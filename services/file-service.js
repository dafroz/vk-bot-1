var fs = require('fs');
var Q = require('q');
var request = require('./../request-wrapper');

module.exports = function(options) {
    var fileId = 0;
    var directory = options.directory;
    
    var getFilename = function() {
        fileId++;
        return directory + '/' + fileId;
    };

    this.downloadAndSaveFile = function(url, ext) {
        var deferred = Q.defer();
        var file = getFilename() + '.' + ext;
        console.log('[file-service] Create file', file);

        try {
            var downloadImageStream = request
                .raw({
                    url: url
                })
                .pipe(fs.createWriteStream(file));

            downloadImageStream.on('finish', function() {
                deferred.resolve(file);
            });
        } catch (e) {
            deferred.failure(e);
        }

        return deferred.promise;
    };

    this.deleteFile = function(filename) {
        console.log('[file-service] Delete', filename);
        fs.unlink(filename);
    };
};



