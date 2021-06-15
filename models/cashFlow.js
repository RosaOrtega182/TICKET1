const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');



class CashFlow extends Model 
{


    async listAllCashFlow()
    {
        return await CashFlow.findAll();
    }

    async countAllCashFlow(idBudget)
    {
        return await CashFlow.count({
            where:{id_presupuesto: idBudget}
        });
    }

    async getCashFlowInnerJoinByIdBudgetAndIdMonth(idBudget)
    {
        return await CashFlow.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
           where: {id_presupuesto: idBudget},
           // include: { all: true }
           include: [
            
            {
               
            model: Month,
        
            required: true,
          
            }]
                
          });
    }







    async countAllCashFlowByIdBudget(id_Budget)
    {
        return await CashFlow.count({
            where: {
              id_presupuesto:  id_Budget
            }
          });

    }


    async  findMonthAddedLatest(id_Budget)
    {
        
        return await CashFlow.findAll({
            limit: 1,
            where: {
             id_presupuesto: id_Budget
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addCashFlow(id_Budget,month)
    {
        return await CashFlow.findOrCreate(
            {
                where: { id_mes: month},
                defaults:
                {
                    id_presupuesto:id_Budget,
                    id_mes: month
                }
            });
    }





    async deleteCashFlow(idFlow)
    {
        await CashFlow.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await CashFlow.findByPk(id);
    }

    async editEntry(ingresos,idFlujo)
    {
        await CashFlow.update({  ingresos: ingresos}, {
            where: {
              id_flujo:  idFlujo
            }
          });
    }



    async editTotalMes(total_mes, idPresupuesto, id_flujo)
    {
        await CashFlow.update({egresos:total_mes},
            {
                where: {
                    id_presupuesto:idPresupuesto,
                    id_flujo: id_flujo
                  } 
            }

        )
    }



}   

CashFlow.init({

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
        type: DataTypes.DECIMAL(7,2)
        
    },
    egresos:
    {
        type: DataTypes.DECIMAL(7,2)
        
    },
    total_mes:
    {
        type: DataTypes.DECIMAL(7,2)
        
    },
    acumulado:
    {
        type: DataTypes.DECIMAL(7,2)
        
    },
}, 
{ 
    sequelize,
    modelName: 'flujosEfectivos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=CashFlow;


