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
  "fasdaa": {
    longURL: "http://lighthouselabs.ca",
    userID: "user1Id",
  },

  "123434": {
    longURL: "http://google.com",
    userID: "user2Id",
  }
};

describe('getUserByEmail', function() {

  it('should return user info with a matching email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    }
    assert.equal(expectedOutput, user);
  });
});