const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const Row= require('./rowEntry');
const infoFilas=require('../models/infofilaingreso');





class SummaryCostsResources extends Model 
{


    async listAllFinancialFlow()
    {
        return await SummaryCostsResources.findAll();
    }

    async countAllSummaryCostsResources(id_Budget)
    {
        return await SummaryCostsResources.count({
            where:{id_presupuesto: id_Budget}
        });
    }

    async countAllEntriesByIdPresupuesto(idPresupuesto)
    {
        return await SummaryCostsResources.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }



    async countAllEntriesByRow(id_Presupuesto)
    {

        const Op = require('sequelize').Op;
       


        return await SummaryCostsResources.count(
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
        
        return await SummaryCostsResources.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addSummaryCostsResources(id_Presupuesto,mes,id_flujo)
    {
        return await SummaryCostsResources.findOrCreate(
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



    async getSummaryInnerJoinByIdBudgetAndMonth(id_Budget)
    {
          return await  SummaryCostsResources.findAll({
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
        return await SummaryCostsResources.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_presupuesto:idPresupuesto
            },
          
          include: { all: true }

         
          });
          
    }


    async deleteSummaryCostsResourcesColumn(idFlow)
    {
        await SummaryCostsResources.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await SummaryCostsResources.findByPk(id);
    }

  


    async editEntryIdFila(idFila,idPresupuesto)
    {
        await SummaryCostsResources.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }



    async  findbyBudget(idPresupuesto)
    {
        
        return await SummaryCostsResources.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_presupuesto: idPresupuesto
            }
          })
    }




}   


SummaryCostsResources.init({

    id_resumen: 
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
    modelName: 'resumencostosrecursos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=SummaryCostsResources;


