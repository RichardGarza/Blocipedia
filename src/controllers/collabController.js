const express = require('express');
const router = express.Router();
const wikiQueries = require ('../db/queries/queries.wikis');
const collaboratorQueries = require('../db/queries/queries.collabs');
const Authorizer = require('../policies/application');

module.exports = {

	create(req, res, next) {
			collaboratorQueries.create(req, (err, collaborator) => {
				if(err){
					req.flash("notice", err);
				}
				res.redirect(req.headers.referer);
			});
	},

	view(req, res, next){

		wikiQueries.getWiki(req , (err, result) => {
				if(err !== null) 	{
					wiki = result["wiki"];
					collaborators = result["collaborators"];
				}
				if(err || wiki == null){
					res.redirect(404, "/");
				} else {

				const authorized = new Authorizer(req.user, wiki, collaborators).viewCollab();
				
				if(authorized){
					res.render("collaborators/edit", {wiki, collaborators});
				} else {
					req.flash("You are not authorized to do that.");
					res.redirect(`/wikis/${req.params.wikiId}`);
				}
			}
    });
	},

	delete(req, res, next) {
		if(req.user){
			collaboratorQueries.delete(req, (err, collaborator) => {
				if(err){
					req.flash("notice", err);
				}
				res.redirect(req.headers.referer);
			});
		} else {
			req.flash("notice", "You must be signed in to remove Collaborators!");
			res.redirect(req.headers.referer);
		}
	} 
}