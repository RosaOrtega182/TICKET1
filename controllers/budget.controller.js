const Budget= require('../models/budget')
const budget = Budget.build();
const RowEntry=require('../models/rowEntry');
const rowEntry=  RowEntry.build();
const RowDirectCosts= require('../models/rowDirectCosts');
const rowDirectCosts= RowDirectCosts.build();
const RowAdministrativeExpenses= require('../models/rowAdministrativeExpenses');
const rowAdministrativeExpenses= RowAdministrativeExpenses.build();
const RowResources= require('../models/rowResources');
const rowResources= RowResources.build();
const RowCosts= require('../models/rowCosts');
const rowCosts= RowCosts.build();
const RowSummaryCostsResources= require('../models/rowSummaryCostsResources');
const rowSummaryCostsResources= RowSummaryCostsResources.build();


exports.getBudgetIndexes=async(req,res,next)=>
{
    
    const listBudget = await budget.listAllBudgets();
    const numberRecords= await budget.countAllBudgets();
    res.render('budgets',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}




exports.addBudgetGet=async(req,res,next)=>
{
    res.render('Budget/addBudget');
   
}



exports.addBudgetPost=async(req,res,next)=>
{

  
    let creationDate= req.body.fechaCreacion;
    let proyect=req.body.proyecto;
    let version=req.body.version;

   

    req.checkBody('fechaCreacion','El campo fecha debe de tener un valor').notEmpty();
    req.checkBody('proyecto','El campo proyecto debe de tener un valor').notEmpty();
    req.checkBody('version','El campo version debe de tener un valor').notEmpty();

   
    

    let errors= req.validationErrors();
   
    if(errors)
    {
        res.render('Budget/addBudget',
        {
            errors: errors
        });
         
    }
    else
    {

             
    
        const [instance, wasCreated] = await budget.addBudget(creationDate,proyect,version);

        if(wasCreated)
        {
       
            res.redirect('/')
                   
        }
        else
        {
            req.flash('danger','Este nombre de presupuesto ya ha sido creado');
         
            res.render('Budget/addBudget',{
             errors: errors
            });
         
              

        }
    }
}


exports.editBudgetGet= async(req,res,next)=>
{      
    
   const id_Budget= req.params.idBudget;
   const instanceBudget= await budget.findByPrimaryKey(id_Budget);

  res.render('Budget/editBudget',
   {
        creationDate: instanceBudget.fecha_creacion,
        proyect: instanceBudget.proyecto,
        version: instanceBudget.versiones,
        id_Budget: instanceBudget.id_Presupuesto


   });  
   
}









exports.editBudgetPost=async(req,res,next)=>
{
    let creationDate= req.body.fechaCreacion;
    let proyect=req.body.proyecto;
    let version=req.body.version;
    const id_Budget= req.params.idBudget;


    req.checkBody('fechaCreacion','El campo fecha debe de tener un valor').notEmpty();
    req.checkBody('proyecto','El campo proyecto debe de tener un valor').notEmpty();
    req.checkBody('version','El campo version debe de tener un valor').notEmpty();
   
   
    

   
    let errors= req.validationErrors();
   
    if(errors)
    {
       
        const instanceBudget= await budget.findByPrimaryKey(id_Budget);

        res.render('Budget/editBudget',
         {
              creationDate: instanceBudget.fecha_creacion,
              proyect: instanceBudget.proyecto,
              version: instanceBudget.versiones,
              id_Budget: instanceBudget.id_Presupuesto,
              errors:errors
      
      
         });  
    }
    else
    {
        const cantity = await budget.countAllBudgetsByProyect(proyect,id_Budget);
 
        


        if(cantity >= 1)
        {

            req.flash('danger','El nombre del proyecto  ya ha sido creado');
            const instanceBudget2= await budget.findByPrimaryKey(id_Budget);

            res.render('Budget/editBudget',
             {
                  creationDate: instanceBudget2.fecha_creacion,
                  proyect: instanceBudget2.proyecto,
                  version: instanceBudget2.versiones,
                  id_Budget: instanceBudget2.id_Presupuesto,
                  errors: errors
          
          
             });  
              
      
        }
        else
        {
           
            await budget.editBudget(creationDate,proyect,version,id_Budget);
            //req.flash('success', 'Se actualizo el presupuesto!');
            res.redirect('/')       
        }
    }
}


exports.deleteBudgetGet=async (req,res,next)=>
{
    let id_Budget = req.params.idBudget;
    const instanceRowEntry=  await rowEntry.deleteRowEntryByIdBudget(id_Budget);

    if(instanceRowEntry===null)
    {
        req.flash('danger','El presupuesto no se eliminó');
       
    }
    else
    {
        const instanceBudget= await budget.deleteBudget(id_Budget) ;
   
        //DELETE ROW INGRESOS
        const instanceRowEntry= await rowEntry.deleteRowEntryByIdBudget(id_Budget);
        //DELETE ROW COSTOSDIRECTOS
        const instanceRowDirectCosts= await rowDirectCosts.deleteRowDirectCostsByIdBudget(id_Budget);
         //DELETE ROW GASTOS ADMINISTRATIVOS
         const instanceRowAdministrativeExpenses= await rowAdministrativeExpenses.deleteAdministrativeExpensesByIdBudget(id_Budget);
        //DELETE ROW RECURSOS
        const instanceResources= await rowResources.deleteRowResourcesByIdBudget(id_Budget);
         //DELETE ROW COSTOS
         const instanceCosts= await rowCosts.deleteRowCostsByIdBudget(id_Budget);
          //DELETE ROW RESUMEN COSTOS RECURSOS
        const instanceSummary= await rowSummaryCostsResources.deleteRowSummaryCostsResourcesByIdBudget(id_Budget);


        res.redirect('/');   
    }

}
  