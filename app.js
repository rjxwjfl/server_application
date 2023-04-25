const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use("/user", require("./routes/userRouter"));
app.use("/project", require("./routes/projectRouter"));
app.use("/task", require("./routes/taskRouter"));
app.use("/feed", require("./routes/feedRouter"));

module.exports = app;
