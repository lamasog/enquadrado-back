const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) 
    return res.status(401).send({ msg: "No token provided" });

  const parts = authHeader.split(' ');

  if(parts.length !== 2)
    return res.status(401).send({ msg: "Token error" });

    const [bearer, token] = parts;
    if(!/^Bearer$/i.test(bearer))
      return res.status(401).send({ msg: 'Malformed token'});

    jwt.verify(token, '150ef76c7869d07cb51e37699d32baf7', (err, decoded) => {
      if(err) 
        return res.status(401).send({ msg: 'Invalid token' });

      req.id = decoded.id;
      req.isAdmin = decoded.isAdmin;

      return next();
    });
}