const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const Row= require('./rowEntry');
const infoFilas=require('../models/infofilaingreso');





class Resources extends Model 
{


    async listAllFinancialFlow()
    {
        return await Resources.findAll();
    }

    async countAllResources(id_Budget)
    {
        return await Resources.count({
            where:{id_presupuesto: id_Budget}
        });
    }

    async countAllEntriesByIdPresupuesto(idPresupuesto)
    {
        return await Resources.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }



    async countAllEntriesByRow(id_Presupuesto)
    {

        const Op = require('sequelize').Op;
       


        return await Resources.count(
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
        
        return await Resources.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addResource(id_Presupuesto,mes,id_flujo)
    {
        return await Resources.findOrCreate(
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



    async getResourcesInnerJoinByIdBudgetAndMonth(id_Budget)
    {
          return await  Resources.findAll({
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
        return await Resources.findAll({
       
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
        await Resources.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await Resources.findByPk(id);
    }

    async editEntry(ingresos,idFlujo)
    {
        await FinancialFlow.update({  ingresos: ingresos}, {
            where: {
              id_flujo:  idFlujo
            }
          });
    }


    async editEntryIdFila(idFila,idPresupuesto)
    {
        await Resources.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }



    async  findbyBudget(idPresupuesto)
    {
        
        return await Resources.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_presupuesto: idPresupuesto
            }
          })
    }




}   


Resources.init({

    id_recurso: 
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
    modelName: 'recursos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=Resources;


