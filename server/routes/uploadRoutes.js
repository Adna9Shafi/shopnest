const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/', protect, isAdmin, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post('/multiple', protect, isAdmin, upload.array('images', 10), (req, res) => {
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
