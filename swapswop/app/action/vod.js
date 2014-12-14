var utils = require("../../lib/utils");
var userAgent = require("express-useragent");

var vod = {};

var responseCode = {
    "success": 200,
    "fail": 500
};

var authorization = function (req) {
    var uagent = req.headers["user-agent"];
    if (!uagent) {
        return {"permsn": false};
    } else {
        return userAgent.parse(uagent);
    }

}

vod.share = function (req, res) {

    var reports = authorization(req);
    if (reports.permsn === false) {
        res.status(responseCode.fail).end("missing require parameter: user-agent");
    } else {
        var ua = {
            "isMobile": reports.isMobile,
            "isiPad": reports.isiPad,
            "isiPod": reports.isiPod,
            "isiPhone": reports.isiPhone,
            "isAndroid": reports.isAndroid,
            "isBlackberry": reports.isBlackberry
        }
        console.log(ua);  //TODO, SET this to database

        var fromDevice = req.query["fr"];
        var videoId = req.query["vid"];
        var toSharePfm = req.query["to"];
        if (fromDevice && videoId && toSharePfm) {
            // TODO, save to database
            res.status(responseCode.success).end(".");

        } else {
            res.status(responseCode.fail).end("lack necessary params of these: fr = iOS::${mobileId}, vid=${videoId}, to=${sharePlatformMark}");
        }
    }

};

vod.upload = function (req, res) {

    var filepath = "/usr/local/nginx/html";

    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (!filename) {
            // If filename is not truthy it means there's no file
            return res.status(responseCode.fail).end("no filename");
        }
        var fstream;
        var fileNewName = utils.uuid();
        fstream = fs.createWriteStream(filepath + '/' + fileNewName.trim() + ".mp4");
        file.pipe(fstream);
        fstream.on('close', function () {
            res.status(responseCode.success).end(JSON.stringify({"vid": fileNewName.trim()}));
        });
    });

    req.pipe(req.busboy);

};

vod.play = function (req, res) {

    var reports = authorization(req);
    if (reports.permsn === false) {
        res.status(responseCode.fail).end("missing require parameter: user-agent");
        /*}else if (!reports.isMobile){
         //TODO render a html page of the case
         res.status(responseCode.fail).end("not using mobile to visit");

         }*/
    } else {

        var srcPfm = req.query["src"];
        var videoId = req.query["vid"];
        if (videoId) {
            //TODO save to database
            console.log(srcPfm);
            res.render("faceplay", {"serverHost": "123.57.7.45", "vodId": videoId});

        } else {
            res.status(responseCode.fail).end("missing video Id");
        }
    }

};

/**
 * Expose *
 */
module.exports = vod;