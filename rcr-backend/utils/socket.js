import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

/**
 * Initialize Socket.io server
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.io server instance
 */
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    socket.join(`user:${socket.userId}`);

    if (socket.userRole === 'counselor') {
      socket.join('counselors');
    } else if (socket.userRole === 'patient') {
      socket.join('patients');
    }

    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    socket.on('send-message', async (data) => {
      try {
        const { conversationId, content, receiverId } = data;

        if (!content || (!conversationId && !receiverId)) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        let conversation;

        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
          if (!conversation) {
            socket.emit('error', { message: 'Conversation not found' });
            return;
          }
        } else if (receiverId) {
          conversation = await Conversation.findOne({
            $or: [
              { counselor: socket.userId, patient: receiverId },
              { counselor: receiverId, patient: socket.userId }
            ]
          });

          if (!conversation) {
            conversation = await Conversation.create({
              participants: [socket.userId, receiverId],
              counselor: socket.userRole === 'counselor' ? socket.userId : receiverId,
              patient: socket.userRole === 'patient' ? socket.userId : receiverId,
              unreadCount: {
                counselor: 0,
                patient: 0
              }
            });
          }
        }

        const messageReceiverId = socket.userRole === 'counselor' 
          ? conversation.patient.toString()
          : conversation.counselor.toString();

        const message = await Message.create({
          conversation: conversation._id,
          sender: socket.userId,
          receiver: messageReceiverId,
          content: content.trim()
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        
        if (socket.userRole === 'counselor') {
          conversation.unreadCount.patient += 1;
        } else {
          conversation.unreadCount.counselor += 1;
        }
        
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
          .populate({
            path: 'sender',
            select: '-password',
            populate: {
              path: 'profile',
              select: 'firstName lastName profilePicture'
            }
          })
          .populate({
            path: 'receiver',
            select: '-password',
            populate: {
              path: 'profile',
              select: 'firstName lastName profilePicture'
            }
          });

        io.to(`conversation:${conversation._id}`).emit('new-message', {
          message: populatedMessage,
          conversation: conversation
        });

        io.to(`user:${messageReceiverId}`).emit('message-notification', {
          conversationId: conversation._id,
          message: populatedMessage,
          unreadCount: socket.userRole === 'counselor' 
            ? conversation.unreadCount.patient
            : conversation.unreadCount.counselor
        });
      } catch (error) {
        console.error('Error sending message via socket:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    socket.on('typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on('stop-typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-stop-typing', {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on('mark-read', async (data) => {
      try {
        const { conversationId } = data;
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          return;
        }

        await Message.updateMany(
          {
            conversation: conversationId,
            receiver: socket.userId,
            isRead: false
          },
          {
            isRead: true,
            readAt: new Date()
          }
        );

        if (socket.userRole === 'counselor') {
          conversation.unreadCount.counselor = 0;
        } else {
          conversation.unreadCount.patient = 0;
        }
        
        await conversation.save();

        io.to(`conversation:${conversationId}`).emit('messages-read', {
          conversationId,
          userId: socket.userId
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export default initializeSocket;

