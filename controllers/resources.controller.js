const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/month');
const month= Mes.build();

const Filas= require('../models/rowEntry');
const row= Filas.build();

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
    res.render('resources',
    {
        allBudgets:listBudget,
        quantity: numberRecords
    });
   
}



exports.showResourcesGet=async(req,res,next)=>
{
    const id_Budget= req.params.idBudget;
    const numRegisters= await resources.countAllResources(id_Budget);

    const instanceResources= await resources.getResourcesInnerJoinByIdBudgetAndMonth(id_Budget);
   
    const instanceInfoResources= await rowInfoResources.getInfoRowResourceInnerJoin();
 
    res.render('Resources/resources',
    {

        id_Presupuesto:id_Budget,
        cantidad: numRegisters,
        instanceEntry: instanceResources,
        instanceInfoEntry: instanceInfoResources

    });
   
}


exports.addRowGet=async(req,res,next)=>
{
    const id_Presupuesto= req.params.idBudget;


    res.render('Resources/addRow',
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


        res.render('Resources/addRow',
        {
            errors: errors,
            id_Presupuesto:id_Presupuesto,
           
    
        });
    
         
    }
    else
    {
        
         
      
        const [instanceRow, wasCreated] = await rowResources.addRow(nombre, id_Presupuesto);
        const [instanceRowCosts,wasCreatedCosts]=await rowCosts.addRow(nombre,id_Presupuesto);
        const [instanceRowSummary,wasCreatedSummary]=await rowSummaryCostsResources.addRow(nombre,id_Presupuesto);

        if(wasCreated)
        {

            const instanceResources= await resources.findbyBudget(id_Presupuesto);
            
            instanceResources.forEach(async function(resource)
            {
                await rowInfoResources.addInfoRow(resource.id_recurso,instanceRow.id_fila);

            });
            
            const instanceCosts=await cost.findbyBudget(id_Presupuesto);

            instanceCosts.forEach(async function(cost)
            {
                await rowInfoCosts.addInfoRow(cost.id_costo,instanceRowCosts.id_fila);

            });


            const instanceSummary=await summaryCostsResources.findbyBudget(id_Presupuesto);
            console.log(instanceRowSummary.id_fila);

            instanceSummary.forEach(async function(summary)
            {
                await rowInfoSummaryCostsResources.addInfoRow(summary.id_resumen,instanceRowSummary.id_fila);

            });


           


            res.redirect('/resources/showResources/'+id_Presupuesto)
           
         

           
          
            
        }
        else
        {
            
            const id_Presupuesto= req.params.idBudget;


            res.render('Resources/addRow',
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
    const instanceRowEntry= await rowResources.listAllRowResourcesByIdBudget(id_Budget);
    

    res.render('Resources/deleteRow',
    {
        id_Presupuesto:id_Budget,
        instanceRowEntry: instanceRowEntry
       

    });

   
}



exports.deleteRowPost=async (req,res,next)=>
{
    let id_Presupuesto= req.params.idPresupuesto;
    let id_fila=req.body.concepto;
 
    const InstanceResource= await rowResources.findByPrimaryKey(id_fila);
    const nombre=InstanceResource.nombre;
    const instanceRowResources= await rowResources.deleteRowbyIdRow(id_fila) ;
   //DELETE COSTOS TABLE
    const instanceRowCosts= await rowCosts.deleteRowbyName(nombre);

     //DELETE RESUMEN COSTOS TABLE
     const instanceRowSummary= await rowSummaryCostsResources.deleteRowbyName(nombre);
    if(instanceRowResources===null)
    {
        //req.flash('danger','La fila no se elimino');
       
    }
    else
    {
       res.redirect('/resources/showResources/'+id_Presupuesto);
       
    }

}



exports.editConceptGet= async(req,res,next)=>
{      
    
   const id_info= req.params.idInfo;
  
   const instanceInfoRow= await rowInfoResources.getResourcesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    console.log(instanceInfoRow[0].recurso.id_presupuesto);
  res.render('Resources/editConcept',
   {

       infoRow: instanceInfoRow[0].valor,
       id_info: id_info,
       idPresupuesto: instanceInfoRow[0].recurso.id_presupuesto

   });  
   
}




exports.editConceptPost=async(req,res,next)=>
{
   
    req.checkBody('valor','El campo valor debe de tener un valor').notEmpty();
   
    const id_info= req.params.idInfo;
    let valor= req.body.valor;
    const instanceInfoRow= await rowInfoResources.getResourcesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
    id_Presupuesto= instanceInfoRow[0].recurso.id_presupuesto;
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceInfoRow= await rowInfoResources.getResourcesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info);
      res.render('Incomes/editConcept',
       {
    
           infoRow: instanceInfoRow[0].valor,
           id_info: id_info,
           idPresupuesto: instanceInfoRow[0].recurso.id_presupuesto
    
       });  
         
    }
    else
    {
        
           
            await rowInfoResources.editValorInfoFila(valor,id_info);
            //req.flash('success', 'Se actualizo el producto!');
            res.redirect('/resources/showResources/'+id_Presupuesto);        
       
    }
}
  
