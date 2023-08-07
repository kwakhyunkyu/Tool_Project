const express = require('express');
const { Users } = require('../models');
const router = express.Router();
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
// 회원가입 끝
module.exports = router;
