////instanciamos router
const router=require('express').Router();
const resourcesController=require('../controllers/resources.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',resourcesController.getBudgetIndexes);
router.get('/showResources/:idBudget',resourcesController.showResourcesGet);
router.get('/addRow/:idBudget',resourcesController.addRowGet);
router.post('/addRow/:idBudget',resourcesController.addRowPost);
router.get('/deleteRow/:idBudget',resourcesController.deleteRowGet);
router.post('/deleteRow/:idPresupuesto',resourcesController.deleteRowPost);
router.get('/editConcept/:idInfo',resourcesController.editConceptGet);
router.post('/editConcept/:idInfo',resourcesController.editConceptPost);



module.exports= router;