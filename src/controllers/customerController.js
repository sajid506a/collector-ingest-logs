const dynamoService = require('../services/dynamoService');

const registerCustomer = async (req, res) => {
  const customer = req.body;

  try {
    await dynamoService.registerCustomer(customer);
    res.status(201).send('Customer registered successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deregisterCustomer = async (req, res) => {
  const { customerId } = req.params;

  try {
    await dynamoService.deregisterCustomer(customerId);
    res.status(200).send('Customer deregistered successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  registerCustomer,
  deregisterCustomer,
};