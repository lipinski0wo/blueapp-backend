const http = require('http');
const { handler } = require('./handler');

jest.mock('./handler', () => ({
  handler: jest.fn()
}));

const mockListen = jest.fn();

jest.mock('http', () => ({
  createServer: jest.fn(() => ({
    listen: mockListen
  }))
}));

describe('server', () => {
  it('should run server', async () => {
    require('./server');

    expect(http.createServer).toHaveBeenCalledWith(handler);
    expect(http.createServer).toHaveBeenCalledTimes(1);
    expect(http.createServer().listen).toHaveBeenCalledTimes(1);
  });
});
