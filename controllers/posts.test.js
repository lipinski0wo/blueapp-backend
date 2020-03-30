const { executeSql } = require('../core/db');
const { sendJson, send500, send200, send404 } = require('../core/httpMsg');
const { getPosts, getPost, addPost, deletePost } = require('./posts');

let mockExecuteSqlCount = 0;

jest.mock('../core/db', () => ({
  executeSql: jest.fn((sql, fn) => {
    mockExecuteSqlCount++;
    switch (mockExecuteSqlCount) {
    case 2: // should getUsers and handle failure
    case 5: // should getPost and handle failure
    case 8: // should addPost and handle no user
    case 13: // should deletePost and fail to delete post
    case 15: // should deletePost and fail to delete comments
      fn(null, new Error('sql error').message);
      break;
    case 4: // should getPost and handle no user
    case 6: // should addPost and handle empty form data
      fn([], null);
      break;
    case 10: // should addPost and handle failure
      fn({ insertId: 1 }, null);
      break;
    default:
      fn(['post'], null);
    }
  })
}));

jest.mock('../core/httpMsg', () => ({
  sendJson: jest.fn(),
  send500: jest.fn(),
  send404: jest.fn(),
  send200: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('posts', () => {
  it('should getUsers', async () => {
    getPosts('req', 'res', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(sendJson).toHaveBeenCalledWith('req', 'res', ['post']);
  });

  it('should getUsers and handle failure', async () => {
    getPosts('req', 'res', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'sql error');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getPost', async () => {
    getPost('req', 'res', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(sendJson).toHaveBeenCalledWith('req', 'res', 'post');
  });

  it('should getPost and handle no user', async () => {
    getPost('req', 'res', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(send404).toHaveBeenCalledWith('req', 'res');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getPost and handle failure', async () => {
    getPost('req', 'res', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'sql error');
    expect(send404).not.toHaveBeenCalled();
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost and handle empty form data', async () => {
    addPost('req', 'res', '{}', 'userId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost and handle wrong body', async () => {
    addPost('req', 'res', 'not a json stringified', 'userId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Unexpected token o in JSON at position 1');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost and handle bad form data body', async () => {
    addPost('req', 'res', '{"title": "pass", "body": ""}', 'userId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost and handle bad form data title', async () => {
    addPost('req', 'res', '{"title": "", "body": "pass"}', 'userId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost and handle no user', async () => {
    addPost('req', 'res', '{"title": "pass", "body": "pass"}', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'No such user.');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost and handle failure', async () => {
    addPost('req', 'res', '{"title": "pass", "body": "pass"}', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(2);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'sql error');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should addPost', async () => {
    addPost('req', 'res', '{"title": "pass", "body": "pass"}', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(2);
    expect(send500).not.toHaveBeenCalled();
    expect(sendJson).toHaveBeenCalledWith('req', 'res', { id: 1 });
  });

  it('should deletePost', async () => {
    deletePost('req', 'res', 'userId', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(2);
    expect(send500).not.toHaveBeenCalled();
    expect(send200).toHaveBeenCalledTimes(1);
  });

  it('should deletePost and fail to delete post', async () => {
    deletePost('req', 'res', 'userId', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalled();
    expect(send200).not.toHaveBeenCalled();
  });

  it('should deletePost and fail to delete comments', async () => {
    deletePost('req', 'res', 'userId', 'userId');
    expect(executeSql).toHaveBeenCalledTimes(2);
    expect(send500).toHaveBeenCalled();
    expect(send200).not.toHaveBeenCalled();
  });
});
