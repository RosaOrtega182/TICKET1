const express= require('express');
const app= express();
const path= require('path');
const userAuthenticateRoute=require('./routes/userAuthenticate.route');
const budgetRoute= require('./routes/budget.route');
const cashFlowRoute= require('./routes/cashFlow.route');
const incomesRoute=require('./routes/incomes.route');
const directCostsRoute=require('./routes/directCosts.route');
const administrativeExpensesRoute=require('./routes/administrativeExpenses.route');
const resourcesRoute=require('./routes/resources.route');
const costRoute=require('./routes/cost.route');
const summaryCostsResourcesRoute=require('./routes/summaryCostsResources.route')
const session= require('express-session');
const flash=require('connect-flash');
const expressValidator = require('express-validator');
const passport= require('passport');
const bodyParser=require('body-parser');
const sequelize= require('./models/conexion');
const User= require('./models/user');
const Budget= require('./models/budget');
const Month=require('./models/month');
const CashFlow=require('./models/cashFlow');

const Row=require('./models/rowEntry');
const Incomes=require('./models/income');
const InfoEntry= require('./models/infofilaingreso');

const RowDirectCosts=require('./models/rowDirectCosts');
const DirectCosts=require('./models/directcosts');
const InfoRowDirectCosts= require('./models/infoRowDirectCosts');

const RowAdministrativeExpenses=require('./models/rowAdministrativeExpenses');
const AdministrativeExpenses=require('./models/administrativeExpenses');
const InfoRowAdministrativeExpenses=require('./models/infofilaAdministrativeExpenses');

const RowResources=require('./models/rowResources');
const Resources= require('./models/resources');
const InfoRowResources=require('./models/infofilaresources');

const RowCosts=require('./models/rowCosts');
const Costs= require('./models/costs');
const InfoRowCosts=require('./models/infofilaCosts');

const RowSummaryCostsResources=require('./models/rowSummaryCostsResources');
const SummaryCostsResources= require('./models/summarycostsresources');
const InfoRowSummaryCostResources=require('./models/infofilaSummaryCostResources');


const dotenv=require ('dotenv');

 
dotenv.config();

/*SERVICIO DE ARCHIVOS ESTATICOS
Para el servicio de archivos estáticos como, por ejemplo, imágenes, 
archivos CSS y archivos JavaScript, utilice la función de middleware incorporado express.static de Express. 
*/

app.use(express.static(path.join(__dirname,'assets')));



/* MOTORES DE PLANTILLA
views: el directorio donde se encuentran los archivos de plantilla
view engine, el motor de plantilla que se utiliza*/

app.set ('view engine','ejs');
app.set('views','views');



/*MIDDLEWARES GLOBALES*/
app.use(express.json());//Leer o decodificar todos los json que lleguen en los request por medio de param o body


app.use(bodyParser.urlencoded({extended: false}));


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));









// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
   
}));


