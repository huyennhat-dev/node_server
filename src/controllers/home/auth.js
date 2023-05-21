const { userModel } = require("../../models/user");
const { endcodedToken } = require("../../util/index");
const bcrypt = require("bcryptjs");

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await userModel.findOne({ username }).populate("status");

      if (!user) {
        return res.status(400).json({
          success: false,
          error: {
            keyPattern: {
              message: "Tài khoản hoặc mật khẩu không đúng!",
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
              message: "Tài khoản hoặc mật khẩu không đúng!",
            },
          },
        });
      }
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },

  checkLogin: async (req, res) => {
    try {
      const id = req.user.sub.id;
      const data = await userModel
        .findById(id)
        .select("-password -role -status");
      if (data) {
        return res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json({ status: false, error });
    }
  },
};

module.exports = authController;
