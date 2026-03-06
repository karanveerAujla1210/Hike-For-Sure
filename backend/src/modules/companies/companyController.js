const db = require('../config/database');

const createCompany = async (req, res, next) => {
  try {
    const { name, description, website, industry, companySize, foundedYear, headquarters, specialties } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const result = await db.query(
      `INSERT INTO companies (name, slug, description, website, industry, company_size, founded_year, headquarters, specialties)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, slug, description, website, industry, companySize, foundedYear, headquarters, specialties]
    );

    res.status(201).json({ message: 'Company created successfully', company: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await db.query('SELECT * FROM companies WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = result.rows[0];

    const jobsResult = await db.query(
      'SELECT COUNT(*) FROM jobs WHERE company_id = $1 AND status = $2',
      [company.id, 'active']
    );
    company.active_jobs_count = parseInt(jobsResult.rows[0].count);

    res.json(company);
  } catch (error) {
    next(error);
  }
};

const followCompany = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { companyId } = req.params;

    const existingFollow = await db.query(
      'SELECT id FROM company_followers WHERE company_id = $1 AND user_id = $2',
      [companyId, userId]
    );

    if (existingFollow.rows.length > 0) {
      return res.status(400).json({ error: 'Already following this company' });
    }

    await db.query(
      'INSERT INTO company_followers (company_id, user_id) VALUES ($1, $2)',
      [companyId, userId]
    );

    await db.query(
      'UPDATE companies SET follower_count = follower_count + 1 WHERE id = $1',
      [companyId]
    );

    res.json({ message: 'Company followed successfully' });
  } catch (error) {
    next(error);
  }
};

const unfollowCompany = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { companyId } = req.params;

    const result = await db.query(
      'DELETE FROM company_followers WHERE company_id = $1 AND user_id = $2 RETURNING *',
      [companyId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not following this company' });
    }

    await db.query(
      'UPDATE companies SET follower_count = follower_count - 1 WHERE id = $1',
      [companyId]
    );

    res.json({ message: 'Company unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

const getCompanyJobs = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT j.*, c.name as company_name, c.logo_url as company_logo
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.company_id = $1 AND j.status = 'active'
       ORDER BY j.created_at DESC
       LIMIT $2 OFFSET $3`,
      [companyId, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompany,
  followCompany,
  unfollowCompany,
  getCompanyJobs,
};
