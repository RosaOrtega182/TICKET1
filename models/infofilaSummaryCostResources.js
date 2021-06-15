const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const RowSummary= require('./rowSummaryCostsResources');



class InfoSummaryCostResources extends Model 
{
    async addInfoRow(id_resumen,id_fila)
    {
        return await InfoSummaryCostResources.create(
        {
            id_resumen:id_resumen,
            id_fila: id_fila
        });

    }


    async findByPrimaryKey(id)
    {
        return await InfoSummaryCostResources.findByPk(id);
    }


    async editValorInfoFila(valor,id_info)
    {
        await InfoSummaryCostResources.update({  valor: valor}, {
            where: {
              id_info:  id_info
            }
          });
    }



async getSummaryInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info)
    {
        return await InfoSummaryCostResources.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_info:id_info
            },
          
          include: { all: true }

         
          });
          
    }



    async getInfoRowSummaryInnerJoin()
    {
        return await InfoSummaryCostResources.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
            
            include: [
                {model: RowSummary }
              ], 
            order: [ [ 'id_fila', 'ASC' ]]
        
          });
    }

 


}   


InfoSummaryCostResources.init({

    id_info: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_resumen:
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
    modelName: 'infofilasresumencostosrecursos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=InfoSummaryCostResources;


