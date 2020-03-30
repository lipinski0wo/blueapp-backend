const http = require('http');

const { matchUrl } = require('../helpers/matchUrl');
const { retrievePostData } = require('../helpers/retrievePostData');
const { serverPort } = require('../settings');

const { getUser, getUsers } = require('../controllers/users');
const { getPosts, getPost, deletePost, addPost } = require('../controllers/posts');
const { getComments, addComment } = require('../controllers/comments');
const { send405, send500 } = require('./httpMsg');

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', '*');

  switch (req.method) {
  case 'GET':
    matchUrl(req, '/users', () => {
      getUsers(req, res);
    }) ||
    matchUrl(req, '/posts/:userId', ({ userId }) => {
      getPosts(req, res, userId);
    }) ||
    matchUrl(req, '/users/:userId', ({ userId }) => {
      getUser(req, res, userId);
    }) ||
    matchUrl(req, '/posts/:userId/:postId', ({ userId, postId }) => {
      getPost(req, res, userId, postId);
    }) ||
    matchUrl(req, '/comments/:userId/:postId', ({ userId, postId }) => {
      getComments(req, res, userId, postId);
    }) ||
    send405(req, res);
    break;
  case 'POST':
    matchUrl(req, '/posts/:userId/:postId', ({ userId, postId }) => {
      deletePost(req, res, userId, postId);
    }) ||
    matchUrl(req, '/posts/:userId', ({ userId }) => {
      retrievePostData(req, (body, error) => {
        if (error) {
          return send500(req, res, error);
        }
        addPost(req, res, body, userId);
      });
    }) ||
    matchUrl(req, '/comments/:userId/:postId', ({ userId, postId }) => {
      retrievePostData(req, (body, error) => {
        if (error) {
          return send500(req, res, error);
        }
        addComment(req, res, body, userId, postId);
      });
    }) ||
    send405(req, res);
    break;
    // case 'DELETE':
    //     matchUrl(req, '/posts/:userId/:postId', ({ userId, postId }) => {
    //         deletePost(req, res, userId, postId);
    //     }) ||
    //     send404(req, res);
    //     break;
  default:
    send405(req, res);
  }
}).listen(serverPort, function () {
  console.log('server is running on port: ' + serverPort);
});
