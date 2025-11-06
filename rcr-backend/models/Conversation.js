import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    counselor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    unreadCount: {
        counselor: {
            type: Number,
            default: 0
        },
        patient: {
            type: Number,
            default: 0
        }
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

conversationSchema.index({ counselor: 1, lastMessageAt: -1 });
conversationSchema.index({ patient: 1, lastMessageAt: -1 });
conversationSchema.index({ counselor: 1, patient: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;

