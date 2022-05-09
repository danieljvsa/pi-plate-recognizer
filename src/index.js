require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PiCamera = require('pi-camera');
const gpio = require('onoff').Gpio;
const pir = new gpio(12, 'in', 'both');
const led = new gpio(17, 'out');
const app = express()


app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const myCamera = new PiCamera({
  mode: 'photo',
  width: 640,
  height: 480,
  nopreview: true,
});

app.get('/take-photo', async (req,res) => {
    myCamera.snap().then((result) => {
        let image_path = result;
        let body = new FormData();
        body.append("upload", fs.createReadStream(image_path));
        // Or body.append('upload', base64Image);
        body.append("regions", "pt"); // Change to your country
        fetch("https://api.platerecognizer.com/v1/plate-reader/", {
          method: "POST",
          headers: {
            Authorization: PLATE_RECOGNIZER_TOKEN,
          },
          body: body,
        })
        .then((res) => {
            console.log(res.results.plate)
            return res.status(200).send(res.results.plate)
        })
        .then((json) => console.log(json))
        .catch((err) => {
            console.log(err);
            return res.status(400).send(err)
        });
    }).catch((error) => {
        return res.status(500).send(err)
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