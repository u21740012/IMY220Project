//Oarabile Matlala u21740012 position 5
// library.js
const { MongoClient } = require("mongodb");

const DEFAULT_URI =
  process.env.MONGO_URI ||
  "mongodb://test-user:test-password@127.0.0.1:27017/?authSource=libraryDB";

const DB_NAME = "libraryDB";
const USERS_COLL = "users";
const BOOKS_COLL = "books";
const MAX_CHECKOUTS = 3;

let client;
let db;

const seedUsers = [
  { userId: "U001", username: "Admin",   password: "admin123",   role: "admin", checkedOut: [] },
  { userId: "U002", username: "Alice",   password: "alice123",   role: "admin", checkedOut: [] },
  { userId: "U003", username: "Bob",     password: "bob123",     role: "user",  checkedOut: [] },
  { userId: "U004", username: "Charlie", password: "charlie123", role: "user",  checkedOut: [] },
  { userId: "U005", username: "Diana",   password: "diana123",   role: "user",  checkedOut: [] },
  { userId: "U006", username: "Edward",  password: "edward123",  role: "user",  checkedOut: [] },
  { userId: "U007", username: "Fiona",   password: "fiona123",   role: "user",  checkedOut: [] },
  { userId: "U008", username: "George",  password: "george123",  role: "admin", checkedOut: [] },
  { userId: "U009", username: "Hannah",  password: "hannah123",  role: "user",  checkedOut: [] },
  { userId: "U010", username: "Ian",     password: "ian123",     role: "user",  checkedOut: [] }
];

const seedBooks = [
  { bookId: "B001", title: "The Lord of the Rings",                author: "J.R.R. Tolkien", year: 1954, genre: "Fantasy",         checkedOutBy: null },
  { bookId: "B002", title: "The Hobbit",                           author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy",         checkedOutBy: null },
  { bookId: "B003", title: "The Chronicles of Narnia",             author: "C.S. Lewis",     year: 1950, genre: "Fantasy",         checkedOutBy: null },
  { bookId: "B004", title: "Dune",                                 author: "Frank Herbert",  year: 1965, genre: "Science Fiction", checkedOutBy: null },
  { bookId: "B005", title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams",  year: 1979, genre: "Science Fiction", checkedOutBy: null }
];

// helpers
const clean = (v) => (v == null ? "" : String(v).trim());

async function init() {
  if (db) return db;
  client = new MongoClient(DEFAULT_URI);
  await client.connect();
  db = client.db(DB_NAME);

  const users = db.collection(USERS_COLL);
  const books = db.collection(BOOKS_COLL);

  if ((await users.estimatedDocumentCount()) === 0) await users.insertMany(seedUsers);
  if ((await books.estimatedDocumentCount()) === 0) await books.insertMany(seedBooks);

  await books.createIndex({ title: "text" });
  await books.createIndex({ bookId: 1 }, { unique: true });
  await users.createIndex({ userId: 1 }, { unique: true });
  await users.createIndex({ username: 1 }, { unique: true });

  await books.updateMany(
    { $or: [{ checkedOutBy: { $exists: false } }, { checkedOutBy: "" }, { checkedOutBy: "null" }] },
    { $set: { checkedOutBy: null } }
  );
  await users.updateMany(
    { $or: [{ checkedOut: { $exists: false } }, { checkedOut: null }] },
    { $set: { checkedOut: [] } }
  );

  try {
    await db.command({
      collMod: BOOKS_COLL,
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["bookId", "title", "author", "year", "genre"],
          properties: {
            bookId: { bsonType: "string" },
            checkedOutBy: { bsonType: ["string", "null"] }
          }
        }
      },
      validationLevel: "moderate"
    });
  } catch (_) {}

  return db;
}

async function login(username, password) {
  await init();
  const u = clean(username);
  const p = clean(password);
  const user = await db.collection(USERS_COLL).findOne({ username: u, password: p });
  if (!user) return null;
  return { userId: user.userId, username: user.username, role: user.role, checkedOut: user.checkedOut || [] };
}

async function getAllBooks() {
  await init();
  return db.collection(BOOKS_COLL).find({}).sort({ title: 1 }).toArray();
}

async function searchBooksByTitle(query) {
  await init();
  const q = clean(query);
  if (!q) return getAllBooks();
  return db.collection(BOOKS_COLL).find({ title: { $regex: q, $options: "i" } }).sort({ title: 1 }).toArray();
}

