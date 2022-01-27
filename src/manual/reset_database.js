
const { sequelize, User } = require('../models');

(async () => {

  await sequelize.sync({ force: true });
  var users = await User.findAll();
  console.log(users);

})();
