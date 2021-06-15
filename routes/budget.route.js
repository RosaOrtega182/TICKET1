////instanciamos router
const router=require('express').Router();
const budgetController=require('../controllers/budget.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',budgetController.getBudgetIndexes);
router.get('/budget/addBudget',budgetController.addBudgetGet);
router.post('/budget/addBudget',budgetController.addBudgetPost);
router.get('/budget/editBudget/:idBudget',budgetController.editBudgetGet);
router.post('/budget/editBudget/:idBudget',budgetController.editBudgetPost);
router.get('/budget/deleteBudget/:idBudget',budgetController.deleteBudgetGet);


//aplicarle rutas a esa instancia

module.exports= router;