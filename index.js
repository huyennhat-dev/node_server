require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./src/config/dbconnection");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const authAdminRoute = require("./src/routes/admin/auth");
const roleAdminRoute = require("./src/routes/admin/role");
const statusAdminRoute = require("./src/routes/admin/status");
const productAdminRoute = require("./src/routes/admin/product");

const userRoute = require("./src/routes/user");
const categoriesRoute = require("./src/routes/categories");

const authRoute = require("./src/routes/home/auth");
const indexRoute = require("./src/routes/home/index");
const cartRoute = require("./src/routes/home/cart");
const productRoute = require("./src/routes/home/product");

const paymentRoute = require("./src/routes/payment");

connectDB();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cors());
app.use(morgan("common"));

app.use("/api/v1/admin/role", roleAdminRoute);
app.use("/api/v1/admin/status", statusAdminRoute);
app.use("/api/v1/admin/auth", authAdminRoute);
app.use("/api/v1/admin/product", productAdminRoute);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/categories", categoriesRoute);

app.use("/api/v1/payment", paymentRoute);

app.use("/api/v1/home/", authRoute);
app.use("/api/v1/home/index", indexRoute);
app.use("/api/v1/home/cart", cartRoute);
app.use("/api/v1/home/product", productRoute);


const PORT = process.env.PORT || 3010;

const server = app.listen(PORT, () => {
  console.log(`Server is running to port ${PORT}`);
});
