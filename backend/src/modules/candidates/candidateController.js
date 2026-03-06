const db = require('../config/database');

const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT cp.*, u.email, u.phone 
       FROM candidate_profiles cp 
       JOIN users u ON cp.user_id = u.id 
       WHERE cp.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {
      firstName, lastName, headline, bio, location, country,
      openToWork, preferredWorkMode, preferredEmploymentType,
      expectedSalaryMin, expectedSalaryMax, yearsOfExperience,
      linkedinUrl, githubUrl, portfolioUrl
    } = req.body;

    const result = await db.query(
      `UPDATE candidate_profiles 
       SET first_name = $1, last_name = $2, headline = $3, bio = $4, 
           location = $5, country = $6, open_to_work = $7, 
           preferred_work_mode = $8, preferred_employment_type = $9,
           expected_salary_min = $10, expected_salary_max = $11,
           years_of_experience = $12, linkedin_url = $13, 
           github_url = $14, portfolio_url = $15
       WHERE user_id = $16 
       RETURNING *`,
      [firstName, lastName, headline, bio, location, country, openToWork,
       preferredWorkMode, preferredEmploymentType, expectedSalaryMin,
       expectedSalaryMax, yearsOfExperience, linkedinUrl, githubUrl,
       portfolioUrl, userId]
    );

    res.json({ message: 'Profile updated successfully', profile: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const addSkill = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { skillName, proficiencyLevel, yearsOfExperience } = req.body;

    const profileResult = await db.query(
      'SELECT id FROM candidate_profiles WHERE user_id = $1',
      [userId]
    );
    const candidateId = profileResult.rows[0].id;

    let skillResult = await db.query('SELECT id FROM skills WHERE name = $1', [skillName]);
    
    if (skillResult.rows.length === 0) {
      skillResult = await db.query(
        'INSERT INTO skills (name) VALUES ($1) RETURNING id',
        [skillName]
      );
    }

    const skillId = skillResult.rows[0].id;

    const result = await db.query(
      `INSERT INTO candidate_skills (candidate_id, skill_id, proficiency_level, years_of_experience)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [candidateId, skillId, proficiencyLevel, yearsOfExperience]
    );

    res.status(201).json({ message: 'Skill added successfully', skill: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const addWorkExperience = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { companyName, jobTitle, employmentType, location, isCurrent, startDate, endDate, description } = req.body;

    const profileResult = await db.query(
      'SELECT id FROM candidate_profiles WHERE user_id = $1',
      [userId]
    );
    const candidateId = profileResult.rows[0].id;

    const result = await db.query(
      `INSERT INTO work_experiences (candidate_id, company_name, job_title, employment_type, location, is_current, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [candidateId, companyName, jobTitle, employmentType, location, isCurrent, startDate, endDate, description]
    );

    res.status(201).json({ message: 'Work experience added successfully', experience: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const addEducation = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { institutionName, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;

    const profileResult = await db.query(
      'SELECT id FROM candidate_profiles WHERE user_id = $1',
      [userId]
    );
    const candidateId = profileResult.rows[0].id;

    const result = await db.query(
      `INSERT INTO education (candidate_id, institution_name, degree, field_of_study, start_date, end_date, grade, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [candidateId, institutionName, degree, fieldOfStudy, startDate, endDate, grade, description]
    );

    res.status(201).json({ message: 'Education added successfully', education: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getSkills = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT cs.*, s.name as skill_name, s.category 
       FROM candidate_skills cs
       JOIN skills s ON cs.skill_id = s.id
       JOIN candidate_profiles cp ON cs.candidate_id = cp.id
       WHERE cp.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addSkill,
  addWorkExperience,
  addEducation,
  getSkills,
};
