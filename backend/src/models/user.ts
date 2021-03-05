import mongoose from 'mongoose'

let User = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    status: {
        type: String
    },
    category: {
        type: String
    },

    // Student
    index: {
        type: String
    },
    type: {
        type: String
    },
    attends: {
        type: [
            String
        ]
    },

    // Personnel
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    website: {
        type: String
    },
    personalData: {
        type: String
    },
    title: {
        type: String
    },
    officeNumber: {
        type: String
    },
    image: {
        type: String
    },
    engagedIn: {
        type: [
            String
        ]
    }

});

export default mongoose.model('User', User, 'users');