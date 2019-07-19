const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach(done => {

    sequelize.sync({ force: true })
    .then(() => {
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
  });

  describe("GET /users/sign_up", () => {

    it("should render a view with a sign in form", done => {

      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });

  describe("POST /users/sign_up", () => {

    it("should create a new user with valid values", done => {

      const options = {
        url: `${base}sign_up`,
        form: {
          username: "manhands",
          email: "handy@manny.com",
          password: "123456789"
        }
      };

      request.post(options, (err, res, body) => {

        User.findOne({ where: { username: "manhands" } })
        .then(user => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("handy@manny.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
      });
    });

    it("should not create a new user with invalid username ", done => {
      request.post(
        { url: `${base}sign_up`,
          form: {
            username: "Deb",
            email: "handsome@man.com",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "handsome@man.com" } })
          .then(user => {
            expect(user).toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not create a new user with invalid email ", done => {
      request.post(
        {
          url: `${base}sign_up`,
          form: { username: "handsomeman",
            email: "handsomeMan",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "handsomeMan" } })
          .then(user => {
            expect(user).toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not create a new user with existing email ", done => {
      request.post(
        {
          url: `${base}sign_up`,
          form: { username: "handsomeman",
            email: "handsome@man.com",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "handsome@man.com" } })
          .then(user => {
            expect(user).not.toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        }
      );

      request.post(
        {
          url: `${base}sign_up`,
          form: { username: "handsomeman",
            email: "handsome@man.com",
            password: "123456789"
          }
        },
        (err, res, body) => {
          console.log(res)
          expect(res.statusCode).toBe(406);
          expect(res.statusMessage).toContain('Not Acceptable');
        }
      );
    });

    it("should not create a new user with invalid password ", done => {
      request.post(
        { url: `${base}sign_up`,
          form: {
            username: "handsomeman",
            email: "handsome@man.com",
            password: "12354"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "handsome@man.com" } })
          .then(user => {
            expect(user).toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not save password without hashing", done => {
      const options = {
        url: `${base}sign_up`,
        form: {
          username: "manhands",
          email: "man@sandwich.com",
          password: "123456789"
        }
      };

      request.post(options, (err, res, body) => {
        User.findOne({ where: { username: "manhands" } })
        .then(user => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("man@sandwich.com");
          expect(user.id).toBe(1);
          expect(user.password).not.toBe("123456789");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /users/sign_up", () => {
    it("should render a sign up form", done => {

      request.get(`${base}sign_up`, (err, res, body) => {

        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });
});