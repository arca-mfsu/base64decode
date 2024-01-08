// source: http://jsperf.com/blob-base64-conversion
function base64ToBlob(base64, type) {
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for ( var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
        }
        var blob = new Blob([ view ], {type: type});
        return blob;
};


function blobToBase64(blob, cb) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      cb(base64);
    };
    reader.readAsDataURL(blob);
};
