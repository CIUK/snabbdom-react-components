var liveServer = require("live-server");

var params = {
  port: 8181,
  ignore: `${__dirname}/src`,
  host: "0.0.0.0",
  root: `${__dirname}/public`,
  open: true,
  file: "index.html",
  wait: 1000,
};

liveServer.start(params);