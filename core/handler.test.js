const { getUser, getUsers } = require('../controllers/users');
const { getPosts, getPost, deletePost, addPost } = require('../controllers/posts');
const { getComments, addComment } = require('../controllers/comments');
const { send405, send500 } = require('./httpMsg');

const { retrievePostData } = require('../helpers/retrievePostData');

const { handler } = require('./handler');

let mockRetrievePostDataCount = 0;
jest.mock('../helpers/retrievePostData', () => ({
  retrievePostData: jest.fn((req, call) => {
    mockRetrievePostDataCount++;
    switch (mockRetrievePostDataCount) {
    case 2:
    case 4:
      call({}, new Error('error').message);
      break;

    default:
      call({ data: 'data' }, null);
      break;
    }
  }),
}));

jest.mock('./httpMsg', () => ({
  send500: jest.fn(),
  send405: jest.fn()
}));

jest.mock('../controllers/comments', () => ({
  getComments: jest.fn(),
  addComment: jest.fn()
}));

jest.mock('../controllers/posts', () => ({
  getPost: jest.fn(),
  getPosts: jest.fn(),
  deletePost: jest.fn(),
  addPost: jest.fn()
}));

jest.mock('../controllers/users', () => ({
  getUser: jest.fn(),
  getUsers: jest.fn()
}));

jest.mock('../helpers/mapDbResponse', () => ({
  mapDbResponse: jest.fn((response) => response)
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('handler', () => {
  it('should set headers', async () => {
    const setHeader = jest.fn();
    await handler({ method: 'GET', url: '/' }, { setHeader });
    expect(setHeader).toHaveBeenCalledTimes(5);
  });

  it('should getUsers', async () => {
    await handler({ method: 'GET', url: '/users' }, { setHeader: jest.fn() });
    expect(getUsers).toHaveBeenCalledTimes(1);
    expect(send405).not.toHaveBeenCalled();
    expect(getPost).not.toHaveBeenCalled();
    expect(getPosts).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(getComments).not.toHaveBeenCalled();
  });

  it('should getUser', async () => {
    await handler({ method: 'GET', url: '/users/1' }, { setHeader: jest.fn() });
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(send405).not.toHaveBeenCalled();
    expect(getPost).not.toHaveBeenCalled();
    expect(getPosts).not.toHaveBeenCalled();
    expect(getUsers).not.toHaveBeenCalled();
    expect(getComments).not.toHaveBeenCalled();
  });

  it('should getPosts', async () => {
    await handler({ method: 'GET', url: '/posts/1' }, { setHeader: jest.fn() });
    expect(getPosts).toHaveBeenCalledTimes(1);
    expect(send405).not.toHaveBeenCalled();
    expect(getPost).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(getUsers).not.toHaveBeenCalled();
    expect(getComments).not.toHaveBeenCalled();
  });

  it('should getPost', async () => {
    await handler({ method: 'GET', url: '/posts/1/1' }, { setHeader: jest.fn() });
    expect(getPost).toHaveBeenCalledTimes(1);
    expect(send405).not.toHaveBeenCalled();
    expect(getPosts).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(getUsers).not.toHaveBeenCalled();
    expect(getComments).not.toHaveBeenCalled();
  });

  it('should getComments', async () => {
    await handler({ method: 'GET', url: '/comments/1/1' }, { setHeader: jest.fn() });
    expect(getComments).toHaveBeenCalledTimes(1);
    expect(send405).not.toHaveBeenCalled();
    expect(getPosts).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(getUsers).not.toHaveBeenCalled();
    expect(getPost).not.toHaveBeenCalled();
  });

  it('should send405', async () => {
    await handler({ method: 'GET', url: '/notfound' }, { setHeader: jest.fn() });
    expect(send405).toHaveBeenCalledTimes(1);
    expect(getComments).not.toHaveBeenCalled();
    expect(getPosts).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(getUsers).not.toHaveBeenCalled();
    expect(getPost).not.toHaveBeenCalled();
  });

  it('should deletePost', async () => {
    await handler({ method: 'POST', url: '/posts/1/1' }, { setHeader: jest.fn() });
    expect(deletePost).toHaveBeenCalledTimes(1);
    expect(retrievePostData).not.toHaveBeenCalled();
    expect(send500).not.toHaveBeenCalled();
    expect(send405).not.toHaveBeenCalled();
    expect(addPost).not.toHaveBeenCalled();
    expect(addComment).not.toHaveBeenCalled();
  });

  it('should send405', async () => {
    await handler({ method: 'POST', url: '/notfound' }, { setHeader: jest.fn() });
    expect(send405).toHaveBeenCalledTimes(1);
    expect(retrievePostData).not.toHaveBeenCalled();
    expect(send500).not.toHaveBeenCalled();
    expect(deletePost).not.toHaveBeenCalled();
    expect(addPost).not.toHaveBeenCalled();
    expect(addComment).not.toHaveBeenCalled();
  });

  it('should addPost', async () => {
    await handler({ method: 'POST', url: '/posts/1' }, { setHeader: jest.fn() });
    expect(addPost).toHaveBeenCalledTimes(1);
    expect(retrievePostData).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(deletePost).not.toHaveBeenCalled();
    expect(send405).not.toHaveBeenCalled();
    expect(addComment).not.toHaveBeenCalled();
  });

  it('should addPost error', async () => {
    await handler({ method: 'POST', url: '/posts/1' }, { setHeader: jest.fn() });
    expect(send500).toHaveBeenCalledTimes(1);
    expect(retrievePostData).toHaveBeenCalledTimes(1);
    expect(addPost).not.toHaveBeenCalled();
    expect(deletePost).not.toHaveBeenCalled();
    expect(send405).not.toHaveBeenCalled();
    expect(addComment).not.toHaveBeenCalled();
  });

  it('should addComment', async () => {
    await handler({ method: 'POST', url: '/comments/1/1' }, { setHeader: jest.fn() });
    expect(addComment).toHaveBeenCalledTimes(1);
    expect(retrievePostData).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(deletePost).not.toHaveBeenCalled();
    expect(send405).not.toHaveBeenCalled();
    expect(addPost).not.toHaveBeenCalled();
  });

  it('should addComment error', async () => {
    await handler({ method: 'POST', url: '/comments/1/1' }, { setHeader: jest.fn() });
    expect(send500).toHaveBeenCalledTimes(1);
    expect(retrievePostData).toHaveBeenCalledTimes(1);
    expect(addComment).not.toHaveBeenCalled();
    expect(deletePost).not.toHaveBeenCalled();
    expect(send405).not.toHaveBeenCalled();
    expect(addPost).not.toHaveBeenCalled();
  });
});
