import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verify = jwt.verify(token, process.env.TOKEN_KEY);

    if (verify) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        errorMessage: 'Failed to Authenticate'
      });
    }
  } catch (error) {
    res.status(403).json({
      status: 403,
      errorMessage: 'Failed to Authenticate'
    });
  }
};

export default verifyLogin;