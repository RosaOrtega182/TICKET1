////instanciamos router
const router=require('express').Router();
const administrativeExpensesController=require('../controllers/administrativeExpenses.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',administrativeExpensesController.getBudgetIndexes);
router.get('/showAdministrativeExpenses/:idBudget',administrativeExpensesController.showAdministrativeExpensesGet);
router.get('/addRow/:idBudget',administrativeExpensesController.addRowGet);
router.post('/addRow/:idBudget',administrativeExpensesController.addRowPost);
router.get('/deleteRow/:idBudget',administrativeExpensesController.deleteRowGet);
router.post('/deleteRow/:idBudget',administrativeExpensesController.deleteRowPost);
router.get('/editConcept/:idInfo',administrativeExpensesController.editConceptGet);
router.post('/editConcept/:idInfo',administrativeExpensesController.editConceptPost);



module.exports= router;