"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let News = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('News', News, 'news');
//# sourceMappingURL=news.js.map