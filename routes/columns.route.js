const authMiddleware = require('../middlewares/auth-middleware');
const express = require('express');
const { Columns, UserBoards } = require('../models');
const router = express.Router();

// 라우팅 작업하세요!
// 컬럼 조회
router.get('/:board_id/column', async (req, res) => {
  try {
    const { board_id } = req.params;
    // 순번이 빠른 순서대로 가져오기
    const columns = await Columns.findAll(
      { attributus: ['columnId, boardId', 'name', 'order'] },
      { where: { boardId: board_id } },
      { order: ['order', 'asc'] },
    );
    return res.status(200).json({ datas: columns });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// 컬럼생성 (관리자만 생성 가능)
router.post('/:board_id/column', authMiddleware, async (req, res) => {
  const user = res.locals.user;
  const { board_id } = req.params;
  const { name, order } = req.body;

  try {
    console.log('name, order = ', user.userId, name, order);
    // 유저보드에 있는 유저의 정보를 가져오기 (보드테이블이 없으므로 주석)
    const userBoard = await UserBoards.findOne({
      where: { userId: user.userId, boardId: board_id },
    });
    if (!userBoard) return res.status(401).json({ message: '해당 보드를 찾지 못했습니다.' });
    // 순사가 겹치는지 확인
    const dupOrder = await Columns.findOne({ where: { order: order, boardId: board_id } });
    if (dupOrder) return res.status(401).json({ message: '순서가 겹치는 컬럼이 있습니다.' });

    // 관리자인지 확인 (보드테이블이 없으므로 주석)
    if (userBoard.isAdmin === false)
      return res.status(400).json({ message: '컬럼생성은 관리자만 가능합니다.' });

    const column = await Columns.create({
      boardId: board_id,
      name,
      order,
    });
    return res.status(201).json({ data: column, message: '새로운 컬럼이 생성되었습니다.' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// 컬럼 이름 수정 (관리자만 수정 가능)
router.put('/:board_id/column/:column_id', authMiddleware, async (req, res) => {
  const user = res.locals.user;
  const { name } = req.body;
  const { board_id, column_id } = req.params;
  try {
    // 유저보드에 있는 유저의 정보를 가져오기 (보드테이블이 없으므로 주석)
    const userBoard = await UserBoards.findOne({
      where: { userId: user.userId, boardId: board_id },
    });

    // 가져온 유저가 관리자인지 확인한다. (보드테이블이 없으므로 주석)
    if (userBoard.isAdmin === false)
      return res.status(403).json({ message: '수정권한이 없습니다.' });

    // 컬럼의 이름을 수정한다.
    await Columns.update(
      { name: name },
      {
        where: { columnId: column_id, boardId: board_id },
      },
    );

    return res.status(200).json({ message: '컬럼 이름이 수정되었습니다.' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// 컬럼 순서변경
router.put('/:board_id/column_order/:column_id', authMiddleware, async (req, res) => {
  const { board_id, column_id } = req.params;
  const { order } = req.body;
  // 변경하고 싶은 순서
  try {
    // 컬럼의 정보를 가져오기
    const columnInfo = await Columns.findOne({ where: { columnId: column_id, boardId: board_id } });
    if (!columnInfo) return res.status(412).json({ message: '해당 컬럼을 찾지 못했습니다.' });

    // 컬럼의 모든 정보를 가져오기
    const columns = await Columns.findAll({ where: { boardId: board_id } });
    for (let idx = 0; idx < columns.length; idx++) {
      console.log('column = ', columns[idx].order);
    }
    // 순번을 바꾸는데
    // 만약 순서를 2번으로 바꾸려고 하면 2번에 있던 애를 3번
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// 컬럼 삭제
router.delete('/:board_id/column/:column_id', authMiddleware, async (req, res) => {
  const user = res.locals.user;
  const { board_id, column_id } = req.params;
  try {
    // 컬럼의 정보를 가져오기
    const columnInfo = await Columns.findOne({ where: { columnId: column_id } });
    if (!columnInfo) return res.status(412).json({ message: '해당 컬럼을 찾지 못했습니다.' });
    // 유저보드에 있는 유저의 정보를 가져오기 (보드유저테이블이 없으므로 주석)
    const userBoard = await UserBoards.findOne({
      where: { userId: user.userId, boardId: board_id },
    });
    // 가져온 유저가 관리자인지 확인한다. (보드유저테이블이 없으므로 주석)
    if (userBoard.isAdmin === false)
      return res.status(403).json({ message: '삭제권한이 없습니다.' });

    await Columns.destroy({
      // where: { columnId: column_id, boardId: board_id }, (보드유저테이블이 없으므로 주석)
      where: { columnId: column_id },
    });

    return res.status(200).json({ message: '해당 컬럼이 삭제되었습니다.' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
