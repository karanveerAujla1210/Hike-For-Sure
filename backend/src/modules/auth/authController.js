const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const signup = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName, companyId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );

    const user = userResult.rows[0];

    if (role === 'candidate') {
      await db.query(
        'INSERT INTO candidate_profiles (user_id, first_name, last_name) VALUES ($1, $2, $3)',
        [user.id, firstName, lastName]
      );
    } else if (role === 'recruiter') {
      await db.query(
        'INSERT INTO recruiter_profiles (user_id, first_name, last_name, company_id) VALUES ($1, $2, $3, $4)',
        [user.id, firstName, lastName, companyId]
      );
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      'SELECT id, email, password_hash, role, status FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const generateOTP = async (req, res, next) => {
  try {
    const { userId, otpType } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await db.query(
      'INSERT INTO otp_verifications (user_id, otp_code, otp_type, expires_at) VALUES ($1, $2, $3, $4)',
      [userId, otp, otpType, expiresAt]
    );

    res.json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp, otpType } = req.body;

    const result = await db.query(
      'SELECT * FROM otp_verifications WHERE user_id = $1 AND otp_code = $2 AND otp_type = $3 AND verified = false AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1',
      [userId, otp, otpType]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await db.query(
      'UPDATE otp_verifications SET verified = true WHERE id = $1',
      [result.rows[0].id]
    );

    if (otpType === 'email') {
      await db.query('UPDATE users SET email_verified = true WHERE id = $1', [userId]);
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, generateOTP, verifyOTP, logout };
