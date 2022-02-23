const express = require("express");
const router = express.Router();
const { autheticate } = require('../../middleware/auth');
const category = require('../../controller/category');

router.post('/category',autheticate, category.addData);
router.get('/category/find', autheticate, category.findData);
router.get('/category/find/:id', autheticate, category.findcategory_id);
router.put('/category/edit/:id', autheticate, category.editcategory);
router.delete('/category/delete/:id', autheticate, category.deleteData);
router.delete('/category/deletee', autheticate, category.multipleDelete);

module.exports = router;





