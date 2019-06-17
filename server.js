'use strict';
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads'});
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
let count = 0;
let total = 0;

app.use(express.static('public'));
app.use(bodyParser.json({
    limit: '16mb'
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '256mb'
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        res.json(req.file);
    } else throw 'error';
});

app.post('/upload64', (req, res) => {
    if (!req.body || !req.body.data) {
        res.sendStatus(400);
        return;
    }

    total++;
    const base64Data = req.body.data.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(path.resolve(__dirname, 'uploads', `img_${new Date().getTime()}.png`), base64Data, 'base64', function (err) {
        err && console.log(err);
        if (!err) {
            console.log('File written successfully', count, ' of ', total);
        }
        count++;
    });
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log('Listening at ' + PORT);
});

process.on('uncaughtException', function (error) {
    console.log(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});
