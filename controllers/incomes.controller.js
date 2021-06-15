const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/month');
const month= Mes.build();
const Incomes= require('../models/income');
const incomes= Incomes.build();
const Filas= require('../models/rowEntry');
const row= Filas.build();
const infoFila=require('../models/infofilaingreso');
const inforow= infoFila.build();


exports.getBudgetIndexes=async(req,res,next)=>
{
    
    const listBudget = await budget.listAllBudgets();
    const numberRecords= await budget.countAllBudgets();
    res.render('incomes',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showIncomesGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numRegisters= await incomes.countAllIncomes(id_Budget);

    const instanceEntry= await incomes.getIncomesInnerJoinByIdBudgetAndMonth(id_Budget);
   
    const instanceInfoEntry= await inforow.getInfoRowIncomeInnerJoin();
 
    res.render('Incomes/incomes',
    {

        id_Presupuesto:id_Budget,
        cantidad: numRegisters,
        instanceEntry: instanceEntry,
        instanceInfoEntry: instanceInfoEntry

    });
   
}


exports.addRowGet=async(req,res,next)=>
{
    const id_Presupuesto= req.params.idBudget;


    res.render('Incomes/addRow',
    {
        id_Presupuesto:id_Presupuesto,
       

    });

    
   

    
   
}







exports.addRowPost=async(req,res,next)=>
{

    let id_Presupuesto= req.params.idBudget;
    

    let nombre=req.body.nombre;


    req.checkBody('nombre','El campo nombre debe de tener un valor').notEmpty();
   
    

    let errors= req.validationErrors();
   
    if(errors)
    {
        const id_Presupuesto= req.params.idBudget;


        res.render('Ingresos/addRow',
        {
            errors: errors,
            id_Presupuesto:id_Presupuesto,
           
    
        });
    
         
    }
    else
    {
        
         
      
        const [instanceRow, wasCreated] = await row.addRow(nombre, id_Presupuesto);
     

        if(wasCreated)
        {

            const instanceIngresos= await incomes.findbyPresupuesto(id_Presupuesto);
            instanceIngresos.forEach(async function(ingreso)
            {
                await inforow.addInfoRow(ingreso.id_ingreso,instanceRow.id_fila);

            });
            res.redirect('/incomes/showIncomes/'+id_Presupuesto)
           
         
           
          
            
        }
        else
        {
            
            const id_Presupuesto= req.params.idBudget;


            res.render('Ingresos/addRow',
            {
                errors: errors,
                id_Presupuesto:id_Presupuesto,
               
        
            });     
           
           
           
          
    
              

        }
    }
}
 



exports.deleteRowGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const instanceRowEntry= await row.listAllRowEntriesByIdBudget(id_Budget);

    res.render('Incomes/deleteRow',
    {
        id_Presupuesto:id_Budget,
        instanceRowEntry: instanceRowEntry
       

    });

   
}



exports.deleteRowPost=async (req,res,next)=>
{
    let id_Presupuesto= req.params.idPresupuesto;
    let id_fila=req.body.concepto;
 
    const instanceFinancialFlow= await row.deleteRowbyIdRow(id_fila) ;
    if(instanceFinancialFlow===null)
    {
        //req.flash('danger','La fila no se elimino');
       
    }
    else
    {
        const instanceIncome= await incomes.getIncomesInnerJoinByIdBudgetAndMonth(id_Presupuesto);
    

        //const instanceInfoDirectCost= await infoRowDirectCosts.getInfoRowDirectCostsInnerJoinByIdDirectCosts();
        //console.log(instanceInfoDirectCost)
        let suma=0;
       
        instanceIncome.forEach(async function(instance)
        {
            
            
            suma=await inforow.getSum(instance.id_ingreso);
            await incomes.editTotalMes(suma,id_Presupuesto, instance.id_ingreso);
            
        });
       res.redirect('/incomes/showIncomes/'+id_Presupuesto);
       
    }

}



exports.editConceptGet= async(req,res,next)=>
{      
    
   const id_info= req.params.idInfo;
  
   const instanceInfoRow= await inforow.getFlujosInnerJoinByIdPresupuestoAndIdMesAndIdFlujo(id_info);
    console.log(instanceInfoRow[0].ingreso.id_presupuesto);
  res.render('Incomes/editConcept',
   {

       infoRow: instanceInfoRow[0].valor,
       id_info: id_info,
       idPresupuesto: instanceInfoRow[0].ingreso.id_presupuesto

   });  
   
}




exports.editConceptPost=async(req,res,next)=>
{
   
    req.checkBody('valor','El campo valor debe de tener un valor').notEmpty();
   
    const id_info= req.params.idInfo;
    let valor= req.body.valor;
    const instanceInfoRow= await inforow.getFlujosInnerJoinByIdPresupuestoAndIdMesAndIdFlujo(id_info);
    id_Presupuesto= instanceInfoRow[0].ingreso.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceInfoRow= await inforow.getFlujosInnerJoinByIdPresupuestoAndIdMesAndIdFlujo(id_info);
      res.render('Incomes/editConcept',
       {
    
           infoRow: instanceInfoRow[0].valor,
           id_info: id_info,
           idPresupuesto: instanceInfoRow[0].ingreso.id_presupuesto
    
       });  
         
    }
    else
    {
        
           
            await inforow.editValorInfoFila(valor,id_info);


            const instanceIncome= await incomes.getIncomesInnerJoinByIdBudgetAndMonth(id_Presupuesto);
    

        //const instanceInfoDirectCost= await infoRowDirectCosts.getInfoRowDirectCostsInnerJoinByIdDirectCosts();
        //console.log(instanceInfoDirectCost)
        let suma=0;
       
        instanceIncome.forEach(async function(instance)
        {
            
            
            suma=await inforow.getSum(instance.id_ingreso);
            await incomes.editTotalMes(suma,id_Presupuesto, instance.id_ingreso);
            
        });









            //req.flash('success', 'Se actualizo el producto!');
            res.redirect('/incomes/showIncomes/'+id_Presupuesto);        
       
    }
}
  
