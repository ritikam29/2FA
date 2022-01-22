const express = require("express");
// const bodyParser = require('body-parser');
// const JsonDB = require('node-json-db').JsonDB;
// const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
// const uuid = require("uuid");
// const speakeasy = require("speakeasy");

// const app = express();

// // The second argument is used to tell the DB to save after each push
// // If you put false, you'll have to call the save() method.
// // The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// // The last argument is the separator. By default it's slash (/)
// var db = new JsonDB(new Config("myDataBase", true, false, '/'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/api", (req, res) => {
//     res.json({ message: "Welcome to the two factor authentication exmaple" })
// });