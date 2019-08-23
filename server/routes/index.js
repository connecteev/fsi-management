module.exports = function (app) {
  const userRoutes = require('./user')
  const driverRoutes = require('./driver')
  app.use(userRoutes, driverRoutes);
};
