var fs = require('fs');

module.exports.createDirIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

// data must be string
module.exports.saveConfig = (data, dir, fileName) => {
    fs.writeFileSync(`${dir}/${fileName}`, data, (err) => {
        if (err) throw err;
        console.log(`Data is successfully saved in '${dir}/${fileName}'`);
    });
}