async function getCheckedOutBooks() {
  await init();
  return db.collection(BOOKS_COLL).find({ checkedOutBy: { $ne: null } }).toArray();
}

async function addBook(book) {
  await init();
  const b = {
    bookId: clean(book?.bookId),
    title: clean(book?.title),
    author: clean(book?.author),
    year: Number(book?.year),
    genre: clean(book?.genre),
    checkedOutBy: null
  };
  if (!b.bookId || !b.title || !b.author || !b.year || !b.genre) {
    throw new Error("Missing required book fields.");
  }
  await db.collection(BOOKS_COLL).insertOne(b);
  return b;
}

async function deleteBook(bookId) {
  await init();

  const bid = clean(bookId);
  const books = db.collection(BOOKS_COLL);
  const users = db.collection(USERS_COLL);

  const book = await books.findOne(
    { bookId: bid },
    { projection: { _id: 0, bookId: 1, title: 1, checkedOutBy: 1 } }
  );
  if (!book) throw new Error(`Book not found (bookId=${bid}).`);

  const isFree =
    book.checkedOutBy == null ||
    book.checkedOutBy === "" ||
    book.checkedOutBy === "null";

  if (!isFree) throw new Error(`Cannot delete: "${book.title}" is checked out by ${book.checkedOutBy}.`);

  const result = await books.deleteOne({ bookId: bid });
  if (result.deletedCount !== 1) throw new Error(`Delete failed unexpectedly for bookId=${bid}.`);

  await users.updateMany({}, { $pull: { checkedOut: bid } });
  return book;
}

async function checkoutBook(userId, bookId) {
  await init();

  const uid = clean(userId);
  const bid = clean(bookId);

  const users = db.collection(USERS_COLL);
  const books = db.collection(BOOKS_COLL);

  const user = await users.findOne({ userId: uid });
  if (!user) throw new Error("User not found.");

  const doc = await books.findOne(
    { bookId: bid },
    { projection: { _id: 0, bookId: 1, title: 1, checkedOutBy: 1 } }
  );
  if (!doc) throw new Error(`Book not found (bookId=${bid}).`);

  const holder = (doc.checkedOutBy === "" || doc.checkedOutBy === "null" || doc.checkedOutBy == null)
    ? null
    : String(doc.checkedOutBy).trim();

  if (holder === uid) {
    await users.updateOne({ userId: uid }, { $addToSet: { checkedOut: bid } });
    return doc;
  }

  if (holder && holder !== uid) {
    throw new Error(`Book is already checked out by ${holder}.`);
  }

  const count = Array.isArray(user.checkedOut) ? user.checkedOut.length : 0;
  if (count >= MAX_CHECKOUTS) throw new Error("User already has 3 books checked out.");

  await books.updateOne({ bookId: bid }, { $set: { checkedOutBy: uid } });
  await users.updateOne({ userId: uid }, { $addToSet: { checkedOut: bid } });

  return await books.findOne(
    { bookId: bid },
    { projection: { _id: 0, bookId: 1, title: 1, checkedOutBy: 1 } }
  );
}

async function checkinBook(userId, bookId) {
  await init();

  const uid = clean(userId);
  const bid = clean(bookId);

  const users = db.collection(USERS_COLL);
  const books = db.collection(BOOKS_COLL);

  const doc = await books.findOne(
    { bookId: bid },
    { projection: { _id: 0, bookId: 1, title: 1, checkedOutBy: 1 } }
  );
  if (!doc) throw new Error(`Book not found (bookId=${bid}).`);

  const holder = (doc.checkedOutBy === "" || doc.checkedOutBy === "null" || doc.checkedOutBy == null)
    ? null
    : String(doc.checkedOutBy).trim();

  if (holder === null) {
    await users.updateOne({ userId: uid }, { $pull: { checkedOut: bid } });
    return { ...doc, checkedOutBy: null };
  }

  if (holder !== uid) {
    throw new Error(`Book is checked out by ${holder}, not this user.`);
  }

  
  await books.updateOne({ bookId: bid, checkedOutBy: uid }, { $set: { checkedOutBy: null } });
  await users.updateOne({ userId: uid }, { $pull: { checkedOut: bid } });

  return await books.findOne(
    { bookId: bid },
    { projection: { _id: 0, bookId: 1, title: 1, checkedOutBy: 1 } }
  );
}

module.exports = {
  init,
  login,
  getAllBooks,
  searchBooksByTitle,
  getCheckedOutBooks,
  addBook,
  deleteBook,
  checkoutBook,
  checkinBook
};
