const { Signup, Login, AdminLogin, GetBusinesses, GetCreators, PostCreators, Postbusinesses, Contact } = require("../Controllers/AuthController");
const { userVerification, adminVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();


router.post('/signup', Signup);
router.post('/login', Login);
router.post('/', userVerification);
router.post('/admin', AdminLogin);
router.post('/admindashboard', adminVerification);
router.get('/api/creators', GetCreators);
router.get('/api/businesses', GetBusinesses);
router.post('/api/creators',PostCreators);
router.post('/api/businesses',Postbusinesses);
router.post('/api/contact',Contact);

module.exports = router;