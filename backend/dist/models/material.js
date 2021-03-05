"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Material = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Material', Material, 'materials');
//# sourceMappingURL=material.js.map