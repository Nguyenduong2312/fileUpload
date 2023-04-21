class convertString {
    bytesToHex(byteArray) {
        return byteArray.toString('hex');
    }
    hexToBytes(hex) {
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }
}
module.exports = new convertString();
