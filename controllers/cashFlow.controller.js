const Budget= require('../models/budget')
const budget = Budget.build();
const Month= require('../models/month');
const month= Month.build();
const CashFlow= require('../models/cashFlow');
const cashFlow= CashFlow.build();

const RowEntry=require('../models/rowEntry');
const rowEntry= RowEntry.build(); 
const RowInfoEntry= require('../models/infofilaingreso');
const rowInfoEntry=RowInfoEntry.build();
const Incomes= require('../models/income');
const entry=Incomes.build();

const RowDirectCosts= require('../models/rowDirectCosts');
const rowDirectCosts= RowDirectCosts.build();
const InfoRowDirectCosts= require('../models/infoRowDirectCosts');
const infoRowDirectCosts= InfoRowDirectCosts.build();
const DirectCosts=require('../models/directcosts');
const directcosts= DirectCosts.build();

const RowAdministrativeExpenses= require('../models/rowAdministrativeExpenses');
const rowAdministrativeExpenses= RowAdministrativeExpenses.build();
const InfoRowAdministrativeExpenses= require('../models/infofilaAdministrativeExpenses');
const infoRowAdministrativeExpenses= InfoRowAdministrativeExpenses.build();
const AdministrativeExpenses=require('../models/administrativeExpenses');
const administrativeExpenses= AdministrativeExpenses.build();


const RowResources= require('../models/rowResources');
const rowResources= RowResources.build();
const InfoRowResources= require('../models/infofilaresources');
const rowInfoResources= InfoRowResources.build();
const Resources=require('../models/resources');
const resources= Resources.build();



const RowCosts= require('../models/rowCosts');
const rowCosts= RowCosts.build();
const InfoRowCosts= require('../models/infofilaCosts');
const rowInfoCosts =InfoRowCosts.build();
const Costs=require('../models/costs');
const cost= Costs.build();


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
    res.render('cashFlow',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showCashFlowGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numberRecords= await cashFlow.countAllCashFlow(id_Budget);

    const instanceCashFlow = await cashFlow.getCashFlowInnerJoinByIdBudgetAndIdMonth(id_Budget);
    res.render('CashFlow/cashFlow',
    {

        id_Budget:id_Budget,
        quantity: numberRecords,
        instanceCashFlow: instanceCashFlow

    });
   
}


