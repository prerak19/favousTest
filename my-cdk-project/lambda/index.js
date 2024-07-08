const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
// const { nanoid } = require('nanoid'); // Import nanoid for generating unique IDs

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Parse the event body if necessary
  let body;
  if (typeof event.body === 'string') {
    body = JSON.parse(event.body);
  } else {
    body = event;
  }

  const { id, input_text, input_file_path } = body;

  // Generate a unique ID using nanoid
//   const id = nanoid();

  console.log('Parsed input_text:', input_text);
  console.log('Parsed input_file_path:', input_file_path);
  console.log('Generated id:', id);
  console.log('process.env.TABLE_NAME:', process.env.TABLE_NAME);

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id,
      input_text,
      input_file_path,
    },
  });

  try {
    const response = await docClient.send(command);
    console.log('DynamoDB response:', response);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('DynamoDB put error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Could not store data in DynamoDB' }),
    };
  }
};


// const AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// exports.handler = async (event) => {
//   const { id, input_text, input_file_path } = event;

//   const params = {
//     TableName: process.env.TABLE_NAME,
//     Item: {
//       id,
//       input_text,
//       input_file_path,
//     },
//   };

//   await dynamodb.put(params).promise();

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//     body: JSON.stringify({ id }),
//   };
// };
