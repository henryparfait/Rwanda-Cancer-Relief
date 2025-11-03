import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    district: {
        type: String,
        required: true,
        trim: true,
    },
    telephone: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: '/assets/avatars/profile-placeholder.png',
    },

    // Specific patient field
    cancerType: {
        type: String,
        enum: ['', 'breast', 'prostate', 'lung', 'cervical', 'colon', 'other'],
        default: ''
    },

    // Counsellor Specific Field
    cv: String,
    medicalLicense: String,
    specialization: [String],
    yearsOfExperience: Number,
    bio: String,
    qualifications: String,

    // Additional fields for approval process
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



