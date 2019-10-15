const express = require("express");
const consola = require("consola");
const {
  Nuxt,
  Builder
} = require("nuxt");
const app = express();

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host,
    port
  } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {

  }

  // pass the instance of our app to serverjs file
  await require("./server.js")(app, express);

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(3000);
  consola.success("Server created!");
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