//config passport
require('./middlewares/middleware.passport')(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Express Messages middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


//SET GLOBAL ERRORS VALIDATOR
app.locals.errors=null;


app.get('/*',function(req,res,next)
{
 res.locals.token= req.session.token;
 res.locals.user=req.user || null;
 next();
});

app.use('/', userAuthenticateRoute);
app.use('/',budgetRoute);
app.use('/cashFlow',cashFlowRoute);
app.use('/incomes',incomesRoute);
app.use('/directCosts',directCostsRoute);
app.use('/administrativeExpenses',administrativeExpensesRoute);
app.use('/resources',resourcesRoute);
app.use('/costs',costRoute);
app.use('/summaryCostsResources',summaryCostsResourcesRoute);




app.get('/error',(req,res,next)=>
{
    res.status(500);
    res.render('error.ejs',
    {
        pageTitle: "Error narf!"
    })

});










/*LEVANTAMOS SERVIDOR*/




async function inicioServidor()
{
    try
    {
        
        // ASOCIACIONES TABLA FLUJOSEFECTIVO
        Budget.hasMany(CashFlow,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
        CashFlow.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});

        Month.hasMany(CashFlow,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
        CashFlow.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});


       
       //ASOCIACIONES TABLA  ingresos
        Budget.hasMany(Incomes,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
        Incomes.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});

        Month.hasMany(Incomes,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
        Incomes.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});

        Incomes.belongsTo(CashFlow,{foreignKey: 'id_flujo'});


        Row.hasMany(InfoEntry,{foreignKey: 'id_fila', sourceKey: 'id_fila'});
        InfoEntry.belongsTo(Row,{foreignKey: 'id_fila', targetKey: 'id_fila'});

        Incomes.hasOne(InfoEntry,{foreignKey: 'id_ingreso', sourceKey: 'id_ingreso'});
        InfoEntry.belongsTo(Incomes,{foreignKey: 'id_ingreso', targetKey: 'id_ingreso'});

        Row.belongsTo(Budget,{foreignKey:'id_presupuesto'});



        //ASOCIACIONES TABLA  costosdirectos
        Budget.hasMany(DirectCosts,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
        DirectCosts.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});

        Month.hasMany(DirectCosts,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
        DirectCosts.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});

        DirectCosts.belongsTo(CashFlow,{foreignKey: 'id_flujo'});

        

        RowDirectCosts.hasMany(InfoRowDirectCosts,{foreignKey: 'id_fila', sourceKey: 'id_fila'});
        InfoRowDirectCosts.belongsTo(RowDirectCosts,{foreignKey: 'id_fila', targetKey: 'id_fila'});

        DirectCosts.hasOne(InfoRowDirectCosts,{foreignKey: 'id_costos', sourceKey: 'id_costos'});
        InfoRowDirectCosts.belongsTo(DirectCosts,{foreignKey: 'id_costos', targetKey: 'id_costos'});
      
        RowDirectCosts.belongsTo(Budget,{foreignKey:'id_presupuesto'});
        


        //ASOCIACIONES TABLA  gastos administrativos
        Budget.hasMany(AdministrativeExpenses,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
        AdministrativeExpenses.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});

        Month.hasMany(AdministrativeExpenses,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
        AdministrativeExpenses.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});

        AdministrativeExpenses.belongsTo(CashFlow,{foreignKey: 'id_flujo'});

        RowAdministrativeExpenses.hasMany(InfoRowAdministrativeExpenses,{foreignKey: 'id_fila', sourceKey: 'id_fila'});
        InfoRowAdministrativeExpenses.belongsTo( RowAdministrativeExpenses,{foreignKey: 'id_fila', targetKey: 'id_fila'});

        AdministrativeExpenses.hasOne(InfoRowAdministrativeExpenses,{foreignKey: 'id_gastos', sourceKey: 'id_gastos'});
        InfoRowAdministrativeExpenses.belongsTo( AdministrativeExpenses,{foreignKey: 'id_gastos', targetKey: 'id_gastos'});
      
        RowAdministrativeExpenses.belongsTo(Budget,{foreignKey:'id_presupuesto'});





          //ASOCIACIONES TABLA  recursos
          Budget.hasMany(Resources,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
          Resources.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});
  
          Month.hasMany(Resources,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
          Resources.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});
  
          Resources.belongsTo(CashFlow,{foreignKey: 'id_flujo'});
  
          
  
          RowResources.hasMany(InfoRowResources,{foreignKey: 'id_fila', sourceKey: 'id_fila'});
          InfoRowResources.belongsTo(RowResources,{foreignKey: 'id_fila', targetKey: 'id_fila'});
  
          Resources.hasOne(InfoRowResources,{foreignKey: 'id_recurso', sourceKey: 'id_recurso'});
          InfoRowResources.belongsTo(Resources,{foreignKey: 'id_recurso', targetKey: 'id_recurso'});
        
          RowResources.belongsTo(Budget,{foreignKey:'id_presupuesto'});




          //ASOCIACIONES TABLA  costos
        Budget.hasMany(Costs,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
        Costs.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});

        Month.hasMany(Costs,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
        Costs.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});

        Costs.belongsTo(CashFlow,{foreignKey: 'id_flujo'});


        RowCosts.hasMany(InfoRowCosts,{foreignKey: 'id_fila', sourceKey: 'id_fila'});
        InfoRowCosts.belongsTo(RowCosts,{foreignKey: 'id_fila', targetKey: 'id_fila'});

        Costs.hasOne(InfoRowCosts,{foreignKey: 'id_costo', sourceKey: 'id_costo'});
        InfoRowCosts.belongsTo(Costs,{foreignKey: 'id_costo', targetKey: 'id_costo'});

        RowCosts.belongsTo(Budget,{foreignKey:'id_presupuesto'});
        

            //ASOCIACIONES TABLA RESUMENCOSTOSRECURSOS
            Budget.hasMany(SummaryCostsResources,{foreignKey: 'id_presupuesto', sourceKey: 'id_Presupuesto'});
            SummaryCostsResources.belongsTo(Budget,{foreignKey: 'id_presupuesto', targetKey: 'id_Presupuesto'});
    
            Month.hasMany(SummaryCostsResources,{foreignKey: 'id_mes', sourceKey: 'id_mes'});
            SummaryCostsResources.belongsTo(Month,{foreignKey: 'id_mes', targetKey: 'id_mes'});
    
            SummaryCostsResources.belongsTo(CashFlow,{foreignKey: 'id_flujo'});
    
    
            RowSummaryCostsResources.hasMany(InfoRowSummaryCostResources,{foreignKey: 'id_fila', sourceKey: 'id_fila'});
            InfoRowSummaryCostResources.belongsTo(RowSummaryCostsResources,{foreignKey: 'id_fila', targetKey: 'id_fila'});
    
            SummaryCostsResources.hasOne(InfoRowSummaryCostResources,{foreignKey: 'id_resumen', sourceKey: 'id_resumen'});
            InfoRowSummaryCostResources.belongsTo(SummaryCostsResources,{foreignKey: 'id_resumen', targetKey: 'id_resumen'});
    
            RowSummaryCostsResources.belongsTo(Budget,{foreignKey:'id_presupuesto'});
            




        /* User.sync({ alter: true }): Esto verifica cuál es el estado actual de la tabla en la base de datos (qué columnas tiene, 
         cuáles son sus tipos de datos, etc.), y luego realiza los cambios necesarios en la tabla para que coincida con
          el modelo.*/
      
        await User.sync({alter:true});
        await Budget.sync({alter:true});
        await Month.sync({alter:true});
        await CashFlow.sync({alter:true});
        await Row.sync({alter:true});
        await Incomes.sync({alter:true});
        await InfoEntry.sync({alter:true});
        await RowDirectCosts.sync({alter:true});
        await DirectCosts.sync({alter:true});
        await InfoRowDirectCosts.sync({alter:true});
        await RowAdministrativeExpenses.sync({alter:true});
        await AdministrativeExpenses.sync({alter:true});
        await InfoRowAdministrativeExpenses.sync({alter:true});
        await RowResources.sync({alter:true});
        await Resources.sync({alter:true});
        await InfoRowResources.sync({alter:true});
        await RowCosts.sync({alter:true});
        await Costs.sync({alter:true});
        await InfoRowCosts.sync({alter:true});
        await RowSummaryCostsResources.sync({alter:true});
        await SummaryCostsResources.sync({alter:true});
        await InfoRowSummaryCostResources.sync({alter:true});

        await sequelize.authenticate();
        console.log("Se ha conectado a la Base de datos yujuuu");
        app.listen(process.env.PORT,()=>{
            console.log(`Server started to listener on http://${process.env.HOST}:${process.env.PORT} yupi`);
        })
    }
    catch(err)
    {
        console.log(err);
        console.log("No se pudo conectar con la base de datos");
    }
}



inicioServidor();