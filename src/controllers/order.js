const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const { orderModel } = require("../models/order");
const { orderStatusModel } = require("../models/orderStatus");
const { cartModel } = require("../models/cart");

const {
  VNP_TMNCODE,
  VNP_HASHSECRET,
  VNP_API,
  VNP_RETURNURL,
  VNP_URL,
} = require("../config");

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

const orderController = {
  create: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const { products, totalPrice, paymentMethod } = req.body;

      const orderStatus = await orderStatusModel.findOne({ slug: "da-huy" });

      const order = new orderModel({
        user: uid,
        products,
        totalPrice,
        paymentMethod,
        orderStatus: orderStatus._id,
      });
      const cart = await cartModel.findOne({ user: uid });
      await cart.deleteOne();

      return await order.save();
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  createUrl: async (req, res) => {
    try {
      process.env.TZ = "Asia/Ho_Chi_Minh";

      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");

      const rs = await orderController.create(req, res);

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = VNP_TMNCODE;
      let secretKey = VNP_HASHSECRET;
      let vnpUrl = VNP_URL;
      let returnUrl = VNP_RETURNURL;

      let orderId = rs._id;

      let amount = rs.totalPrice;
      let locale = "vn";

      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      return res.status(200).json({ status: true, vnpUrl: vnpUrl });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },

  vnpRs: async (req, res) => {
    try {
      let vnp_Params = req.query;

      let secureHash = vnp_Params["vnp_SecureHash"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);

      let tmnCode = VNP_TMNCODE;
      let secretKey = VNP_HASHSECRET;

      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");

      if (secureHash === signed) {
        const orderStatus = await orderStatusModel.findOne({
          slug: "da-thanh-toan",
        });

        await orderModel.findByIdAndUpdate(vnp_Params["vnp_TxnRef"], {
          $set: { orderStatus: orderStatus._id },
        });
        return res.redirect("http://localhost:5173/checkout/success");
      }
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = orderController;