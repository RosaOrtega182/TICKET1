////instanciamos router
const router=require('express').Router();
const directCostsController=require('../controllers/directCosts.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',directCostsController.getBudgetIndexes);
router.get('/showDirectCosts/:idBudget',directCostsController.showDirectCostsGet);
router.get('/addRow/:idBudget',directCostsController.addRowGet);
router.post('/addRow/:idBudget',directCostsController.addRowPost);
router.get('/deleteRow/:idBudget',directCostsController.deleteRowGet);
router.post('/deleteRow/:idPresupuesto',directCostsController.deleteRowPost);
router.get('/editConcept/:idInfo',directCostsController.editConceptGet);
router.post('/editConcept/:idInfo',directCostsController.editConceptPost);



module.exports= router;