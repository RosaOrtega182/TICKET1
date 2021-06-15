////instanciamos router
const router=require('express').Router();
const incomesController=require('../controllers/incomes.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',incomesController.getBudgetIndexes);
router.get('/showIncomes/:idBudget',incomesController.showIncomesGet);
router.get('/addRow/:idBudget',incomesController.addRowGet);
router.post('/addRow/:idBudget',incomesController.addRowPost);
router.get('/deleteRow/:idBudget',incomesController.deleteRowGet);
router.post('/deleteRow/:idPresupuesto',incomesController.deleteRowPost);
router.get('/editConcept/:idInfo',incomesController.editConceptGet);
router.post('/editConcept/:idInfo',incomesController.editConceptPost);



module.exports= router;