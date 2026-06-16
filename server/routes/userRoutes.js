const express = require('express');
const router = express.Router();
const { getUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.delete('/:id', protect, isAdmin, deleteUser);
router.put('/:id', protect, isAdmin, updateUser);

module.exports = router;
