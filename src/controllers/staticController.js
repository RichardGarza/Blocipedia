module.exports = {
  index(req, res, next){
    let user;
    if(req.user){ user = req.user };
    res.render("static/index", {title: "Welcome to Blocipedia", user });
  }
}