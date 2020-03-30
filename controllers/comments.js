const { executeSql } = require('../core/db');
const { sendJson, send500 } = require('../core/httpMsg');

exports.getComments = function (req, res, userId, postId) {
  executeSql(`SELECT * FROM comments WHERE userId=${userId} AND postId=${postId}`, (results, error) => {
    if (error) {
      return send500(req, res, error);
    }
    sendJson(req, res, results);
  });
};

exports.addComment = function (req, res, reqBody, userId, postId) {
  try {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const data = JSON.parse(reqBody);
    if (!data) throw new Error('Input not valid');
    if (!data.name || typeof data.name !== 'string' || data.name.length < 1) throw new Error('Input not valid');
    if (!data.body || typeof data.body !== 'string' || data.body.length < 1) throw new Error('Input not valid');
    if (!data.email || typeof data.email !== 'string' || !re.test(data.email)) throw new Error('Input not valid');

    executeSql(`SELECT * FROM posts WHERE id=${postId} AND userId=${userId}`, (results, error) => {
      if (!error && results.length === 0) {
        error = new Error('No such post.').message;
      }
      if (error) {
        return send500(req, res, error);
      }

      executeSql(`INSERT INTO comments (userId, postId, name, body, email) VALUES ('${userId}', '${postId}', '${data.name}', '${data.body}', '${data.email}')`, (results, error) => {
        if (error) {
          return send500(req, res, error);
        }
        sendJson(req, res, { id: results.insertId });
      });
    });
  } catch (err) {
    send500(req, res, err);
  }
};
