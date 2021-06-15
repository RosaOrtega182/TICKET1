const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/month');
const month= Mes.build();

const Filas= require('../models/rowEntry');
const row= Filas.build();





const RowSummaryCostsResources= require('../models/rowSummaryCostsResources');
const rowSummaryCostsResources= RowSummaryCostsResources.build();
const InfoRowSummaryCostsResources= require('../models/infofilaSummaryCostResources');
const rowInfoSummaryCostsResources =InfoRowSummaryCostsResources.build();
const SummaryCostsResources=require('../models/summarycostsresources');
const summaryCostsResources= SummaryCostsResources.build();


exports.getBudgetIndexes=async(req,res,next)=>
{
    
    const listBudget = await budget.listAllBudgets();
    const numberRecords= await budget.countAllBudgets();
    res.render('summaryCostsResources',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showSummaryCostsResourcesGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numRegisters= await summaryCostsResources.countAllSummaryCostsResources(id_Budget);

    const instanceSummary= await summaryCostsResources.getSummaryInnerJoinByIdBudgetAndMonth(id_Budget);
   
    const instanceInfoSummary= await rowInfoSummaryCostsResources.getInfoRowSummaryInnerJoin();
    console.log(instanceInfoSummary)
 
    res.render('SummaryCostsResources/summaryCostsResources',
    {

        id_Presupuesto:id_Budget,
        cantidad: numRegisters,
        instanceEntry: instanceSummary,
        instanceInfoEntry: instanceInfoSummary

    });
   
}




exports.editConceptGet= async(req,res,next)=>
{      
    
   const id_info= req.params.idInfo;
  
   const instanceInfoRow= await rowInfoSummaryCostsResources.getSummaryInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    console.log(instanceInfoRow[0].resumencostosrecurso.id_presupuesto);
  res.render('SummaryCostsResources/editConcept',
   {

       infoRow: instanceInfoRow[0].valor,
       id_info: id_info,
       idPresupuesto: instanceInfoRow[0].resumencostosrecurso.id_presupuesto

   });  
   
}




exports.editConceptPost=async(req,res,next)=>
{
   
    req.checkBody('valor','El campo valor debe de tener un valor').notEmpty();
   
    const id_info= req.params.idInfo;
    let valor= req.body.valor;
    const instanceInfoRow= await rowInfoSummaryCostsResources.getSummaryInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    id_Presupuesto= instanceInfoRow[0].resumencostosrecurso.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceInfoRow= await rowInfoSummaryCostsResources.getSummaryInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
      res.render('Costs/editConcept',
       {
    
           infoRow: instanceInfoRow[0].valor,
           id_info: id_info,
           idPresupuesto: instanceInfoRow[0].resumencostosrecurso.id_presupuesto
    
       });  
         
    }
    else
    {
        
           
            await rowInfoSummaryCostsResources.editValorInfoFila(valor,id_info);
            //req.flash('success', 'Se actualizo el producto!');
            res.redirect('/summaryCostsResources/showSummaryCostsResources/'+id_Presupuesto);        
       
    }
}
  
