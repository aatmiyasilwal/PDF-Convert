import React, { useState } from 'react';
import { Header } from './components/main_page';
import { Button } from '@blueprintjs/core'; // Importing the Button component from Blueprint.js
import { previewStyle } from './css_styles';
import '@blueprintjs/core/lib/css/blueprint.css'; // Importing Blueprint.js CSS

const App: React.FC = () => {
  const [filePreviews, setFilePreviews] = useState<{ type: string; data: string }[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files); // Convert FileList to an array
      const previews: { type: string; data: string }[] = [];
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push({ type: file.type, data: reader.result as string });
          if (previews.length === fileArray.length) {
            setFilePreviews(prevPreviews => [...prevPreviews, ...previews]); // Merge new previews with existing ones
          }
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      });
    }
  };

  const handleClear = () => {
    setFilePreviews([]); // Clear the previews
  };

  const handleConvert = async () => {
    if (filePreviews.length > 0) {
      const file = filePreviews[0]; // Assuming you want to convert the first file
      const formData = new FormData();
      formData.append('file', file.data); // This needs to be a Blob or File object

      const response = await fetch('http://localhost:5000/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File converted successfully", result);
        // Optionally handle success (e.g., show a notification)
      } else {
        const error = await response.json();
        console.error("Error converting file:", error);
        // Optionally handle error (e.g., show an error message)
      }
    } else {
      console.log("No file selected for conversion");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', textAlign: 'center', marginLeft: '25vw', width: '100%' }}>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          multiple
          accept=".pdf, .doc, .docx, image/*" // Accept PDF, Word, and image files
          style={{ margin: '10px' }} // Margin for spacing
        />
        <Button
          onClick={handleClear}
          intent="danger"
          style={{ marginLeft: '10px' }}
          text="Clear"
        />

      </div>
      {filePreviews.length > 0 && (
        <div>
          <h3 style={{ color: 'black' }}>File Previews:</h3>
          <div style={previewStyle}>
            <div style={{ display: 'inline-flex' }}> {/* Use inline-flex to align items horizontally */}
              {filePreviews.map((preview, index) => (
                <div key={index} style={{ margin: '10px' }}>
                  {preview.type.startsWith('image/') ? (
                    <img
                      src={preview.data}
                      alt={`preview-${index}`}
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  ) : preview.type === 'application/pdf' ? (
                    <iframe
                      src={preview.data}
                      title={`preview-${index}`}
                      style={{ width: '150px', height: '200px' }}
                    />
                  ) : (
                    <div>Unsupported file type</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Button
        onClick={handleConvert}
        intent="primary"
        style={{ marginLeft: '47vw', bottom: '10vh', position: 'fixed', }}
        text="Convert"
      />
    </div>
  );
};

export default App;