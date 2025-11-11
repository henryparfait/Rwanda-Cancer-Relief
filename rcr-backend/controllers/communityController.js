import CommunityPost from '../models/CommunityPost.js';
import CommunityComment from '../models/CommunityComment.js';
import { getAudienceScope, updateReactionSummary } from '../utils/analyticsHelpers.js';

const REACTION_TYPES = ['like', 'support', 'insight', 'celebrate'];

const getBroadcastTargets = (audience) => {
  if (audience === 'patients') {
    return ['patients'];
  }
  if (audience === 'counselors') {
    return ['counselors'];
  }
  return ['patients', 'counselors'];
};

const emitCommunityEvent = (req, targets, event, payload) => {
  const io = req.app.get('io');
  if (!io) {
    return;
  }

  [...new Set(targets.filter(Boolean))].forEach((target) => {
    io.to(target).emit(event, payload);
  });
};

const buildAuthorSummary = (user) => {
  if (!user) {
    return null;
  }
  const profile = user.profile || {};
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePicture: profile.profilePicture
    }
  };
};

const buildPostResponse = (postDocument, currentUserId) => {
  if (!postDocument) {
    return null;
  }

  const post = postDocument.toObject ? postDocument.toObject() : postDocument;
  const reactions = Array.isArray(post.reactions) ? post.reactions : [];
  const userReaction = reactions.find((reaction) => reaction.user?.toString() === currentUserId?.toString());

  return {
    id: post._id,
    title: post.title,
    content: post.content,
    audience: post.audience,
    tags: post.tags || [],
    attachments: post.attachments || [],
    isPinned: post.isPinned,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    commentCount: post.commentCount || 0,
    reactionSummary: post.reactionSummary || { like: 0, support: 0, insight: 0, celebrate: 0 },
    userReaction: userReaction ? userReaction.type : null,
    author: buildAuthorSummary(post.author)
  };
};

const buildCommentResponse = (commentDocument) => {
  if (!commentDocument) {
    return null;
  }

  const comment = commentDocument.toObject ? commentDocument.toObject() : commentDocument;

  return {
    id: comment._id,
    content: comment.content,
    post: comment.post,
    parentComment: comment.parentComment,
    mentions: comment.mentions || [],
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    reactionSummary: comment.reactionSummary || { like: 0, support: 0, insight: 0, celebrate: 0 },
    author: buildAuthorSummary(comment.author)
  };
};

export const listPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tag,
      author,
      search,
      audience,
      onlyPinned
    } = req.query;

    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const audiences = getAudienceScope(req.user.role);

    const query = {
      audience: { $in: audiences }
    };

    if (audience && audiences.includes(audience)) {
      query.audience = audience;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (author) {
      query.author = author;
    }

    if (onlyPinned === 'true') {
      query.isPinned = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ];
    }

    const [posts, total] = await Promise.all([
      CommunityPost.find(query)
        .populate({
          path: 'author',
          select: 'email role',
          populate: {
            path: 'profile',
            select: 'firstName lastName profilePicture'
          }
        })
        .sort({ isPinned: -1, publishedAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      CommunityPost.countDocuments(query)
    ]);

    const response = posts.map((post) => buildPostResponse(post, req.user.id));

    res.json({
      success: true,
      data: response,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit) || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching community posts',
      error: error.message
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      audience = 'all',
      tags = [],
      attachments = []
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    const allowedAudiences = getAudienceScope(req.user.role);
    const normalizedAudience = allowedAudiences.includes(audience) ? audience : allowedAudiences[0];

    const post = await CommunityPost.create({
      author: req.user.id,
      title: title?.trim() || null,
      content: content.trim(),
      audience: normalizedAudience,
      tags: Array.isArray(tags) ? tags : [],
      attachments: Array.isArray(attachments) ? attachments : [],
      publishedAt: new Date()
    });

    const populatedPost = await CommunityPost.findById(post._id)
      .populate({
        path: 'author',
        select: 'email role',
        populate: {
          path: 'profile',
          select: 'firstName lastName profilePicture'
        }
      });

    const response = buildPostResponse(populatedPost, req.user.id);

    const broadcastTargets = getBroadcastTargets(normalizedAudience).map((room) => room);
    broadcastTargets.push(`user:${req.user.id}`);
    emitCommunityEvent(req, broadcastTargets, 'community:new-post', { post: response });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating community post',
      error: error.message
    });
  }
};

