const getUserByEmail = (email) => {
    for (let key in users) {
      if (users[key].email === email) {
        return users[key];
      } else {
        return null;
      }
    }
};

const urlsForUser = (id) => {
  let urls = {};

  for (let key in urlDatabase) {
    if(urlDatabase[key].userID === id) {
      urls[key] = urlDatabase[key];
    }
  }
  return urls;
};

const generateRandomString = () => {
  let randomString = "";
  let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let alphaNumericLength = alphaNumeric.length;

  for (let i = 0; i < 6; i++) {
    randomString += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumericLength));
  }
  return randomString;
};

const express = require("express");
const app = express();
const PORT = 8082; // default port 8082
const cookieParser = require('cookie-parser');
const { get } = require("request");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const users = {};

const urlDatabase = {

  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let userURL = urlsForUser(req.cookies.user_id);
  
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: userURL,
  };

  if (!templateVars.user) {
    return res.status(403).send("Please login to see your URLs");
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies.user_id]}
  
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get(`/urls/:id`, (req, res) => {
  
  if(urlDatabase[req.params.id]) {
    const templateVars = {
      user: users[req.cookies.user_id],
      longURL: urlDatabase[req.params.id].longURL,
      id: req.params.id,
    }
    res.render("urls_show", templateVars);
  } else {
    res.status(400).send("Short URL not found in database");
  }
});

app.post("/urls", (req, res) => {
  let id = generateRandomString();

  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id,
  };

  res.redirect(`/urls/${id}`); // Redirects to /urls/(shortened ID)
});

app.get("/u/:id", (req, res) => {
  
    if (urlDatabase[req.params.id]) {
      let redirectURL = urlDatabase[req.params.id].longURL;
      if (redirectURL === undefined) {
        res.status(300);
      } else {
        res.redirect(redirectURL);
      }
    } else {
      res.status(400).send("Failed to find short URL ID in the database");
    }
  
});

app.post("/urls/:id/delete", (req, res) => {
  let deletedId = req.params.id;
  delete urlDatabase[deletedId];
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/urls/:id", (req, res) => {

  let userUrls = urlsForUser(req.cookies.user_id);

  let body = req.body;
  let newLink = body.changeURL;

  urlDatabase[req.params.id].longURL = newLink;

  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  let id = req.params.id;

  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) => {
  
  for (let key in users) {
    if (getUserByEmail(req.body.email)) {
      if (users[key].password === req.body.password) {
        res.cookie('user_id', users[key].id);
        res.redirect("/urls")
      } else {
        res.status(403).send("Please make sure you entered a valid email/password combination");
      }
    } else {
      res.status(403).send("Please make sure you entered a valid email/password combination");
    }
  }
  res.status(403).send("Please make sure you entered a valid email/password combination");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  if (templateVars.user) {
    res.redirect("/urls");
  }

  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  if (!email || !password) {
    res.status(400).send("Please make sure you entered a valid email/password combination")
  } else if (getUserByEmail(req.body.email)) {
    res.status(400).send("The email address is already registered in the system")
  } else {
    let userId = generateRandomString();
    
    users[userId] = {
      id: userId,
      email: email,
      password: password,
    }

    res.cookie("user_id", userId);
  }
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urlDatabase,
  };
  if (templateVars.user) {
    res.redirect("/urls");
  }
  res.render("login", templateVars);

});