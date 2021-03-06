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

exports.uploadFile = async (req, next) => {
    try {
        if (req.hasOwnProperty('file'))
        {
            const response = await drive.files.create({
                requestBody: {
                    name: req.body.name,
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