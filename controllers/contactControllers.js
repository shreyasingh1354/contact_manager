const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactsModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private 

const getContacts = asyncHandler(async (req, res) => {
  console.log("Works")
  const contacts = await Contact.find();
  console.log(contacts)
  res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts 
//@access private

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { user_id,name, email, phone } = req.body;
  // Check for mandatory fields
  if (!name || !email || !phone || !user_id) {
    console.log("Error: Missing required fields");
    res.status(400).json({ message: "All fields are mandatory!" });
    return; 
  }

  try {
   
    const contact = await Contact.create({
      user_id,
      name,
      email,
      phone,
     

    });
    console.log("Contact created successfully:", contact);
    res.status(201).json(contact);
  } catch (error) {
    console.error("Failed to create contact:", error.message);
    res.status(500).json({ message: "Server error while creating contact", error: error.message });
  }
});

//@desc Create new contact
//@route POST /api/contacts
//@access private 

const getContact = asyncHandler(async (req, res) => {
  console.log(req.params);
  console.log(req.params.user_id);
  const contact = await Contact.find({"user_id":req.params.user_id})
  // const contact = await Contact.findById(req.params.user_id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  console.log("Sent!"); 
  res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts 
//@access private 

const updateContact = asyncHandler(async (req, res) => {
  console.log(req.params.user_id)
  const contact = await Contact.find({"user_id":Number(req.params.user_id)})
  if (!contact) { 
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedContact = await Contact.findOneAndUpdate(
    {"user_id":req.params.user_id},
    req.body, 
    { new: true } 
  );

  res.status(200).json(updatedContact);
});
 //@desc Delete contact
//@route DELETE /api/contacts
//@access private 

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.find({"user_id": req.params.user_id });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  
  await Contact.deleteOne({"user_id": req.params.user_id });
  res.status(200).json(contact);
});






  module.exports={getContacts, createContact, getContact,updateContact, deleteContact};
