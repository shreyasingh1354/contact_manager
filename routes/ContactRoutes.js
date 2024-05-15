const express = require("express");
const router = express.Router();
const {getContacts, createContact, getContact,updateContact, deleteContact} = require("../controllers/contactControllers");
const validateToken = require("../middleware/validateTokenHandler");


router.route("/").get(getContacts);

  router.route("/").post(createContact);

  router.route("/:user_id").get(getContact);

  router.route("/:user_id").put(updateContact);

  router.route("/:user_id").delete(deleteContact);
  module.exports = router;
