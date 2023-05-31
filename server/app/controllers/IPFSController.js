const Ipfs = require('../ipfs/Ipfs');

const ipfs = Ipfs.loadIpfs();

class IPFSController {
    // load(req, res, next)
    // {
    //     if (ipfs != null) {
    //         console.log(ipfs);
    //         res.status(200).json({ data: ipfs });
    //     }
    // }
    upFile(req, res, next) {
        ipfs.then(async (ipfs) => {
            try {
                let result = await Ipfs.uploadFile(ipfs, req.body.path);
                res.status(200).json({ status: true });
            } catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ error: 'Failed to upload file' });
            }
        });
    }
    downFile(req, res, next) {
        ipfs.then(async (ipfs) => {
            try {
                let result = await Ipfs.downloadFile(
                    ipfs,
                    req.body.cid,
                    req.body.destPath,
                );
                res.status(200).json({ status: true });
            } catch (error) {
                console.error('Error downloading file:', error);
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
    }
}

module.exports = new IPFSController();
