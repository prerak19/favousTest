import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';

const s3 = new AWS.S3({
  region: 'us-east-1',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:2b2c1a99-cece-444a-9cae-99c1aa6bedb0',
  }),
});

function App() {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    setUploading(true);

    const fileKey = `uploads/${file.name}`;

    try {
      const params = {
        Bucket: 'mycdkprojectstack-mybucketf68f3ff0-rauuimsuc9mh',
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      };

      await s3.upload(params).promise();

      console.log('File uploaded successfully');
      console.log('S3 URL:', `s3://${params.Bucket}/${params.Key}`);
      console.log('Text Input:', textInput);

      // ✅  MyCdkProjectStack

      // ✨  Deployment time: 223.69s
      
      // Outputs:
      // MyCdkProjectStack.FileApiEndpoint0B05AD47 = https://s69hpb5tq9.execute-api.us-east-1.amazonaws.com/prod/
      // Stack ARN:
      // arn:aws:cloudformation:us-east-1:533352177208:stack/MyCdkProjectStack/b9addc10-3c1a-11ef-aaac-0e45a15df905
      
      // ✨  Total time: 226.77s
      const response = await fetch('https://s69hpb5tq9.execute-api.us-east-1.amazonaws.com/prod/', {
        method: 'POST',
        body: JSON.stringify({
          id: nanoid(),
          input_text: textInput,
          input_file_path: `s3://${params.Bucket}/${params.Key}`,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('DynamoDB Response:', result);

    } catch (error) {
      console.error('Error:', error);
      alert(`Upload failed: ${error.message}`);
    }

    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="textInput">Text input:</label>
        <input
          type="text"
          id="textInput"
          value={textInput}
          onChange={handleTextChange}
        />
      </div>
      <div>
        <label htmlFor="fileInput">File input:</label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
        />
        {file ? <span>{file.name}</span> : <span>No file chosen</span>}
      </div>
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}

export default App;