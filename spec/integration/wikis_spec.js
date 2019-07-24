const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "berrywhites",
        email: "whiteassberry@gmail.com",
        password: "123456789",
        role: "member"
      })
        .then(user => {
          this.user = user;
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            }
          });
          Wiki.create({
            title: "The Amazing Tesla",
            body: "Tesla is the best car ever hands down",
            userId: user.id
          })
            .then(wiki => {
              this.wiki = wiki;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  ////////////////////////////// CREATE ////////////////////////////////////////////////
  describe("GET /wikis/new", () => {
    it("should render a view with a new wiki form", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", done => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Another Tesla Wiki",
          body: "Tesla's are the greatest!",
          private: true,
          userId: this.user.id
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({ where: { title: "Another Tesla Wiki" } })
          .then(wiki => {
            expect(wiki.title).toBe("Another Tesla Wiki");
            expect(wiki.body).toBe("Tesla's are the greatest!");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });
  ////////////////////////////// READ ////////////////////////////////////////////////

  describe("GET /wikis", () => {
    it("should render the index page", done => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        done();
      });
    });
  });

  describe("GET /wikis/:id", () => {
    it("should render a view with the selected wiki", done => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("The Amazing Tesla");
        done();
      });
    });
  });

  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", done => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Your Wiki");
        expect(body).toContain("The Amazing Tesla");
        done();
      });
    });
  });
  ////////////////////////////// UPDATE ////////////////////////////////////////////////

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", done => {
      request.post(
        {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Holy Guacamole!",
            body: "Tolito vehicles used to run off steam! And Coal!",
            userId: this.user.id
          }
        },
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: 1 }
          })
          .then(wiki => {
            expect(wiki.title).toBe("Holy Guacamole!");
            expect(wiki.body).toBe("Tolito vehicles used to run off steam! And Coal!");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        }
      );
    });
  });
  ////////////////////////////// DELETE ////////////////////////////////////////////////

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", done => {

      Wiki.findAll().then(wikis => {

        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);

        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findAll()
          .then(wikis => {
            expect(err).toBeNull();
            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        });
      });
    });
  });
});