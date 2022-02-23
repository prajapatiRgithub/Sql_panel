const express = require('express');
const router = express();

const routes = require('../routes/routes/user_route');

// const contactRoutes = require('../routes/router/contactRoutes');
 const category = require('../routes/routes/category');
 const portfolio = require('../routes/routes/portfolio');
// const testRoutes = require('../routes/router/testRoutes');




router.use('/', routes);
router.use('/', category);
router.use('/', portfolio);
// router.use('/', contactRoutes);
// router.use('/', testRoutes);



module.exports = router;