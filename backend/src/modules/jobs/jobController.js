const db = require('../config/database');

const createJob = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {
      title, description, requirements, responsibilities, benefits,
      location, country, workMode, employmentType, experienceLevel,
      minExperience, maxExperience, salaryMin, salaryMax, currency,
      salaryDisclosed, positionsAvailable, applicationDeadline, skills
    } = req.body;

    const recruiterResult = await db.query(
      'SELECT id, company_id FROM recruiter_profiles WHERE user_id = $1',
      [userId]
    );

    if (recruiterResult.rows.length === 0) {
      return res.status(403).json({ error: 'Only recruiters can post jobs' });
    }

    const { id: recruiterId, company_id: companyId } = recruiterResult.rows[0];

    const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const jobResult = await db.query(
      `INSERT INTO jobs (company_id, recruiter_id, title, slug, description, requirements, 
       responsibilities, benefits, location, country, work_mode, employment_type, 
       experience_level, min_experience, max_experience, salary_min, salary_max, 
       currency, salary_disclosed, positions_available, application_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       RETURNING *`,
      [companyId, recruiterId, title, slug, description, requirements, responsibilities,
       benefits, location, country, workMode, employmentType, experienceLevel,
       minExperience, maxExperience, salaryMin, salaryMax, currency, salaryDisclosed,
       positionsAvailable, applicationDeadline]
    );

    const job = jobResult.rows[0];

    if (skills && skills.length > 0) {
      for (const skillName of skills) {
        let skillResult = await db.query('SELECT id FROM skills WHERE name = $1', [skillName]);
        
        if (skillResult.rows.length === 0) {
          skillResult = await db.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName]);
        }

        await db.query(
          'INSERT INTO job_skills (job_id, skill_id) VALUES ($1, $2)',
          [job.id, skillResult.rows[0].id]
        );
      }
    }

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, location, workMode, employmentType, experienceLevel } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT j.*, c.name as company_name, c.logo_url as company_logo
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'active'
    `;
    const params = [];
    let paramIndex = 1;

    if (location) {
      query += ` AND j.location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (workMode) {
      query += ` AND j.work_mode = $${paramIndex}`;
      params.push(workMode);
      paramIndex++;
    }

    if (employmentType) {
      query += ` AND j.employment_type = $${paramIndex}`;
      params.push(employmentType);
      paramIndex++;
    }

    if (experienceLevel) {
      query += ` AND j.experience_level = $${paramIndex}`;
      params.push(experienceLevel);
      paramIndex++;
    }

    query += ` ORDER BY j.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    const countResult = await db.query('SELECT COUNT(*) FROM jobs WHERE status = $1', ['active']);
    const totalJobs = parseInt(countResult.rows[0].count);

    res.json({
      jobs: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT j.*, c.name as company_name, c.logo_url as company_logo, 
              c.description as company_description, c.website as company_website,
              r.first_name as recruiter_first_name, r.last_name as recruiter_last_name
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       LEFT JOIN recruiter_profiles r ON j.recruiter_id = r.id
       WHERE j.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await db.query('UPDATE jobs SET views_count = views_count + 1 WHERE id = $1', [id]);

    const skillsResult = await db.query(
      `SELECT s.name, s.category, js.is_required
       FROM job_skills js
       JOIN skills s ON js.skill_id = s.id
       WHERE js.job_id = $1`,
      [id]
    );

    const job = { ...result.rows[0], skills: skillsResult.rows };

    res.json(job);
  } catch (error) {
    next(error);
  }
};

const applyToJob = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const profileResult = await db.query(
      'SELECT id FROM candidate_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(403).json({ error: 'Only candidates can apply to jobs' });
    }

    const candidateId = profileResult.rows[0].id;

    const existingApplication = await db.query(
      'SELECT id FROM job_applications WHERE job_id = $1 AND candidate_id = $2',
      [jobId, candidateId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const applicationResult = await db.query(
      `INSERT INTO job_applications (job_id, candidate_id, resume_url, cover_letter)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [jobId, candidateId, resumeUrl, coverLetter]
    );

    await db.query(
      'INSERT INTO application_status_history (application_id, status, changed_by) VALUES ($1, $2, $3)',
      [applicationResult.rows[0].id, 'applied', userId]
    );

    await db.query('UPDATE jobs SET applications_count = applications_count + 1 WHERE id = $1', [jobId]);

    res.status(201).json({ message: 'Application submitted successfully', application: applicationResult.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const profileResult = await db.query(
      'SELECT id FROM candidate_profiles WHERE user_id = $1',
      [userId]
    );

    const candidateId = profileResult.rows[0].id;

    const result = await db.query(
      `SELECT ja.*, j.title as job_title, j.location, j.work_mode, j.employment_type,
              c.name as company_name, c.logo_url as company_logo
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE ja.candidate_id = $1
       ORDER BY ja.applied_at DESC`,
      [candidateId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE jobs SET status = $1, closed_at = CASE WHEN $1 = $2 THEN CURRENT_TIMESTAMP ELSE closed_at END WHERE id = $3 RETURNING *',
      [status, 'closed', id]
    );

    res.json({ message: 'Job status updated successfully', job: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  getApplications,
  updateJobStatus,
};
