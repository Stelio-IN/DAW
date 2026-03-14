import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const User = db.User;

const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      tipo_usuario: 'comum',
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Senha inválida' });

  const token = jwt.sign(
    { user_id: user.user_id, tipo_usuario: user.tipo_usuario },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
    },
  });
};

const getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.user_id, {
    attributes: { exclude: ['password'] },
  });
  res.json(user);
};

export default { createUser, loginUser, getUserProfile };
