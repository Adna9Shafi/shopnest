const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('wishlist');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUsers, getUserById, deleteUser, updateUser };
