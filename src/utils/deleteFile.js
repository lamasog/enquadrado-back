const path = require('path');
const fs = require('fs');

module.exports = {
    deleteFile: (fileName) => {
        fs.unlink(path.resolve(__dirname, '..', '..', 'uploads', fileName), (err) => {
            if(err) console.log(err);
        })
    }
}