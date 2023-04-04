const express = require("express");
const app = express();

app.use("/api/user", require("./routes/userRouter"));

module.exports = app;
