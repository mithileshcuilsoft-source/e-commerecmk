const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/auth/auth.controller");
const { protect } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.use(protect); // All user routes require authentication

router.get("/me", asyncHandler(ctrl.getProfile));
router.put("/me", upload.single("image"), asyncHandler(ctrl.updateProfile));

module.exports = router;
