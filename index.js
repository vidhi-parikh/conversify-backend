const express = require("express");
const cors = require("cors")
const app = express();
const connectDB = require("./utils/db");
const user_router = require("./routes/user_route")
const chat_router = require("./routes/chat_route")
const PORT = 4000;
const dotenv = require("dotenv");
dotenv.config({
  path: './.env'
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use(cors())
app.use('/api/user',user_router)
app.use('/api/chat',chat_router)


app.listen(PORT, () => {
  console.log("Hi buudy ! Are you listening ?");
});
