var fs = require('fs');
var uuid = require('uuid');
var exec = require('child_process').exec;

var TEMP_PATH = __dirname + '/tmp/';

var rmdir = function (path) {
    fs.readdir(path, function (err, files) {
        if (err)
            return;
        var unlinked = 0;
        files.forEach(function (file) {
            fs.unlink(path + '/' + file, function (err, data) {
                unlinked++;

                if (unlinked == files.length) {
                    fs.rmdir(path, function () { });
                }
            });
        });
    });
};

module.exports.toIconset = function (file) {
    var id = uuid.v1();
    var outpath = TEMP_PATH + id + '.iconset';
    return new Promise((resolve, reject) => {
        exec('iconutil --convert iconset "' + file + '" --output "' + outpath + '"', function (err, stdout) {
            if (err) {
                reject('No ICNS file found!')
                // cb('No ICNS file found!', undefined);
                // return;
            }

            fs.readdir(outpath, function (err, files) {
                if (err) {
                    reject('An error occured while reading the iconset.');
                    // cb('An error occured while reading the iconset.');
                    // return;
                }

                var readfiles = {};

                files.forEach(function (file) {
                    fs.readFile(outpath + '/' + file, function (err, data) {
                        readfiles[file] = data;

                        if (Object.keys(readfiles).length == files.length) {
                            resolve(readfiles);
                            // rmdir(outpath);
                        }
                    });
                });
            });
        });

    })

};

// module.exports.toICNS = function (file, cb) {
//     var id = uuid.v1();

//     var outpath = TEMP_PATH + id + '.icns';

//     exec('iconutil --convert icns "' + file + '" --output "' + outpath + '"', function (err, stdout) {
//         if (err) {
//             cb('No iconset folder found!', undefined);
//             return;
//         }

//         fs.readFile(outpath, function (err, data) {
//             if (err) {
//                 cb(err, undefined);
//                 return;
//             }

//             cb(data);
//             fs.unlink(outpath);
//         });
//     });
// };