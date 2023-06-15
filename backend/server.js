const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(router);
dbConnect();

app.use("/storage", express.static("storage"));
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`BackEnd is Running on port ${PORT}`);
});
