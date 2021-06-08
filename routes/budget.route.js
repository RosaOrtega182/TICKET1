////instanciamos router
const router=require('express').Router();
const budgetController=require('../controllers/budget.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',budgetController.getPresupuestoIndexes);
router.get('/addPresupuesto',budgetController.addPresupuestoGet);
router.post('/addPresupuesto',budgetController.addPresupuestoPost);
router.get('/editPresupuesto/:idPresupuesto',budgetController.editPresupuestoGet);
router.post('/editPresupuesto/:idPresupuesto',budgetController.editPresupuestoPost);
//router.get('/deleteProduct/:idProduct',adminProductsController.deleteProductGet);


//aplicarle rutas a esa instancia

module.exports= router;