////instanciamos router
const router=require('express').Router();
const summaryCostsResourcesController=require('../controllers/summaryCostsResources.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',summaryCostsResourcesController.getBudgetIndexes);
router.get('/showSummaryCostsResources/:idBudget',summaryCostsResourcesController.showSummaryCostsResourcesGet);
router.get('/editConcept/:idInfo',summaryCostsResourcesController.editConceptGet);
router.post('/editConcept/:idInfo',summaryCostsResourcesController.editConceptPost);



module.exports= router;