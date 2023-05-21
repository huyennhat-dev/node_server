const { productModel } = require("../../models/product");

const indexController = {
  test: (req, res) => {
    return res.json({ status: true, message: "api hoat dong" });
  },
  recommendProduct: async (req, res) => {
    try {
      console.log(1);
      const products = await productModel.find().limit(16).exec();
      return res.status(200).json({ status: true, products });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = indexController;
