const GOOGLE_API_FOLDER_ID = '1G46WOXInmLKxarhskk5jcYk5KOin4w3d';

const fs = require('fs');
const { google } = require('googleapis');

class UploadDrive {
    upload(path, name) {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: './googleKey.json',
                scopes: ['https://www.googleapis.com/auth/drive'],
            });
            const driveService = google.drive({
                version: 'v3',
                auth,
            });

            const fileMetaData = {
                name: `${name}`,
                parents: [GOOGLE_API_FOLDER_ID],
            };

            const media = {
                mimeType: 'image/jpg',
                body: fs.createReadStream(path),
            };
            return driveService.files.create({
                resource: fileMetaData,
                media: media,
            });
        } catch (err) {
            console.log('Upload file error', err);
        }
    }
}
module.exports = new UploadDrive();
