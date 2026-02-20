const pool = require('../config/db');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
            [userId]
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
};

// Internal Helper
const createNotification = async (userId, message, type = 'info') => {
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)',
            [userId, message, type]
        );
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
