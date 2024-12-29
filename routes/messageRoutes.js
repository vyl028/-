const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 获取与特定用户的对话
router.get('/messages/:userId', async (req, res) => {
  try {
    const messages = await Message.getConversation(
      req.user.id,  // 当前登录用户
      req.params.userId  // 对话对象
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: '获取消息失败' });
  }
});

// 发送新消息
router.post('/messages', async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create(
      req.user.id,
      receiverId,
      content
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: '发送消息失败' });
  }
});

module.exports = router; 