const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { authorization } = req.cookies;
  if (authorization) return res.render('index', { login: 1 });
  return res.redirect('/login');
});
router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('/signup', (req, res) => {
  const { authorization } = req.cookies;
  if (authorization)  return res.render('auth', { login: 1 });
  return res.redirect('/login');
 
});

router.get('/boards/:boardId', (req, res) => {
  const { authorization } = req.cookies;
  if (authorization)   return res.render('board',{ login: 1 });
  return res.redirect('/login');
 
});

router.get('/cards/:cardId', (req, res) => {
  const { authorization } = req.cookies;
  if (authorization)   return res.render('card',{ login: 1 });
  return res.redirect('/login');
 
});

router.get('/boards-admin', (req, res) => {
  const { authorization } = req.cookies;
  if (authorization)   return res.render('board-admin',{ login: 1 });
  return res.redirect('/login');
 
});

router.get('/boards-edit/:boardId', (req, res) => {
  const { authorization } = req.cookies;
  if (authorization)   return res.render('board-edit',{ login: 1 });
  return res.redirect('/login');
 
});

router.get('/user', (req, res) => {
  return res.render('user');
});
module.exports = router;
