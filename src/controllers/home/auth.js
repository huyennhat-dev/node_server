const { statusModel } = require("../../models/status");
const { userModel } = require("../../models/user");
const { endcodedToken } = require("../../util/index");
const bcrypt = require("bcryptjs");

const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} = require("../../config");

const cloudinary = require("cloudinary").v2;

const { publicId } = require("../../util/index");

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

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
            address: user.address,
            phone: user.phone,
            email: user.email,
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
            address: user.address,
            phone: user.phone,
            email: user.email,
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
  update: async (req, res) => {
    try {
      const data = req.body;
      const id = req.user.sub.id;

      const user = await userModel.findById(id);

      if (user) {
        if (data.photo && data.photo.length > 100) {
          if (user.photo) {
            await cloudinary.uploader.destroy(
              `images/users/${publicId(user.photo)}`
            );
          }
          const rs = await cloudinary.uploader.upload(data.photo, {
            folder: "images/users",
          });
          data.photo = rs.url;
        }

        await user.updateOne({ $set: data });
      }
      return res.status(200).json({ status: true });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },
};

module.exports = authController;
