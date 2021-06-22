const path = require('path');
const fs = require('fs');

class FileHandler {
    isFile(dir) {
        dir = path.resolve(process.cwd(), dir);
        return fs.existsSync(dir) && fs.lstatSync(dir).isFile();
    }

    readFile(dir) {
        dir = path.resolve(process.cwd(), dir);
        if (!this.isFile(dir)) return Error(`[jswhat] File at ${dir} does not exist`);
        const content = fs.readFileSync(dir).toString();
        return content.split(/\s/g).filter(x => x);
    }
}

module.exports = exports = FileHandler;