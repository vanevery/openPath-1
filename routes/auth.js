
var request = require('request')
  , user = require('./user');

exports.status = function authStatus(req, res) {
  request.post({
    url: 'https://login.persona.org/verify',
    json: {
      assertion: req.body.assertion,
      audience: "http://ec2-23-20-219-99.compute-1.amazonaws.com:8080"
    }
  }, function(e, r, body) {
    if(body && body.email) {
      req.session.email = body.email;
      res.json(body);
      console.log("auth status: persona");
    } else {
      // if not authenticated, is user a guest?
      if (req.session.email == "guest"){
        console.log("auth status: guest");
        res.json({"email": "Guest1234", "status": "okay"});
      }
    }
  });
};

exports.logout = function authLogout(req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.guest = function authGuest(req, res) {
  // create new guest user
  user.addGuestUser(function(newGuest){
    req.session.email = "guest";
    req.session.userId = newGuest._id;
    newGuest.status = "okay";
    res.json(newGuest);
  });
};