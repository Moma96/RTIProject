"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let User = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map