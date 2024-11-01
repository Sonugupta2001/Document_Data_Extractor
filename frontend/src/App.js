import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract data');
      }

      const data = await response.json();
      setExtractedData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request.');
    }
  };

  return (
    <div className="container">
      <h1>Document Data Extraction</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button type="submit" className="submit-button">Upload</button>
      </form>
      {extractedData && (
        <div className="extracted-data">
          <h2>Extracted Information:</h2>
          <p><strong>Name:</strong> {extractedData.name || 'N/A'}</p>
          <p><strong>Document Number:</strong> {extractedData.documentNumber || 'N/A'}</p>
          <p><strong>Expiration Date:</strong> {extractedData.expirationDate || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default App;