exports.addColumnGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const quantityCashFlow= await cashFlow.countAllCashFlowByIdBudget(id_Budget);

    
    if(quantityCashFlow==0)
    {
    const instanceMonths= await month.listAllMonths();

    res.render('CashFlow/addColumn',
    {
        id_Budget:id_Budget,
        months: instanceMonths

    });

    }
    else
    {

        const monthtouse= await cashFlow.findMonthAddedLatest(id_Budget);
        let month= monthtouse[0].id_mes;
      

        if(month==12)
        {
            let newMonth=1
            const [instance, wasCreated] = await cashFlow.addCashFlow(id_Budget,newMonth);
           

            if(wasCreated )
             {
              
                
                let idFlow= instance.id_flujo;



                /*ADD IN INGRESOS TABLE */ 
            
                const [instanceEntry,wasCreatedEntry]= await entry.addEntry(id_Budget,newMonth,idFlow);
                let idEntry=instanceEntry.id_ingreso;
                const quantityRow= await rowEntry.countAllEntries(id_Budget);
                if(quantityRow!=0)
                {
                    const instanceRowEntry= await rowEntry.listAllRowEntriesByIdBudget(id_Budget);
                    instanceRowEntry.forEach(async function(instanceRow)
                    {
                        await rowInfoEntry.addInfoRow(idEntry,instanceRow.id_fila);
        
                    });
                } 



                /*ADD IN COSTOSDIRECTOS TABLE */ 
                const [instanceDirectCost,wasCreatedDirectCosts]= await directcosts.addDirectCosts(id_Budget,newMonth,idFlow);
                let idDirectCost=instanceDirectCost.id_costos;
                const quantityRowDirectCosts= await rowDirectCosts.countAllDirectCosts(id_Budget);
                if(quantityRowDirectCosts!=0)
                {
                    const instanceRowDirectCosts= await rowDirectCosts.listAllRowDirectCostsByIdBudget(id_Budget);
                    instanceRowDirectCosts.forEach(async function(instanceRow)
                    {
                        await infoRowDirectCosts.addInfoRow(idDirectCost,instanceRow.id_fila);
        
                    });
                } 



                
                /*ADD IN GASTOS ADMINISTRATIVOS TABLE */ 
                const [instanceAdministrativeExpenses,wasCreatedAdministrativeExpenses]= await administrativeExpenses.addAdministrativeExpenses(id_Budget,newMonth,idFlow);
                let idAdministrativeExpenses=instanceAdministrativeExpenses.id_gastos;
                const quantityAdministrativeExpenses= await rowAdministrativeExpenses.countAllAdministrativeExpenses(id_Budget);
                if(quantityAdministrativeExpenses!=0)
                {
                    const instanceRowAdministrativeExpenses= await rowAdministrativeExpenses.listAllRowAdministrativeExpensesByIdBudget(id_Budget);
                    instanceRowAdministrativeExpenses.forEach(async function(instanceRow)
                    {
                        await infoRowAdministrativeExpenses.addInfoRow(idAdministrativeExpenses,instanceRow.id_fila);
        
                    });
                } 



                   /*ADD IN RECURSOS TABLE */ 
            
                const [instanceResources,wasCreatedResources]= await resources.addResource(id_Budget,newMonth,idFlow);
                let idResource=instanceEntry.id_recurso;
                const quantityRowResource= await rowResources.countAllResources(id_Budget);
                if(quantityRowResource!=0)
                {
                    const instanceRowResource= await rowResources.listAllRowResourcesByIdBudget(id_Budget);
                    instanceRowResource.forEach(async function(instanceRow)
                    {
                        await rowInfoResources.addInfoRow(idResource,instanceRow.id_fila);
        
                    });
                } 


                 /*ADD IN COSTOS TABLE */ 
            
                const [instanceCosts,wasCreatedCosts]= await cost.addCost(id_Budget,newMonth,idFlow);
                let idCosts=instanceCosts.id_costo;
                const quantityRowCosts= await rowCosts.countAllCosts(id_Budget);
                if(quantityRowCosts!=0)
                {
                    const instanceRowCosts= await rowCosts.listAllRowCostsByIdBudget(id_Budget);
                    instanceRowCosts.forEach(async function(instanceRow)
                    {
                        await rowInfoCosts.addInfoRow(idCosts,instanceRow.id_fila);
        
                    });
                } 



                
                 /*ADD IN RESUMEN COSTOS RECURSOS TABLE */ 
            
                 const [instanceSummary,wasCreatedSummary]= await summaryCostsResources.addSummaryCostsResources(id_Budget,newMonth,idFlow);
                 let idSummary=instanceSummary.id_resumen;
                 const quantityRowSummary= await rowSummaryCostsResources.countAllSummaryCostsResources(id_Budget);
                 if(quantityRowSummary!=0)
                 {
                     const instanceRowSummary= await rowSummaryCostsResources.listAllRowSummaryCostByIdBudget(id_Budget);
                     instanceRowSummary.forEach(async function(instanceRow)
                     {
                         await rowInfoSummaryCostsResources.addInfoRow(idSummary,instanceRow.id_fila);
         
                     });
                 } 





            res.redirect('/cashFlow/showCashFlow/'+id_Budget)
            }
            else
              {
                req.flash('danger','El flujo de efectivo no se creo');
         
                const numberRecords= await cashFlow.countAllCashFlow(id_Budget);


                const instanceCashFlow = await cashFlow.getCashFlowInnerJoinByIdBudgetAndIdMonth(id_Budget);
                res.render('CashFlow/cashFlow',
                {
        
                    id_Budget:id_Budget,
                    quantity: numberRecords,
                    instanceCashFlow: instanceCashFlow
        
                });
         
              

             }
        }
        else
        {
            let newMonth=month+1;
            const [instance, wasCreated] = await cashFlow.addCashFlow(id_Budget,newMonth);
          

            if(wasCreated)
            {
                let idFlow= instance.id_flujo;
                 /*ADD IN INGRESOS TABLE */ 

               
                const [instanceEntry,wasCreatedEntry]= await entry.addEntry(id_Budget,newMonth,idFlow);
                let idEntry=instanceEntry.id_ingreso;
                const quantityRow= await rowEntry.countAllEntries(id_Budget);
                if(quantityRow!=0)
                {
                    const instanceRowEntry= await rowEntry.listAllRowEntriesByIdBudget(id_Budget);
                    instanceRowEntry.forEach(async function(instanceRow)
                    {
                        await rowInfoEntry.addInfoRow(idEntry,instanceRow.id_fila);
        
                    });
                }



                  /*ADD IN COSTOSDIRECTOS TABLE */ 
               
                  const [instanceDirectCost,wasCreatedDirectCosts]= await directcosts.addDirectCosts(id_Budget,newMonth,idFlow);
                  let idDirectCost=instanceDirectCost.id_costos;
                  const quantityRowDirectCosts= await rowDirectCosts.countAllDirectCosts(id_Budget);
                if(quantityRowDirectCosts!=0)
                  {
                      const instanceRowDirectCosts= await rowDirectCosts.listAllRowDirectCostsByIdBudget(id_Budget);
                      instanceRowDirectCosts.forEach(async function(instanceRow)
                      {
                          await infoRowDirectCosts.addInfoRow(idDirectCost,instanceRow.id_fila);
          
                      });
                  } 


                    
                /*ADD IN GASTOS ADMINISTRATIVOS TABLE */ 
                const [instanceAdministrativeExpenses,wasCreatedAdministrativeExpenses]= await administrativeExpenses.addAdministrativeExpenses(id_Budget,newMonth,idFlow);
                let idAdministrativeExpenses=instanceAdministrativeExpenses.id_gastos;
                const quantityAdministrativeExpenses= await rowAdministrativeExpenses.countAllAdministrativeExpenses(id_Budget);
                if(quantityAdministrativeExpenses!=0)
                {
                    const instanceRowAdministrativeExpenses= await rowAdministrativeExpenses.listAllRowAdministrativeExpensesByIdBudget(id_Budget);
                    instanceRowAdministrativeExpenses.forEach(async function(instanceRow)
                    {
                        await infoRowAdministrativeExpenses.addInfoRow(idAdministrativeExpenses,instanceRow.id_fila);
        
                    });
                } 



                    /*ADD IN RECURSOS TABLE */ 
            
                    const [instanceResources,wasCreatedResources]= await resources.addResource(id_Budget,newMonth,idFlow);
                    let idResource=instanceEntry.id_recurso;
                    const quantityRowResource= await rowResources.countAllResources(id_Budget);
                    if(quantityRowResource!=0)
                    {
                        const instanceRowResource= await rowResources.listAllRowResourcesByIdBudget(id_Budget);
                        instanceRowResource.forEach(async function(instanceRow)
                        {
                            await rowInfoResources.addInfoRow(idResource,instanceRow.id_fila);
            
                        });
                    } 



                        /*ADD IN COSTOS TABLE */ 
            
                const [instanceCosts,wasCreatedCosts]= await cost.addCost(id_Budget,newMonth,idFlow);
                let idCosts=instanceCosts.id_costo;
                const quantityRowCosts= await rowCosts.countAllCosts(id_Budget);
                if(quantityRowCosts!=0)
                {
                    const instanceRowCosts= await rowCosts.listAllRowCostsByIdBudget(id_Budget);
                    instanceRowCosts.forEach(async function(instanceRow)
                    {
                        await rowInfoCosts.addInfoRow(idCosts,instanceRow.id_fila);
        
                    });
                } 


                 
                 /*ADD IN RESUMEN COSTOS RECURSOS TABLE */ 
            
                 const [instanceSummary,wasCreatedSummary]= await summaryCostsResources.addSummaryCostsResources(id_Budget,newMonth,idFlow);
                 let idSummary=instanceSummary.id_resumen;
                 const quantityRowSummary= await rowSummaryCostsResources.countAllSummaryCostsResources(id_Budget);
                 if(quantityRowSummary!=0)
                 {
                     const instanceRowSummary= await rowSummaryCostsResources.listAllRowSummaryCostByIdBudget(id_Budget);
                     instanceRowSummary.forEach(async function(instanceRow)
                     {
                         await rowInfoSummaryCostsResources.addInfoRow(idSummary,instanceRow.id_fila);
         
                     });
                 } 





                res.redirect('/cashFlow/showCashFlow/'+id_Budget)
            }

            else
            {
                req.flash('danger','El flujo de efectivo no se creo');
       
                const numberRecords= await cashFlow.countAllCashFlow(id_Budget);

                const instanceCashFlow = await cashFlow.getCashFlowInnerJoinByIdBudgetAndIdMonth(id_Budget);
                res.render('CashFlow/cashFlow',
                {
      
                     id_Budget:id_Budget,
                    quantity: numberRecords,
                    instanceCashFlow: instanceCashFlow
      
                });
       
            

           }

        }
        

    }

    
   
}







