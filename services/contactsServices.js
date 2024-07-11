import Contact from "../db/models/Contacts.js";

export const getContacts = () => {
  return Contact.find();
};
export const getContactById = (filter) => Contact.findOne(filter);

export const addContact = (data) => {
  return Contact.create(data);
};
export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body);
};
export const removeContact = (filter) => {
  return Contact.findByIdAndDelete(filter);
};
