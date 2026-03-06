const db = require('../config/database');

const getPlans = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT p.*, 
              json_agg(json_build_object('feature_name', pf.feature_name, 'feature_value', pf.feature_value)) as features
       FROM plans p
       LEFT JOIN plan_features pf ON p.id = pf.plan_id
       WHERE p.is_active = true
       GROUP BY p.id
       ORDER BY p.price ASC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { planId, billingCycle } = req.body;

    const planResult = await db.query('SELECT * FROM plans WHERE id = $1 AND is_active = true', [planId]);

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResult.rows[0];

    const startDate = new Date();
    const endDate = new Date();

    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscriptionResult = await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, planId, startDate, endDate, 'active']
    );

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: subscriptionResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { subscriptionId, amount, currency, paymentMethod, transactionId, paymentGateway } = req.body;

    const paymentResult = await db.query(
      `INSERT INTO payments (user_id, subscription_id, amount, currency, payment_method, transaction_id, payment_gateway, payment_status, payment_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) RETURNING *`,
      [userId, subscriptionId, amount, currency, paymentMethod, transactionId, paymentGateway, 'completed']
    );

    const payment = paymentResult.rows[0];

    const invoiceNumber = `INV-${Date.now()}-${userId.substring(0, 8)}`;
    await db.query(
      'INSERT INTO invoices (payment_id, invoice_number) VALUES ($1, $2)',
      [payment.id, invoiceNumber]
    );

    res.status(201).json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    next(error);
  }
};

const getSubscription = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT s.*, p.name as plan_name, p.plan_type, p.price, p.billing_cycle
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { subscriptionId } = req.params;

    const result = await db.query(
      'UPDATE subscriptions SET status = $1, auto_renew = false WHERE id = $2 AND user_id = $3 RETURNING *',
      ['cancelled', subscriptionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription cancelled successfully', subscription: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT p.*, i.invoice_number, i.invoice_url, s.plan_id
       FROM payments p
       LEFT JOIN invoices i ON p.id = i.payment_id
       LEFT JOIN subscriptions s ON p.subscription_id = s.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlans,
  subscribe,
  createPayment,
  getSubscription,
  cancelSubscription,
  getPaymentHistory,
};
