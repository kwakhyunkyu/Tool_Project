const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const { Boards, UserBoards } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();
// 라우팅 작업하세요!
const findById = async (boardId) => {
  return await Boards.findOne({ where: { boardId }, includes: [{ model: UserBoards }] });
};

// 보드 생성
router.post('/boards', authMiddleware, async (req, res) => {
  const { name, color, description } = req.body;
  const { user } = res.locals;
  console.log();
  try {
    const board = await Boards.create({ name, color, description });
    await UserBoards.create({
      userId: user.userId,
      boardId: board.boardId,
      isAdmin: true,
    });
    res.status(201).json({ message: '보드가 성공적으로 생성되었습니다.' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// 내 보드 전체 조회
router.get('/boards', authMiddleware, async (req, res) => {
  const userId = res.locals.user.userId;
  try {
    const boards = await UserBoards.findAll({
      where: { userId },
      include: [{ model: Boards }],
    });
    // console.log(boards[0].dataValues.Board.dataValues);
    const data = boards.map((board) => board.dataValues.Board.dataValues);
    res.status(200).json({ data });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// 보드 상세 조회
router.get('/boards/:boardId', async (req, res) => {
  const boardId = Number(req.params.boardId);
  try {
    const board = await findById(boardId);
    if (!board) return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });

    return res.status(200).json({ data: board });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 보드 관리
router.get('/boards-admin', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  try {
    const boards = await UserBoards.findAll({
      where: { [Op.and]: [{ userId }, { isAdmin: true }] },
      include: [{ model: Boards }],
    });
    // console.log(boards[0].dataValues.Board.dataValues);
    const data = boards.map((board) => board.dataValues.Board.dataValues);
    res.status(200).json({ data });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// 보드 수정
router.put('/boards/:boardId', authMiddleware, async (req, res) => {
  const boardId = Number(req.params.boardId);
  const { name, color, description } = req.body;
  try {
    const board = await findById(boardId);

    if (!board) return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    const updateResult = await Boards.update({ name, color, description }, { where: { boardId } });
    res.status(200).json({ message: '수정이 완료되었습니다.' });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// 보드 삭제
router.delete('/boards/:boardId', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const boardId = Number(req.params.boardId);
  try {
    const userBoard = await UserBoards.findOne({
      where: { [Op.and]: [{ userId }, { boardId }] },
    });
    // console.log(userBoard.isAdmin);
    if (!userBoard) return res.status(404).json({ message: '해당 게시물이 없습니다.' });

    if (!userBoard.isAdmin) return res.status(401).json({ message: '삭제권한이 없습니다.' });

    await UserBoards.destroy({
      where: {
        [Op.and]: [{ userId }, { boardId }],
      },
    });

    await Boards.destroy({ where: { boardId } });

    res.status(200).json({ message: '삭제가 완료되었습니다.' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// 보드 초대
router.post('/boards/:boardId/invitations/:userId', authMiddleware, async (req, res) => {
  const adminId = res.locals.user.userId;
  const userId = Number(req.params.userId);
  const boardId = Number(req.params.boardId);
  try {
    const userBoard = await UserBoards.findOne({
      where: { [Op.and]: [{ userId: adminId }, { boardId }] },
    });

    if (!userBoard.dataValues.isAdmin)
      return res.status(401).json({ message: '초대할 권한이 없습니다.' });
    const existUserBoard = await UserBoards.findOne({
      where: { [Op.and]: [{ userId }, { boardId }] },
    });

    if (existUserBoard) return res.status(409).json({ message: '이미 초대한 유저입니다.' });
    await UserBoards.create({ boardId, userId, isAdmin: false });

    res.status(201).json({ message: '초대가 완료되었습니다.' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

module.exports = router;
