import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['pdf', 'video', 'guide', 'link', 'audio', 'image'],
        required: true,
        index: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: ['counseling', 'education', 'support', 'medical', 'wellness', 'other'],
        default: 'other',
        index: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: true,
        index: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String
    }
}, {
    timestamps: true
});

resourceSchema.index({ type: 1, createdAt: -1 });
resourceSchema.index({ uploadedBy: 1, createdAt: -1 });
resourceSchema.index({ isPublic: 1, createdAt: -1 });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;

