const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const RowResource= require('./rowResources');



class InfoResources extends Model 
{
    async addInfoRow(id_recurso,id_fila)
    {
        return await InfoResources.create(
        {
            id_recurso:id_recurso,
            id_fila: id_fila
        });

    }


    async findByPrimaryKey(id)
    {
        return await InfoResources.findByPk(id);
    }


    async editValorInfoFila(valor,id_info)
    {
        await InfoResources.update({  valor: valor}, {
            where: {
              id_info:  id_info
            }
          });
    }





    async getResourcesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info)
    {
        return await InfoResources.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_info:id_info
            },
          
          include: { all: true }

         
          });
          
    }



    async getInfoRowResourceInnerJoin()
    {
        return await InfoResources.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
            
            include: [
                {model: RowResource }
              ], 
            order: [ [ 'id_fila', 'ASC' ]]
        
          });
    }

 




}   


InfoResources.init({

    id_info: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_recurso:
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
    modelName: 'infofilasrecursos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=InfoResources;


