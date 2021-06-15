const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/month');
const month= Mes.build();

const Filas= require('../models/rowEntry');
const row= Filas.build();


const RowCosts= require('../models/rowCosts');
const rowCosts= RowCosts.build();
const InfoRowCosts= require('../models/infofilaCosts');
const rowInfoCosts =InfoRowCosts.build();
const Costs=require('../models/costs');
const cost= Costs.build();


exports.getBudgetIndexes=async(req,res,next)=>
{
    
    const listBudget = await budget.listAllBudgets();
    const numberRecords= await budget.countAllBudgets();
    res.render('costs',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showCostsGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numRegisters= await cost.countAllCosts(id_Budget);

    const instanceCosts= await cost.getCostsInnerJoinByIdBudgetAndMonth(id_Budget);
   
    const instanceInfoEntry= await rowInfoCosts.getInfoRowCostsInnerJoin();
 
    res.render('Costs/costs',
    {

        id_Presupuesto:id_Budget,
        cantidad: numRegisters,
        instanceEntry: instanceCosts,
        instanceInfoEntry: instanceInfoEntry

    });
   
}




exports.editConceptGet= async(req,res,next)=>
{      
    
   const id_info= req.params.idInfo;
  
   const instanceInfoRow= await rowInfoCosts.getCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    console.log(instanceInfoRow[0].costo.id_presupuesto);
  res.render('Costs/editConcept',
   {

       infoRow: instanceInfoRow[0].valor,
       id_info: id_info,
       idPresupuesto: instanceInfoRow[0].costo.id_presupuesto

   });  
   
}




exports.editConceptPost=async(req,res,next)=>
{
   
    req.checkBody('valor','El campo valor debe de tener un valor').notEmpty();
   
    const id_info= req.params.idInfo;
    let valor= req.body.valor;
    const instanceInfoRow= await rowInfoCosts.getCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    id_Presupuesto= instanceInfoRow[0].costo.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceInfoRow= await rowInfoCosts.getCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
      res.render('Costs/editConcept',
       {
    
           infoRow: instanceInfoRow[0].valor,
           id_info: id_info,
           idPresupuesto: instanceInfoRow[0].costo.id_presupuesto
    
       });  
         
    }
    else
    {
        
           
            await rowInfoCosts.editValorInfoFila(valor,id_info);
            //req.flash('success', 'Se actualizo el producto!');
            res.redirect('/costs/showCosts/'+id_Presupuesto);        
       
    }
}
  
