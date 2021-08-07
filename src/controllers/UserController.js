const User = require('../models/User');

const { hasNull } = require('../utils/hasNull');
const { generateHash, generateToken, validPassword } = require('../utils/auth');

module.exports = {

  async login(req, res) {
    if(hasNull(req.body, ['email', 'password']))
      return res.status(400).send({ msg: "Missing required data" });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if(!user)
        return res.status(400).send({ msg: "Invalid email or password" });

      if(!(await validPassword(password, user.password)))
        return res.status(400).send({ msg: "Invalid email or password" });

      user.password = undefined;
      return res.status(200).send({ user, token: generateToken({ id: user.id, isAdmin: user.is_admin }) });

    } catch(error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal server error" });
    }
  },

  async create(req, res) {
    if(hasNull(req.body, ['name', 'email', 'password']))
      return res.status(400).send({ msg: "Missing required data"});

    const { name, email, password } = req.body;

    try {
      const userExists = await User.findAll({
        where: { email }
      });

      if(userExists.length > 0)
        return res.status(400).send({ msg: "Duplicate entries in the database" });

      const result = await User.create({ name, email, password: await generateHash(password) });
      result.password = undefined;

      return res.status(200).send({ user: result, token: generateToken({ id: result.id, isAdmin: result.is_admin }) });

    } catch(error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal server error" });
    }
  },

  async read(req, res) {
    if(!req.isAdmin)
      return res.status(403).send({ mgs: 'Forbidden' });

    try {
      const result = await User.findAll({
        attributes: { exclude: ['password'] }
      });

      if(result.length === 0)
        return res.status(404).send({ msg: 'Not found'});

      return res.status(200).send(result);
    } catch(error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByPk(req.id);

      if(!user)
        return res.status(404).send({ msg: "Not found" });

      const { name, oldPassword, password } = req.body;

      if(password) {
        if(!oldPassword)
          return res.status(400).send({ msg: "Missing required data" });

        if(!(await validPassword(oldPassword, user.password)))
          return res.status(400).send({ msg: "Invalid password" });

        await user.update({ name, password: await generateHash(password) });
      }
      else await user.update({ name });

      user.password = undefined;
      return res.status(200).send(user);

    } catch(error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal server error" });
    }
  },

  async delete(req, res) {
    if(!req.isAdmin)
      return res.status(403).send({ msg: "Permission denied" });

    try {
      const user = await User.findByPk(req.id);

      if(!user)
        return res.status(404).send({ msg: "Not found" });

      await user.destroy();
      return res.status(200).send({ msg: "User deleted" });

    } catch(error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal server error" });
    }
  }
}