import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import user from './models/user';
import news from './models/news';
import subject from './models/subject';
import material from './models/material';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/assets'));

mongoose.connect('mongodb://localhost:27017/RTIDatabase');

const conn = mongoose.connection;
conn.once('open', () => {
    console.log('Connection successful');
});

const router = express.Router();
const ASSETS_PATH = 'dist/assets/'; 
const IMAGES_PATH = ASSETS_PATH + 'images/';
const MATERIALS_PATH = ASSETS_PATH + 'materials/';
const NEWS_FILES_PATH = ASSETS_PATH + 'news_files/';

//TODO: Add password hashing (+ salt)
//TODO: Add backend validation

router.route('/user/login').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    user.findOne({ 'username': username, 'password': password }, (err, user) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': user });
    });
});

router.route('/user/register').post((req, res) => {
    let u = new user(req.body.user);
    u.save().then(u => {
        res.json({ 'res': 'ok' });
    }).catch(err => {
        res.json({ 'res': 'error' });
    });
});

router.route('/user/upload-image').post((req, res) => {
    let image = <fileUpload.UploadedFile>req.files.image;
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
    fs.unlink(filePath, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});

router.route('/user/exists').post((req, res) => {
    let username = req.body.username;
    user.findOne({ 'username': username }, (err, user) => {
        if (user)
            res.json({ 'res': 'yes' });
        else
            res.json({ 'res': 'no' });
    });
});

router.route('/user/get').post((req, res) => {
    let username = req.body.username;
    user.findOne({ 'username': username }, (err, user) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': user });
    });
});

router.route('/user/get-all').get((req, res) => {
    user.find({ 'category': { $ne: "admin" }}, (err, users) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': users });
    })
});

router.route('/user/update').post((req, res) => {
    let userData = req.body.user;
    user.findOne({ 'username': userData.username }, (err, u) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            let userDocument: any = u;
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

    user.findOne({ 'username': username, 'password': oldPassword }, (err, u) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            if (!u) {
                res.json({ 'res': 'wrongDataError' });
            }
            else {
                let userDocument: any = u;

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
    user.findOneAndDelete({ 'username': username }, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});

router.route('/personnel/get-all').get((req, res) => {
    user.find({ 'category': 'personnel' }, (err, users) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': users });
    })
});


router.route('/subject/get').post((req, res) => {
    let id = req.body.id;
    subject.findOne({ 'id': id }, (err, subject) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': subject });
    })
});

router.route('/subject/get-per-department').post((req, res) => {
    let department = req.body.department;
    subject.find({ 'department': department }, (err, subjects) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': subjects});
    });
});

router.route('/subject/get-all').get((req, res) => {
    subject.find({}, (err, subjects) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': subjects });
    })
});

router.route('/subject/add').post((req, res) => {
    let s = new subject(req.body.subject);
    s.save().then(s => {
        res.json({ 'res': 'ok' });
    }).catch(err => {
        res.json({ 'res': 'error' });
    });
});

router.route('/subject/update').post((req, res) => {
    let subjectData = req.body.subject;
    subject.findOne({ 'id': subjectData.id }, (err, s) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            let subjectDocument: any = s;
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
    material.deleteMany({ 'subject': subjectId }, (err) => {
        if (err)
            console.log("Error in materials delete.");
    });

    // Delete all appearances in news
    news.updateMany({}, { $pull: { subjects: subjectId }}, (err, news) => {
        if (err)
            console.log("Error in news related subjects delete.");
    });
    
    // Delete every related news file
    news.find({ 'subjects': { $size: 0 }}, (err, n) => {
        for(let news of n) {
            let fileName = (<any>news).fileName;
            if (fileName) {
                const newsFileUrl = NEWS_FILES_PATH + news._id + fileName;
                fs.unlink(newsFileUrl, err => {
                if (err)
                    console.log("Error in deleting news file");
                else
                    console.log("Deleted news file " + newsFileUrl);
            });
            }
        }
    })

    // Delete every news with no subjects
    news.deleteMany({ 'subjects': { $size: 0 }}, (err) => {
        if (err)
            console.log("Error in news delete.");
    });

    // Delete every related material
    fs.readdir(MATERIALS_PATH, (error, files) => {
        if (error) throw error;
        files.filter(name => new RegExp("^" + subjectId, "g").test(name)).forEach((value) => {
            fs.unlink(MATERIALS_PATH + "/" + value, err => {
                if (err)
                    console.log("Error in deleting material file");
                else
                    console.log("Deleted material " + value);
            });
        });
    });

    // Delete every engagement
    user.updateMany({}, { $pull: { engagedIn: subjectId }}, (err, users) => {
        if (err)
            console.log("Error in engagement delete.");
    });

    // Delete every attendance
    user.updateMany({}, { $pull: { attends: subjectId }}, (err, users) => {
        if (err)
            console.log("Error in attends delete.");
    });

    subject.findOneAndDelete({ 'id': subjectId }, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});

router.route('/subject/get-personnel').post((req, res) => {
    let subject = req.body.subject;
    user.find({ 'engagedIn': { $all: [ subject ]}}, (err, users) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': users });
    })
});

router.route('/subject/materials').post((req, res) => {
    let subject = req.body.subject;
    let category = req.body.category;
    material.find({ 'subject': subject, 'category': category }, null, { sort: { position: 1 }}, (err, materials) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': materials });
    })
});

