require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors(
  {
    origin: ["https://youbettersplit.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }
));

const mongoose = require("mongoose");
const router = require("./Routes/Router.jsx");

app.use(express.json())

app.use("/", router);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log("error :",error)
  })
