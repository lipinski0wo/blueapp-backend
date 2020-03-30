const { retrievePostData } = require('./retrievePostData');

const createRequest = (isDataTooBig) => {
  return {
    on: jest.fn((type, callback) => {
      let data = 'posted data';
      if (isDataTooBig) {
        data += new Array(1e7).join('a');
      }
      if (type === 'data') {
        callback(Buffer.from(data));
      } else {
        callback();
      }
    })
  };
};

describe('retrievePostData', () => {
  it('should correctly retrieve data', async () => {
    const req = createRequest();
    const callback = jest.fn();
    await retrievePostData(req, callback);
    expect(callback).toHaveBeenCalledWith('posted data', null);
  });

  it('should call error on data too big', async () => {
    const req = createRequest(true);
    const callback = jest.fn();
    await retrievePostData(req, callback);
    expect(callback).toHaveBeenCalledWith(null, 'data too big');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
