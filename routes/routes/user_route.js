const express = require('express');
const router = express.Router();
const auth = require('../../controller/auth');
const { autheticate, generateAuthToken } = require('../../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.post("/signup", upload.single('Image'), auth.signup);
router.post("/loginUser", generateAuthToken, auth.authUser);

router.post('/forgetPassword', auth.forgetPassword);
router.post("/verifyOtp", auth.verifyOtp);

router.put("/updatePassword", auth.updatePassword);
router.post("/resetPassword", autheticate, auth.resetPassword);
router.get('/viewProfile', autheticate, auth.viewProfile);
router.put('/editProfile', autheticate, upload.single('Image'), auth.editProfile);

router.get("/logout",autheticate, auth.logout);
module.exports = router;