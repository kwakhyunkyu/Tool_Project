const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index');
});
router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('/signup', (req, res) => {
  return res.render('auth');
});

router.get('/boards/:boardId', (req, res) => {
  return res.render('board');
});

router.get('/cards/:cardId', (req, res) => {
  return res.render('card');
});

router.get('/boards-admin', (req, res) => {
  return res.render('board-admin');
});

router.get('/boards-edit/:boardId', (req, res) => {
  return res.render('board-edit');
});
module.exports = router;
