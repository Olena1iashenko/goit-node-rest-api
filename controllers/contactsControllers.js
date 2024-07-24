import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as contactsService from "../services/contactsServices.js";
import fs from "node:fs/promises";
import path from "node:path";

const avatarsPath = path.resolve("public", "avatars");
// console.log(avatarsPath);
// /Users/helen/Desktop/goit-node-rest-api/public/avatars

const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const filter = { owner };
  const contacts = await contactsService.listContacts({ filter });
  res.status(200).json({ message: "Contacts get succesfully", contacts });
};

const getOneContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsService.getContactById({ _id, owner });
  if (!contact) {
    throw HttpError(404);
  }
  res
    .status(200)
    .json({ message: `Contact with id=${id} get succesfully`, contact });
};

const deleteContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await contactsService.removeContact({ _id, owner });
  if (!deletedContact) {
    throw HttpError(404);
  }
  res.status(204).send();
  // res.json({
  //   message: `Contact deleted successfully`,
  //   deletedContact,
  // });
};

const createContact = async (req, res, next) => {
  // console.log("req.body", req.body);
  //   req.body [Object: null prototype] {
  //   name: 'Onil Jackson',
  //   email: 'ooo@bjay.com',
  //   phone: '0978767985'
  // }
  // console.log("req.file", req.file);
  // req.file {
  //   fieldname: 'avatar',
  //   originalname: 'IMG_20240302_095707.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: '/Users/helen/Desktop/goit-node-rest-api/tmp',
  //   filename: '1721742326764-300939311_IMG_20240302_095707.jpg',
  //   path: '/Users/helen/Desktop/goit-node-rest-api/tmp/1721742326764-300939311_IMG_20240302_095707.jpg',
  //   size: 549117
  // }
  try {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(image, filename);
    await fs.rename(oldPath, newPath);

    const contactURL = path.join("public", "contacts", filename);

    const { _id: owner } = req.user;
    const newContact = await contactsService.addContact({
      ...req.body,
      owner,
      contactURL,
    });

    res.status(201).json({
      message: "Contact add sucesfully",
      newContact,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

const updateContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const updatedContact = await contactsService.getContactById(
    { _id, owner },
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res
    .status(200)
    .json({ message: `Contact edited successfully`, updatedContact });
};

const updateStatusContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const updatedStatus = await contactsService.updateStatusContact(
    { _id, owner },
    req.body
  );
  if (!updatedStatus) {
    throw HttpError(404);
  }
  res
    .status(200)
    .json({ message: `Contact status updated successfully`, updatedStatus });
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
