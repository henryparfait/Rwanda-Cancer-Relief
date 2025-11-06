import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

/**
 * Get all conversations for counselor
 */
export const getConversations = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { search } = req.query;

    let query = { counselor: counselorId };

    if (search) {
      const patients = await User.find({
        role: 'patient',
        $or: [
          { email: { $regex: search, $options: 'i' } }
        ]
      }).populate({
        path: 'profile',
        match: {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } }
          ]
        }
      });

      const patientIds = patients
        .filter(p => p.profile)
        .map(p => p._id);

      if (patientIds.length > 0) {
        query.patient = { $in: patientIds };
      } else {
        return res.json({
          success: true,
          count: 0,
          data: []
        });
      }
    }

    const conversations = await Conversation.find(query)
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      })
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    const conversationsWithUnread = conversations.map(conv => {
      const unreadCount = conv.counselor.toString() === counselorId
        ? conv.unreadCount.counselor
        : conv.unreadCount.patient;

      return {
        ...conv.toObject(),
        unreadCount
      };
    });

    res.json({
      success: true,
      count: conversationsWithUnread.length,
      data: conversationsWithUnread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

/**
 * Get or create conversation with patient
 */
export const getOrCreateConversation = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { patientId } = req.params;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    let conversation = await Conversation.findOne({
      counselor: counselorId,
      patient: patientId
    })
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [counselorId, patientId],
        counselor: counselorId,
        patient: patientId,
        unreadCount: {
          counselor: 0,
          patient: 0
        }
      });

      await conversation.populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting conversation',
      error: error.message
    });
  }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const counselorId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.counselor.toString() !== counselorId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .populate({
        path: 'sender',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      })
      .populate({
        path: 'receiver',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: counselorId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    conversation.unreadCount.counselor = 0;
    await conversation.save();

    res.json({
      success: true,
      count: messages.length,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

/**
 * Send message
 */
export const sendMessage = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { conversationId, content, patientId } = req.body;

    if (!content || (!conversationId && !patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Content and either conversationId or patientId are required'
      });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.counselor.toString() !== counselorId) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }
    } else {
      const patient = await User.findById(patientId);
      if (!patient || patient.role !== 'patient') {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      conversation = await Conversation.findOne({
        counselor: counselorId,
        patient: patientId
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [counselorId, patientId],
          counselor: counselorId,
          patient: patientId,
          unreadCount: {
            counselor: 0,
            patient: 0
          }
        });
      }
    }

    const receiverId = conversation.patient.toString();

    const message = await Message.create({
      conversation: conversation._id,
      sender: counselorId,
      receiver: receiverId,
      content: content.trim()
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    conversation.unreadCount.patient += 1;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate({
        path: 'sender',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      })
      .populate({
        path: 'receiver',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const counselorId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.counselor.toString() !== counselorId) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: counselorId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    conversation.unreadCount.counselor = 0;
    await conversation.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

