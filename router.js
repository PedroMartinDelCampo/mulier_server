var AuthController = require('./controller/auth');
module.exports = function(router) {
    AuthController(router);
};