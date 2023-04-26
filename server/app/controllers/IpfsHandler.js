async function loadIpfs() {
    const { create } = await import('ipfs-core');

    const node = await create({
        // ... config here
    });

    return node;
}
async function saveFileToIpfs(path, data) {
    node = await loadIpfs();
    const fileAdded = await node.add({
        path: path,
        content: data,
    });

    console.log('Added file:', fileAdded.path, fileAdded.cid);
    return fileAdded.path, fileAdded.cid;
}

async function getDataFromIpfs(hash) {
    let ipfs = await loadIpfs();

    let asyncitr = ipfs.cat(hash);

    for await (const itr of asyncitr) {
        let data = Buffer.from(itr).toString();
        return data;
    }
}

module.exports = { loadIpfs, saveFileToIpfs, getDataFromIpfs };
