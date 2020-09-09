const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const requests = require("requests");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/services", function (req, res) {
  res.sendFile(__dirname + "/services.html");
});

app.get("/reviews", function (req, res) {
  res.sendFile(__dirname + "/reviews.html");
});

app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/contact.html");
});

app.post("/signup", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = process.env.MAILCHIMP_URL;

  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP_AUTH,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
      console.log(response.errorStatus);
    } else {
      res.sendFile(__dirname + "/failure.html");
      console.log(response.errorStatus);
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);

  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/signup");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
