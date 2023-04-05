const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use("/user", require("./routes/userRouter"));
app.use("/project", require("./routes/projectRouter"));

module.exports = app;
