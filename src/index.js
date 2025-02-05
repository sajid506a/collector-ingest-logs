const express = require('express');
const cron = require('node-cron');
const customerController = require('./controllers/customerController');
const pollLogs = require('./services/logService');
const { initializeTable } = require('./services/dynamoService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

initializeTable().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to initialize table:', error);
  process.exit(1); // Exit the process with an error code
});

// Schedule polling for logs every 5 minutes
cron.schedule('*/1 * * * *', () => {
  console.log('Polling for logs...');
  pollLogs();
});

// Register customer and collector
app.post('/register', customerController.registerCustomer);

// Deregister customer
app.delete('/deregister/:customerId', customerController.deregisterCustomer);