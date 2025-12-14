import express from "express";
import cors from "cors";
import initWebRouters from "./route//web";
import categoryRouter from "./route/category";
import cartRouter from "./route/cart";
import productRouter from "./route/product";
import cartItemRouter from "./route/cartItem";
import orderItemRouter from "./route/orderItem";
import orderRouter from "./route/order";
import productVariantRouter from "./route/productVariant";
import configViewEngine from "./config/viewEngine";
import styleRouter from "./route/style";

require("dotenv").config();

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: true }));

configViewEngine(app);
initWebRouters(app); // user router
categoryRouter(app);
cartRouter(app);
productRouter(app);
cartItemRouter(app);
orderItemRouter(app);
orderRouter(app);
productVariantRouter(app);
styleRouter(app);

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("backend nodejs in running on the port:" + port);
});
