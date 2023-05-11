const GOOGLE_API_FOLDER_ID = '1G46WOXInmLKxarhskk5jcYk5KOin4w3d';

const fs = require('fs');
const { google } = require('googleapis');

class DownloadDrive {
    download(fileId) {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: './googleKey.json',
                scopes: ['https://www.googleapis.com/auth/drive'],
            });
            const driveService = google.drive({
                version: 'v3',
                auth,
            });

            return driveService.files.get(
                { fileId: fileId, alt: 'media' },
                { responseType: 'stream' },
            );

            // driveService.files.get(
            //     {fileId: fileId, alt: "media",},
            //     {responseType: "stream"},
            //     (err, { data }) => {
            //       if (err) {
            //         console.log(err);
            //         return;
            //       }
            //       let buf = [];
            //       data.on("data", (e) => buf.push(e));
            //       data.on("end", () => {
            //         buffer = Buffer.concat(buf);
            //       });
            //     }
            //   );
        } catch (err) {
            console.log('Upload file error', err);
        }
    }
}
module.exports = new DownloadDrive();
