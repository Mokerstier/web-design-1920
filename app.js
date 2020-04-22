const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const ally = require('./lighthouse-config.json')
const fs = require('fs')
const jsonFile = 'data/tests.json'

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
  chromeFlags: ['--headless', '--disable-gpu'],
};

// Usage:
const PORT = process.env.PORT
const app = express();

function updateData(content) {

    fs.writeFile(jsonFile, JSON.stringify(content, null, 2), err => {
        if (err) console.log(err)
    })

}

app
  .use(urlencodedParser)
  .use(express.static(__dirname + "/static"))
  .use(express.json())
  .set("view engine", "ejs");
app

  .get("/test/:url", (req, res, next) => {
      console.log(req.params)
      const url = req.params.url
      if(url.startsWith('http')){
        launchChromeAndRunLighthouse(url, opts, ally).then(
            (results) => {
              fs.readFile(jsonFile, (err, content) => {
                  if (err) return console.log(err)
                  const contentJSON = JSON.parse(content)
                    const dataObject = results.
                  contentJSON.tests.push(results)
      
                  updateData(contentJSON)
                  
              })
              res.send(results);
            }
          );
      } else {
        launchChromeAndRunLighthouse('https://'+url, opts, ally).then(
            (results) => {
              fs.readFile(jsonFile, (err, content) => {
                  if (err) return console.log(err)
                  const contentJSON = JSON.parse(content)
      
                  contentJSON.tests.push(results)
      
                  updateData(contentJSON)
                  
              })
              res.send(results);
            }
          );
      }
    
  })
  .get("/", (req, res) => {
    res.render("pages/home.ejs", {
      title: "Home",
    });
  })

  .listen(PORT || 3000, () => {
    console.log("Listnening in on http://localhost:3000");
  });
