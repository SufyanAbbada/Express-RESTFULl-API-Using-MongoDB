admin = (req, res, next) => {
  if (req.auser.role != "admin")
    return res.status(403).send("Youa re not Admin and thus Not Authorized.");
  next();
};

module.exports = admin;
