const { executeSql } = require('./db');

jest.mock('mysql', () => {
  return {
    createConnection: jest.fn(() => ({
      connect: jest.fn(),
      query: (sql, callback) => {
        if (typeof sql !== 'string') {
          callback(new Error('wrong sql').message, null);
        } else {
          callback(null, { id: 'id' });
        }
      },
      end: jest.fn()
    }))
  };
});

describe('db', () => {
  it('should execute sql', async () => {
    const callback = jest.fn();
    await executeSql('some sql', callback);
    expect(callback).toHaveBeenCalledWith({ id: 'id' }, null);
  });

  it('should return error for wrong sql', async () => {
    const callback = jest.fn();
    await executeSql({ msg: 'this is not a string' }, callback);
    expect(callback).toHaveBeenCalledWith(null, 'wrong sql');
  });
});
