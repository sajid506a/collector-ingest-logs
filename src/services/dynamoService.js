const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const ddbDocClient = require('../utils/dynamodb');

const TABLE_NAME = process.env.TABLE_NAME || 'Customers';

const initializeTable = async () => {
  try {
    await ddbDocClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table ${TABLE_NAME} already exists.`);
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      const params = {
        TableName: TABLE_NAME,
        KeySchema: [
          { AttributeName: 'customerId', KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'customerId', AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };
      try {
        const createTableResponse = await ddbDocClient.send(new CreateTableCommand(params));
        console.log(`Table ${TABLE_NAME} created successfully.`, createTableResponse);
      } catch (createError) {
        console.error(`Error creating table ${TABLE_NAME}:`, createError);
        throw createError;
      }
    } else {
      throw error;
    }
  }
};

const registerCustomer = async (customer) => {
  const params = {
    TableName: TABLE_NAME,
    Item: customer
  };

  await ddbDocClient.send(new PutCommand(params));
};

const deregisterCustomer = async (customerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      customerId,
    },
  };

  await ddbDocClient.send(new DeleteCommand(params));
};

module.exports = {
  initializeTable,
  registerCustomer,
  deregisterCustomer,
};