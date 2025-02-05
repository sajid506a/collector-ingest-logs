const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
const client = new DynamoDBClient({ 
    region: process.env.REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'defaultAccessKeyId',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'defaultSecretAccessKey'
    }
  });
const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = ddbDocClient;