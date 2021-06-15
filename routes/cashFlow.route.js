////instanciamos router
const router=require('express').Router();
const cashFlowController=require('../controllers/cashFlow.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',cashFlowController.getBudgetIndexes);
router.get('/showCashFlow/:idBudget',cashFlowController.showCashFlowGet);
router.get('/addColumn/:idBudget',cashFlowController.addColumnGet);
router.post('/addColumn/:idBudget',cashFlowController.addColumnPost);
router.get('/deleteColumn/:idBudget',cashFlowController.deleteColumnGet);
router.get('/editIncome/:idFlow',cashFlowController.editIncomeGet);
router.post('/editIncome/:idFlow',cashFlowController.editIncomePost);



module.exports= router;