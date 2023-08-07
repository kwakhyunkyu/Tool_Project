const express = require('express');
const { Comments } = require('../models');
const router = express.Router();
const auth = require('../middlewares/auth-middleware');

// 댓글 작성
router.post('/', auth, (req, res) => {
  const { cardId } = req.params;
  const { comment } = req.body;
  const userId = res.locals.user.userId;
  if (!comment) return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });

  Comments.create({ cardId: cardId, userId: userId, comment: comment });
  res.status(200).json({ message: '댓글이 작성되었습니다.' });
});

// 댓글 수정
router.put('/:commentId', auth, async (req, res) => {
  const commentId = req.params.commentId;
  const comment = req.body.comment;
  const { userId } = res.locals.user;
  const comments = await Comments.findOne({ where: { commentId } });

  if (!comments) return res.status(400).json({ message: '댓글 내용을 입력해 주세요.' });
  if (comments) {
    if (userId !== comments.UserId) {
      return res.status(400).json({ message: '댓글 작성자가 아닙니다.' });
    } else {
      await Comments.update(
        { comment: comment },
        {
          where: {
            commentId: commentId,
          },
        },
      );
      res.status(200).json({ message: '수정이 정상적으로 완료되었습니다.' });
    }
  }
});

// 댓글 삭제
router.delete('/:commentId', auth, async (req, res) => {
  const commentId = req.params.commentId;
  const { userId } = res.locals.user;
  const comments = await Comments.findOne({ where: { commentId } });

  if (!comments)
    return res.status(400).json({ message: '존재하지 않는 댓글은 삭제할 수 없습니다.' });
  if (comments) {
    if (userId !== comments.UserId) {
      return res.status(400).json({ message: '댓글 작성자가 아닙니다.' });
    } else {
      await Comments.destroy({
        where: {
          commentId: commentId,
        },
      });
      res.status(200).json({ message: '댓글이 정상적으로 삭제되었습니다.' });
    }
  }
});

// 댓글 조회
router.get('/comment/:card_id', async (req, res) => {
  const cardId = req.params.card_id;

  try {
    const comments = await Comments.findAll({ where: { CardId: cardId } });

    if (comments.length === 0) {
      return res.status(404).json({ message: '해당 카드에 댓글이 없습니다.' });
    }

    const commentList = comments.map((comment) => ({
      commentId: comment.id,
      comment: comment.comment,
      userId: comment.UserId,
    }));

    res.status(200).json({ comments: commentList });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: '서버 오류로 댓글을 불러올 수 없습니다.' });
  }
});

module.exports = router;
