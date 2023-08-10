const authMiddleware = require('../middlewares/auth-middleware');
const express = require('express');
const { Columns, UserBoards, sequelize } = require('../models');
const { Transaction, Op } = require('sequelize');
const router = express.Router();

// 라우팅 작업하세요!
// 컬럼 조회
router.get('/:board_id/column', async (req, res) => {
  try {
    const { board_id } = req.params;
    // 순번이 빠른 순서대로 가져오기
    const columns = await Columns.findAll({ 
      where: { boardId: board_id }, 
      attributes: ['columnId', 'boardId', 'name', 'order'], 
      order: [['order', 'ASC']],
    });
    return res.status(200).json({ datas: columns });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// 컬럼생성 (관리자만 생성 가능)
router.post('/:board_id/column', authMiddleware, async (req, res) => {
  const user = res.locals.user;
  const { board_id } = req.params;
  const { name } = req.body;
  try {
    const maxOrder = await Columns.max('order', { where: { boardId: board_id } });
    // 유저보드에 있는 유저의 정보를 가져오기
    const userBoard = await UserBoards.findOne({
      where: { userId: user.userId, boardId: board_id },
    });
    if (!userBoard) return res.status(401).json({ message: '해당 보드를 찾지 못했습니다.' });

    // 관리자인지 확인
    if (userBoard.isAdmin === false)
      return res.status(400).json({ message: '컬럼생성은 관리자만 가능합니다.' });

    const column = await Columns.create({
      boardId: board_id,
      name,
      order: maxOrder !== null ? maxOrder + 1 : 1,
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
  const regex= /^[0-9]/g
  const t = await sequelize.transaction({
    islationLeval: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 격리수준을 READ_COMMITTED로 설정
  });
  const { board_id, column_id } = req.params;
  const { order } = req.body;

  // 변경하고 싶은 순서
  try {
    // 해당 컬럼의 정보를 가져오기
    const columnInfo = await Columns.findOne({ where: { columnId: column_id, boardId: board_id } });
    if (!columnInfo) return res.status(412).json({ message: '해당 컬럼을 찾지 못했습니다.' });
    if(regex.test(order) === false) {
      return res.status(412).json({message: "숫자만 입력해 주세요"})
    }
    // 현재의 순번보다 변경하려는 순번값이 높은지 낮은지 먼저 확인한다.
    if (columnInfo.order > order) {
      // 순번을 앞으로 할때
      // 변경순번이상 현재순번 미만의 컬럼의 모든 정보를 가져오기
      const columns = await Columns.findAll({
        // Op.gte = 이상 Op.lt = 미만
        where: { boardId: board_id, order: { [Op.gte]: order, [Op.lt]: columnInfo.order } },
      });
      for (let idx = 0; idx < columns.length; idx++) {
        // 근데 만약 바로 다음의 숫자가 적힌 order가 아니면 거기서 return
        // 바꾸려는 컬럼보다 순번이 빠른 컬럼들의 order에 1씩 추가 하여 order를 업데이트
        await Columns.update(
          { order: columns[idx].order + 1 },
          { where: { columnId: columns[idx].columnId } },
          { transaction: t },
        );
      }
    } else if (columnInfo.order < order) {
      // 순번을 뒤로 할때
      // 바꾸려는 순번이하 현재의 순번초과의 컬럼들을 불러온다
      const columns = await Columns.findAll({
        // Op.lt = 미만
        where: { boardId: board_id, order: { [Op.gt]: columnInfo.order, [Op.lte]: order } },
      });
      for (let idx = 0; idx < columns.length; idx++) {
        // 근데 만약 바로 다음의 숫자가 적힌 order가 아니면 거기서 return
        // 바꾸려는 컬럼보다 순번이 빠른 컬럼들의 order에 1씩 추가 하여 order를 업데이트
        await Columns.update(
          { order: columns[idx].order - 1 },
          { where: { columnId: columns[idx].columnId } },
          { transaction: t },
        );
      }
    } else if (columnInfo.order === order) {
      return res.status(412).json({ message: '현재 순번입니다.' });
    }
    // 해당 컬럼보다 순번이 빨랐던 컬럼들이 1씩 밀리면
    // 해당 컬럼의 order를 수정
    await Columns.update({ order: order }, { where: { columnId: column_id } }, { transaction: t });
    // 모든 로직이 완료된 경우
    await t.commit();
    return res.status(200).json({ message: '컬럼의 순번이 변경되었습니다.' });
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ message: error });
  }
});

// 컬럼 삭제
router.delete('/:board_id/column/:column_id', authMiddleware, async (req, res) => {
  const t = await sequelize.transaction({
    islationLeval: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 격리수준을 READ_COMMITTED로 설정
  });
  const user = res.locals.user;
  const { board_id, column_id } = req.params;
  try {
    // 컬럼의 정보를 가져오기
    const columnInfo = await Columns.findOne({ where: { columnId: column_id } });
    if (!columnInfo) return res.status(412).json({ message: '해당 컬럼을 찾지 못했습니다.' });
    // 유저보드에 있는 유저의 정보를 가져오기
    const userBoard = await UserBoards.findOne({
      where: { userId: user.userId, boardId: board_id },
    });
    // 가져온 유저가 관리자인지 확인한다.
    if (userBoard.isAdmin === false)
      return res.status(403).json({ message: '삭제권한이 없습니다.' });

    // 삭제하려는 컬럼의 순번이 초과인 컬럼들을 가져오기
    const columns = await Columns.findAll({
      // Op.gte = 이상 Op.lt = 미만
      where: { boardId: board_id, order: { [Op.gt]: columnInfo.order } },
    });
    for (let idx = 0; idx < columns.length; idx++) {
      // 근데 만약 바로 다음의 숫자가 적힌 order가 아니면 거기서 return
      // 바꾸려는 컬럼보다 순번이 빠른 컬럼들의 order에 1씩 추가 하여 order를 업데이트
      await Columns.update(
        { order: columns[idx].order - 1 },
        { where: { columnId: columns[idx].columnId } },
        { transaction: t },
      );
    }
    await Columns.destroy(
      {
        where: { columnId: column_id, boardId: board_id },
      },
      { transaction: t },
    );
    await t.commit();
    return res.status(200).json({ message: '해당 컬럼이 삭제되었습니다.' });
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
