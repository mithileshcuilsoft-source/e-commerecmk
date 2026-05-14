const router = require("express").Router();

const validate = require("../middlewares/validate");
const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/auth/auth.controller");
const registerSchema = require("../validations/auth.validation");

router.post("/vendor/register", validate(registerSchema), asyncHandler(ctrl.registerVendor));
router.post("/register", validate(registerSchema), asyncHandler(ctrl.registerUser));
router.post("/login", asyncHandler(ctrl.login));

module.exports = router;