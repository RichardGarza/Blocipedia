module.exports = {
  index(req, res, next){
    let currentUser;
    if(req.user){ currentUser = req.user };
    res.render("static/index", {title: "Welcome to Blocipedia", currentUser });
  }
}