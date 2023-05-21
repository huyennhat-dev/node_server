const express = require("express");
const adminAuthRoute = require("./admin/auth");
const adminRoleRoute = require("./admin/role");
const adminStatusRoute = require("./admin/status");
const adminProductRoute = require("./admin/product");
const userRoute = require("./admin/user");
const categoriesRoute = require("./admin/categories");
const homeAuthRoute = require("./home/auth");
const homeIndexRoute = require("./home/index");
const homeCartRoute = require("./home/cart");
const homeProductRoute = require("./home/product");
const paymentRoute = require("./home/payment");

const router = express.Router();

// Admin routes
router.use("/api/v1/admin/auth", adminAuthRoute);
router.use("/api/v1/admin/role", adminRoleRoute);
router.use("/api/v1/admin/status", adminStatusRoute);
router.use("/api/v1/admin/product", adminProductRoute);

// User routes
router.use("/api/v1/user", userRoute);
router.use("/api/v1/categories", categoriesRoute);

// Home routes
router.use("/api/v1/home/auth", homeAuthRoute);
router.use("/api/v1/home/index", homeIndexRoute);
router.use("/api/v1/home/cart", homeCartRoute);
router.use("/api/v1/home/product", homeProductRoute);

// Payment route
router.use("/api/v1/payment", paymentRoute);

module.exports = router;
