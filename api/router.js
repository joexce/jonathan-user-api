'use strict';
const controller = require('./controller/user');
const auth = require('./controller/auth');

module.exports = function (app, middleware) {
    app.route('/user').get(middleware.validation, controller.getUser);
    app.route('/user').post(middleware.validation, controller.createUser);
    app.route('/user').put(middleware.validation, controller.updateUser);
    app.route('/user').delete(middleware.validation, controller.deleteUser);
    app.route('/user/account/:accountNumber').get(middleware.validation, controller.getUserByAccountnumber);
    app.route('/user/id/:id').get(middleware.validation, controller.getUserById);

    app.route('/user/login').post(auth.login);
};