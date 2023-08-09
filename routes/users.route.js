const express = require('express');
const { Users } = require('../models');
const router = express.Router();
const middleware = require('../middlewares/auth-middleware');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
// 라우팅 작업하세요!
// 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const isExitstUser = await Users.findOne({ where: { email } });
    //이미 db에 이메일이 있다면
    if (isExitstUser) {
      res.status(409).json({ message: '이미 존제하는 이메일입니다.' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }

  // 유저 & 유저정보 생성
  try {
    // 사용자 테이블에 데이터 삽입
    await Users.create({ email, password, name });
    // 사용자 정보 테이블에 데이터를 삽입
    res.status(201).json({ message: '회원가입이 완료되었습니다' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({
        message: 'check email or password',
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: 'check email or password',
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        message: 'check email or password',
      });
    }
    const token = await jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);
    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ token });
  } catch {
    res.status(500).json({ message: 'login server error.' });
  }
});
// 삭제
router.delete('/userInfo', middleware, async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const userFind = await Users.findOne({ where: userId });
    if (!userFind) {
      res.status(400).json({ message: '회원이 조회되지 않습니다.' });
    }
    await Users.destroy({
      where: {
        [Op.and]: [{ userId: userId }],
      },
    });
    res.status(200).json({ message: '삭제가 완료되었습니다.' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'server error.' });
  }
});
//수정
router.put('/signup_update', middleware, async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const { email, password, name } = req.body;

    const userUpdateFind = await Users.findOne({ where: { userId } });
    if (!userUpdateFind) {
      return res.status(404).json({ message: '유저가 존재하지 않습니다.' });
    } else if (userUpdateFind.userId !== userId) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }

    await Users.update(
      { email, name, password },
      {
        where: {
          [Op.and]: [{ userId: userId }],
        },
      },
    );
    res.status(200).json({ message: '유저 정보를 수정합니다.' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'server error.' });
  }
});

// 회원가입 끝
module.exports = router;
