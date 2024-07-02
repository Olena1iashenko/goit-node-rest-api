import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (!deletedContact) {
      //   return res.status(404).json({ message: "Not found" });
      throw HttpError(404);
    }
    res.status(204).json(deletedContact);
  } catch (error) {
    next(error);
    // console.error("Error deleting contact:", error);
    // res.status(500).json({ message: "Server error" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate({ name, email, phone });
    if (error) {
      //   return res.status(400).json({ message: error.message });
      throw HttpError(400);
    }
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json({
      id: newContact.id,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const { error } = updateContactSchema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const existingContact = await contactsService.getContactById(id);
    if (!existingContact) {
      return res.status(404).json({ message: "Not found" });
    }
    const updatedFields = {
      name: name || existingContact.name,
      email: email || existingContact.email,
      phone: phone || existingContact.phone,
    };
    const updatedContact = await contactsService.updateContact(
      id,
      updatedFields
    );
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};
