const { match } = require('path-to-regexp');

exports.matchUrl = (req, url, callback) => {
  const matched = match(url)(req.url);
  if (matched) {
    callback(matched.params);
    return true;
  }
  return false;
};
