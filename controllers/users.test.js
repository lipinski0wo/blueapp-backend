const { executeSql } = require('../core/db');
const { sendJson, send500, send404 } = require('../core/httpMsg');
const { mapDbResponse } = require('../helpers/mapDbResponse');
const { getUsers, getUser } = require('./users');

let mockExecuteSqlCount = 0;

jest.mock('../core/db', () => ({
  executeSql: jest.fn((sql, fn) => {
    mockExecuteSqlCount++;

    switch (mockExecuteSqlCount) {
    case 2: // should getUsers and handle failure
    case 5: // should getUser and handle failure
      fn(null, new Error('sql error').message);
      break;
    case 4: // should getUser and handle no user
      fn([], null);
      break;
    default:
      fn(['user'], null);
    }
  })
}));

jest.mock('../core/httpMsg', () => ({
  sendJson: jest.fn(),
  send500: jest.fn(),
  send404: jest.fn()
}));

jest.mock('../helpers/mapDbResponse', () => ({
  mapDbResponse: jest.fn((response) => response)
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('users', () => {
  it('should getUsers', async () => {
    getUsers('req', 'res');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(mapDbResponse).toHaveBeenCalledWith(['user']);
    expect(sendJson).toHaveBeenCalledWith('req', 'res', ['user']);
  });

  it('should getUsers and handle failure', async () => {
    getUsers('req', 'res');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalled();
    expect(mapDbResponse).not.toHaveBeenCalled();
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getUser', async () => {
    getUser('req', 'res', 'id');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(mapDbResponse).toHaveBeenCalledWith(['user']);
    expect(sendJson).toHaveBeenCalledWith('req', 'res', 'user');
  });

  it('should getUser and handle no user', async () => {
    getUser('req', 'res', 'id');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).not.toHaveBeenCalled();
    expect(send404).toHaveBeenCalledWith('req', 'res');
    expect(mapDbResponse).not.toHaveBeenCalled();
    expect(sendJson).not.toHaveBeenCalled();
  });

  it('should getUser and handle failure', async () => {
    getUser('req', 'res', 'id');
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(send500).toHaveBeenCalledWith('req', 'res', 'sql error');
    expect(send404).not.toHaveBeenCalled();
    expect(mapDbResponse).not.toHaveBeenCalled();
    expect(sendJson).not.toHaveBeenCalled();
  });
});
