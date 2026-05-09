const Service = require('../models/Service');

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};
