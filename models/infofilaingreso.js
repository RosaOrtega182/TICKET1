const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const Row= require('./rowEntry');
const Income = require('./income');



class InfoEntry extends Model 
{
    async addInfoRow(id_ingreso,id_fila)
    {
        return await InfoEntry.create(
        {
            id_ingreso:id_ingreso,
            id_fila: id_fila
        });

    }


    async findByPrimaryKey(id)
    {
        return await InfoEntry.findByPk(id);
    }


    async editValorInfoFila(valor,id_info)
    {
        await InfoEntry.update({  valor: valor}, {
            where: {
              id_info:  id_info
            }
          });
    }




  /*  async listAllFinancialFlow()
    {
        return await Entry.findAll();
    }

    async countAllEntry()
    {
        return await Entry.count();
    }

    async countAllEntriesByIdPresupuesto(idPresupuesto)
    {
        return await Entry.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }

    



    async countAllEntriesByRow(id_Presupuesto)
    {

        const Op = require('sequelize').Op;
       


        return await Entry.count(
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
        
        return await Entry.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addEntry(id_Presupuesto,mes,id_flujo)
    {
        return await Entry.findOrCreate(
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


*/

async getFlujosInnerJoinByIdPresupuestoAndIdMesAndIdFlujo(id_info)
    {
        return await InfoEntry.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_info:id_info
            },
          
          include: { all: true }

         
          });
          
    }


    async getSum(id_ingreso)
    {
        return await InfoEntry.sum('valor',
        {
            where:{id_ingreso:id_ingreso}
        }

        );
    }


    async getInfoRowIncomeInnerJoin()
    {
        return await InfoEntry.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
            
            include: [
                {model: Row }
              ], 
            order: [ [ 'id_fila', 'ASC' ], [ 'id_ingreso', 'ASC' ]]
        
          });
    }

 /*   async deleteEntryColumn(idFlow)
    {
        await Entry.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await Entry.findByPk(id);
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
        await Entry.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }*/




}   


InfoEntry.init({

    id_info: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_ingreso:
    {
        type: DataTypes.INTEGER
      /*  references: 
        {
            model: 'presupuestos',
            key: 'id_Presupuesto'
        }*/
    },
    id_fila:
    {
        type: DataTypes.INTEGER
    },
   

    valor:
    {
        type: DataTypes.DECIMAL(7,2)
        
    }
   
}, 
{ 
    sequelize,
    modelName: 'infofilasingresos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=InfoEntry;


