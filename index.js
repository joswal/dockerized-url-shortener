const express = require('express');
const mongoose = require('mongoose');
const urlApi = require('./api/url');
// var cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;


//database connection for local
// mongoose.connect("mongodb://localhost/fcc", {
//         useNewUrlParser: true
//     })
//     .then(() => console.log(`Connected to db...`))
//     .catch(err => console.error(err))

//database connection for docker
mongoose.connect("mongodb://mongo:27017/url-shortener", {
        useNewUrlParser: true
    })
    .then(() => console.log(`Connected to db...`))
    .catch(err => console.error(err))


//middlewares
// app.use(cors());
app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use("/", urlApi)

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;