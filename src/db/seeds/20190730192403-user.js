'use strict';

const faker = require("faker");

let users = [
  {
    username: "jerrymama",
    email: "jayjaythejetplane@yahoo.com",
    password: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 0
  },
  {
    username: "terribleuser",
    email: "mayonaise@rapper.com",
    password: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 2
  },
  {
    username: "randomransom",
    email: "mycousin@gmail.com",
    password: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 1
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.bulkInsert("Users", users, {} )
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete("Users", null, {} );
  }
};
