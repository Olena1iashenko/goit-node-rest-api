import Contacts from "../db/models/Contacts.js";

export const listContacts = (query = {}) => {
  const { filter } = query;
  return Contacts.find();
};

export const getContactById = (id) => Contacts.findOne(id);

export const removeContact = (filter) => {
  return Contacts.findByIdAndDelete(filter);
};

export const addContact = (data) => {
  return Contacts.create(data);
};

export const updateContact = (filter, data) =>
  Contacts.findOneAndUpdate(filter, data);

export const updateStatusContact = (id, body) => {
  return Contacts.findByIdAndUpdate(id, body);
};

try {
} catch (error) {}
