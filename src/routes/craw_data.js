const router = require("express").Router();
const cheerio = require("cheerio");
const request = require("request-promise");
const slug = require("slug");

const { categoriesModel } = require("../models/categories");
const { random } = require("lodash");
const { productModel } = require("../models/product");
const { adminModel } = require("../models/admin");

router.post("/", async (req, res) => {
  const { url, categories } = req.body;

  const cateSlug = slug(categories);

  let category;

  category = await categoriesModel.findOne({ slug: cateSlug });

  if (!category) {
    category = await categoriesModel.create({
      name: categories,
      slug: cateSlug,
      status: "645d30d2eb6f40e2906325fa",
    });
  }

  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const data = [];

      const bookUrls = [];

      $(
        ".ProductList__NewWrapper-sc-1dl80l2-0.jXFjHV div a.product-item "
      ).each((index, el) => {
        const bookUrl = "https:" + $(el).attr("href");
        bookUrls.push(bookUrl);
      });
      let completedRequests = 0;

      bookUrls.forEach((bookUrl) => {
        request(bookUrl, async (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const name = $(
              ".styles__Wrapper-sc-8ftkqd-0.eypWKn .styles__StyledProductContent-sc-1f8f774-0.ewqXRk .header h1.title"
            )
              .text()
              .trim();
            const author =
              $(
                ".styles__Wrapper-sc-8ftkqd-0.eypWKn .styles__StyledProductContent-sc-1f8f774-0.ewqXRk .header .brand h6 a"
              )
                .text()
                .trim() || "Nhiều Tác Giả";
            const photo = $(
              ".style__ProductImagesStyle-sc-1fmads3-0.fymfgs .group-images img"
            ).attr("src");
            const price =
              parseInt(
                $(
                  ".styles__Wrapper-sc-8ftkqd-0.eypWKn .styles__StyledProductContent-sc-1f8f774-0.ewqXRk .body .left .style__StyledProductPrice-sc-15mbtqi-0.hlBZfh div.product-price__list-price"
                )
                  .text()
                  .trim()
                  .replace(/\D/g, "")
              ) ||
              parseInt(
                $(
                  ".styles__Wrapper-sc-8ftkqd-0.eypWKn .styles__StyledProductContent-sc-1f8f774-0.ewqXRk .body .left .style__StyledProductPrice-sc-15mbtqi-0.hlBZfh div.product-price__current-price"
                )
                  .text()
                  .trim()
                  .replace(/\D/g, "")
              ) ||
              100000;
            const sale =
              parseInt(
                $(
                  ".styles__Wrapper-sc-8ftkqd-0.eypWKn .styles__StyledProductContent-sc-1f8f774-0.ewqXRk .body .left .style__StyledProductPrice-sc-15mbtqi-0.hlBZfh div.product-price__discount-rate"
                )
                  .text()
                  .trim()
                  .replace(/\D/g, "")
              ) / 100 || 0.0;

            const description = $(
              ".style__Wrapper-sc-12gwspu-0.cIWQHl .left .group .content .ToggleContent__Wrapper-sc-1dbmfaw-1.cqXrJr"
            )
              .html()
              .trim();

            const quantity = random(10, 100);
            const categories = category._id;
            const status = "645d30d2eb6f40e2906325fa";
            const extraPerson = "645fd0b6b9c84aa81c7d5a02";

            const product = await productModel.create({
              name,
              photos: [photo],
              author,
              price,
              quantity,
              sale,
              description,
              categories,
              status,
              extraPerson,
            });

            await categoriesModel.updateOne(
              { _id: category._id },
              { $push: { products: product._id } }
            );
            await adminModel.updateOne(
              { _id: extraPerson },
              { $push: { products: product._id } }
            );
          } else {
            console.log(error);
          }

          completedRequests++;

          if (completedRequests == bookUrls.length) {
            return res.json("success");
          }
        });
      });
    } else {
      console.log(error);
    }
  });
});

router.put("/update", async (req, res) => {
  await productModel.updateMany(
    { sale: 0 },
    {
      $set: {
        sale: 0.0,
      },
    }
  );
  return res.json("ok")
});

module.exports = router;
