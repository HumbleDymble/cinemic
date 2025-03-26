import jwt from "jsonwebtoken";

export const validateEmailFormat = async (req, res, next) => {
  const { email } = req.body;
  const re = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  if (email && re.test(String(email).toLowerCase())) {
    next();
  } else {
    res.status(403).json({ error: "The email provided is not valid" });
  }
};

export const validatePasswordLength = async (req, res, next) => {
  const { password } = req.body;
  if (password && password.length > 7) {
    next();
  } else {
    res.status(403).json({ error: "The password provided is not valid" });
  }
};

export const authMiddleware = async (req, res, next) => {
  const jwtAccess = req.cookies?.accessToken;
  const jwtRefresh = req.cookies?.refreshToken;

  const bearer = req.headers.authorization?.split(" ")[1] || jwtAccess;

  if (!bearer && !jwtRefresh) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!bearer) {
    res.status(401);
    next();
  }
  if (bearer && jwtRefresh) {
    next();
  }
};

export const generateTokens = (data) => {
  const accessToken = jwt.sign(data, process.env.SECRET_ACCESS, {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign(data, process.env.SECRET_REFRESH, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
};
