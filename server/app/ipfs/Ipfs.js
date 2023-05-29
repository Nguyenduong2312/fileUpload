const fs = require('fs');

class Ipfs {
    loadIpfs = async () => {
        const { create } = await import('ipfs-http-client');
        // connect to a different API
        const client = create({ url: 'http://127.0.0.1:5002/api/v0' });
        return client;
    };

    saveDataToIpfs = async (node, data) => {
        const fileAdded = await node.add({
            content: data,
        });

        return fileAdded.cid;
    };

    readDataFromIpfs = async (cid) => {
        let asyncitr = node.cat(cid);
        let content = '';
        for await (const itr of asyncitr) {
            let data = Buffer.from(itr).toString();
            content += data;
        }
        return content;
    };

    uploadFile = async (node, filePath) => {
        let data = fs.readFileSync(filePath);
        let options = {
            warpWithDirectory: false,
            progress: (prog) => console.log(`Saved :${prog}`),
        };
        let result = await node.add(data, options);
        return result;
    };
}
module.exports = new Ipfs();
