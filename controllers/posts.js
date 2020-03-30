const { executeSql } = require('../core/db');
const { sendJson, send500, send200, send404 } = require('../core/httpMsg');

exports.getPosts = function (req, res, userId) {
  executeSql(`SELECT * FROM posts WHERE userId=${userId}`, (results, error) => {
    if (error) {
      return send500(req, res, error);
    }
    sendJson(req, res, results);
  });
};

exports.getPost = function (req, res, userId, postId) {
  executeSql(`SELECT * FROM posts WHERE userId=${userId} AND id=${postId}`, (results, error) => {
    if (error) {
      return send500(req, res, error);
    }
    if (results.length === 0) {
      return send404(req, res);
    }
    sendJson(req, res, results[0]);
  });
};

exports.addPost = function (req, res, reqBody, userId) {
  try {
    const data = JSON.parse(reqBody);

    if (!data) throw new Error('Input not valid');
    if (!data.title || typeof data.title !== 'string' || data.title.length < 1) throw new Error('Input not valid');
    if (!data.body || typeof data.body !== 'string' || data.body.length < 1) throw new Error('Input not valid');

    executeSql(`SELECT * FROM users WHERE id=${userId}`, (results, error) => {
      if (!error && results.length === 0) {
        error = new Error('No such user.').message;
      }
      if (error) {
        return send500(req, res, error);
      }

      executeSql(`INSERT INTO posts (userId, title, body) VALUES ('${userId}', '${data.title}', '${data.body}')`, (results, error) => {
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

exports.deletePost = function (req, res, userId, postId) {
  executeSql(`DELETE FROM posts WHERE userId=${userId} AND id=${postId}`, (results, error) => {
    if (!error && results.affectedRows === 0) {
      error = new Error('Failed to delete post').message;
    }
    if (error) {
      return send500(req, res, error);
    }
    executeSql(`DELETE FROM comments WHERE userId=${userId} AND postId=${postId}`, (results, error) => {
      if (error) {
        return send500(req, res, error);
      }
      send200(req, res);
    });
  });
};
