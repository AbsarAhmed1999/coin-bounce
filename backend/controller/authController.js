const Joi = require("joi");
const User = require("../models/user");
const bycrypt = require("bcryptjs");
const UserDto = require("../dto/user");
const JWTService = require("../services/jwtService");
const RefreshToken = require("../models/token");
const passwordPattern = /(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}/;
const authController = {
  async register(req, res, next) {
    // 1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(RegExp(passwordPattern)).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);
    // 2. if error in validation --> return error via middleware
    if (error) {
      return next(error);
    }
    // 3. if email or username is already registered --> return an error
    const { username, name, email, password } = req.body;

    //check if email is not already registered
    try {
      const emailInUse = await User.exists({ email });
      const userNameInUse = await User.exists({ username });
      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered,use another email ",
        };
        return next(error);
      }

      if (userNameInUse) {
        const error = {
          status: 409,
          message: "Username not available,choost another username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. password hash
    const hashedPassword = await bycrypt.hash(password, 10);
    // 5. store user data in db
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });
      // here object is saved with name "user"
      user = await userToRegister.save();
      // token generation
      accessToken = JWTService.signAccessToken(
        {
          _id: user._id,
        },
        "30m"
      );
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }
    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    // 6. response send
    // DTO is used to hide sensitive information
    const userDto = new UserDto(user);
    return res.status(201).json({ user: userDto, auth: true });
  },

  async login(req, res, next) {
    // validate user input

    // we expect data to be in this shape/format
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);
    //if validation error, return error
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;
    // short hand
    //const username = req.body.username
    //const password = req.body.password
    // match username & password
    let user;
    try {
      //match username
      user = await User.findOne({ username: username });
      //short hand
      // {username,password} when key & value are same write key only
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username or password",
        };
        return next(error);
      }
      //match password
      const matchPassword = await bycrypt.compare(password, user.password);
      if (!matchPassword) {
        const error = {
          status: 401,
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh Token in database
    // since interacting with database so use try{}catch()
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        {
          token: refreshToken,
        },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    const userDto = new UserDto(user);
    // return response
    return res.status(200).json({ user: userDto, auth: true });
  },
  async logout(req, res, next) {
    // 1 Delete refresh token
    const { refreshToken } = req.cookies;
    try {
      // here RefreshToken is db schema
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // 2. Send response to user
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    //1. get refresh token from cookies
    const originalRefreshToken = req.cookies.refreshToken;
    //2. verify refresh token
    let id;
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken);
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    //3. generate new token
    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (e) {
      return next(e);
    }
    const user = await User.findOne({ _id: id });
    const userDto = new UserDto(user);

    return res.status(200).json({ user: userDto, auth: true });
    //4. update db , return response
  },
};

module.exports = authController;
