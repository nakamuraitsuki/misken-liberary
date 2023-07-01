
const Books = {
    createTable:`
        CREATE TABLE IF NOT EXISTS books(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            author TEXT NOT NULL,
            author_alp TEXT NOT NULL,
            publisher TEXT NOT NULL,
            publisher_alp TEXT NOT NULL,
            stock INTEGER DEFAULT '1',
            borrowed INTEGER DEFAULT '0'
        )
    `,
    create: `INSERT INTO books (name, author, author_alp, publisher, publisher_alp) VALUES (?, ?, ?, ?, ?);`,
    findAll: `SELECT * FROM books;`,
    findById:`SELECT * FROM books WHERE id = ?;`,
    findByAutor: `SELECT * FROM books WHERE author_alp = ?;`,
    findByPublisher: `SELECT * FROM books WHERE publisher_alp = ? ;`,
    stockUpdate: `UPDATE books SET stock = ? WHERE id = ?;`,
    borrowedUpdate:`UPDATE books SET borrowed = '?' WHERE id = ?;`,
};
  
module.exports = {
    Books,
};
  