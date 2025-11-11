import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },

    role: {
        type: String,
        enum: ['patient', 'counselor', 'admin'],
        required: true
    },

    isApproved: {
        type: Boolean,
        default: function() {
            return this.role !== 'admin'; // this allows admins to be auto-approved
        }
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() {
            return this.role === 'admin' ? 'approved' : 'pending';
        }
    },

    // Admin specific fields
    fullName: {
        type: String,
        required: function() {
            return this.role === 'admin';
        }
    },

    position: {
        type: String,
        default: function() {
            return this.role === 'admin' ? 'System Administrator' : '';
        }
    },

    // Track login info
    lastLogin: {
        type: Date
    },

    loginCount: {
        type: Number,
        default: 0
    },
    
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    lastActivityAt: {
        type: Date
    },

    deactivatedAt: {
        type: Date
    },
    
    rejectionReason: {
        type: String,
        default: ''
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    approvedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true   
}); 

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Check If password is correct

userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);  
};

const User = mongoose.model('User', userSchema);
export default User;