const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();


exports.getPresupuestoIndexes=async(req,res,next)=>
{
    
    const listaPresupuestos = await budget.listAllBudgets();
    const numRegistros= await budget.countAllBudgets();
    //res.send('admin area narf');
    res.render('presupuestos',
    {
        todosLosPresupuestos:listaPresupuestos,
        cantidad: numRegistros
    });
   
}



/* GET  ADD PRODUCT*/
exports.addPresupuestoGet=async(req,res,next)=>
{
    res.render('addPresupuesto');
   
}




/* POST  ADD PRODUCT*/


exports.addPresupuestoPost=async(req,res,next)=>
{

  
    let fechaCreacion= req.body.fechaCreacion;
    let proyecto=req.body.proyecto;
    let version=req.body.version;
   


    req.checkBody('fechaCreacion','El campo fecha debe de tener un valor').notEmpty();
    req.checkBody('proyecto','El campo proyecto debe de tener un valor').notEmpty();
    req.checkBody('version','El campo version debe de tener un valor').notEmpty();

   
    

    let errors= req.validationErrors();
   
    if(errors)
    {
        res.render('addPresupuesto');
         
    }
    else
    {

       
        console.log(version);
         
    
        const [instance, wasCreated] = await budget.addBudget(fechaCreacion,proyecto,version);

        if(wasCreated)
        {
        // req.flash('success','Producto agregado troz');
            res.redirect('/presupuestos')
                   // console.log("se creo");
        }
        else
        {
            req.flash('danger','Este presupuesto ya ha sido creado');
         
            res.render('addPresupuesto');
         
              

        }
    }
}


/* GET  EDIT PRODUCT*/
exports.editPresupuestoGet= async(req,res,next)=>
{      
    
   const id_Presupuesto= req.params.idPresupuesto;
   const instanceBudget= await budget.findByPrimaryKey(id_Presupuesto);

  res.render('editPresupuesto',
   {
        fecha_creacion: instanceBudget.fecha_creacion,
        proyecto: instanceBudget.proyecto,
        versiones: instanceBudget.versiones,
        id_Presupuesto: instanceBudget.id_Presupuesto


   });  
   
}









exports.editPresupuestoPost=async(req,res,next)=>
{
    let fecha_creacion= req.body.fechaCreacion;
    let proyecto=req.body.proyecto;
    let versiones=req.body.version;
    const id_Presupuesto= req.params.idPresupuesto;


    req.checkBody('fechaCreacion','El campo fecha debe de tener un valor').notEmpty();
    req.checkBody('proyecto','El campo proyecto debe de tener un valor').notEmpty();
    req.checkBody('version','El campo version debe de tener un valor').notEmpty();
   
   
    

   
    let errors= req.validationErrors();
   
    if(errors)
    {
       
        const instanceBudget= await budget.findByPrimaryKey(id_Presupuesto);

        res.render('editPresupuesto',
         {
              fecha_creacion: instanceBudget.fecha_creacion,
              proyecto: instanceBudget.proyecto,
              versiones: instanceBudget.versiones,
              id_Presupuesto: instanceBudget.id_Presupuesto
      
      
         });  
    }
    else
    {
        const cantity = await budget.countAllBudgetsByProyecto(proyecto,id_Presupuesto);
 
        


        if(cantity >= 1)
        {

            req.flash('danger','El nombre del proyecto  ya ha sido creado');
            const instanceBudget2= await budget.findByPrimaryKey(id_Presupuesto);

            res.render('editPresupuesto',
             {
                  fecha_creacion: instanceBudget2.fecha_creacion,
                  proyecto: instanceBudget2.proyecto,
                  versiones: instanceBudget2.versiones,
                  id_Presupuesto: instanceBudget2.id_Presupuesto
          
          
             });  
              
      
        }
        else
        {
           console.log(fecha_creacion);
            await budget.editBudget(fecha_creacion,proyecto,versiones,id_Presupuesto);
            //req.flash('success', 'Se actualizo el presupuesto!');
            res.redirect('/presupuestos')       
        }
    }
}
  