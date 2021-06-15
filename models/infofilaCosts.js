const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const RowCosts= require('./rowCosts');



class InfoCosts extends Model 
{
    async addInfoRow(id_costo,id_fila)
    {
        return await InfoCosts.create(
        {
            id_costo:id_costo,
            id_fila: id_fila
        });

    }


    async findByPrimaryKey(id)
    {
        return await InfoCosts.findByPk(id);
    }


    async editValorInfoFila(valor,id_info)
    {
        await InfoCosts.update({  valor: valor}, {
            where: {
              id_info:  id_info
            }
          });
    }



async getCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info)
    {
        return await InfoCosts.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_info:id_info
            },
          
          include: { all: true }

         
          });
          
    }



    async getInfoRowCostsInnerJoin()
    {
        return await InfoCosts.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
            
            include: [
                {model: RowCosts }
              ], 
            order: [ [ 'id_fila', 'ASC' ]]
        
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


InfoCosts.init({

    id_info: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    id_costo:
    {
        type: DataTypes.INTEGER
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
    modelName: 'infofilascostos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=InfoCosts;


