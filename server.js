const express = require('express');
const multer = require('multer');
const Clarifai = require('clarifai');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const clarifaiApp = new Clarifai.App({
  apiKey: '3a31a47e4df64761ab1f57d6a93ac1f5'
});

app.post('/api/recognize', upload.single('image'), async (req, res) => {
  try {
    const imageBytes = fs.readFileSync(req.file.path);
    const response = await clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, { base64: imageBytes.toString('base64') });
    const keywords = response.outputs[0].data.concepts.map(concept => concept.name);

    res.json({ keywords });
  } catch (error) {
    console.error('Error with Clarifai:', error);
    res.status(500).send('Image recognition failed');
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
