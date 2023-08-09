const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users.route.js');
const authRouter = require('./routes/auth.route.js');
const boardsRouter = require('./routes/boards.route.js');
const cardsRouter = require('./routes/cards.route.js');
const columnsRouter = require('./routes/columns.route.js');
const commentsRouter = require('./routes/comments.route.js');
const viewRouter = require('./views/router/index.js');
const app = express();

const PORT = 3000;
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));
app.use('/', viewRouter);

app.use('/api', [
  usersRouter,
  authRouter,
  boardsRouter,
  cardsRouter,
  columnsRouter,
  commentsRouter,
]);
app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
