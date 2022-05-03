require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PiCamera = require('pi-camera');
const app = express()


app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const path = "./images"
let today = new Date()
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ path }/${date}_${time}.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

myCamera.snap().then((result) => {
    // Your picture was captured
}).catch((error) => {
    // Handle your error
});




app.listen( process.env.PORT || 3333,() => {
    console.log('Listenning to requests on port 3333')
})