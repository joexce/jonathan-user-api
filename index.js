const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const middleware = require('./middleware');

const app = express();
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

const dbUrl = "mongodb://127.0.0.1:27017/jonathan-user"

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Error connect to the database. Exiting now...', err);
    process.exit();
});

const router = require('./api/router');

app.use(bodyParser.json({
    limit: 90000
}));

app.get("/ping", (req,res) => {
    res.send("it is works");
});

router(app, middleware);

app.listen(port, () => {
    console.log('server is running on port ', port);
})