const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const Row= require('./rowEntry');
const infoFilas=require('../models/infofilaingreso');





class Income extends Model 
{


    async listAllFinancialFlow()
    {
        return await Income.findAll();
    }

    async countAllIncomes(id_Budget)
    {
        return await Income.count({
            where:{id_presupuesto: id_Budget}
        });
    }

    async countAllEntriesByIdPresupuesto(idPresupuesto)
    {
        return await Income.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }



    async countAllEntriesByRow(id_Presupuesto)
    {

        const Op = require('sequelize').Op;
       


        return await Income.count(
        {
            where:
            {
                id_presupuesto: id_Presupuesto,
                id_fila:  { [Op.is]: null }
            }
        });

      
    }





    async  findMonthAddedLatest(idPresupuesto)
    {
        
        return await Income.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addEntry(id_Presupuesto,mes,id_flujo)
    {
        return await Income.findOrCreate(
            {
                where: { id_mes: mes},
                defaults:
                {
                    id_presupuesto:id_Presupuesto,
                    id_mes: mes,
                    id_flujo:id_flujo
                }
            });
    }



    async getIncomesInnerJoinByIdBudgetAndMonth(id_Budget)
    {
          return await  Income.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {id_presupuesto: id_Budget},
            include: [
                {model: Month }
              ]
            });
    }


    async getFlujosInnerJoinByIdPresupuestoAndIdMesAndIdFlujo(idPresupuesto)
    {
        return await Income.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_presupuesto:idPresupuesto
            },
          
          include: { all: true }

         
          });
          
    }


    async deleteEntryColumn(idFlow)
    {
        await Income.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await Income.findByPk(id);
    }

    async editEntry(ingresos,idFlujo)
    {
        await FinancialFlow.update({  ingresos: ingresos}, {
            where: {
              id_flujo:  idFlujo
            }
          });
    }


    async editTotalMes(total_mes, idPresupuesto, id_ingreso)
    {
        await Income.update({total_mes:total_mes},
            {
                where: {
                    id_presupuesto:idPresupuesto,
                    id_ingreso: id_ingreso
                  } 
            }

        )
    }



    async editEntryIdFila(idFila,idPresupuesto)
    {
        await Income.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }



    async  findbyPresupuesto(idPresupuesto)
    {
        
        return await Income.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_presupuesto: idPresupuesto
            }
          })
    }




}   


Income.init({

    id_ingreso: 
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
    id_flujo:
    {
        type: DataTypes.INTEGER
        
    },

    total_mes:
    {
        type: DataTypes.DECIMAL(7,2)
        
    }
   
}, 
{ 
    sequelize,
    modelName: 'ingresos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=Income;


