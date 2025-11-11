import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    telephone: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: '/assets/avatars/profile-placeholder.png'
    },
    cancerType: {
        type: String,
        enum: ['', 'breast', 'prostate', 'lung', 'cervical', 'colon', 'other'],
        default: ''
    },
    cv: String,
    medicalLicense: String,
    specialization: [String],
    specialties: {
        type: [String],
        default: []
    },
    yearsOfExperience: Number,
    bio: String,
    qualifications: String,
    languages: {
        type: [String],
        default: ['English']
    },
    serviceModes: {
        type: [{
            type: String,
            enum: ['in-person', 'virtual', 'hybrid']
        }],
        default: ['virtual']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    availability: {
        timezone: {
            type: String,
            default: 'Africa/Kigali'
        },
        weeklySchedule: {
            type: [{
                day: {
                    type: String,
                    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    required: true
                },
                slots: [{
                    start: {
                        type: String,
                        required: true
                    },
                    end: {
                        type: String,
                        required: true
                    },
                    isVirtual: {
                        type: Boolean,
                        default: true
                    }
                }]
            }],
            default: []
        },
        exceptions: {
            type: [{
                date: {
                    type: Date,
                    required: true
                },
                isAvailable: {
                    type: Boolean,
                    default: false
                },
                reason: String
            }],
            default: []
        },
        maxSessionsPerDay: {
            type: Number,
            default: 6
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        },
        lastReviewAt: Date
    },
    feedbackHighlights: {
        type: [String],
        default: []
    },
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        },
        message: {
            type: Boolean,
            default: true
        }
    },
    applicationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Profiles for patients and counselors
ProfileSchema.pre('save', async function (next) {
    const user = await mongoose.model('User').findById(this.user);
    if (user && user.role === 'admin') {
        return next(new Error('Admins do not require profiles'));
    }
    next();
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;



