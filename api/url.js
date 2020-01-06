const express = require('express');
const mongoose = require('mongoose');

const router = express.Router()

//url schema and model
const urlSchema = new mongoose.Schema({
    id: Number,
    name: String
})

const URL = mongoose.model("url", urlSchema);

//validate url

function valid_url(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(str);
}

// API endpoints... 

//post new url
router.post("/new", async function (req, res) {
    try {
        let valid = valid_url(req.body.name);
        if (!valid) return res.status(400).json({
            "error": "invalid URL"
        });
        let found = await URL.findOne({
            name: req.body.name
        })
        if (found) return res.status(400).send(`URL exists already and its new url is ${found.id}`);
        let count = await URL.countDocuments();
        count++;
        let url = new URL({
            id: count,
            name: req.body.name
        })
        await url.save();
        res.status(200).redirect("/");
    } catch (ex) {
        res.status(504).send("something failed, couldnt save url");
    }
});

//index page that gets all shortened urls
router.get("/", async (req, res) => {
    URL.find()
        .then(links => res.render('index', {
            links
        }))
        .catch(err => res.status(404).json({
            msg: "no shortened links found yet"
        }));

});

//get new url
router.get("/:id", async (req, res) => {
    try {
        let url = await URL.findOne({
            id: req.params.id
        })
        if (!url) return res.status(400).send("url doesnt exist in our database");
        res.status(200).redirect('http://' + url.name);
    } catch (ex) {
        res.status(504).send("something failed, couldnt get shorturl and redirect");
    }
})

module.exports = router;