import fs from "node:fs/promises";
import { faker } from "@faker-js/faker";
import path from "node:path";

// const contactsPath = path.join(
//   process.cwd(),
//   "src",
//   "db",
//   "contacts.json"
// );
const contactsPath = path.resolve("src", "db", "contacts.json");

export async function listContacts() {
  // ...твій код. Повертає масив контактів.
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const contact = contacts.find(
    (contact) => String(contact.id) === String(contactId)
  );
  if (!contact) {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const index = await contacts.findIndex(
    (contact) => (contact) => String(contact.id) === String(contactId)
  );
  if (index === -1) {
    return null;
  }
  const removedContact = contacts.splice(index, 1)[0];
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact;
}

async function addContact(name, email, phone) {
  // ...твій код. Повертає об'єкт доданого контакту (з id).
  const newContact = {
    id: faker.string.uuid(),
    name: name || faker.person.fullName(),
    email: email || faker.internet.email(),
    phone: phone || faker.phone.number(),
  };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContact(contactId, body) {
  // ...твій код.  Редагує об'єкт доданого контакту (з id).
  let contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  contact.name = body.name || contact.name;
  contact.email = body.email || contact.email;
  contact.phone = body.phone || contact.phone;
  const contacts = await listContacts();
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contact;
}

export { getContactById, removeContact, addContact, updateContact };
