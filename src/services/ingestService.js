const axios = require('axios');

const sendLogs = async (logs) => {
  try {
    await axios.post('https://external-ingest-service.com/logs', logs);
  } catch (err) {
    console.error('Error sending logs:', err.message);
  }
};

module.exports = {
  sendLogs,
};
