// const crypto = require("crypto-js");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// HERE IS PERFOMED ENCRYPTION USING THE CRYPTO LIBRARY WITH DIFFRENT ALGO
function encrypt(masterKey, tempToken) {
  const iv = crypto.lib.WordArray.random(16);
  const salt = crypto.lib.WordArray.random(16);
  const key = crypto.PBKDF2(masterKey, salt, { keySize: 256 / 32, iterations: 10000, hasher: crypto.algo.SHA256 });
  const encrypted = crypto.AES.encrypt(tempToken, key, { iv: iv }).ciphertext;
  const concatenned = crypto.lib.WordArray.create().concat(salt).concat(iv).concat(encrypted);
  return concatenned.toString(crypto.enc.Base64);
}

// HERE IS PERFOMED DECRYPTION USING THE CRYPTO LIBRARY WITH DIFFRENT ALGO
function decrypt(masterKey, tempToken, secretKey) {
  const encrypted = crypto.enc.Base64.parse(secretKey);
  const salt_len = (iv_len = 16);
  const salt = crypto.lib.WordArray.create(encrypted.words.slice(0, salt_len / 4));
  const iv = crypto.lib.WordArray.create(encrypted.words.slice(0 + salt_len / 4, (salt_len + iv_len) / 4));
  const key = crypto.PBKDF2(masterKey, salt, { keySize: 256 / 32, iterations: 10000, hasher: crypto.algo.SHA256 });
  const decrypted = crypto.AES.decrypt(
    {
      ciphertext: crypto.lib.WordArray.create(encrypted.words.slice((salt_len + iv_len) / 4)),
    },
    key,
    { iv: iv },
  );
  const decryptedString = decrypted.toString(crypto.enc.Utf8);
  return tempToken == decryptedString;
}

function removeKeyCustom(obj, key) {
  const { [key]: _, ...newObj } = obj; // USING DESTRUCTURING ASSIGNMENT AND THE REST OPERATOR.
  return newObj; // RETURN THE MODIFIED OBJECT.
}

// HERE IS PERFOMED HASHING OF PASSWORD FOR THE USERS
function hashPassword(password) {
  return bcrypt.hashSync(password, saltRounds);
}

// HERE IS FUNCTION FOR THE VERIFY PASSOWRD WE ARE NOT ABLE TO DYCYPT IT.
function verifyPassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}

// HERE IS FUNCTION FOR FORMAT DATE IN YYYY-MM-DD
function formatDate(requestDate) {
  var date = new Date(requestDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function yearsDiff(d1, d2) {
  let date1 = new Date(d1);
  let date2 = new Date(d2);
  let yearsDiff = date2.getFullYear() - date1.getFullYear();
  return yearsDiff;
}

function generateOTP() {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString(); 
}

function getCurrentDateFormatted() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleDateString('en-US', options);
}

function getDateFromParameters(year, month, day) {
  // Months in JavaScript are zero-based, so we subtract 1 from the provided month
  return new Date(year, month - 1, day);
}

//EXPORTED ABOVE METHODS
module.exports = { 
  encrypt, 
  decrypt, 
  removeKeyCustom, 
  hashPassword, 
  verifyPassword, 
  formatDate, 
  yearsDiff, 
  generateOTP, 
  getCurrentDateFormatted,
  getDateFromParameters
};


