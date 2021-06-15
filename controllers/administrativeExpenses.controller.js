const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/month');
const month= Mes.build();
const AdministrativeExpenses=require('../models/administrativeExpenses');
const administrativeExpenses= AdministrativeExpenses.build();
const RowAdministrativeExpenses= require('../models/rowAdministrativeExpenses');
const rowAdministrativeExpenses= RowAdministrativeExpenses.build();
const InfoRowAdministrativeExpenses= require('../models/infofilaAdministrativeExpenses');
const infoRowAdministrativeExpenses= InfoRowAdministrativeExpenses.build();


exports.getBudgetIndexes=async(req,res,next)=>
{
    
    const listBudget = await budget.listAllBudgets();
    const numberRecords= await budget.countAllBudgets();
    res.render('administrativeExpenses',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showAdministrativeExpensesGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numRegisters= await administrativeExpenses.countAllAdministrativeExpenses(id_Budget);

    const instanceAdministrativeExpenses= await administrativeExpenses.getAdministrativeExpensesInnerJoinByIdBudgetAndMonth(id_Budget);
   
    const instanceInfoAdministrativeExpenses= await infoRowAdministrativeExpenses.getInfoRowAdministrativeExpensesInnerJoin();
 
    res.render('AdministrativeExpenses/administrativeExpenses',
    {

        id_Presupuesto:id_Budget,
        cantidad: numRegisters,
        instanceEntry: instanceAdministrativeExpenses,
        instanceInfoEntry: instanceInfoAdministrativeExpenses

    });
   
}


exports.addRowGet=async(req,res,next)=>
{
    const id_Presupuesto= req.params.idBudget;


    res.render('AdministrativeExpenses/addRow',
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


        res.render('administrativeExpenses/addRow',
        {
            errors: errors,
            id_Presupuesto:id_Presupuesto,
           
    
        });
    
         
    }
    else
    {
        
         
      
        const [instanceRow, wasCreated] = await rowAdministrativeExpenses.addRow(nombre, id_Presupuesto);
     

        if(wasCreated)
        {

            const instanceAdministrativeExpenses= await administrativeExpenses.findbyPresupuesto(id_Presupuesto);
            instanceAdministrativeExpenses.forEach(async function(administrativeExpenses)
            {
                await infoRowAdministrativeExpenses.addInfoRow(administrativeExpenses.id_gastos,instanceRow.id_fila);

            });
            res.redirect('/administrativeExpenses/showAdministrativeExpenses/'+id_Presupuesto)
           
         
           
          
            
        }
        else
        {
            
            const id_Presupuesto= req.params.idBudget;


            res.render('AdministrativeExpenses/addRow',
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
    const instanceRowAdministrativeExpenses= await rowAdministrativeExpenses.listAllRowAdministrativeExpensesByIdBudget(id_Budget);

    res.render('AdministrativeExpenses/deleteRow',
    {
        id_Presupuesto:id_Budget,
        instanceRowEntry: instanceRowAdministrativeExpenses
       

    });

   
}



exports.deleteRowPost=async (req,res,next)=>
{
    let id_Presupuesto= req.params.idBudget;
    let id_fila=req.body.concepto;
 
    const instanceAdministrativeExpenses= await rowAdministrativeExpenses.deleteRowbyIdRow(id_fila) ;
    if(instanceAdministrativeExpenses===null)
    {
        //req.flash('danger','La fila no se elimino');
       
    }
    else
    {

        const instanceAdministrativeExpenses= await administrativeExpenses.getAdministrativeExpensesInnerJoinByIdBudgetAndMonth(id_Presupuesto);
    

          
            let suma=0;
           
            instanceAdministrativeExpenses.forEach(async function(instance)
            {
                
                
                suma=await infoRowAdministrativeExpenses.getSum(instance.id_gastos);
                await administrativeExpenses.editTotalMes(suma,id_Presupuesto, instance.id_gastos);
                
            }); 
       res.redirect('/administrativeExpenses/showAdministrativeExpenses/'+id_Presupuesto);
       
    }

}



exports.editConceptGet= async(req,res,next)=>
{      
    
   const id_info= req.params.idInfo;
  
   const instanceInfoRow= await infoRowAdministrativeExpenses.getAdministrativeExpensesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    console.log(instanceInfoRow);
  res.render('AdministrativeExpenses/editConcept',
   {

       infoRow: instanceInfoRow[0].valor,
       id_info: id_info,
       idPresupuesto: instanceInfoRow[0].gastosadministrativo.id_presupuesto

   });  
   
}




exports.editConceptPost=async(req,res,next)=>
{
   
    req.checkBody('valor','El campo valor debe de tener un valor').notEmpty();
   
    const id_info= req.params.idInfo;
    let valor= req.body.valor;
    const instanceInfoRow= await infoRowAdministrativeExpenses.getAdministrativeExpensesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    id_Presupuesto= instanceInfoRow[0].gastosadministrativo.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceInfoRow= await infoRowAdministrativeExpenses.getAdministrativeExpensesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
      res.render('AdministrativeExpenses/editConcept',
       {
    
           infoRow: instanceInfoRow[0].valor,
           id_info: id_info,
           idPresupuesto: instanceInfoRow[0].gastosadministrativo.id_presupuesto
    
       });  
         
    }
    else
    {
        
           
            await infoRowAdministrativeExpenses.editValorInfoFila(valor,id_info);

            const instanceAdministrativeExpenses= await administrativeExpenses.getAdministrativeExpensesInnerJoinByIdBudgetAndMonth(id_Presupuesto);
    

          
            let suma=0;
           
            instanceAdministrativeExpenses.forEach(async function(instance)
            {
                
                
                suma=await infoRowAdministrativeExpenses.getSum(instance.id_gastos);
                console.log("SUMAAAAAA"+suma)

                await administrativeExpenses.editTotalMes(suma,id_Presupuesto, instance.id_gastos);
                
            });


            //req.flash('success', 'Se actualizo el producto!');
            res.redirect('/administrativeExpenses/showAdministrativeExpenses/'+id_Presupuesto);        
       
    }
}
  