router.route('/subject/get-material').post((req, res) => {
    let subject = req.body.subject;
    let category = req.body.category;
    let fileName = req.body.fileName;
    material.findOne({ 'subject': subject, 'category': category, 'fileName': fileName }, (err, m) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': m });
    });
});

router.route('/subject/upload-material-file').post((req, res) => {
    let material = <fileUpload.UploadedFile>req.files.file;
    material.mv(MATERIALS_PATH + material.name, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});

router.route('/subject/add-material').post((req, res) => {
    let materialData = req.body.material;
    material.findOne({ 'subject': materialData.subject, 'category': materialData.category }, null, { sort: { position: -1 }}, (err, maxMaterial) => {
        if (err) {
            res.json({ 'res': 'error' });
        }
        else {
            if (!maxMaterial)
                materialData.position = 1;
            else
                materialData.position = (<any>maxMaterial).position + 1;

            let newMaterial = new material(materialData);
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

    material.findOne({ 'subject': materialData1.subject, 'category': materialData1.category, 'fileName': materialData1.fileName }, (err, m1) => {
        if (err) {
            res.json({ 'res': 'error' });
        }
        else {
            (<any>m1).position = materialData1.position;
            m1.save().then(m1 => {
                material.findOne({ 'subject': materialData2.subject, 'category': materialData2.category, 'fileName': materialData2.fileName }, (err, m2) => {
                    if (err) {
                        res.json({ 'res': 'error' });
                    }
                    else {
                        (<any>m2).position = materialData2.position;
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
    fs.unlink(materialUrl, err => {
        if (err) {
            res.json({ 'res': 'error' });
        }
        else {
            material.findOneAndDelete({ 'subject': m.subject, 'category': m.category, 'fileName': m.fileName }, (err, material) => {
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
    news.findOne({ '_id': newsId }, (err, n) => { 
        if (err)
            res.json({ 'res': 'error' });
        else {
            res.json({ 'res': n });
        }
    });
});

router.route('/subject/get-news').get((req, res) => {
    news.find({}, null, { sort: { date: -1 }}, (err, n) => { 
        if (err)
            res.json({ 'res': 'error' });
        else {
            res.json({ 'res': n });
        }
    });
});

router.route('/subject/get-news/by-subject').post((req, res) => {
    let subject = req.body.subject;
    news.find({ 'subjects': subject }, null, { sort: { date: -1 }}, (err, news) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': news });
    })
});

router.route('/subject/get-news/by-personnel').post((req, res) => {
    let uploadedBy = req.body.uploadedBy;
    news.find({ 'uploadedBy': uploadedBy }, null, { sort: { date: -1 }}, (err, news) => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': news });
    })
});

router.route('/subject/upload-news-file').post((req, res) => {
    let newsFile = <fileUpload.UploadedFile>req.files.file;
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
    fs.unlink(filePath, err => {
        if (err)
            res.json({ 'res': 'error' });
        else
            res.json({ 'res': 'ok' });
    });
});

router.route('/subject/add-news').post((req, res) => {
    let newsData = req.body.news;
    let newNews = new news(newsData);
    newNews.save().then(n => {
        res.json({ 'res': n });
    }).catch(err => {
        res.json({ 'res': 'error' });
    });
});

router.route('/subject/update-news').post((req, res) => {
    let newsData = req.body.news;
    news.findOne({ "_id": newsData._id }, (err, n) => { 
        if (err)
            res.json({ 'res': 'error' });
        else {
            if (!n) {
                res.json({ 'res': 'error' });
            }
            else {
                let newsDocument: any = n;
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
    news.findOneAndDelete({ "_id": newsData._id }, (err, n) => {
        if (err)
            res.json({ 'res': 'error' });
        else {
            if (newsData.file) {
                const newsFileUrl = NEWS_FILES_PATH + newsData._id + newsData.fileName;
                fs.unlink(newsFileUrl, err => {
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