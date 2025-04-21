const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to simulate an API call to get books data
const getBooksFromDB = () => {
	return new Promise((resolve, reject) => {
		// Simulating API delay
		setTimeout(() => {
			resolve(Object.values(books));
		}, 300);
	});
};

// Function to get a book by ISBN
const getBookByISBN = (isbn) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (books[isbn]) {
				resolve(books[isbn]);
			} else {
				reject("Book not found");
			}
		}, 300);
	});
};

// Function to get books by author
const getBooksByAuthor = (author) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const booksByAuthor = Object.values(books).filter(
				(book) => book.author === author
			);
			if (booksByAuthor.length > 0) {
				resolve(booksByAuthor);
			} else {
				reject("No books found by this author");
			}
		}, 300);
	});
};

// Function to get books by title
const getBooksByTitle = (title) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const booksByTitle = Object.values(books).filter(
				(book) => book.title === title
			);
			if (booksByTitle.length > 0) {
				resolve(booksByTitle);
			} else {
				reject("No books found with this title");
			}
		}, 300);
	});
};

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}
	if (users[username]) {
		return res.status(400).json({ message: "User already exists" });
	}
	users[username] = { password };
	return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	const bookList = Object.values(books);
	res.send(JSON.stringify(bookList, null, 4));
});

// Task 10: Get the book list using Promise callback in a single function
public_users.get("/promise/books", (req, res) => {
	new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				const bookList = Object.values(books);
				resolve(bookList);
			} catch (error) {
				reject("Error retrieving books");
			}
		}, 300);
	})
		.then((bookList) => {
			res.send(JSON.stringify(bookList, null, 4));
		})
		.catch((error) => {
			res.status(500).send(error);
		});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	if (books[isbn]) {
		res.send(JSON.stringify(books[isbn], null, 4));
	} else {
		res.status(404).send("Book not found");
	}
});

// Task 11: Get book details based on ISBN using Promise callback in a single function
public_users.get("/promise/isbn/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	new Promise((resolve, reject) => {
		setTimeout(() => {
			if (books[isbn]) {
				resolve(books[isbn]);
			} else {
				reject("Book not found");
			}
		}, 300);
	})
		.then((book) => {
			res.send(JSON.stringify(book, null, 4));
		})
		.catch((error) => {
			res.status(404).send(error);
		});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;
	const booksByAuthor = Object.values(books).filter(
		(book) => book.author === author
	);
	if (booksByAuthor.length > 0) {
		res.send(JSON.stringify(booksByAuthor, null, 4));
	} else {
		res.status(404).send("No books found by this author");
	}
});

// Task 12: Get book details based on author using Promise callback in a single function
public_users.get("/promise/author/:author", (req, res) => {
	const author = req.params.author;
	new Promise((resolve, reject) => {
		setTimeout(() => {
			const booksByAuthor = Object.values(books).filter(
				(book) => book.author === author
			);
			if (booksByAuthor.length > 0) {
				resolve(booksByAuthor);
			} else {
				reject("No books found by this author");
			}
		}, 300);
	})
		.then((booksByAuthor) => {
			res.send(JSON.stringify(booksByAuthor, null, 4));
		})
		.catch((error) => {
			res.status(404).send(error);
		});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title;
	const booksByTitle = Object.values(books).filter(
		(book) => book.title === title
	);
	if (booksByTitle.length > 0) {
		res.send(JSON.stringify(booksByTitle, null, 4));
	} else {
		res.status(404).send("No books found with this title");
	}
});

// Task 13: Get book details based on title using Promise callback in a single function
public_users.get("/promise/title/:title", (req, res) => {
	const title = req.params.title;
	// Using Promise without async/await
	new Promise((resolve, reject) => {
		setTimeout(() => {
			const booksByTitle = Object.values(books).filter(
				(book) => book.title === title
			);
			if (booksByTitle.length > 0) {
				resolve(booksByTitle);
			} else {
				reject("No books found with this title");
			}
		}, 300);
	})
		.then((booksByTitle) => {
			res.send(JSON.stringify(booksByTitle, null, 4));
		})
		.catch((error) => {
			res.status(404).send(error);
		});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	if (books[isbn]) {
		res.send(JSON.stringify(books[isbn].reviews, null, 4));
	} else {
		res.status(404).send("Book not found");
	}
});

module.exports.general = public_users;
