const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const PORT = 8082;

const {urlsForUser, generateRandomString, getUserByEmail} = require("./helpers.js");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['CHARLES'],
  maxAge: 24 * 60 * 60 * 1000,
}));

const users = {};
const urlDatabase = {};

////////// ROUTES //////////

app.get("/", (req, res) => {

  const templateVars = {
    user: users[req.session.user_id],
  };

  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});

app.get("/urls", (req, res) => {

  let userURL = urlsForUser(req.session.user_id, urlDatabase);
  
  const templateVars = {
    user: users[req.session.user_id],
    urls: userURL,
  };

  if (!templateVars.user) {
    return res.status(403).send("Please login to see your URLs");
  }

  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {

  const templateVars = {user: users[req.session.user_id]};
  
  if (!templateVars.user) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);

});

app.get(`/urls/:id`, (req, res) => {
  
  if (urlDatabase[req.params.id]) {

    const templateVars = {
      user: users[req.session.user_id],
      longURL: urlDatabase[req.params.id].longURL,
      id: req.params.id,
    };

    console.log(templateVars);
    if (!templateVars.user) {
      res.status(400).send("Please login to see your links");
    } else if (templateVars.user.id !== req.session.user_id){
      res.status(400).send("You are not logged in as the appropriate link owner");
    }
    res.render("urls_show", templateVars);
  } else {
    res.status(400).send("Short URL not found in database");
  }

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

app.get("/register", (req, res) => {

  const templateVars = {
    user: users[req.session.user_id],
  };
  
  if (templateVars.user) {
    res.redirect("/urls");
  }
  
  res.render("register", templateVars);

});

app.get("/login", (req, res) => {

  const templateVars = {
    user: users[req.session.user_id],
    urlDatabase,
  };
  if (templateVars.user) {
    res.redirect("/urls");
  }
  res.render("login", templateVars);

});

app.post("/urls", (req, res) => {
  let id = generateRandomString();

  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };

  res.redirect(`/urls/${id}`);
  
});


app.post("/urls/:id/delete", (req, res) => {
  let deletedId = req.params.id;
  delete urlDatabase[deletedId];
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls/:id", (req, res) => {

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
    if (getUserByEmail(req.body.email, users)) {
      if (bcrypt.compareSync(req.body.password, users[key].password)) {
        req.session.user_id = users[key].id;
        res.redirect("/urls");
      } else {
        res.status(403).send("Please make sure you entered a valid email/password combination");
      }
    } else {
      res.status(403).send("Please make sure you entered a valid email/password combination");
    }
  }
  res.status(403).send("Please make sure you entered a valid email/password combination");
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let preHashedPassword = req.body.password;
  let password = bcrypt.hashSync(preHashedPassword, 10);
  
  if (!email || !password) {
    res.status(400).send("Please make sure you entered a valid email/password combination");
  } else if (getUserByEmail(req.body.email, users)) {
    res.status(400).send("The email address is already registered in the system");
  } else {
    let userId = generateRandomString();
    
    users[userId] = {
      id: userId,
      email: email,
      password: password,
    };

    req.session.user_id = userId;
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example App listening on port ${PORT}`);
});