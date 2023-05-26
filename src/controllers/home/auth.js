const { statusModel } = require("../../models/status");
const { userModel } = require("../../models/user");
const { endcodedToken } = require("../../util/index");
const bcrypt = require("bcryptjs");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email }).populate("status");

      if (!user) {
        return res.status(400).json({
          success: false,
          error: {
            keyPattern: {
              message: "Email hoặc mật khẩu không đúng!",
            },
          },
        });
      }
      const checkPass = await bcrypt.compare(password, user.password);
      if (user && checkPass) {
        if (user.status.slug == "tam-khoa") {
          return res.status(400).json({
            success: false,
            error: { keyPattern: { message: "Tài khoản của bạn đã bị khóa!" } },
          });
        }
        return res.status(200).json({
          success: true,
          token: endcodedToken({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }),
        });
      } else {
        return res.status(400).json({
          success: false,
          error: {
            keyPattern: {
              message: "Email hoặc mật khẩu không đúng!",
            },
          },
        });
      }
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },

  loginGoogle: async (req, res) => {
    try {
      const { email, photo, name } = req.body;
      const data = await userModel.findOne({ email }).populate("status");
      if (!data) {
        const status = await statusModel.findOne({ slug: "hoat-dong" });

        const user = await userModel.create({
          email,
          photo,
          name,
          status: status._id,
        });
        return res.status(200).json({
          success: true,
          token: endcodedToken({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }),
        });
      }
      return res.status(200).json({
        success: true,
        token: endcodedToken({
          id: data._id,
          name: data.name,
          photo: data.photo,
        }),
      });
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },
};

module.exports = authController;
