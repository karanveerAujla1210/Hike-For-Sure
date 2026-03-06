const db = require('../config/database');

const getDashboardStats = async (req, res, next) => {
  try {
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const candidatesCount = await db.query('SELECT COUNT(*) FROM candidate_profiles');
    const recruitersCount = await db.query('SELECT COUNT(*) FROM recruiter_profiles');
    const companiesCount = await db.query('SELECT COUNT(*) FROM companies');
    const jobsCount = await db.query('SELECT COUNT(*) FROM jobs WHERE status = $1', ['active']);
    const applicationsCount = await db.query('SELECT COUNT(*) FROM job_applications');
    const subscriptionsCount = await db.query('SELECT COUNT(*) FROM subscriptions WHERE status = $1', ['active']);
    const revenueResult = await db.query('SELECT SUM(amount) FROM payments WHERE payment_status = $1', ['completed']);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalCandidates: parseInt(candidatesCount.rows[0].count),
      totalRecruiters: parseInt(recruitersCount.rows[0].count),
      totalCompanies: parseInt(companiesCount.rows[0].count),
      activeJobs: parseInt(jobsCount.rows[0].count),
      totalApplications: parseInt(applicationsCount.rows[0].count),
      activeSubscriptions: parseInt(subscriptionsCount.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].sum || 0),
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, role, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, role, status, email_verified, created_at, last_login FROM users WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING *',
      [status, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT r.*, 
             u1.email as reporter_email,
             u2.email as reported_user_email
      FROM reports r
      LEFT JOIN users u1 ON r.reporter_id = u1.id
      LEFT JOIN users u2 ON r.reported_user_id = u2.id
      WHERE 1=1
    `;

    const params = [];
    if (status) {
      query += ' AND r.status = $1';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const resolveReport = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    const result = await db.query(
      'UPDATE reports SET status = $1, admin_notes = $2, resolved_by = $3, resolved_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [status, adminNotes, userId, reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report resolved successfully', report: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const verifyCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const result = await db.query(
      'UPDATE companies SET verified = true WHERE id = $1 RETURNING *',
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company verified successfully', company: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getReports,
  resolveReport,
  verifyCompany,
};
