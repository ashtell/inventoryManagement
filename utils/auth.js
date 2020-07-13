const crypto = require("crypto");

const hashPassword = (plainText) => {
  return crypto
    .createHmac("sha256", "hoogbloo")
    .update(plainText)
    .digest("hex");
};

module.exports = { hashPassword };
