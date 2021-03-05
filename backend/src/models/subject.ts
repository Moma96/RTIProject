import mongoose from 'mongoose'

let Subject = new mongoose.Schema({
    id: {
        type: String
    },
	name: {
        type: String
    },
    ects: {
        type: Number
    },
	department: {
		type: String
	},
	semester: {
		type: Number
	},
	mandatory: {
		type: Boolean
	},
	classLoad: {
		type: String
	},
	classSchedule: {
		type: String
	},
	practicalClassSchedule: {
		type: String
	},
	goal: {
		type: String
	},
	outcome: {
		type: String
	},
	details: {
		type: String
	},
	hasLabs: {
		type: Boolean
	},
	labDetails: {
		type: String
	}

});

export default mongoose.model('Subject', Subject, 'subjects');