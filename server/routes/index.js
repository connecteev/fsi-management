module.exports = function (app) {
  const userRoutes = require('./user')
  const driverRoutes = require('./driver')
  const childRoutes = require('./child')
  app.use(userRoutes, driverRoutes, childRoutes);
};
