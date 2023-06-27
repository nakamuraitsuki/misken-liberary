const sqlite3 = require("sqlite3").verbose();
const queries = require("./queries");
const templates = require("./templates");
const { serve } = require("@hono/node-server");
const { serveStatic } = require("@hono/node-server/serve-static");
const { Hono } = require("hono");

const db = new sqlite3.Database("database.db");

db.serialize(() => {
    db.run(queries.Tweets.createTable);
    db.run(queries.Users.createTable);
    db.run(queries.Books.createTable);

    db.run(queries.Books.create, '遠回りする雛','米澤穂信','yonezawahonobu', '角川文庫','kadokawabunnko');
});

const app = new Hono();

//以下localhost:3000に訪れたときのやつ
app.get("/", async (c) => {
  //function_view にFUNCTION_VIEWを入れる
 const function_view = templates.FUNCTION_VIEW();
 //response でHTMLのbodyにfunction_viewを入れる
 const response = templates.HTML(function_view);
 
  //()の中の指示を呼び出す。
  return c.html(response);
});
//以下蔵書一覧ページに飛んだ時のやつ
app.get("/allbook",async (c) =>{
    //allbookに蔵書の中身を入れる
    const allbook = await new Promise((resolve) => {
      db.all(queries.Books.findAll, (err, rows) => {
           resolve(rows);
       });
    });
  //ALLBOOL_LIST_VIEWでallbookに代入したツイートを表示する変数をallbooklistにした
  const allbooklist = templates.ALLBOOK_LIST_VIEW(allbook);
  //responseが呼び出されたときHTMLのボディにtweetListを入れてやる
  response = templates.HTML(allbooklist);
  //const response = templates.HTML(tweetList);
  return c.html(response);
});

//authorsearchに訪れたときのやつ
app.get("/authorsearch",async (c) =>{
    const author_search_form = templates.SEARCH_AUTHOR();

    const response = templates.HTML(author_search_form);

    return c.html(response);
});

//publishersearchに訪れたときのやつ
app.get("/publishersearch",async (c) =>{
    const publisher_search_form = templates.SEARCH_PUBLISHER();

    const response = templates.HTML(publisher_search_form);

    return c.html(response);
});

//addbookに訪れたときのやつ
app.get("/addbook", async (c) => {
    const addbookForm = templates.ADD_BOOK_FORM_VIEW();

    const response = templates.HTML(addbookForm);

    return c.html(response);
});

app.post("/addbook", async (c) => {
    const body = await c.req.parseBody();
    const now = new Date().toISOString();

    await new Promise((resolve) => {
        db.run(queries.Books.create, body.name, body.author, body.author_alp , body.publisher, body.publisher_alp , now, (err) => {
            resolve();
        });
    });

    return c.redirect(`/allbook`);
});


app.get("/user/:id", async (c) => {
    const userId = c.req.param("id");

    const user = await new Promise((resolve) => {
        db.get(queries.Users.findById, userId, (err, row) => {
            resolve(row);
        });
    });

    if (!user) {
        return c.notFound();
    }

    const tweets = await new Promise((resolve) => {
        db.all(queries.Tweets.findByUserId, userId, (err, rows) => {
            resolve(rows);
        });
    });

    const userTweetList = templates.USER_TWEET_LIST_VIEW(user, tweets);

    const response = templates.HTML(userTweetList);

    return c.html(response);
});

app.get("/tweet", async (c) => {
    const users = await new Promise((resolve) => {
        db.all(queries.Users.findAll, (err, rows) => {
            resolve(rows);
        });
    });

    const tweetForm = templates.TWEET_FORM_VIEW(users);

    const response = templates.HTML(tweetForm);

    return c.html(response);
});

app.post("/tweet", async (c) => {
    const body = await c.req.parseBody();
    const now = new Date().toISOString();

    await new Promise((resolve) => {
        db.run(queries.Tweets.create, body.content, body.user_id, now, (err) => {
            resolve();
        });
    });

    return c.redirect("/");
});

app.use("/static/*", serveStatic({ root: "./" }));

serve(app);

process.stdin.on("data", (data) => {
  if (data.toString().trim() === "q") {
    db.close();
    process.exit();
  }
});
