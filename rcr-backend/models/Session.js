import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
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
    scheduledDate: {
        type: Date,
        required: true,
        index: true
    },
    scheduledTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 60,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled',
        index: true
    },
    sessionType: {
        type: String,
        enum: ['individual', 'group', 'family'],
        default: 'individual'
    },
    notes: {
        type: String,
        default: ''
    },
    sessionSummary: {
        type: String,
        default: ''
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    },
    cancellationReason: {
        type: String,
        default: ''
    },
    rescheduledFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    rescheduledTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }
}, {
    timestamps: true
});

sessionSchema.index({ counselor: 1, scheduledDate: 1 });
sessionSchema.index({ patient: 1, scheduledDate: 1 });
sessionSchema.index({ status: 1, scheduledDate: 1 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;

