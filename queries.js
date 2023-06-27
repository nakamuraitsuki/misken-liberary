

//本に関する情報のクエリ
const Books = {
    createTable:`
        CREATE TABLE IF NOT EXISTS books(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            author TEXT NOT NULL,
            author_alp TEXT NOT NULL,
            publisher TEXT NOT NULL,
            publisher_alp TEXT NOT NULL
        )
    `,
    create: `INSERT INTO books (name, author, author_alp, publisher, publisher_alp) VALUES (?, ?, ?, ?, ?);`,
    findAll: `SELECT * FROM books;`,
    findByAutor: `SELECT * FROM books WHERE author = ?;`,
    findByPublisher: `SELECT * FROM books WHERE publisher = ? ;`,
};
  
module.exports = {
    Books,
};
  