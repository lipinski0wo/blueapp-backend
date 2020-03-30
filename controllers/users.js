const { executeSql } = require('../core/db');
const { sendJson, send500, send404 } = require('../core/httpMsg');
const { mapDbResponse } = require('../helpers/usersController');

exports.getUsers = function (req, res) {
  executeSql('SELECT * FROM users', (results, error) => {
    if (error) {
      return send500(req, res, error);
    }

    sendJson(req, res, mapDbResponse(results));
  });
};

exports.getUser = function (req, res, id) {
  executeSql(`SELECT * FROM users WHERE id=${id}`, (results, error) => {
    if (error) {
      return send500(req, res, error);
    }
    if (results.length === 0) {
      return send404(req, res);
    }
    sendJson(req, res, mapDbResponse(results)[0]);
  });
};
