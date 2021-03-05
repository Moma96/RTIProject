"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./models/user"));
const news_1 = __importDefault(require("./models/news"));
const subject_1 = __importDefault(require("./models/subject"));
const material_1 = __importDefault(require("./models/material"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(express_fileupload_1.default());
app.use(express_1.default.static(__dirname + '/assets'));
mongoose_1.default.connect('mongodb://localhost:27017/RTIDatabase');
const conn = mongoose_1.default.connection;
conn.once('open', () => {
    console.log('Connection successful');
});
const router = express_1.default.Router();
const ASSETS_PATH = 'dist/assets/';
const IMAGES_PATH = ASSETS_PATH + 'images/';
const MATERIALS_PATH = ASSETS_PATH + 'materials/';
const NEWS_FILES_PATH = ASSETS_PATH + 'news_files/';
//TODO: Add password hashing (+ salt)
//TODO: Add backend validation
router.route('/user/login').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    user_1.default.findOne({ 'username': username, 'password': password }, (err, user) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': user });
    });
});
router.route('/user/register').post((req, res) => {
    let u = new user_1.default(req.body.user);
    u.save().then(u => {
        res.json({ 'res': 'ok' });
    }).catch(err => {
        res.json({ 'res': 'error' });
    });
});
router.route('/user/upload-image').post((req, res) => {
    let image = req.files.image;
    image.mv(IMAGES_PATH + image.name, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/user/remove-image').post((req, res) => {
    let imageName = req.body.imageName;
    const filePath = IMAGES_PATH + imageName;
    fs_1.default.unlink(filePath, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/user/exists').post((req, res) => {
    let username = req.body.username;
    user_1.default.findOne({ 'username': username }, (err, user) => {
        if (user)
            res.json({ 'res': 'yes' });
        else
            res.json({ 'res': 'no' });
    });
});
router.route('/user/get').post((req, res) => {
    let username = req.body.username;
    user_1.default.findOne({ 'username': username }, (err, user) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': user });
    });
});
router.route('/user/get-all').get((req, res) => {
    user_1.default.find({ 'category': { $ne: "admin" } }, (err, users) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': users });
    });
});
router.route('/user/update').post((req, res) => {
    let userData = req.body.user;
    user_1.default.findOne({ 'username': userData.username }, (err, u) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            let userDocument = u;
            userDocument.username = userData.username;
            userDocument.firstName = userData.firstName;
            userDocument.lastName = userData.lastName;
            // for student
            userDocument.index = userData.index;
            userDocument.type = userData.type;
            userDocument.attends = userData.attends;
            // for personnel
            userDocument.address = userData.address;
            userDocument.phoneNumber = userData.phoneNumber;
            userDocument.website = userData.website;
            userDocument.personalData = userData.personalData;
            userDocument.title = userData.title;
            userDocument.officeNumber = userData.officeNumber;
            userDocument.image = userData.image;
            userDocument.engagedIn = userData.engagedIn;
            u.save().then(user => {
                res.json({ 'res': 'ok' });
            }).catch(err => {
                res.json({ 'res': 'error' });
            });
        }
    });
});
router.route('/user/change-password').post((req, res) => {
    let username = req.body.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    user_1.default.findOne({ 'username': username, 'password': oldPassword }, (err, u) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            if (!u) {
                res.json({ 'res': 'wrongDataError' });
            }
            else {
                let userDocument = u;
                userDocument.password = newPassword;
                userDocument.status = "active";
                u.save().then(user => {
                    res.json({ 'res': 'ok' });
                }).catch(err => {
                    res.json({ 'res': 'error' });
                });
            }
        }
    });
});
router.route('/user/remove').post((req, res) => {
    let username = req.body.username;
    user_1.default.findOneAndDelete({ 'username': username }, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/personnel/get-all').get((req, res) => {
    user_1.default.find({ 'category': 'personnel' }, (err, users) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': users });
    });
});
router.route('/subject/get').post((req, res) => {
    let id = req.body.id;
    subject_1.default.findOne({ 'id': id }, (err, subject) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': subject });
    });
});
router.route('/subject/get-per-department').post((req, res) => {
    let department = req.body.department;
    subject_1.default.find({ 'department': department }, (err, subjects) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': subjects });
    });
});
router.route('/subject/get-all').get((req, res) => {
    subject_1.default.find({}, (err, subjects) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': subjects });
    });
});
router.route('/subject/add').post((req, res) => {
    let s = new subject_1.default(req.body.subject);
    s.save().then(s => {
        res.json({ 'res': 'ok' });
    }).catch(err => {
        res.json({ 'res': 'error' });
    });
});
router.route('/subject/update').post((req, res) => {
    let subjectData = req.body.subject;
    subject_1.default.findOne({ 'id': subjectData.id }, (err, s) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            let subjectDocument = s;
            subjectDocument.name = subjectData.name;
            subjectDocument.ects = subjectData.ects;
            subjectDocument.department = subjectData.department;
            subjectDocument.semester = subjectData.semester;
            subjectDocument.mandatory = subjectData.mandatory;
            subjectDocument.classLoad = subjectData.classLoad;
            subjectDocument.classSchedule = subjectData.classSchedule;
            subjectDocument.practicalClassSchedule = subjectData.practicalClassSchedule;
            subjectDocument.goal = subjectData.goal;
            subjectDocument.outcome = subjectData.outcome;
            subjectDocument.details = subjectData.details;
            subjectDocument.hasLabs = subjectData.hasLabs;
            subjectDocument.labDetails = subjectData.labDetails;
            s.save().then(subject => {
                res.json({ 'res': 'ok' });
            }).catch(err => {
                res.json({ 'res': 'error' });
            });
        }
    });
});
router.route('/subject/remove').post((req, res) => {
    let subjectId = req.body.subjectId;
    // Delete all materials
    material_1.default.deleteMany({ 'subject': subjectId }, (err) => {
        if (err)
            console.log("Error in materials delete.");
    });
    // Delete all appearances in news
    news_1.default.updateMany({}, { $pull: { subjects: subjectId } }, (err, news) => {
        if (err)
            console.log("Error in news related subjects delete.");
    });
    // Delete every related news file
    news_1.default.find({ 'subjects': { $size: 0 } }, (err, n) => {
        for (let news of n) {
            let fileName = news.fileName;
            if (fileName) {
                const newsFileUrl = NEWS_FILES_PATH + news._id + fileName;
                fs_1.default.unlink(newsFileUrl, err => {
                    if (err)
                        console.log("Error in deleting news file");
                    else
                        console.log("Deleted news file " + newsFileUrl);
                });
            }
        }
    });
    // Delete every news with no subjects
    news_1.default.deleteMany({ 'subjects': { $size: 0 } }, (err) => {
        if (err)
            console.log("Error in news delete.");
    });
    // Delete every related material
    fs_1.default.readdir(MATERIALS_PATH, (error, files) => {
        if (error)
            throw error;
        files.filter(name => new RegExp("^" + subjectId, "g").test(name)).forEach((value) => {
            fs_1.default.unlink(MATERIALS_PATH + "/" + value, err => {
                if (err)
                    console.log("Error in deleting material file");
                else
                    console.log("Deleted material " + value);
            });
        });
    });
    // Delete every engagement
    user_1.default.updateMany({}, { $pull: { engagedIn: subjectId } }, (err, users) => {
        if (err)
            console.log("Error in engagement delete.");
    });
    // Delete every attendance
    user_1.default.updateMany({}, { $pull: { attends: subjectId } }, (err, users) => {
        if (err)
            console.log("Error in attends delete.");
    });
    subject_1.default.findOneAndDelete({ 'id': subjectId }, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/subject/get-personnel').post((req, res) => {
    let subject = req.body.subject;
    user_1.default.find({ 'engagedIn': { $all: [subject] } }, (err, users) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': users });
    });
});
router.route('/subject/materials').post((req, res) => {
    let subject = req.body.subject;
    let category = req.body.category;
    material_1.default.find({ 'subject': subject, 'category': category }, null, { sort: { position: 1 } }, (err, materials) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': materials });
    });
});
router.route('/subject/get-material').post((req, res) => {
    let subject = req.body.subject;
    let category = req.body.category;
    let fileName = req.body.fileName;
    material_1.default.findOne({ 'subject': subject, 'category': category, 'fileName': fileName }, (err, m) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': m });
    });
});
router.route('/subject/upload-material-file').post((req, res) => {
    let material = req.files.file;
    material.mv(MATERIALS_PATH + material.name, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/subject/add-material').post((req, res) => {
    let materialData = req.body.material;
    material_1.default.findOne({ 'subject': materialData.subject, 'category': materialData.category }, null, { sort: { position: -1 } }, (err, maxMaterial) => {
        if (err) {
            res.json({ 'res': 'error' });
        }
        else {
            if (!maxMaterial)
                materialData.position = 1;
            else
                materialData.position = maxMaterial.position + 1;
            let newMaterial = new material_1.default(materialData);
            newMaterial.save().then(newMaterial => {
                res.json({ 'res': 'ok' });
            }).catch(err => {
                res.json({ 'res': 'error' });
            });
        }
    });
});
router.route('/subject/swap-material-position').post((req, res) => {
    let materialData1 = req.body.material1;
    let materialData2 = req.body.material2;
    let position = materialData1.position;
    materialData1.position = materialData2.position;
    materialData2.position = position;
    material_1.default.findOne({ 'subject': materialData1.subject, 'category': materialData1.category, 'fileName': materialData1.fileName }, (err, m1) => {
        if (err) {
            res.json({ 'res': 'error' });
        }
        else {
            m1.position = materialData1.position;
            m1.save().then(m1 => {
                material_1.default.findOne({ 'subject': materialData2.subject, 'category': materialData2.category, 'fileName': materialData2.fileName }, (err, m2) => {
                    if (err) {
                        res.json({ 'res': 'error' });
                    }
                    else {
                        m2.position = materialData2.position;
                        m2.save().then(m2 => {
                            res.json({ 'res': 'ok' });
                        }).catch(err => {
                            res.json({ 'res': 'error' });
                        });
                    }
                });
            }).catch(err => {
                res.json({ 'res': 'error' });
            });
        }
    });
});
router.route('/subject/remove-material').post((req, res) => {
    let m = req.body.material;
    const materialUrl = MATERIALS_PATH + m.subject + m.category + m.fileName + '.' + m.fileExtension;
    fs_1.default.unlink(materialUrl, err => {
        if (err) {
            res.json({ 'res': 'error' });
        }
        else {
            material_1.default.findOneAndDelete({ 'subject': m.subject, 'category': m.category, 'fileName': m.fileName }, (err, material) => {
                if (err)
                    res.json({ 'res': 'error' });
                else
                    res.json({ 'res': 'ok' });
            });
        }
    });
});
router.route('/subject/get-one-news').post((req, res) => {
    let newsId = req.body.newsId;
    news_1.default.findOne({ '_id': newsId }, (err, n) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            res.json({ 'res': n });
        }
    });
});
router.route('/subject/get-news').get((req, res) => {
    news_1.default.find({}, null, { sort: { date: -1 } }, (err, n) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            res.json({ 'res': n });
        }
    });
});
router.route('/subject/get-news/by-subject').post((req, res) => {
    let subject = req.body.subject;
    news_1.default.find({ 'subjects': subject }, null, { sort: { date: -1 } }, (err, news) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': news });
    });
});
router.route('/subject/get-news/by-personnel').post((req, res) => {
    let uploadedBy = req.body.uploadedBy;
    news_1.default.find({ 'uploadedBy': uploadedBy }, null, { sort: { date: -1 } }, (err, news) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': news });
    });
});
router.route('/subject/upload-news-file').post((req, res) => {
    let newsFile = req.files.file;
    const filePath = NEWS_FILES_PATH + newsFile.name;
    newsFile.mv(filePath, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/subject/remove-news-file').post((req, res) => {
    let filename = req.body.filename;
    const filePath = NEWS_FILES_PATH + filename;
    fs_1.default.unlink(filePath, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});
router.route('/subject/add-news').post((req, res) => {
    let newsData = req.body.news;
    let newNews = new news_1.default(newsData);
    newNews.save().then(n => {
        res.json({ 'res': n });
    }).catch(err => {
        res.json({ 'res': 'error' });
    });
});
router.route('/subject/update-news').post((req, res) => {
    let newsData = req.body.news;
    news_1.default.findOne({ "_id": newsData._id }, (err, n) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            if (!n) {
                res.json({ 'res': 'error' });
            }
            else {
                let newsDocument = n;
                newsDocument.caption = newsData.caption;
                newsDocument.content = newsData.content;
                newsDocument.time = newsData.time;
                newsDocument.uploadedBy = newsData.uploadedBy;
                newsDocument.fileName = newsData.fileName;
                newsDocument.subjects = newsData.subjects;
                n.save().then(news => {
                    res.json({ 'res': 'ok' });
                }).catch(err => {
                    res.json({ 'res': 'error' });
                });
            }
        }
    });
});
router.route('/subject/remove-news').post((req, res) => {
    let newsData = req.body.news;
    news_1.default.findOneAndDelete({ "_id": newsData._id }, (err, n) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            if (newsData.file) {
                const newsFileUrl = NEWS_FILES_PATH + newsData._id + newsData.fileName;
                fs_1.default.unlink(newsFileUrl, err => {
                    if (err)
                        res.json({ 'res': 'error' });
                    else
                        res.json({ 'res': 'ok' });
                });
            }
            else {
                res.json({ 'res': 'ok' });
            }
        }
    });
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map