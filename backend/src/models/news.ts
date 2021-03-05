import mongoose from 'mongoose'

let News = new mongoose.Schema({
    caption: {
        type: String
    },
    content: {
        type: String
    },
    date: {
        type: Date
    },
    uploadedBy: {
        type: String
    },
    fileName: {
        type: String
    },
    subjects: {
        type: [
            String
        ]
    }

});

export default mongoose.model('News', News, 'news');