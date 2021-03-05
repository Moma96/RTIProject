import mongoose from 'mongoose'

let Material = new mongoose.Schema({
    subject: {
        type: String
    },
    category: {
        type: String
    },
    title: {
        type: String
    },
    fileName: {
        type: String
    },
    fileExtension: {
        type: String
    },
    fileSize: {
        type: Number
    },
    time: {
        type: Date
    },
    uploadedBy: {
        type: String
    },
    position: {
        type: Number
    },

    // Lab
    details: {
        type: String
    }
});

export default mongoose.model('Material', Material, 'materials');