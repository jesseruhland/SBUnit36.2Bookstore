process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Books Routes Test", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");

    const book1 = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
  });

  describe("GET /books", function () {
    test("can get all books", async function () {
      let response = await request(app).get("/books");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        books: [
          {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017,
          },
        ],
      });
    });
  });

  describe("GET /books/:isbn", function () {
    test("can get a specific book", async function () {
      let response = await request(app).get("/books/0691161518");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        book: {
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "Matthew Lane",
          language: "english",
          pages: 264,
          publisher: "Princeton University Press",
          title: "Power-Up: Unlocking Hidden Math in Video Games",
          year: 2017,
        },
      });
    });

    test("will respond with 404 if a book is not found", async function () {
      let response = await request(app).get("/books/0");
      expect(response.status).toEqual(404);
    });
  });

  describe("POST /books", function () {
    test("can create a book", async function () {
      let response = await request(app)
        .post("/books")
        .send({
          book: {
            isbn: "0691161519",
            amazon_url: "http://a.co/eobPtX",
            author: "Test Author",
            language: "english",
            pages: 305,
            publisher: "Princeton University Press",
            title: "Power-Up: Tests with Jest",
            year: 2018,
          },
        });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        book: {
          isbn: "0691161519",
          amazon_url: "http://a.co/eobPtX",
          author: "Test Author",
          language: "english",
          pages: 305,
          publisher: "Princeton University Press",
          title: "Power-Up: Tests with Jest",
          year: 2018,
        },
      });
    });

    test("will not create a duplicate book", async function () {
      let response = await request(app)
        .post("/books")
        .send({
          book: {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017,
          },
        });

      expect(response.status).toEqual(400);
    });

    test("will not create a book with missing information", async function () {
      let response = await request(app)
        .post("/books")
        .send({
          book: {
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017,
          },
        });

      expect(response.status).toEqual(400);
    });
  });

  describe("PUT /books/:isbn", function () {
    test("can update a book", async function () {
      let response = await request(app)
        .put("/books/0691161518")
        .send({
          book: {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX",
            author: "Test Author",
            language: "english",
            pages: 305,
            publisher: "Princeton University Press",
            title: "Power-Up: Tests with Jest",
            year: 2018,
          },
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        book: {
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX",
          author: "Test Author",
          language: "english",
          pages: 305,
          publisher: "Princeton University Press",
          title: "Power-Up: Tests with Jest",
          year: 2018,
        },
      });
    });

    test("will not update a book that does not exist", async function () {
      let response = await request(app)
        .put("/books/0")
        .send({
          book: {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017,
          },
        });

      expect(response.status).toEqual(404);
    });

    test("will not create a book with missing information", async function () {
      let response = await request(app)
        .put("/books/0691161518")
        .send({
          book: {
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017,
          },
        });

      expect(response.status).toEqual(400);
    });
  });

  describe("DELETE /books/:isbn", function () {
    test("can delete a book", async function () {
      let response = await request(app).delete("/books/0691161518");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: "Book deleted" });
    });

    test("will not delete a book that does not exist", async function () {
      let response = await request(app).delete("/books/0691161519");

      expect(response.status).toEqual(404);
    });
  });

  afterAll(async function () {
    await db.end();
  });
});
