exports.send500 = (req, res, error) => {
  res.writeHead(500, 'Internall Error occured', { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ data: 'error occuered:' + error }));
  res.end();
};

exports.send405 = (req, res, error) => {
  res.writeHead(405, 'Method not supported', { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ data: 'Method not supported' }));
  res.end();
};

exports.send404 = (req, res, error) => {
  res.writeHead(404, 'Resource not found', { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ data: 'Resource not found' }));
  res.end();
};

exports.send200 = (req, res, error) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ data: 'OK' }));
  res.end();
};

exports.sendJson = (req, res, data) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(data || {}));
  res.end();
};
