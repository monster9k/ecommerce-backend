import express from "express";
import cors from "cors";
import initWebRouters from "./route//web";
import configViewEngine from "./config/viewEngine";

require("dotenv").config();

let app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

configViewEngine(app);
initWebRouters(app);

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("backend nodejs in running on the port:" + port);
});
