let fs = require('fs');
let https = require('https');
let { parseString } = require('xml2js');

module.exports.https = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        https.get(url, options, resp => {
            let data = '';
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => resolve(data));
            resp.on('error', error => reject(Error(error)));
        });
    });
};

module.exports.parseXML = xml => {
    return new Promise((resolve, reject) => {
        parseString(xml, {
            explicitArray: false
        }, (error, data) => {
            if (error) reject(Error(error));
            resolve(data);
        });
    });
};

module.exports.map = async (array, callback) => {
    return await Promise.all(
        array.map(i => callback(i))
    );
};

module.exports.write = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(Error(error));
            resolve();
        });
    });
};