const fs = require('fs');

module.exports = function $(file) {
    if (typeof fs === 'undefined') return null;
    const isFile = fs.existsSync(file) && fs.lstatSync(file).isFile();
    if (!isFile) return false;

    return {
        read: () => {
            const buffer = fs.readFileSync(file, 'utf8');
            return buffer.toString();
        },
    };
};
