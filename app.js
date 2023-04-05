const express = require("express");
const app = express();

app.use("/user", require("./routes/userRouter"));
app.use("/project", require("./routes/projectRouter"));

module.exports = app;
