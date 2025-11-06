import mongoose from 'mongoose';

const sessionNotesTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    template: {
        type: String,
        required: true
    },
    fields: [{
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['text', 'textarea', 'number', 'date', 'select', 'checkbox'],
            default: 'text'
        },
        required: {
            type: Boolean,
            default: false
        },
        options: [String]
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['initial', 'follow-up', 'crisis', 'termination', 'general'],
        default: 'general'
    }
}, {
    timestamps: true
});

sessionNotesTemplateSchema.index({ createdBy: 1, createdAt: -1 });
sessionNotesTemplateSchema.index({ isPublic: 1, category: 1 });

const SessionNotesTemplate = mongoose.model('SessionNotesTemplate', sessionNotesTemplateSchema);
export default SessionNotesTemplate;

