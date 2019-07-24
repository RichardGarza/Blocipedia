const wikiQueries = require("../db/queries/queries.wikis.js");
const Authorizer = require("../policies/application");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect("/");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },

  new(req, res, next) {

    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You must be logged in to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next) {

    const authorized = new Authorizer(req.user).create();

    if (authorized) {

      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      };

      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect("wikis/new");
        } else {
          res.redirect(`/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You must be logged in to do that.");
      res.redirect("/wikis");
    }
  },

  show(req, res, next) {

    wikiQueries.getWiki(req.params.id, (err, result) => {

      wiki = result["wiki"];
      
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {

        const authorized = new Authorizer(req.user, wiki).show();
        
        if(authorized){
          
          res.render("wikis/show", {wiki});
        } else {
          req.flash("notice", "You must be logged in to do that.")
          res.redirect('/wikis')
        }
      }
    });
  },

  edit(req, res, next) {

    wikiQueries.editWiki(req, (err, wiki) => {
    
      if(err){
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.render("wikis/edit", { wiki });
      }
    });
  },

  destroy(req, res, next) {

    wikiQueries.deleteWiki(req, (err, wiki) => {
      if (err) {
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.redirect("/wikis");
      }
    });
  },

  update(req, res, next) {

    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err) {
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
};