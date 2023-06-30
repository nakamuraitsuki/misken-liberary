const sqlite3 = require("sqlite3").verbose();
const queries = require("./queries");
const templates = require("./templates");
const { serve } = require("@hono/node-server");
const { serveStatic } = require("@hono/node-server/serve-static");
const { Hono } = require("hono");

const db = new sqlite3.Database("database.db");

db.serialize(() => {
  
  db.run(queries.Books.createTable);

});

const app = new Hono();

app.get("/", async (c) =>{
 
  const function_view = templates.FUNCTION_VIEW();
  const response = templates.HTML(function_view);
   return c.html(response);

});

app.get("/allbook",async (c) =>{
  
    const allbook = await new Promise((resolve) => {
      db.all(queries.Books.findAll, (err, rows) => {
           resolve(rows);
       });
    });
  
  const allbooklist = templates.ALLBOOK_LIST_VIEW(allbook);

  response = templates.HTML(allbooklist);

  return c.html(response);
});


app.get("/authorsearch",async (c) =>{
    const author_search_form = templates.SEARCH_AUTHOR();

    const response = templates.HTML(author_search_form);

    return c.html(response);
});

app.post("/authorsearch",async (c) =>{
  const body = await c.req.parseBody();
  const nothing = templates.NOT_FOUND();
  resp = templates.HTML(nothing);
  if(!body.author){
    return c.html(resp);
  }
  return c.redirect(`/authorsearch/${body.author}`);
});

app.get("/authorsearch/:name", async (c) => {
  const name = c.req.param("name");

  const books = await new Promise((resolve) => {
      db.all(queries.Books.findByAutor, name, (err, row) => {
          resolve(row);
      });
  });

  if (typeof books === "undefined") {
    const nothing = templates.NOT_FOUND();
    response = templates.HTML(nothing);
      return c.html(response);
  }

  const booklist = templates.SEARCH_BOOK_LIST_VIEW(books);

  const response = templates.HTML(booklist);

  return c.html(response);
});

app.get("/publishersearch",async (c) =>{
    const publisher_search_form = templates.SEARCH_PUBLISHER();

    const response = templates.HTML(publisher_search_form);

    return c.html(response);
});

app.post("/publishersearch",async (c) =>{
  const body = await c.req.parseBody();
  const nothing = templates.NOT_FOUND();
  resp = templates.HTML(nothing);
  if(!body.publisher){
    return c.html(resp);
  }
  return c.redirect(`/publishersearch/${body.publisher}`);
})

app.get("/publishersearch/:name", async (c) => {
  const name = c.req.param("name");

  const books = await new Promise((resolve) => {
      db.all(queries.Books.findByPublisher, name, (err, row) => {
          resolve(row);
      });
  });

  if (!books) {
    const nothing = templates.NOT_FOUND();
    response = templates.HTML(nothing);
      return c.html(response);
  }

  const booklist = templates.SEARCH_BOOK_LIST_VIEW(books);

  const response = templates.HTML(booklist);

  return c.html(response);
});

app.get("/addbook", async (c) => {
    const addbookForm = templates.ADD_BOOK_FORM_VIEW();

    const response = templates.HTML(addbookForm);

    return c.html(response);
});

app.post("/addbook", async (c) => {
    const body = await c.req.parseBody();

    await new Promise((resolve) => {
        db.run(queries.Books.create, body.name, body.author, body.author_alp , body.publisher, body.publisher_alp ,  (err) => {
            resolve();
        });
    });

    return c.redirect(`/allbook`);
});

app.get("/:id", async (c) => {
  const bookId = c.req.param("id");

  const book = await new Promise((resolve) => {
    db.get(queries.Books.findById, bookId, (err, row) => {
        resolve(row);
    });

  });
    const bookInfomation = templates.BOOK_INFOMATION_VIEW(book);
    const response = templates.HTML(bookInfomation);

    return c.html(response);
});

app.use("/static/*", serveStatic({ root: "./" }));

serve(app);

process.stdin.on("data", (data) => {
  if (data.toString().trim() === "q") {
    db.close();
    process.exit();
  }
});
