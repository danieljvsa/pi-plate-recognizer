import { createRequire } from 'module'
const require = createRequire(import.meta.url);

require('dotenv').config()

const fs = require('fs')
import fetch from 'node-fetch';
const FormData = require("form-data")
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const gpio = require('onoff').Gpio;
const pir = new gpio(12, 'in', 'both');
const led = new gpio(17, 'out');
const raspicam = require('raspicam')
const app = express()


app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const path = "./images"
let today = new Date()
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

var filename = './images/' + date + '_' + time + '.jpg';
var opts = {
    mode: 'photo',
    output: filename,
    t: 2
};

var camera = new raspicam(opts);

app.get('/take-photo', async (req,res) => {
    camera.start();
    
        let image_path = filename;
        
        let body = new FormData();
        body.append("upload", fs.createReadStream(image_path));
        // Or body.append('upload', base64Image);
        body.append("regions", "pt"); // Change to your country
        fetch("https://api.platerecognizer.com/v1/plate-reader/", {
          method: "POST",
          headers: {
            Authorization: process.env.PLATE_RECOGNIZER_TOKEN,
          },
          body: body,
        })
        .then((data) => {
            console.log(data)
            return res.status(200).send(data)
        })
        .then((json) => console.log(json))
        .catch((err) => {
            console.log(err);
            return res.status(400).send(err)
        });
    
})

app.get('/scan-area', async (req, res) => {
    pir.watch(function(err, value) {
        if (value == 1) {
            myCamera.snap().then((result) => {
                // Your picture was captured
            }).catch((error) => {
                // Handle your error
            });
            
        } else {
            console.log("Entry cancelled!")
        }
    });
})


app.listen( process.env.PORT || 3333,() => {
    console.log('Listenning to requests on port 3333')
})
