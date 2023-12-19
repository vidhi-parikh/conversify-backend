const express = require("express");
const app = express();
const connectDB = require("./db/mongodb-connection");
const user_router = require("./routes/user_route")
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use('/',user_router)

app.listen(PORT, () => {
  console.log("Hi buudy ! Are you listening ?");
});
