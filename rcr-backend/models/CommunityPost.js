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

const attachmentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'document', 'link', 'video'],
    default: 'link'
  },
  title: {
    type: String
  },
  description: {
    type: String
  }
}, {
  _id: false
});

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 160
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  audience: {
    type: String,
    enum: ['patients', 'counselors', 'all'],
    default: 'all',
    index: true
  },
  tags: {
    type: [String],
    default: []
  },
  attachments: {
    type: [attachmentSchema],
    default: []
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
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
  },
  commentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

communityPostSchema.index({ audience: 1, isPinned: -1, publishedAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ author: 1, createdAt: -1 });

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

export default CommunityPost;

