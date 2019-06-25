const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
});

//process.env will look for an environment variable called "Port" to use when we deploy to Heroku that's gonna get
//the port number and locally, I am using 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
