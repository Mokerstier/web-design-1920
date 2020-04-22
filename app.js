const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const ally = require('./lighthouse-config.json')
require("dotenv").config();

const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then((chrome) => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then((results) => {
        // use results.lhr for the JS-consumable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill().then(() => results.lhr);
      });
    });
}

const opts = {
  chromeFlags: ["--show-paint-rects"],
};

// Usage:

const app = express();

app
  .use(urlencodedParser)
  .use(express.static(__dirname + "/static"))
  .use(express.json())
  .set("view engine", "ejs");
app
  .get("/:url", (req, res, next) => {
      console.log('https://'+req.params.url)
      const url = req.params.url
    launchChromeAndRunLighthouse('https://'+url, opts, ally).then(
      (results) => {
          console.log(results)
        res.send(results);
      }
    );
  })
  .get("/", (req, res) => {
    res.render("pages/home.ejs", {
      title: "Home",
    });
  })

  .listen(3000, () => {
    console.log("Listnening in on http://localhost:3000");
  });