export const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;

    if (!REACTION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type'
      });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingReactionIndex = post.reactions.findIndex((reaction) => reaction.user.toString() === req.user.id);
    let userReaction = null;

    if (existingReactionIndex !== -1) {
      const currentReaction = post.reactions[existingReactionIndex];
      if (currentReaction.type === type) {
        post.reactions.splice(existingReactionIndex, 1);
        post.reactionSummary = updateReactionSummary(post.reactionSummary, type, null);
      } else {
        post.reactions[existingReactionIndex].type = type;
        post.reactions[existingReactionIndex].reactedAt = new Date();
        post.reactionSummary = updateReactionSummary(post.reactionSummary, currentReaction.type, type);
        userReaction = type;
      }
    } else {
      post.reactions.push({
        user: req.user.id,
        type,
        reactedAt: new Date()
      });
      post.reactionSummary = updateReactionSummary(post.reactionSummary, null, type);
      userReaction = type;
    }

    await post.save();
    await post.populate({
      path: 'author',
      select: 'email role',
      populate: {
        path: 'profile',
        select: 'firstName lastName profilePicture'
      }
    });

    const response = buildPostResponse(post, req.user.id);
    response.userReaction = userReaction;

    const authorTarget = post.author ? `user:${post.author.toString()}` : null;

    emitCommunityEvent(
      req,
      [
        ...getBroadcastTargets(post.audience),
        authorTarget
      ],
      'community:post-reacted',
      {
        postId: post._id,
        reactionSummary: post.reactionSummary,
        userReaction: userReaction,
        reactedBy: req.user.id
      }
    );

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reacting to post',
      error: error.message
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, parentId } = req.query;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const query = {
      post: postId,
      parentComment: parentId || null
    };

    const [comments, total] = await Promise.all([
      CommunityComment.find(query)
        .populate({
          path: 'author',
          select: 'email role',
          populate: {
            path: 'profile',
            select: 'firstName lastName profilePicture'
          }
        })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(numericLimit),
      CommunityComment.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: comments.map(buildCommentResponse),
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit) || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const {
      content,
      parentComment,
      mentions = []
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    let parent = null;
    if (parentComment) {
      parent = await CommunityComment.findById(parentComment);
      if (!parent || parent.post.toString() !== postId) {
        return res.status(400).json({
          success: false,
          message: 'Parent comment not found for this post'
        });
      }
    }

    const sanitizedMentions = Array.isArray(mentions)
      ? [...new Set(mentions.filter((mention) => typeof mention === 'string' || typeof mention === 'object'))]
      : [];

    const comment = await CommunityComment.create({
      post: postId,
      author: req.user.id,
      content: content.trim(),
      parentComment: parent ? parent._id : null,
      mentions: sanitizedMentions
    });

    await CommunityPost.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 }
    });

    const populatedComment = await CommunityComment.findById(comment._id)
      .populate({
        path: 'author',
        select: 'email role',
        populate: {
          path: 'profile',
          select: 'firstName lastName profilePicture'
        }
      });

    const response = buildCommentResponse(populatedComment);

    const authorTarget = post.author ? `user:${post.author.toString()}` : null;

    emitCommunityEvent(
      req,
      [
        ...getBroadcastTargets(post.audience),
        authorTarget
      ],
      'community:new-comment',
      {
        postId: post._id,
        comment: response
      }
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isAuthor = post.author?.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this post'
      });
    }

    await CommunityPost.deleteOne({ _id: postId });
    const deletedComments = await CommunityComment.deleteMany({ post: postId });

    const postAuthorTarget = post.author ? `user:${post.author.toString()}` : null;

    emitCommunityEvent(
      req,
      [
        ...getBroadcastTargets(post.audience),
        postAuthorTarget
      ],
      'community:post-deleted',
      {
        postId
      }
    );

    res.json({
      success: true,
      message: 'Post deleted successfully',
      data: {
        postId,
        deletedComments: deletedComments.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await CommunityComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const post = await CommunityPost.findById(comment.post);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Parent post not found'
      });
    }

    const isAuthor = comment.author.toString() === req.user.id.toString();
    const isPostAuthor = post.author?.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin && !isPostAuthor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment'
      });
    }

    const childComments = await CommunityComment.find({ parentComment: commentId }).select('_id');
    const commentIdsToDelete = [commentId, ...childComments.map((child) => child._id)];
    await CommunityComment.deleteMany({ _id: { $in: commentIdsToDelete } });

    await CommunityPost.findByIdAndUpdate(comment.post, {
      $inc: { commentCount: -commentIdsToDelete.length }
    });

    const authorTarget = post.author ? `user:${post.author.toString()}` : null;

    emitCommunityEvent(
      req,
      [
        ...getBroadcastTargets(post.audience),
        authorTarget
      ],
      'community:comment-deleted',
      {
        postId: comment.post,
        commentId
      }
    );

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

export const togglePinPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    emitCommunityEvent(
      req,
      getBroadcastTargets(post.audience),
      'community:post-updated',
      {
        postId: post._id,
        isPinned: post.isPinned
      }
    );

    res.json({
      success: true,
      message: `Post ${post.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: {
        postId: post._id,
        isPinned: post.isPinned
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post pin state',
      error: error.message
    });
  }
};

