
const crypto = require('crypto');
JWT_SECRET= process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
module.exports = { jwtSecret: JWT_SECRET, };