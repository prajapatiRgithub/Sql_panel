const express = require('express');
const router = express();
const contact = require('../Controller/contact');
const { auth, generateToken } = require('../model/auth');

router.get("/contact", auth, contact.viewcontact);
router.get("/showcontact", auth, contact.showcontact);
router.post("/addcontact", auth, contact.addcontact);


router.get("/deleteContact/:id", auth, contact.deleteContact);

router.get("/multiDeleteContact", auth, contact.multiDeleteContact);

router.get("/showEditContact/:id", auth, contact.showEditContact);
router.post("/updateContact/:id", auth, contact.updateContact);

module.exports = router;