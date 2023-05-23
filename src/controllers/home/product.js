const { statusModel } = require("../../models/status");
const { categoriesModel } = require("../../models/categories");
const { productModel } = require("../../models/product");

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
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;

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
};

module.exports = productController;
