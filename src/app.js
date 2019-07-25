const express = require("express");
const app = express();
const appConfig = require("./config/main-config.js");
const stripeConfig = require("./config/stripe-config.js");

const routeConfig = require("./config/route-config.js");

appConfig.init(app, express);
stripeConfig.init(app, express);

routeConfig.init(app);

module.exports = app;