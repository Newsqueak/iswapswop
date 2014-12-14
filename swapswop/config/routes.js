/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var vod = require('../app/action/vod');

//the custom middleware of routes
var router = require('express').Router();
router.get("/share", vod.share);
router.get("/play", vod.play);
router.post("/upload", vod.upload);

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // user routes
    app.use("/1/vod", router);

    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).end("error:" + err.stack);
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        return res.status(404).end("Page Not Found");
    });
};