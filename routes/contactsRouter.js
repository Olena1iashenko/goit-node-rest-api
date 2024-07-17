import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../helpers/validateBody.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateStatusContact
);

export default contactsRouter;
