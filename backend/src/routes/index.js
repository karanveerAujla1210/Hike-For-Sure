const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

const authController = require('../modules/auth/authController');
const candidateController = require('../modules/candidates/candidateController');
const jobController = require('../modules/jobs/jobController');
const messagingController = require('../modules/messaging/messagingController');
const subscriptionController = require('../modules/subscriptions/subscriptionController');
const networkingController = require('../modules/networking/networkingController');
const notificationController = require('../modules/notifications/notificationController');
const companyController = require('../modules/companies/companyController');
const adminController = require('../modules/admin/adminController');

// =====================================================
// AUTH ROUTES
// =====================================================
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/otp/generate', authController.generateOTP);
router.post('/auth/otp/verify', authController.verifyOTP);
router.post('/auth/logout', authenticate, authController.logout);

// =====================================================
// CANDIDATE ROUTES
// =====================================================
router.get('/candidates/profile', authenticate, authorize('candidate'), candidateController.getProfile);
router.put('/candidates/profile', authenticate, authorize('candidate'), candidateController.updateProfile);
router.post('/candidates/skills', authenticate, authorize('candidate'), candidateController.addSkill);
router.get('/candidates/skills', authenticate, authorize('candidate'), candidateController.getSkills);
router.post('/candidates/experience', authenticate, authorize('candidate'), candidateController.addWorkExperience);
router.post('/candidates/education', authenticate, authorize('candidate'), candidateController.addEducation);

// =====================================================
// JOB ROUTES
// =====================================================
router.post('/jobs', authenticate, authorize('recruiter'), jobController.createJob);
router.get('/jobs', authenticate, jobController.getJobs);
router.get('/jobs/:id', authenticate, jobController.getJobById);
router.put('/jobs/:id/status', authenticate, authorize('recruiter'), jobController.updateJobStatus);
router.post('/jobs/:jobId/apply', authenticate, authorize('candidate'), jobController.applyToJob);
router.get('/applications', authenticate, authorize('candidate'), jobController.getApplications);

// =====================================================
// MESSAGING ROUTES
// =====================================================
router.post('/conversations', authenticate, messagingController.createConversation);
router.get('/conversations', authenticate, messagingController.getConversations);
router.post('/conversations/:conversationId/messages', authenticate, messagingController.sendMessage);
router.get('/conversations/:conversationId/messages', authenticate, messagingController.getMessages);
router.put('/conversations/:conversationId/read', authenticate, messagingController.markAsRead);

// =====================================================
// SUBSCRIPTION ROUTES
// =====================================================
router.get('/plans', subscriptionController.getPlans);
router.post('/subscriptions', authenticate, subscriptionController.subscribe);
router.get('/subscriptions/current', authenticate, subscriptionController.getSubscription);
router.put('/subscriptions/:subscriptionId/cancel', authenticate, subscriptionController.cancelSubscription);
router.post('/payments', authenticate, subscriptionController.createPayment);
router.get('/payments/history', authenticate, subscriptionController.getPaymentHistory);

// =====================================================
// NETWORKING ROUTES
// =====================================================
router.post('/connections/request', authenticate, networkingController.sendConnectionRequest);
router.put('/connections/:connectionId/accept', authenticate, networkingController.acceptConnectionRequest);
router.delete('/connections/:connectionId/reject', authenticate, networkingController.rejectConnectionRequest);
router.get('/connections', authenticate, networkingController.getConnections);
router.get('/connections/pending', authenticate, networkingController.getPendingRequests);

// =====================================================
// NOTIFICATION ROUTES
// =====================================================
router.get('/notifications', authenticate, notificationController.getNotifications);
router.put('/notifications/:notificationId/read', authenticate, notificationController.markAsRead);
router.put('/notifications/read-all', authenticate, notificationController.markAllAsRead);
router.get('/notifications/unread-count', authenticate, notificationController.getUnreadCount);

// =====================================================
// COMPANY ROUTES
// =====================================================
router.post('/companies', authenticate, authorize('recruiter', 'admin'), companyController.createCompany);
router.get('/companies/:slug', authenticate, companyController.getCompany);
router.post('/companies/:companyId/follow', authenticate, companyController.followCompany);
router.delete('/companies/:companyId/unfollow', authenticate, companyController.unfollowCompany);
router.get('/companies/:companyId/jobs', authenticate, companyController.getCompanyJobs);

// =====================================================
// ADMIN ROUTES
// =====================================================
router.get('/admin/dashboard', authenticate, authorize('admin'), adminController.getDashboardStats);
router.get('/admin/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.put('/admin/users/:userId/status', authenticate, authorize('admin'), adminController.updateUserStatus);
router.get('/admin/reports', authenticate, authorize('admin'), adminController.getReports);
router.put('/admin/reports/:reportId/resolve', authenticate, authorize('admin'), adminController.resolveReport);
router.put('/admin/companies/:companyId/verify', authenticate, authorize('admin'), adminController.verifyCompany);

module.exports = router;
