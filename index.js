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

    db.run(queries.Users.create, 'りんご太郎', 'apple@example.com', '2022-08-15 00:00:00');
    db.run(queries.Users.create, 'みかん次郎', 'mikan@example.com', '2022-08-15 00:00:01');
    db.run(queries.Users.create, 'ぶどう三郎', 'budo@example.com', '2022-08-15 00:00:02');

    db.run(queries.Tweets.create, 'あけおめ！', 3, '2023-01-01 00:00:00');
    db.run(queries.Tweets.create, '今年もよろしくお願いします！', 2, '2023-01-01 00:00:01');
    db.run(queries.Tweets.create, '今年こそは痩せるぞ！', 1, '2023-01-01 00:00:02');
});

const app = new Hono();

//以下localhost:3000に訪れたときのやつ
app.get("/", async (c) => {
    //tweetsという変数の中にTweets.findAllでツイートを代入
  //const tweets = await new Promise((resolve) => {
  //    db.all(queries.Tweets.findAll, (err, rows) => {
  //        resolve(rows);
  //    });
  //  });
    //TWEET_LISTでtweetsに代入したツイートを表示する変数をtweetListにした
  //const tweetList = templates.TWEET_LIST_VIEW(tweets);
  //responseが呼び出されたときHTMLのボディにtweetListを入れてやる
  //const response = templates.HTML(tweetList);

  //function_view にFUNCTION_VIEWを入れる
 const function_view = templates.FUNCTION_VIEW();
 //response でHTMLのbodyにfunction_viewを入れる
 const response = templates.HTML(function_view);
 
  //()の中の指示を呼び出す。
  return c.html(response);
});


app.get("/user/register", async (c) => {
    const registerForm = templates.USER_REGISTER_FORM_VIEW();

    const response = templates.HTML(registerForm);

    return c.html(response);
});

app.post("/user/register", async (c) => {
    const body = await c.req.parseBody();
    const now = new Date().toISOString();

    const userID = await new Promise((resolve) => {
        db.run(queries.Users.create, body.name, body.email, now, (err) => {
            resolve(this.lastID);
        });
    });

    return c.redirect(`/user/${userID}`);
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
