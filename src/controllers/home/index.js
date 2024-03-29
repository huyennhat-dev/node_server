const { productModel } = require("../../models/product");
const { categoriesModel } = require("../../models/categories");

const indexController = {
  recommendProduct: async (req, res) => {
    try {
      const products = await productModel
        .aggregate([{ $sample: { size: 18 } }])
        .exec();

      return res.status(200).json({ status: true, products });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  newProducts: async (req, res) => {
    try {
      const products = await productModel
        .find()
        .sort({ createdAt: -1 })
        .limit(18)
        .exec();
      return res.status(200).json({ status: true, products });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  saleProducts: async (req, res) => {
    try {
      const products = await productModel
        .find()
        .sort({ sale: -1 })
        .limit(18)
        .exec();
      return res.status(200).json({ status: true, products });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  sameAuthorProducts: async (req, res) => {
    try {
      const author = req.params.author
      console.log(author);
      const query = {
        $or: [{ author: { $regex: author, $options: "i" } }],
      };

      const products = await productModel
        .find(query)
        .collation({ locale: "vi", strength: 2 });

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
