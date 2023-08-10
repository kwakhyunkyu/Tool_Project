const express = require('express');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();
// 라우팅 작업하세요!

// 회원가입 API
router.post('/users', async (req, res) => {
  const { email, password, confirmPassword, name } = req.body;
  console.log(email);
  const isExistUser = await Users.findOne({
    where: {
      email: email,
    },
  });

  if (!email || !password || !confirmPassword) {
    res.status(400).json({
      errorMessage: '공백이 없도록 입력하세요.',
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
    });
    return;
  }

  // email 동일한 유저가 실제로 존재할 때, 에러발생
  if (isExistUser) {
    res.status(409).json({
      message: '중복된 닉네임입니다.',
    });
    return;
  }

  await Users.create({ email, password, name });

  return res.status(201).json({
    message: '회원가입이 완료되었습니다.',
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 유저 찾기
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      //유저가 없다면 에러반환
      res.status(401).json({ message: '해당하는 사용자가 존재하지 않습니다.' });
      return;
    } else if (user.password !== password) {
      // 패스워드가 틀리다면 에러반환
      res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      return;
    }
    console.log('process.env.SECRET_KEY = ', process.env.SECRET_KEY);
    // JWT 발급
    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.SECRET_KEY, // env넣기
    );

    // 쿠키를 발급
    res.cookie('authorization', `Bearer ${token}`);

    // response 할당
    res.status(200).json({ message: '로그인에 성공하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
// 로그인 끝

// 로그아웃
router.post('/logout', (req, res) => {
  res.cookie('authorization','');
 return res.status(200).json({message: '로그아웃 완료'})
})
module.exports = router;
