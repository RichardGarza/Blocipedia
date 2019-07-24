const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "dangerzone",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        role: 0
      }).then(user => {
        this.user = user; //store the user
        Wiki.create({
          title: "The Amazing Tesla",
          body: "Tesla is the best car ever hands down",
          userId: user.id
        }).then(wiki => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a wiki object and store it in the database", done => {
      Wiki.create({
        title: "Freaky Waiheke Tiki Wiki",
        body: "Tikis from Waiheke are Freaky",
        userId: 1
      })
        .then(newWiki => {
          expect(newWiki.title).toBe("Freaky Waiheke Tiki Wiki");
          expect(newWiki.body).toBe("Tikis from Waiheke are Freaky");
          done();
        })
        .catch(err => {
          expect(err).toBeNull();
          console.log(err);
          done();
        });
    });

    it("should not create a wiki without a title", done => {
      Wiki.create({
        body: "Wiki without a title",
        userId: 1
      })
        .then(newWiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Wiki.title cannot be null");
          done();
        });
    });

    it("should not create a wiki without a body", done => {
      Wiki.create({
        title: "Wiki without a body. It's only a head.",
        userId: 1
      })
        .then(newWiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Wiki.body cannot be null");
          done();
        });
    });

    it("should not create a wiki without a userId", done => {
      Wiki.create({
        body: "The misterious case of the Wiki with no userId!!",
        title: "Wiki without a userId, boring."
      })
        .then(newWiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Wiki.userId cannot be null");
          done();
        });
    });
  });

  describe("#read()", () => {
    it("should return requested wiki with title and body", done => {
      Wiki.create({
        title: "My Special Wiki",
        body: "This wiki is special because it's mine and i love it.",
        userId: 1
      })
      .then(newWiki => {
        expect(newWiki.title).toBe("My Special Wiki");
        expect(newWiki.body).toBe("This wiki is special because it's mine and i love it.");

        Wiki.findByPk(newWiki.id)
        .then((wiki) => {
          expect(wiki.title).toContain("My Special Wiki");
          expect(wiki.body).toContain("This wiki is special because it's mine and i love it.");
        })
        .catch( (err) => { 
          expect(err).toBeNull();
          console.log(err) 
        });
        done();
      })
      .catch(err => {
        expect(err).toBeNull();
        console.log(err);
        done();
      });
    });

    it("should not return a wiki that does not exist", done => {
      Wiki.findByPk(17)
      .then((wiki) => {
        expect(wiki).toBeNull();
      })
      .catch( (err) => { 
        expect(err).toBeNull();
        console.log(err) 
      });
      done();
    });
  });

  describe("#update()", () => {
    it("should update requested wiki with new title and body", done => {
      Wiki.create({
        title: "My Special Wiki",
        body: "This wiki is special because it's mine and i love it.",
        userId: 1
      })
      .then(newWiki => {
        expect(newWiki.title).toBe("My Special Wiki");
        expect(newWiki.body).toBe("This wiki is special because it's mine and i love it.");

        const updatedWiki = {
          title: "Holy Guacamole!",
          body: "Tolito vehicles used to run off water and coal!",
          userId: 1
        }
        
        newWiki.update(updatedWiki, { fields: Object.keys(updatedWiki) })
        .then((wiki) => {
          expect(wiki.title).toBe("Holy Guacamole!");
          expect(wiki.body).toBe("Tolito vehicles used to run off water and coal!");
        })
        .catch(err => {
          expect(err).toBeNull();
          console.log(err);
        });
        done();
      })
      .catch(err => {
        expect(err).toBeNull();
        console.log(err);
        done();
      });
    });
  });

  describe("#delete()", () => {
    it("should delete a wiki object from the database", done => {
      /////////////// Create Wiki ////////////////////////////
      Wiki.create({
        title: "Created wiki",
        body: "Lets see if the destroy function is working properly, shall we?",
        userId: 1
      })
        .then(newWiki => {
           /////////////// Confirm Wiki Object is Created ////////////////////////////
          expect(newWiki.title).toBe("Created wiki");
          expect(newWiki.body).toBe("Lets see if the destroy function is working properly, shall we?");

          Wiki.findByPk(newWiki.id)
           /////////////// Confirm Wiki Object is In Database ////////////////////////////
          .then((wiki) => {
            expect(wiki.title).toContain("Created wiki");
            expect(wiki.body).toBe("Lets see if the destroy function is working properly, shall we?");
          
            wiki.destroy()
             /////////////// Delete Wiki ////////////////////////////
            .then(res => {
              expect(res.title).toBe("Created wiki")
              expect(res.body).toBe("Lets see if the destroy function is working properly, shall we?")
            });
          })
          .catch( (err) => { 
            expect(err).toBeNull();
            console.log(err) 
          });
          /////////////// Confirm Wiki is No Longer In Database ////////////////////////////
          Wiki.findByPk(newWiki.id)
          .then((wiki) => {
            expect(wiki).toBeNull();          
          })
          .catch( (err) => { 
            expect(err).toBeNull();
            console.log(err) 
          }); 
        })
        .catch(err => {
          callback(err);
        });
      done();
    });   
  });
});