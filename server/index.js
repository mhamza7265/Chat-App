const express = require("express");
const connectToDB = require("./config/connectToDb");
const cors = require("cors");

connectToDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("files"));
app.use(require("./routes/authenticationRoutes"));

app.listen("3000", () => {
  console.log("Server started on port 3000");
});
