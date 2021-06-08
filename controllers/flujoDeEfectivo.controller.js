const Presupuesto= require('../models/budget')
const budget = Presupuesto.build();
const Mes= require('../models/meses');
const month= Mes.build();
const FlujoDeEfectivo= require('../models/flujoDeEfectivo');
const financialflow= FlujoDeEfectivo.build();


exports.getPresupuestoIndexes=async(req,res,next)=>
{
    
    const listaPresupuestos = await budget.listAllBudgets();
    const numRegistros= await budget.countAllBudgets();
    //res.send('admin area narf');
    res.render('flujoDeEfectivo',
    {
        todosLosPresupuestos:listaPresupuestos,
        cantidad: numRegistros
    });
   
}



/* GET  ADD PRODUCT*/
exports.showFlujoDeEfectivoGet=async(req,res,next)=>
{
    const id_Presupuesto= req.params.idPresupuesto;
    const numRegistros= await financialflow.countAllFinancialFlow();

    const instanceFlujos = await financialflow.getFlujosInnerJoinByIdPresupuestoAndIdMes(id_Presupuesto);


    //console.log(instanceFlujos);
   //console.log(instanceFlujos[0].mese.nombre);
    res.render('FlujoDeEfectivo/flujoDeEfectivo',
    {

        id_Presupuesto:id_Presupuesto,
        cantidad: numRegistros,
        instanceFlujos: instanceFlujos

    });
   
}


exports.addColumnGet=async(req,res,next)=>
{
    const id_Presupuesto= req.params.idPresupuesto;
    const cantidadFinancialFlow= await financialflow.countAllFinancialFlowByIdPresupuesto(id_Presupuesto);

    
    if(cantidadFinancialFlow==0)
    {
    const instanceMonths= await month.listAllMonths();

    res.render('FlujoDeEfectivo/addColumn',
    {
        id_Presupuesto:id_Presupuesto,
        months: instanceMonths

    });

    }
    else
    {

        const monthtouse= await financialflow.findMonthAddedLatest(id_Presupuesto);
        let mes= monthtouse[0].id_mes;
      

        if(mes==12)
        {
            let newmes=1
            const [instance, wasCreated] = await financialflow.addFinancialFlow(id_Presupuesto,newmes);
            if(wasCreated)
        {
        // req.flash('success','Producto agregado troz');
            res.redirect('/flujoDeEfectivo/showFlujoDeEfectivo/'+id_Presupuesto)
                   // console.log("se creo");
        }
        }
        else
        {
            let newmes=mes+1;
            const [instance, wasCreated] = await financialflow.addFinancialFlow(id_Presupuesto,newmes);
            if(wasCreated)
            {
            // req.flash('success','Producto agregado troz');
                res.redirect('/flujoDeEfectivo/showFlujoDeEfectivo/'+id_Presupuesto)
                       // console.log("se creo");
            }

        }
        

    }

    
   
}







exports.addColumnPost=async(req,res,next)=>
{

    let id_Presupuesto= req.params.idPresupuesto;
    

    let mes=req.body.mes;


    req.checkBody('mes','El campo mes debe de tener un valor').notEmpty();
   
    

    let errors= req.validationErrors();
   
    if(errors)
    {
        const instanceMonths= await month.listAllMonths();

        res.render('FlujoDeEfectivo/addColumn',
        {
            errors: errors,
            id_Presupuesto:id_Presupuesto,
            months: instanceMonths
    
        });
    
         
    }
    else
    {
         
     
        const [instance, wasCreated] = await financialflow.addFinancialFlow(id_Presupuesto,mes);

        if(wasCreated)
        {
        // req.flash('success','Producto agregado troz');
            res.redirect('/flujoDeEfectivo/showFlujoDeEfectivo/'+id_Presupuesto)
                   // console.log("se creo");
        }
        else
        {
            const instanceMonths= await month.listAllMonths();

            res.render('FlujoDeEfectivo/addColumn',
            {
                errors: errors,
                id_Presupuesto:id_Presupuesto,
                months: instanceMonths
        
            });
              

        }
    }
}
 


/* GET DELETE PRODUCT*/
exports.deleteColumnGet=async (req,res,next)=>
{
    let id_Presupuesto= req.params.idPresupuesto;
    const monthtouse= await financialflow.findMonthAddedLatest(id_Presupuesto);
    let id_flujo= monthtouse[0].id_flujo;
    const instanceFinancialFlow= await financialflow.deleteFinancialFlow(id_flujo) ;
    if(instanceFinancialFlow===null)
    {
        //req.flash('danger','El producto no se elimino');
       
    }
    else
    {
       // req.flash('success', 'Producto eliminado!');
       res.redirect('/flujoDeEfectivo/showFlujoDeEfectivo/'+id_Presupuesto)
       
    }

}