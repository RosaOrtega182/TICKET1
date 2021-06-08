////instanciamos router
const router=require('express').Router();
const userController=require('../controllers/userAuthenticate.controller');



//aplicarle rutas a esa instancia
router.get('/register',userController.registerUserGet);
router.post('/register',userController.registerAndAddUserPost);
router.get('/login',userController.loginUserGet);
router.post('/login',userController.loginUserPost);
router.get('/logout',userController.logoutUserGet);
router.get('/forgotPassword',userController.forgotPasswordGet);
router.post('/forgotPassword',userController.forgotPasswordPost);
router.get('/resetPassword/:idUser',userController.resetPasswordGet);
router.post('/resetPassword/:idUser',userController.resetPasswordPost);





module.exports= router;