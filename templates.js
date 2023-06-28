//根幹のhtml雛型
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
//スタートページのみてくれ
const FUNCTION_VIEW = () =>`
<h1 class="func">ミス研ライブラリー</h1>
<hr/>
<h2 class="func">機能一覧</h2>
<div class="func"><button  type="button" onclick="location.href='/authorsearch'">著者名検索</button></div>
<div class="func"><button  type="button" onclick="location.href='/publishersearch'">出版社から検索</button></div>
<div class="func"><button  type="button" onclick="location.href='/allbook'">蔵書一覧</button></div>
<div class="func"><button  type="button" onclick="location.href='/addbook'">本を追加</button></div>
`;
//著者名検索画面
const SEARCH_AUTHOR = () =>`
<h1 class="title">作者から検索</h1>
<form action="/authorsearch" method="POST">
    <label for="content">作者（アルファベット）</label>
    <textarea name="author" id="author" rows="0"></textarea>
    <div class="func"><button type="submit">検索</button></div>
</form>
<p><a href="../">＞戻る</a></p>
`;
//著者の蔵書一覧
const SEARCH_BOOK_LIST_VIEW = (books) => `
<h1 class="func">以下の本が見つかりました</h1>
<p><a href="../">＞戻る</a></p>
<hr/>
<div class="tweet-list">
    ${books
      .map((book) => `<div class="list">${book.name}/${book.author}/${book.publisher}</div>`)
      .join("\n")}
</div>
`;
//文庫名検索画面
const SEARCH_PUBLISHER = () =>`
<h1 class="title">出版文庫から検索</h1>
<form action="/publishersearch" method="POST">
    <label for="content">文庫（アルファベット）</label>
    <textarea name="publisher" id="publisher" rows="0"></textarea>
    <div class="func"><button type="submit">検索</button></div>
</form>
<p><a href="../">＞戻る</a></p>
`;
//蔵書一覧ページみてくれ
const ALLBOOK_LIST_VIEW = (books) => `
<h1 class="title">蔵書一覧</h1>
<p><a href="../">＞戻る</a></p>
<div class="tweet-list">
    ${books
      .map((book) => `<div class="list">${book.name}/${book.author}/${book.publisher}</div>`)
      .join("\n")}
</div>
`;
//検索に引っかからなかった時
const NOT_FOUND = () => `
<h1 class="notfound">該当蔵書なし</h1>
<p class="notfound"><a href="../">＞戻る</a></p>
`
//蔵書追加ページフォーム
const ADD_BOOK_FORM_VIEW = () => `
<h1 class="title">蔵書を追加</h1>
<p><a href="../">＞戻る</a></p>
<form action="/addbook" method="POST">
    <label for="name">本の名前</label>
    <input type="text" name="name" id="name" />
    <label for="name">著者名</label>
    <input type="text" name="author" id="author" />
    <label for="name">著者名アルファベットフリガナ</label>
    <input type="text" name="author_alp" id="author_alp" />
    <label for="name">出版文庫</label>
    <input type="text" name="publisher" id="publisher" />
    <label for="name">出版文庫アルファベットフリガナ</label>
    <input type="text" name="publisher_alp" id="publisher_alp" />
    <div class="func"><button type="submit">追加</button></div>
</form>
`;

module.exports = {
    HTML,
    FUNCTION_VIEW,
    SEARCH_AUTHOR,
    SEARCH_BOOK_LIST_VIEW,
    SEARCH_PUBLISHER,
    NOT_FOUND,
    ALLBOOK_LIST_VIEW,
    ADD_BOOK_FORM_VIEW,
};
