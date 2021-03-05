"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Subject = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Subject', Subject, 'subjects');
//# sourceMappingURL=subject.js.map