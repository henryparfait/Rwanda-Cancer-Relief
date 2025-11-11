import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'support', 'insight', 'celebrate'],
    default: 'support'
  },
  reactedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
});

const communityCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityComment',
    index: true
  },
  mentions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  reactions: {
    type: [reactionSchema],
    default: []
  },
  reactionSummary: {
    like: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    insight: { type: Number, default: 0 },
    celebrate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

communityCommentSchema.index({ post: 1, createdAt: 1 });
communityCommentSchema.index({ parentComment: 1 });

const CommunityComment = mongoose.model('CommunityComment', communityCommentSchema);

export default CommunityComment;

