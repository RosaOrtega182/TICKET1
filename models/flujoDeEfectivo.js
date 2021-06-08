const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('../models/meses');



class FinancialFlow extends Model 
{


    async listAllFinancialFlow()
    {
        return await FinancialFlow.findAll();
    }

    async countAllFinancialFlow()
    {
        return await FinancialFlow.count();
    }

    async countAllFinancialFlowByIdPresupuesto(idPresupuesto)
    {
        return await FinancialFlow.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }


    async  findMonthAddedLatest(idPresupuesto)
    {
        
        return await FinancialFlow.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addFinancialFlow(id_Presupuesto,mes)
    {
        return await FinancialFlow.findOrCreate(
            {
                where: { id_mes: mes},
                defaults:
                {
                    id_presupuesto:id_Presupuesto,
                    id_mes: mes
                }
            });
    }



    async getFlujosInnerJoinByIdPresupuestoAndIdMes(idPresupuesto)
    {
        return await FinancialFlow.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
           // include: { all: true }
           include: [
            
            {
               
            model: Month,
        
            required: true,
          
            }]
                
          });
    }

    async deleteFinancialFlow(idFlow)
    {
        await FinancialFlow.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }




}   


FinancialFlow.init({

    id_flujo: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_presupuesto:
    {
        type: DataTypes.INTEGER
      /*  references: 
        {
            model: 'presupuestos',
            key: 'id_Presupuesto'
        }*/
    },
    id_mes:
    {
        type: DataTypes.INTEGER
    },

    ingresos:
    {
        type: DataTypes.DECIMAL
        
    },
    egresos:
    {
        type: DataTypes.DECIMAL
        
    },
    total_mes:
    {
        type: DataTypes.DECIMAL
        
    },
    acumulado:
    {
        type: DataTypes.DECIMAL
        
    },
}, 
{ 
    sequelize,
    modelName: 'flujosEfectivos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=FinancialFlow;


