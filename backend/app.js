const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const FormData = require('form-data');

const app = express();
const PORT = 8000;
app.use(cors({ origin: 'http://localhost:3000' }));
const upload = multer({ dest: 'uploads/' });


function extractFields(text) {
  const fields = {
    name: null,
    documentNumber: null,
    expirationDate: null
  };

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  lines.forEach(line => {
    if (/Name:/i.test(line)) {
      fields.name = line.split(/:\s*/i)[1]?.replace(/\|/g, '').trim() || 'N/A';
    }
    if (/ID No|Document No|Document Number|1D No/i.test(line)) {
      fields.documentNumber = line.split(/:\s*/i)[1]?.replace(/\|/g, '').trim() || 'N/A';
    }
    if (/Expires|Expiration Date/i.test(line)) {
      fields.expirationDate = line.split(/:\s*/i)[1]?.replace(/\|/g, '').trim() || 'N/A';
    }
  });

  return fields;
}


app.post('/extract', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.resolve(__dirname, req.file.path);

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const response = await axios.post('http://localhost:5001/process-image', formData, {
      headers: formData.getHeaders(),
    });

    const rawText = response.data.text;
    const extractedData = extractFields(rawText);

    res.json(extractedData);
  }
  catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error processing document.');
  }
  finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
