const { statusModel } = require("../../models/admin/status");
const { categoriesModel } = require("../../models/categories");
const { productModel } = require("../../models/product");

const productController = {
  index: async (req, res) => {
    const pid = req.params.id;
    const pro = await productModel.findById(pid);
    console.log(pro);
  },
  productByCategories: async (req, res) => {
    const cateSlug = req.params.slug;
    const page = parseInt(req.query.page) ;
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
