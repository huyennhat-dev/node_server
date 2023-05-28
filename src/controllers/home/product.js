const { statusModel } = require("../../models/status");
const { categoriesModel } = require("../../models/categories");
const { productModel } = require("../../models/product");

const pageSize = 24;

const productController = {
  index: async (req, res) => {
    try {
      const pid = req.params.id;
      const pro = await productModel
        .findById(pid)
        .populate({
          path: "status",
          select: "-updatedAt -createdAt",
        })
        .populate({
          path: "categories",
          select: "-products -status -updatedAt -createdAt",
        })
        .select("-rates -updatedAt -createdAt");

      return res.status(200).json({ status: true, product: pro });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
  productByCategories: async (req, res) => {
    const cateSlug = req.params.slug;
    const page = parseInt(req.query.page);
    const startIndex = (page - 1) * pageSize || 1;

    const categories = await categoriesModel
      .findOne({ slug: cateSlug })
      .populate({
        path: "products",
        select: "-categories",
        options: {
          skip: startIndex,
          limit: pageSize,
        },
      });

    return res.status(200).json({ categories });
  },
  searchProduct: async (req, res) => {
    try {
      let products;
      const keyword = req.query.key;
      const page = parseInt(req.query.page);
      const startIndex = (page - 1) * pageSize || 1;

      const query = {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { author: { $regex: keyword, $options: "i" } },
        ],
      };

      const totalCount = await productModel
        .countDocuments(query)
        .collation({ locale: "vi", strength: 2 });
      if (totalCount > 24) {
        products = await productModel
          .find(query)
          .collation({ locale: "vi", strength: 2 })
          .skip(startIndex)
          .limit(pageSize);
      } else {
        products = await productModel
          .find(query)
          .collation({ locale: "vi", strength: 2 });
      }
      return res
        .status(200)
        .json({ status: true, products, totalCount, pageSize });
    } catch (error) {
      return res.status(500).json({ status: false, error });
    }
  },
};

module.exports = productController;