exports.addColumnPost=async(req,res,next)=>
{

    let id_Budget= req.params.idBudget;
    

    let month=req.body.mes;


    req.checkBody('mes','El campo mes debe de tener un valor').notEmpty();
   
    

    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceMonths= await month.listAllMonths();

        res.render('FlujoDeEfectivo/addColumn',
        {
            errors: errors,
            id_Budget:id_Budget,
            months: instanceMonths
    
        });
    
         
    }
    else
    {
         
     
        const [instance, wasCreated] = await cashFlow.addCashFlow(id_Budget,month);
       

        if(wasCreated)
        {
            let idFlow= instance.id_flujo;
             /*ADD IN INGRESOS TABLE */ 
            
            const [instanceEntry,wasCreatedEntry]= await entry.addEntry(id_Budget,month,idFlow);

             /*ADD IN COSTOSDIRECTOS TABLE */ 
         
            const [instanceDirectCost,wasCreatedDirectCosts]= await directcosts.addDirectCosts(id_Budget,month,idFlow);
        
            /*ADD IN GASTOSADMINISTRATIVOS TABLE */ 
            const [instanceAdministrativeExpenses,wasCreatedAdministrativeExpenses]= await administrativeExpenses.addAdministrativeExpenses(id_Budget,month,idFlow);

            /*ADD IN RECURSOS TABLE */ 
            const [instanceResources,wasCreatedResources]= await resources.addResource(id_Budget,month,idFlow);

            /*ADD IN COSTOS TABLE */
            const [instanceCosts,wasCreatedCosts]= await cost.addCost(id_Budget,month,idFlow);

            /*ADD IN RESUMEN COSTOS RECURSOS TABLE */
            const [instanceSummary,wasCreatedSummary]= await summaryCostsResources.addSummaryCostsResources(id_Budget,month,idFlow);



            res.redirect('/cashFlow/showCashFlow/'+id_Budget);
        }
        else
        {
            const instanceMonths= await month.listAllMonths();
            req.flash('danger','El flujo de efectivo no se creo');


            res.render('CashFlow/addColumn',
            {
                errors: errors,
                id_Budget:id_Budget,
                months: instanceMonths
        
            });
              

        }
    }
}
 



