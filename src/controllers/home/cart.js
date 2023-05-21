const cartModel = require("../../models/home/cart");
const { productModel } = require("../../models/product");

const cartController = {
  create: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const { id, quantity } = req.body;

      const pro = await productModel.findById(id).populate("status");

      if (!pro || pro.status.slug != "hoat-dong") return;

      let cart = await cartModel.findOne({ user: uid });

      if (!cart) {
        cart = new cartModel({
          user: uid,
          products: [{ product: id, quantity }],
        });
      } else {
        const existingProduct = cart.products.find(
          (product) => product.product.toString() === id
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ product: id, quantity });
        }
      }

      await cart.save();

      return res.status(200).json({ status: true, data: cart });
    } catch (error) {
      res.status(500).json({ status: false, error: error });
    }
  },
  update: async (req, res) => {
    const { carts } = req.body;
    const uid = req.user.sub.id;

    try {
      const cart = await cartModel.findOne({ user: uid });

      if (!cart) {
        return res
          .status(404)
          .json({ status: false, message: "Không tìm thấy giỏ hàng" });
      }
      const newCart = [];
      for (const item in carts) {
        const { product, quantity } = item;
        if (quantity > 0) {
          const newCartItem = { product: product._id, quantity };
          newCart.push(newCartItem);
        }
      }

      await cart.updateOne({ $set: newCart });
    } catch (error) {
      res.status(500).json({ status: false, error: error });
    }
  },
  show: async (req, res) => {
    try {
      const uid = req.user.sub.id;

      const cart = await cartModel.findOne({ user: uid }).populate({
        path: "products.product",
        select: "name photos price",
      });

      if (!cart) {
        return res
          .status(404)
          .json({ status: false, message: "Không tìm thấy giỏ hàng" });
      }
      const cartItems = [];

      for (const item of cart.products) {
        const { product, quantity } = item;
        const productInfo = await productModel
          .findById(product)
          .select("-status");
        if (productInfo) {
          const cartItem = { product: productInfo, quantity };
          cartItems.push(cartItem);
        }
      }

      return res.status(200).json({ status: true, carts: cartItems });
    } catch (error) {
      res.status(500).json({ status: false, error: error });
    }
  },
  delete: async (req, res) => {
    try {
      const uid = req.user.sub.id;
      const productId = req.params.id;
      const cart = await cartModel.findOne({ user: uid });

      const cartItemIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );

      cart.products.splice(cartItemIndex, 1);

      await cart.save();

      res.status(200).json({ status: true, data: cart });
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },
};

module.exports = cartController;
