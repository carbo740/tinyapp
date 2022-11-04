// Gets USER details if matching email is found in database
const getUserByEmail = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    } else {
      return null;
    }
  }
};

// Returns URLS from database for user with specific ID
const urlsForUser = (id, database) => {
  let urls = {};

  for (let key in database) {
    if (database[key].userID === id) {
      urls[key] = database[key];
    }
  }
  if (Object.keys(urls).length > 0) {
    return urls;
  } else {
    return undefined;
  }
};

// Returns a 6 character alpha numeric string
const generateRandomString = () => {
  let randomString = "";
  let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let alphaNumericLength = alphaNumeric.length;

  for (let i = 0; i < 6; i++) {
    randomString += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumericLength));
  }
  return randomString;
};

module.exports = {urlsForUser, generateRandomString, getUserByEmail};