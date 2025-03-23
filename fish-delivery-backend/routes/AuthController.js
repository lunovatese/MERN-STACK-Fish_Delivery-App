const createError = require("http-errors");
const User = require("../models/User.js");
const { generateTokens } = require("../utills/jwt.js");

class AuthController {
  // User registration
  static async registerNewUser(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw createError(400, "All fields are required to create new user");
      }

      const newUser = new User({
        name,
        email,
        password,
        role: "admin",
        lastLogin: Date.now(),
      });

      await newUser.save();

      const tokens = generateTokens(newUser);
      AuthController.setTokenCookies(res, tokens);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // User login
  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw createError(400, "Email and password are required");
      }

      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        throw createError(401, "Invalid credentials");
      }

      const tokens = generateTokens(user);
      AuthController.setTokenCookies(res, tokens); // Fix: Use class name instead of `this`

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw createError(401, "Refresh token required");
      }

      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(payload.id);

      if (!user || user.tokenVersion !== payload.tokenVersion) {
        throw createError(401, "Invalid refresh token");
      }

      const tokens = generateTokens(user);
      AuthController.setTokenCookies(res, tokens); // Fix: Use class name instead of `this`

      res.json({ success: true });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        error = createError(401, "Invalid refresh token");
      }
      next(error);
    }
  }

  // Set token cookies
  static setTokenCookies(res, { accessToken, refreshToken }) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
  }
}

module.exports = AuthController;
