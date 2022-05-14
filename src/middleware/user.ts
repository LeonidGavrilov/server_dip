import User from "../models/User";

const user = async (req: any, res: any, next: any) => {
  console.log('user');
  if (!req.session.user) {
    console.log('1', req.session);
    
    return next();
  }
  req.user = await User.findById(req.session.user._id);
  console.log('1', req.session);
  next();
};

export default user;