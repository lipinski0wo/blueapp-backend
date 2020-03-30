const { matchUrl } = require('./matchUrl');

describe('matchUrl', () => {
  it('should correctly match', async () => {
    const req = { url: '/url/abc/def' };
    const url = '/url/:id/:anotherId';
    const callback = jest.fn();
    const returned = await matchUrl(req, url, callback);
    expect(callback).toHaveBeenCalledWith({ id: 'abc', anotherId: 'def' });
    expect(returned).toEqual(true);
  });

  it('should not match correctly', async () => {
    const req = { url: '/url/wrongurl' };
    const url = '/url';
    const callback = jest.fn();
    const returned = await matchUrl(req, url, callback);
    expect(callback).not.toHaveBeenCalled();
    expect(returned).toEqual(false);
  });
});
