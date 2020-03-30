const { executeSql } = require('../core/db');
const { sendJson, send500 } = require('../core/httpMsg');
const { addComment, getComments } = require('./comments');

let mockExecuteSqlCount = 0;

jest.mock('../core/db', () => ({
  executeSql: jest.fn((sql, fn) => {
    mockExecuteSqlCount++;
    switch (mockExecuteSqlCount) {
    case 2: // should getComments and handle failure
    case 5: // should getComments and handle failed sql
      fn(null, new Error('sql error').message);
      break;
    case 3: // should getComments and handle no post
      fn([], null);
      break;
    case 7: // should getComments
      fn({ insertId: 'comment id' }, null);
      break;
    default:
      fn(['comment'], null);
    }
  })
}));

jest.mock('../core/httpMsg', () => ({
  sendJson: jest.fn(),
  send500: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('comments', () => {
  it('should getComments', async () => {
    getComments('req', 'res', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(sendJson).toHaveBeenCalledWith('req', 'res', ['comment']);
  });

  it('should getComments and handle failure', async () => {
    getComments('req', 'res', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'sql error');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle bad reqBody', async () => {
    addComment('req', 'res', 'not a json stringified', 'userId', 'postId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Unexpected token o in JSON at position 1');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle empty reqBody', async () => {
    addComment('req', 'res', '{}', 'userId', 'postId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle no name in form data', async () => {
    addComment('req', 'res', '{"name": "", "body": "", "email": ""}', 'userId', 'postId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle no body in form data', async () => {
    addComment('req', 'res', '{"name": "pass", "body": "", "email": ""}', 'userId', 'postId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle bad email form data', async () => {
    addComment('req', 'res', '{"name": "pass", "body": "pass", "email": "bad@"}', 'userId', 'postId');
    expect(executeSql).not.toHaveBeenCalled();
    expect(send500).toHaveBeenCalledWith('req', 'res', 'Input not valid');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle no post', async () => {
    addComment('req', 'res', '{"name": "pass", "body": "pass", "email": "pass@pass.com"}', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'No such post.');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments and handle failed sql', async () => {
    addComment('req', 'res', '{"name": "pass", "body": "pass", "email": "pass@pass.com"}', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(2);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'sql error');
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getComments', async () => {
    addComment('req', 'res', '{"name": "pass", "body": "pass", "email": "pass@pass.com"}', 'userId', 'postId');
    expect(executeSql).toHaveBeenCalledTimes(2);
    expect(send500).not.toHaveBeenCalled();
    expect(sendJson).toHaveBeenCalledWith('req', 'res', { id: 'comment id' });
  });
});
