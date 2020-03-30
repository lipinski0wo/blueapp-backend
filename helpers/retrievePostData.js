exports.retrievePostData = (req, callback) => {
  let body = '';
  let called = false;
  req.on('data', data => {
    body += data;
    if (body.length > 1e7 && !called) {
      called = true;
      callback(null, new Error('data too big').message);
    }
  });

  req.on('end', () => {
    if (!called) {
      callback(body, null);
    }
  });
};
