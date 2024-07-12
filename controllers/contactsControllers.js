import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const contact = await contactsServices.getContactById({ _id });
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const deletedContact = await contactsService.removeContact({ _id });
    if (!deletedContact) {
      //   return res.status(404).json({ message: "Not found" });
      throw HttpError(404);
    }
    res.status(204).json(deletedContact);
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const { error } = createContactSchema.validate({
      name,
      email,
      phone,
      favorite,
    });
    if (error) {
      //   return res.status(400).json({ message: error.message });
      throw HttpError(400);
    }
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json({
      id: newContact.id,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      favorite: newContact.favorite,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { name, email, phone, favorite } = req.body;
    const { error } = updateContactSchema.validate({
      name,
      email,
      phone,
      favorite,
    });
    if (error) {
      // return res.status(400).json({ message: error.message });
      throw HttpError(400);
    }
    const existingContact = await contactsService.getContactById({ _id });
    if (!existingContact) {
      // return res.status(404).json({ message: "Not found" });
      throw HttpError(404);
    }
    const updatedFields = {
      name: name || existingContact.name,
      email: email || existingContact.email,
      phone: phone || existingContact.phone,
      favorite: favorite || existingContact.favorite,
    };
    const updatedContact = await contactsService.updateContact(
      { _id },
      updatedFields
    );
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const updatedContact = await contactsServices.updateStatusContact(
      { _id },
      req.body
    );

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.status(200).json({
      updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
