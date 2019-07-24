const Wiki = require("../models").Wiki;
const Authorizer = require("../../policies/application");

module.exports = {

  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },
  
  getAllWikis(callback) {
    return Wiki.findAll()
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },

  getWiki(id, callback) {
    var result = {};
      	return Wiki.findByPk(id)
      	.then((wiki) => {
          if(!wiki) {
           	callback(404);
       	  } else {
            result["wiki"] = wiki;
            callback(null, result);
          } 
      })
  },

  editWiki(req, callback) {
    
    Wiki.findByPk(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).edit();
      
      if(authorized){
        callback(null, wiki)
      } else {
        req.flash("notice", "You are not authorised to do that.");
        callback(404)
      }
    })
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }

      const authorized = new Authorizer(req.user, wiki).update();

      if (authorized) {
        wiki.update(updatedWiki, { fields: Object.keys(updatedWiki) })
        .then(() => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },

  deleteWiki(req, callback) {

    return Wiki.findByPk(req.params.id)

    .then(wiki => {
      const authorized = new Authorizer(req.user, wiki).destroy();

      if (authorized) {
        wiki.destroy().then(res => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch(err => {
      callback(err);
    });
  }
};