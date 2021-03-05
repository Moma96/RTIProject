"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Exam = new mongoose_1.default.Schema({
    subject: {
        type: String
    },
    title: {
        type: String
    },
    time: {
        type: Date
    },
    contentUrl: {
        type: String
    },
    solutionUrl: {
        type: String
    }
});
exports.default = mongoose_1.default.model('Exam', Exam, 'exams');
//# sourceMappingURL=exam.js.map