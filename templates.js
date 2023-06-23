const HTML = (body) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ミス研ライブラリー</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
    ${body}
</body>
</html>
`;



const USER_REGISTER_FORM_VIEW = () => `
<h1 class="title">ユーザー登録</h1>
<form action="/user/register" method="POST">
    <label for="name">名前</label>
    <input type="text" name="name" id="name" />
    <label for="email">メールアドレス</label>
    <input type="email" name="email" id="email" />
    <button type="submit">登録</button>
</form>
`;

const USER_TWEET_LIST_VIEW = (user, tweets) => `
<h1 class="title">${user.name}さんのツイート一覧</h1>
<div class="tweet-list">
    ${tweets
      .map((tweet) => `<div class="tweet">${tweet.content}</div>`)
      .join("\n")}
</div>
`;

const TWEET_FORM_VIEW = (users) => `
<h1 class="title">ツイート</h1>
<form action="/tweet" method="POST">
    <label for="content">内容</label>
    <textarea name="content" id="content" rows="10"></textarea>
    <label for="user_id">ユーザー</label>
    <select name="user_id" id="user_id">
        ${users
          .map((user) => `<option value="${user.id}">${user.name}</option>`)
          .join("\n")}
    </select>
    <button type="submit">投稿</button>
</form>
`;

const FUNCTION_VIEW = () =>`
<h1 class="func">ミス研ライブラリー</h1>
<hr/>
<h2 class="func">機能一覧</h2>
<h2 class="func"><a href="/authorsearch">作者から検索</a></h2>
<h2 class="func"><a href="/publishersearch">出版社から検索</a></h2>
<h2 class="func"><a href="/allbook">蔵書一覧</a><h2>
<h2 class="func"><a href="/addbook">本を追加</a></h2>
`;

const SEARCH_AUTHOR = () =>`
<h1 class="title">作者から検索</h1>
    <label for="content">作者</label>
    <textarea name="author" id="author" rows="1"></textarea>
    <button type="submit">検索</button>
</form>
<p><a href="../">＞戻る</a></p>
`;

const ALLBOOK_LIST_VIEW = (books) => `
<h1 class="title">蔵書一覧</h1>
<p><a href="../">＞戻る</a></p>
<div class="tweet-list">
    ${books
      .map((book) => `<div class="tweet">${book.name}/${book.author}/${book.publisher}</div>`)
      .join("\n")}
</div>
`;

module.exports = {
    HTML,
    USER_REGISTER_FORM_VIEW,
    USER_TWEET_LIST_VIEW,
    TWEET_FORM_VIEW,
    FUNCTION_VIEW,
    SEARCH_AUTHOR,
    ALLBOOK_LIST_VIEW,
};
