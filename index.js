const express = require("express");
const { v4: uuid } = require("uuid");

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    id = uuid()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
}

const lib = {
  books: [],
};

const app = express();
app.use(express.json());

const auth = { id: 1, mail: "test@mail.ru" };

//метод всегда возвращает Code: 201 и статичный объект: { id: 1, mail: "test@mail.ru" }
app.post("/api/user/login", (req, res) => {
  res.status(201);
  res.json(auth);
});

//получаем массив всех книг
app.get("/api/books", (req, res) => {
  const { books } = lib;
  res.json(books);
});

//получаем объект книги, если запись не найдено вернем Code: 404
app.get("/api/books/:id", (req, res) => {
  const { books } = lib;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json(`404 | Запись не найдена`);
  }
});

//создаем книги и возврашаем ее же вместе с присвоенным id
app.post("/api/books", (req, res) => {
  const { books } = lib;
  const { title, description } = req.body;
  const newBook = new Book(title, description);
  books.push(newBook);
  res.status(201);
  res.json(newBook);
});

//редактируем объект книги, если запись не найдено вернем Code: 404
app.put("/api/books/:id", (req, res) => {
  const { books } = lib;
  const { title, description } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
    };
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json(`404 | Запись не найдена`);
  }
});

//удаляем книгу и возвращаем ответ: 'ok'
app.delete("/api/books/:id", (req, res) => {
  const { books } = lib;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books.splice(idx, 1);
  } else {
    res.status(404);
    res.json(`404 | Запись не найдена`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
