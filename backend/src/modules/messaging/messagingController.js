const db = require('../config/database');

const createConversation = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { participantIds, isGroup, name } = req.body;

    const conversationResult = await db.query(
      'INSERT INTO conversations (created_by, is_group, name) VALUES ($1, $2, $3) RETURNING *',
      [userId, isGroup || false, name]
    );

    const conversation = conversationResult.rows[0];

    const allParticipants = [userId, ...participantIds];
    
    for (const participantId of allParticipants) {
      await db.query(
        'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
        [conversation.id, participantId]
      );
    }

    res.status(201).json({ message: 'Conversation created successfully', conversation });
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT DISTINCT c.*, 
              (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
              (SELECT COUNT(*) FROM messages m 
               JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
               WHERE m.conversation_id = c.id AND cp.user_id = $1 AND m.is_read = false AND m.sender_id != $1) as unread_count
       FROM conversations c
       JOIN conversation_participants cp ON c.id = cp.conversation_id
       WHERE cp.user_id = $1
       ORDER BY last_message_time DESC NULLS LAST`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { conversationId } = req.params;
    const { content, attachmentUrl } = req.body;

    const participantCheck = await db.query(
      'SELECT id FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId]
    );

    if (participantCheck.rows.length === 0) {
      return res.status(403).json({ error: 'You are not a participant in this conversation' });
    }

    const messageResult = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, content, attachment_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [conversationId, userId, content, attachmentUrl]
    );

    await db.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversationId]
    );

    res.status(201).json({ message: 'Message sent successfully', data: messageResult.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const participantCheck = await db.query(
      'SELECT id FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId]
    );

    if (participantCheck.rows.length === 0) {
      return res.status(403).json({ error: 'You are not a participant in this conversation' });
    }

    const result = await db.query(
      `SELECT m.*, u.email as sender_email
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [conversationId, limit, offset]
    );

    await db.query(
      'UPDATE messages SET is_read = true WHERE conversation_id = $1 AND sender_id != $2',
      [conversationId, userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { conversationId } = req.params;

    await db.query(
      'UPDATE conversation_participants SET last_read_at = CURRENT_TIMESTAMP WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId]
    );

    res.json({ message: 'Conversation marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
  markAsRead,
};
