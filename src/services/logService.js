const ddbDocClient = require('../utils/dynamodb');
const ingestService = require('./ingestService');
const { ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const axios = require('axios');

const pollLogs = async () => {
  const params = {
    TableName: 'Customers',
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    for (const customer of data.Items) {
      // Fetch logs based on customer.config
      const logs = await fetchLogs(customer.config);
      // Save state in state db
      await saveState(customer.customerId, logs);
      // Send logs to external ingest service
      await ingestService.sendLogs(logs);
    }
  } catch (err) {
    console.error(err);
  }
};


const fetchLogs = async (config) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log(response.data.length);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    return [];
  }
};

const saveState = async (customerId, logs) => {
  const params = {
    TableName: 'State',
    Key: { customerId },
    UpdateExpression: 'set logs = :logs',
    ExpressionAttributeValues: {
      ':logs': logs,
    },
  };

  try {
    await ddbDocClient.send(new UpdateCommand(params));
  } catch (err) {
    console.error('Error saving state:', err.message);
  }
};

module.exports = pollLogs;
