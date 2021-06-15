////instanciamos router
const router=require('express').Router();
const costController=require('../controllers/cost.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',costController.getBudgetIndexes);
router.get('/showCosts/:idBudget',costController.showCostsGet);
router.get('/editConcept/:idInfo',costController.editConceptGet);
router.post('/editConcept/:idInfo',costController.editConceptPost);



module.exports= router;