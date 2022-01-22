const express = require("express");
const bodyParser = require('body-parser');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const uuid = require("uuid");
const speakeasy = require("speakeasy");

const app = express();


var db = new JsonDB(new Config("myDataBase", true, false, '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the 2FA" })
});

// for user registration
app.post("/api/register", (req, res) => {
    const id = uuid.v4();
    try {
        const path = `/user/${id}`;
        // create temporary secret for it to get verified
        const temp_secret = speakeasy.generateSecret();

        db.push(path, { id, temp_secret });
        // Send user id to user
        res.json({ id, secret: temp_secret.base32 })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error generating key' })
    }
})

app.post("/api/verify", (req, res) => {
    const { userId, token } = req.body;
    try {
        // Retrieve the user from database
        const path = `/user/${userId}`;
        const user = db.getData(path);
        console.log({ user })
        const { base32: secret } = user.temp_secret;
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token
        });
        if (verified) {
            // Update the user data
            db.push(path, { id: userId, secret: user.temp_secret });
            res.json({ verified: true })
        } else {
            res.json({ verified: false })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error finding the user' })
    };
})

app.post("/api/validate", (req, res) => {
    const { userId, token } = req.body;
    try {
        // Retrieve the user from database
        const path = `/user/${userId}`;
        const user = db.getData(path);
        console.log({ user })
        const { base32: secret } = user.secret;
        // Returns true if the token matches
        const validates = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1
        });
        if (validates) {
            res.json({ validated: true })
        } else {
            res.json({ validated: false })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user' })
    };
})

const port = 5000;

app.listen(port, () => {
    console.log(`App is running on PORT: ${port}.`);
});