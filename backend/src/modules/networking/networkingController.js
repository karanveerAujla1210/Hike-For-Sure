const db = require('../config/database');

const sendConnectionRequest = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { receiverId, message } = req.body;

    if (userId === receiverId) {
      return res.status(400).json({ error: 'Cannot send connection request to yourself' });
    }

    const existingConnection = await db.query(
      'SELECT * FROM connections WHERE (requester_id = $1 AND receiver_id = $2) OR (requester_id = $2 AND receiver_id = $1)',
      [userId, receiverId]
    );

    if (existingConnection.rows.length > 0) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }

    const result = await db.query(
      'INSERT INTO connections (requester_id, receiver_id, message, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, receiverId, message, 'pending']
    );

    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, $2, $3, $4, $5)`,
      [receiverId, 'connection_request', 'New Connection Request', 'Someone wants to connect with you', `/profile/${userId}`]
    );

    res.status(201).json({ message: 'Connection request sent successfully', connection: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const acceptConnectionRequest = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { connectionId } = req.params;

    const result = await db.query(
      'UPDATE connections SET status = $1, connected_at = CURRENT_TIMESTAMP WHERE id = $2 AND receiver_id = $3 RETURNING *',
      ['accepted', connectionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    const connection = result.rows[0];

    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, $2, $3, $4, $5)`,
      [connection.requester_id, 'connection_accepted', 'Connection Accepted', 'Your connection request was accepted', `/profile/${userId}`]
    );

    res.json({ message: 'Connection request accepted', connection });
  } catch (error) {
    next(error);
  }
};

const rejectConnectionRequest = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { connectionId } = req.params;

    const result = await db.query(
      'DELETE FROM connections WHERE id = $1 AND receiver_id = $2 RETURNING *',
      [connectionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    res.json({ message: 'Connection request rejected' });
  } catch (error) {
    next(error);
  }
};

const getConnections = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT c.*, 
              CASE 
                WHEN c.requester_id = $1 THEN u2.email
                ELSE u1.email
              END as connection_email,
              CASE 
                WHEN c.requester_id = $1 THEN u2.id
                ELSE u1.id
              END as connection_user_id
       FROM connections c
       JOIN users u1 ON c.requester_id = u1.id
       JOIN users u2 ON c.receiver_id = u2.id
       WHERE (c.requester_id = $1 OR c.receiver_id = $1) AND c.status = 'accepted'
       ORDER BY c.connected_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getPendingRequests = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT c.*, u.email as requester_email, u.id as requester_user_id
       FROM connections c
       JOIN users u ON c.requester_id = u.id
       WHERE c.receiver_id = $1 AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnections,
  getPendingRequests,
};
