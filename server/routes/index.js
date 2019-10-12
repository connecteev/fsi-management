module.exports = function (app) {
  const userRoutes = require('./user')
  const driverRoutes = require('./driver')
  const childRoutes = require('./child')
  const attendanceRoutes = require('./attendance')
  const paRoutes = require('./passengerAssistant')
  const fileUploadRoutes = require('./fileUpload');
  const invoiceRoutes = require('./invoice');
  app.use(userRoutes, driverRoutes, childRoutes, paRoutes, fileUploadRoutes, attendanceRoutes, invoiceRoutes);
};
