"use strict";
const faker = require("faker");

let users = [
  {
    username: "jerrymama",
    email: "jayjaythejetplane@yahoo.com",
    password: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "member"
  },
  {
    username: "terribleuser",
    email: "mayonaise@rapper.com",
    password: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "member"
  },
  {
    username: "randomransom",
    email: "mycousin@gmail.com",
    password: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "member"
  }
];

let wikis = [
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  },
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  },
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  },
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  },
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  },
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  },
 
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      queryInterface.bulkInsert("Users", users, {})
      
      return queryInterface.bulkInsert("Wikis", wikis, {});
     
  },

  down: (queryInterface, Sequelize) => {
    
      queryInterface.bulkDelete("Users", null, {});

      return queryInterface.bulkDelete("Wikis", null, {});
    
  }

};