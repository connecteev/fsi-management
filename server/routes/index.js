module.exports = function (app) {
  const userRoutes = require('./user')
  app.use(userRoutes);
};
