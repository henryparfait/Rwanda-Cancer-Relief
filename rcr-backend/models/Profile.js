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
        enum: ['Male', 'Female', 'Other'],
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
    
const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;



