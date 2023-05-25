const { productModel } = require("../../models/product");
const { categoriesModel } = require("../../models/categories");

const indexController = {
  test: (req, res) => {
    return res.json({ status: true, message: "api hoat dong" });
  },
  recommendProduct: async (req, res) => {
    try {
      const products = await productModel.find().limit(16).exec();
      return res.status(200).json({ status: true, products });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  categories: async (req, res) => {
    try {
      const categories = await categoriesModel
        .find()
        .select("-products")
        .populate({ path: "status" });

      const filteredCategories = categories.filter((category) => {
        return category.status.slug == "hoat-dong";
      });

      return res
        .status(200)
        .json({ status: true, categories: filteredCategories });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = indexController;
