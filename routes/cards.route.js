const express = require('express');
const { Cards } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const router = express.Router();

// 카드 생성
router.post('/card', async (req, res) => {
  try {
    const { columnId, userId, name, content, color, endDate } = req.body;

    const maxOrder = await Cards.max('order', { where: { columnId } });

    const newCard = await Cards.create({
      columnId,
      userId,
      name,
      content,
      color,
      endDate,
      order: maxOrder !== null ? maxOrder + 1 : 0,
    });

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: '카드 생성 중 오류가 발생했습니다.' });
  }
});

// 카드 내용 수정
router.put('/card/:cardId', async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { name, content, color, userId } = req.body;

    await Cards.update({ name, content, color, userId }, { where: { cardId } });

    const updatedCard = await Cards.findByPk(cardId);

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: '카드 수정 중 오류가 발생했습니다.' });
  }
});

// 카드 삭제
router.delete('/card/:cardId', async (req, res) => {
  try {
    const cardId = req.params.cardId;
    await Cards.destroy({ where: { cardId } });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: '카드 삭제 중 오류가 발생했습니다.' });
  }
});

// 카드 위치 수정
router.put('/move/:cardId', async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { columnId, newOrder } = req.body;

    const card = await Cards.findOne({ where: { cardId } });

    if (card.columnId !== columnId) {
      await Cards.update(
        { order: sequelize.literal(`\`order\` + 1`) },
        { where: { columnId, order: { [Op.gte]: newOrder } } },
      );

      await Cards.update({ order: newOrder }, { where: { cardId, columnId } });
    } else {
      if (newOrder < card.order) {
        await Cards.update(
          { order: sequelize.literal(`\`order\` + 1`) },
          {
            where: {
              columnId,
              order: { [Op.gte]: newOrder, [Op.lt]: card.order },
            },
          },
        );
      } else if (newOrder > card.order) {
        await Cards.update(
          { order: sequelize.literal(`\`order\` - 1`) },
          {
            where: {
              columnId,
              order: { [Op.gt]: card.order, [Op.lte]: newOrder },
            },
          },
        );
      }

      await Cards.update({ order: newOrder }, { where: { cardId, columnId } });
    }

    res.status(200).json({ message: '카드가 이동되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '카드 이동 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
