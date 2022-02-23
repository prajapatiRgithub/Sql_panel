
const express = require("express");
const router = express.Router();
const { autheticate } = require('../../middleware/auth');
const portfolio = require('../../controller/portfolio');
const multer  = require('multer');

//multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({
    storage: storage
});

router.post('/portfolio', autheticate, upload.array('uploadImage'), portfolio.addData);
router.get('/portfolio/find', autheticate, portfolio.findData);
router.get('/portfolio/find/:id', autheticate, portfolio.findDataByid);

router.put('/portfolio/update/:id', autheticate, upload.array('uploadImage'), portfolio.editportfolio);
router.delete('/portfolio/delete/:id', autheticate, portfolio.deleteData);
router.delete('/portfolio/multiple', autheticate, portfolio.multipleDelete);

module.exports = router;