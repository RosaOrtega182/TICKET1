////instanciamos router
const router=require('express').Router();
const flujoDeEfectivoController=require('../controllers/flujoDeEfectivo.controller');
const midd = require('../middlewares/middleware.user');
var auth = require('../models/authenticaUser');
var isAdmin = auth.isAdmin;

router.get('/',flujoDeEfectivoController.getPresupuestoIndexes);
router.get('/showFlujoDeEfectivo/:idPresupuesto',flujoDeEfectivoController.showFlujoDeEfectivoGet);
router.get('/addColumn/:idPresupuesto',flujoDeEfectivoController.addColumnGet);
router.post('/addColumn/:idPresupuesto',flujoDeEfectivoController.addColumnPost);
router.get('/deleteColumn/:idPresupuesto',flujoDeEfectivoController.deleteColumnGet);



module.exports= router;