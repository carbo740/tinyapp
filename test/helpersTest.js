const { assert } = require('chai');
const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  "daksds": {
    longURL: "https://lighthouselabs.ca",
    userID: "fasdaa",
  },

  "123434": {
    longURL: "http://google.com",
    userID: "user2Id",
  }
};

describe('getUserByEmail', function() {

  it('should return user id with a matching email', function() {
    const userDetails = getUserByEmail("user@example.com", testUsers);
    const id = userDetails.id;
    const expectedOutput = "userRandomID";

    assert.equal(expectedOutput, id);
  });

  it('should return undefined with a non-existent email', function() {
    const userDetails = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = undefined;

    assert.equal(expectedOutput, null);
  });
});

describe('urlsForUser', function() {

  it('should return a "https://lighthouselabs.ca"', function() {
    const userDetails = urlsForUser("fasdaa", testUrlDatabase);
    const longURL = userDetails["daksds"].longURL;
    const expectedOutput = "https://lighthouselabs.ca";
    assert.equal(expectedOutput, longURL);
  });

  it('should return undefined if given wrong ID', function() {
    const userDetails = urlsForUser("123546", testUrlDatabase);
    const expectedOutput = undefined;
    assert.equal(expectedOutput, userDetails);
  });

});