class Message {
  constructor(db) {
    this.db = db;
  }

  async create(senderId, receiverId, content) {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [senderId, receiverId, content];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getConversation(userId1, userId2) {
    const query = `
      SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2)
      OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at DESC
    `;
    const result = await this.db.query(query, [userId1, userId2]);
    return result.rows;
  }
}

module.exports = Message; 