const PlayHT = require('playht');
const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors');
const multer = require('multer')
app.use(express.json())
app.use(cors());
const FormData = require('form-data');
const fetch = require('node-fetch');
require('dotenv').config();
const formData = new FormData();
let uniqueFileName;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        uniqueFileName = uniqueSuffix + '-' + file.originalname;
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const upload = multer({ storage });

const defaultVoice = 's3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json'

PlayHT.init({
    apiKey: process.env.API_KEY,
    userId: process.env.USER_ID,
});

const myfunction = async (userText, voiceId, language = "hindi") => {
    // Generate audio from text
    const generated = await PlayHT.generate(userText, {
        voiceEngine: 'PlayHT2.0',
        voiceId,
        outputFormat: 'mp3',
        temperature: 1.5,
        language,
        quality: 'high',
        speed: 0.8,
    });

    // Grab the generated file URL
    const { audioUrl } = generated;

    return audioUrl;
}

const cloneMyVoice = async (fileName, voiceName, voiceGender) => {
    formData.append('voice_name', voiceName);
    formData.append('sample_file', fs.createReadStream(`uploads/${uniqueFileName}`));

    const url = 'https://api.play.ht/api/v2/cloned-voices/instant';
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            AUTHORIZATION: process.env.API_KEY,
            'X-USER-ID': process.env.USER_ID
        }
    };

    options.body = formData;

    const newData = await fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.error('error:' + err));

    return newData;
}

const getClonedVoices = async () => {
    const url = 'https://api.play.ht/api/v2/cloned-voices';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            AUTHORIZATION: process.env.API_KEY,
            'X-USER-ID': process.env.USER_ID
        }
    };

    const newData = fetch(url, options)
        .then(res => res.json())
        .then(json => {
            return json;
        })
        .catch(err => console.error('error:' + err));

    return newData;
}

app.get('/ai-voices', async (req, res) => {
    const voices = await PlayHT.listVoices();
    res.send(voices);
});

app.get('/ai-cloned-voice', async (req, res) => {
    const clonedVoices = await getClonedVoices();
    res.send(JSON.stringify(clonedVoices));
});

app.post('/text-to-speech', async (req, res) => {
    let { text, selectedVoiceId, language } = req.body;
    if (selectedVoiceId === '') selectedVoiceId = defaultVoice;
    try {
        const mp3File = await myfunction(text, selectedVoiceId, language);
        res.send(mp3File);
    } catch (error) {
        console.error(error);
    }
});

app.post('/upload_voice', upload.single('file'), async (req, res, next) => {
    let { fileName, voiceName, voiceGender } = req.body;
    const mp3File = await cloneMyVoice(fileName, voiceName, voiceGender);
    mp3File.language = "CustomVoice"
    res.send(mp3File);
})

app.post('/delete-ai-cloned-voice', async (req, res) => {
    const { cloneId } = req.body;
    const deletedVoice = await PlayHT.deleteClone(cloneId);
    res.send(JSON.stringify(deletedVoice));
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});