exports.deleteColumnGet=async (req,res,next)=>
{
    let id_Budget= req.params.idBudget;
    const monthtouse= await cashFlow.findMonthAddedLatest(id_Budget);
    let id_flow= monthtouse[0].id_flujo;


   /*DELETE IN INGRESOS TABLE */ 
    const instanceEntry= await entry.deleteEntryColumn(id_flow);
    const instanceRowEntry=await  rowEntry.deleteRowEntryByIdBudget(id_Budget);

   /*DELETE IN COSTOS DIRECTOS TABLE */ 
   const instanceDirectCost= await directcosts.deleteEntryColumn(id_flow);
   const instanceRowDirectCosts=await  rowDirectCosts.deleteRowDirectCostsByIdBudget(id_Budget);

    /*DELETE IN GASTOS ADMINISTRATIVOS TABLE */ 
    const instanceAdministrativeExpenses= await administrativeExpenses.deleteEntryColumn(id_flow);
    const instanceRowAdministrativeExpenses=await  rowAdministrativeExpenses.deleteAdministrativeExpensesByIdBudget(id_Budget);
    

    /*DELETE IN RECURSOS TABLE */ 
    const instanceResources= await resources.deleteEntryColumn(id_flow);
    const instanceRowResources=await  rowResources.deleteRowResourcesByIdBudget(id_Budget);


     /*DELETE IN COSTOS TABLE */ 
     const instanceCosts= await cost.deleteCostColumn(id_flow);
     const instanceRowCosts=await  rowCosts.deleteRowCostsByIdBudget(id_Budget);

    /*DELETE IN RESUMEN COSTOS RESUMEN TABLE */ 
     const instanceSummary= await summaryCostsResources.deleteSummaryCostsResourcesColumn(id_flow);
     const instanceRowSummary=await  rowSummaryCostsResources.deleteRowSummaryCostsResourcesByIdBudget(id_Budget);
  

    const instanceCashFlow= await cashFlow.deleteCashFlow(id_flow) ;


    if(instanceCashFlow===null)
    {
        req.flash('danger','El campo no se elimino');
       
    }
    else
    {
       
       res.redirect('/cashFlow/showCashFlow/'+id_Budget);
       
    }

}



exports.editIncomeGet= async(req,res,next)=>
{      
    
   const idFlow= req.params.idFlow;
  
   const instanceCashFlow= await  cashFlow.findByPrimaryKey(idFlow);
   console.log(instanceCashFlow)

  res.render('CashFlow/editIncome',
   {

       income: instanceCashFlow.ingresos,
       idFlow: idFlow,
       id_Budget: instanceCashFlow.id_presupuesto

   });  
   
}





exports.editIncomePost=async(req,res,next)=>
{
   
    req.checkBody('ingresos','El campo ingresos debe de tener un valor').notEmpty();
   
    const idFlow= req.params.idFlow;
    let income =req.body.ingresos;
    const instanceCashFlow= await cashFlow.findByPrimaryKey(idFlow);
    id_Budget= instanceCashFlow.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceCashFlow= await cashFlow.findByPrimaryKey(idFlow);

        res.render('FlujoDeEfectivo/editIngreso',
         {
      
            income: instanceCashFlow.ingresos,
            idFlow: idFlow,
            id_Budget: instanceCashFlow.id_presupuesto,
            errors:errors
      
         });  
         
    }
    else
    {
        
           
            await cashFlow.editEntry(income,idFlow);
            res.redirect('/cashFlow/showCashFlow/'+id_Budget);        
       
    }
}
  
