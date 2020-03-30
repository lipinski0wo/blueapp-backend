const { send200, send404, send405, send500, sendJson } = require('./httpMsg');

describe('httpMsg', () => {
  it('should send500', async () => {
    const res = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };
    const error = 'Error message';
    await send500(null, res, error);
    expect(res.writeHead).toHaveBeenCalledWith(500, 'Internall Error occured', { 'Content-Type': 'application/json' });
    expect(res.write).toHaveBeenCalledWith('{"data":"error occuered:Error message"}');
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('should send405', async () => {
    const res = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };

    await send405(null, res, null);
    expect(res.writeHead).toHaveBeenCalledWith(405, 'Method not supported', { 'Content-Type': 'application/json' });
    expect(res.write).toHaveBeenCalledWith('{"data":"Method not supported"}');
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('should send404', async () => {
    const res = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };

    await send404(null, res, null);
    expect(res.writeHead).toHaveBeenCalledWith(404, 'Resource not found', { 'Content-Type': 'application/json' });
    expect(res.write).toHaveBeenCalledWith('{"data":"Resource not found"}');
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('should send200', async () => {
    const res = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };
    await send200(null, res, null);
    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.write).toHaveBeenCalledWith('{"data":"OK"}');
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('should sendJson', async () => {
    const res = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };
    const data = { example: 'data' };
    await sendJson(null, res, data);
    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.write).toHaveBeenCalledWith('{"example":"data"}');
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
