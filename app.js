const express = require("express");
const app = express();
const userRouter = require("./routers/users");
const cors = require('cors');

const { connectRabbitMQ } = require('./helpers/utils/rabbitMQ');
require('./helpers/services/emailConsumer');
connectRabbitMQ();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to Backend API" });
});

app.use("/api/", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server on port " + port));

module.exports = app;