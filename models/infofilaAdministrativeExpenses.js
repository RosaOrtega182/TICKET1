const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Budget= require('../models/budget');
const Month=require('./month');
const RowAdministrativeExpenses= require('./rowAdministrativeExpenses');



class InfoAdministrativeExpenses extends Model 
{
    async addInfoRow(id_gastos,id_fila)
    {
        return await InfoAdministrativeExpenses.create(
        {
            id_gastos:id_gastos,
            id_fila: id_fila
        });

    }


    async findByPrimaryKey(id)
    {
        return await InfoAdministrativeExpenses.findByPk(id);
    }


    async editValorInfoFila(valor,id_info)
    {
        await InfoAdministrativeExpenses.update({  valor: valor}, {
            where: {
              id_info:  id_info
            }
          });
    }




  
async getAdministrativeExpensesInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info)
    {
        return await InfoAdministrativeExpenses.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_info:id_info
            },
          
          include: { all: true }

         
          });
          
    }



     async getSum(id_gastos)
    {
        return await InfoAdministrativeExpenses.sum('valor',
        {
            where:{id_gastos:id_gastos}
        }

        );
    }



    async getInfoRowAdministrativeExpensesInnerJoin()
    {
        return await InfoAdministrativeExpenses.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
            
            include: [
                {model: RowAdministrativeExpenses }
              ], 
            order: [ [ 'id_fila', 'ASC' ], [ 'id_gastos', 'ASC' ]]

          });
    }

 


}   


InfoAdministrativeExpenses.init({

    id_info: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_gastos:
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
    modelName: 'infofilasgastosadministrativos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=InfoAdministrativeExpenses;


