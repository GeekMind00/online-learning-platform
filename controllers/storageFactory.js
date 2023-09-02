const { google } = require('googleapis');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs')
const dotenv = require("dotenv");
 
dotenv.config({ path: "../config.env" });

const oauth2client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

oauth2client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2client
})
 
driveFoldersIds = {"First/algebra/exams":"1xVMdr2xGctSJhEVe_xD3BCyfyTJuKij7","First/algebra/videos":"1DC5q246OvOItFH-3G3udVouQmBRdGpyl",
                   "First/algebra/assignments":"1BEqYAFk7XLAUjaRSoG6m4s5xGvzSmO7x","First/geometry/assignments":"1MGmvy0XIXo64xmT_zu0YNwYuWx7M8VdJ",
                   "First/geometry/exams":"1Dl0VYfGDZD7g_pj138FFMXPmUoKCeSw7", "First/geometry/videos":"1NscVctAHNGpqEJwU0_dNe_zAHE_6mkEG",
                   "Second/algebra/exams":"1GIGqJlJGVLO6jzzjukDAiQaCSRWKm-KX","Second/algebra/videos":"1WjVTleN4fFlTWrb4Q47nLxg2_uhq7A9v",
                   "Second/algebra/assignments":"1c4TL-V2WMl-GzL7wh20_W5LhiA9whu1O","Second/geometry/assignments":"1DcWvk8miWZMJoKCIPYNyTY1PgNrxImOH",
                   "Second/geometry/exams":"1zTQkPgGpemDU9y4INBJxQRtQqVL_WS6E", "Second/geometry/videos":"1FNz4c1SQMu-de_2YvLRRZ6HiYr5jJNS-",
                   "Second/calculus/exams":"12WIFQwCKJjMayC16Ql2GwNhO8NOedMwg","Second/calculus/videos":"1n4pbp4ULfRg6zrPnmGIJgS7dtrYwiVis",
                   "Second/calculus/assignments":"1tMTAFyPXz1S9dYhui16Bzn0Fylz4PZXo","Second/mechanics/assignments":"14BjAYCf7ef2a8zZxYP7FSipbnD1XVGdm",
                   "Second/mechanics/exams":"1BuffOIe5M8uEf7LXLvV1F4KtAbD6lqVa", "Second/mechanics/videos":"1buqccvKHylHqOLYnn95gaJ_FL3SExFel"}

examsFoldersId = {table:[]}               
                   
exports.uploadFile = async (req, next) => {
    var filename = req.file.originalname
    var data = fs.readFileSync('examsFoldersId.json')
    this.examsFoldersId = JSON.parse(data)
    folderId = driveFoldersIds[this.driveFolderPath(req)]
    if (req.body.category == "exams"){
        folderId = await this.createFolder(req,folderId)
    }
    else if (req.body.category != "videos" && req.body.category != "assignments"){
        folderId = await this.getFolderId(req,req.body.category)
        filename = req.body.name + ".pdf"
    } 
    try {  
        if (req.hasOwnProperty('file'))
        { 
            const response = await drive.files.create({
                requestBody: {
                    name: filename,
                    parents: [folderId]
                },
                media: { 
                    mimeType: req.body.type,
                    body: fs.createReadStream('./public/' + req.file.originalname),
                },
            });
            req.body.driveId = response.data.id;
            await this.generatePublicUrl(req, next);
        }
    } 
    catch (err) {
        next(err);
    }

};

exports.deleteFile = async (req, next) => {
    try {
        await drive.files.delete({
            fileId: req.body.driveId,
        });
    }
    catch (err) {
        next(err);
    }
};


exports.generatePublicUrl = async (req, next) => {
    try {
        await drive.permissions.create({
            fileId: req.body.driveId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        const result = await drive.files.get({
            fileId: req.body.driveId,
            fields: 'webViewLink',
        });
        req.body.path = result.data.webViewLink;
    }
    catch (err) {
        next(err);
    }

};

exports.driveFolderPath = (req) => {
    return path = req.body.grade + "/" + req.body.branch + "/" + req.body.category
}

exports.createFolder = async (req, id) => {
    folderName = req.body.name.slice(0, -4)
    const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [id]
  };
  try {
    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });

    this.examsFoldersId.table.push({[folderName]: folder.data.id,"grade":req.body.grade, "branch": req.body.branch});
    var json = JSON.stringify(this.examsFoldersId); 
    fs.writeFileSync('examsFoldersId.json', json);
    return folder.data.id;
  } catch (err) {
    throw err;
  }
}

exports.getFolderId = async(req,foldername) =>{
    const folders = this.examsFoldersId.table;
    for (let i = 0; i<folders.length; i++){
        if (foldername == Object.keys(folders[i])[0] && req.body.grade == folders[i]["grade"] && req.body.branch == folders[i]["branch"])
        {
            return folders[i][foldername]
        }
    }
}