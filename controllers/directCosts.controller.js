const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/month');
const month= Mes.build();


const CashFlow= require('../models/cashFlow');
const cashFlow= CashFlow.build();


const AdministrativeExpenses=require('../models/administrativeExpenses');
const administrativeExpenses= AdministrativeExpenses.build();


const RowDirectCosts= require('../models/rowDirectCosts');
const rowDirectCosts= RowDirectCosts.build();
const InfoRowDirectCosts= require('../models/infoRowDirectCosts');
const infoRowDirectCosts= InfoRowDirectCosts.build();
const DirectCosts=require('../models/directcosts');
const directcosts= DirectCosts.build();


exports.getBudgetIndexes=async(req,res,next)=>
{
    
    const listBudget = await budget.listAllBudgets();
    const numberRecords= await budget.countAllBudgets();
    res.render('directCosts',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showDirectCostsGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numRegisters= await directcosts.countAllDirectCosts(id_Budget);

    const instanceDirectCosts= await directcosts.getDirectCostsInnerJoinByIdBudgetAndMonth(id_Budget);
    

    const instanceInfoDirectCost= await infoRowDirectCosts.getInfoRowDirectCostsInnerJoinByIdDirectCosts();
   




    res.render('DirectCosts/directCosts',
    {

        id_Presupuesto:id_Budget,
        cantidad: numRegisters,
        instanceEntry: instanceDirectCosts,
        instanceInfoEntry: instanceInfoDirectCost

    });
   
}


exports.addRowGet=async(req,res,next)=>
{
    const id_Presupuesto= req.params.idBudget;


    res.render('DirectCosts/addRow',
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


        res.render('directCosts/addRow',
        {
            errors: errors,
            id_Presupuesto:id_Presupuesto,
           
    
        });
    
         
    }
    else
    {
        
         
      
        const [instanceRow, wasCreated] = await rowDirectCosts.addRow(nombre, id_Presupuesto);
     

        if(wasCreated)
        {

            const instanceDirectCosts= await directcosts.findbyPresupuesto(id_Presupuesto);
            console.log(instanceDirectCosts)
            instanceDirectCosts.forEach(async function(directCosts)
            {
                await infoRowDirectCosts.addInfoRow(directCosts.id_costos,instanceRow.id_fila);

            });
            res.redirect('/directCosts/showDirectCosts/'+id_Presupuesto)
           
         
           
          
            
        }
        else
        {
            
            const id_Presupuesto= req.params.idBudget;


            res.render('DirectCosts/addRow',
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
    const instanceRowDirectCosts= await rowDirectCosts.listAllRowDirectCostsByIdBudget(id_Budget);

    res.render('DirectCosts/deleteRow',
    {
        id_Presupuesto:id_Budget,
        instanceRowEntry: instanceRowDirectCosts
       

    });

   
}



exports.deleteRowPost=async (req,res,next)=>
{
    let id_Presupuesto= req.params.idPresupuesto;
    let id_fila=req.body.concepto;
 
    const instanceRowDirectCosts= await rowDirectCosts.deleteRowbyIdRow(id_fila) ;
    if(instanceRowDirectCosts===null)
    {
        //req.flash('danger','La fila no se elimino');
       
    }
    else
    {
        
        const instanceDirectCosts= await directcosts.getDirectCostsInnerJoinByIdBudgetAndMonth(id_Presupuesto);
    

        const instanceInfoDirectCost= await infoRowDirectCosts.getInfoRowDirectCostsInnerJoinByIdDirectCosts();
        console.log(instanceInfoDirectCost)
        let suma=0;
       
        instanceDirectCosts.forEach(async function(costs)
        {
            
            
            suma=await infoRowDirectCosts.getSum(costs.id_costos);
            await directcosts.editTotalMes(suma,id_Presupuesto, costs.id_costos);
            
        });





       res.redirect('/directCosts/showDirectCosts/'+id_Presupuesto);
       
    }

}



exports.editConceptGet= async(req,res,next)=>
{      
    
   const id_info= req.params.idInfo;
  
   const instanceInfoRowDirectCosts= await infoRowDirectCosts.getDirectCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
  
  res.render('DirectCosts/editConcept',
   {

       infoRow: instanceInfoRowDirectCosts[0].valor,
       id_info: id_info,
       idPresupuesto: instanceInfoRowDirectCosts[0].costosdirecto.id_presupuesto

   });  
   
}




exports.editConceptPost=async(req,res,next)=>
{
   
    req.checkBody('valor','El campo valor debe de tener un valor').notEmpty();
   
    const id_info= req.params.idInfo;
    let valor= req.body.valor;
    const instanceInfoRow= await infoRowDirectCosts.getDirectCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    id_Presupuesto= instanceInfoRow[0].costosdirecto.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceInfoRow= await infoRowDirectCosts.getDirectCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
      res.render('DirectCosts/editConcept',
       {
    
           infoRow: instanceInfoRow[0].valor,
           id_info: id_info,
           idPresupuesto: instanceInfoRow[0].costosdirecto.id_presupuesto
    
       });  
         
    }
    else
    {
        
           
            await infoRowDirectCosts.editValorInfoFila(valor,id_info);



            const instanceDirectCosts= await directcosts.getDirectCostsInnerJoinByIdBudgetAndMonth(id_Presupuesto);
    


            //const instanceInfoDirectCost= await infoRowDirectCosts.getInfoRowDirectCostsInnerJoinByIdDirectCosts();
            //console.log(instanceInfoDirectCost)
            let suma=0;
           
            instanceDirectCosts.forEach(async function(costs)
            {
                
                
                suma=await infoRowDirectCosts.getSum(costs.id_costos);
                await directcosts.editTotalMes(suma,id_Presupuesto, costs.id_costos);
                
            });



            
            const instanceCash= await  cashFlow.listAllCashFlow();

            let sumCash=0;
            instanceCash.forEach(async function(instance)
            {
                const instanceDirectCosts= await directcosts.findbyFlow(instance.id_flujo)
            
                valor1= instanceDirectCosts[0].total_mes;
                const instanceAdministrative= await administrativeExpenses.findbyFlow(instance.id_flujo);
                valor2= instanceAdministrative[0].total_mes;
                sumaCash= valor1+valor2;
                await cashFlow.editTotalMes(sumaCash,id_Presupuesto,instance.id_flujo)
            });









            
            //req.flash('success', 'Se actualizo el producto!');
            res.redirect('/directCosts/showDirectCosts/'+id_Presupuesto);        
       
    }
}
  
