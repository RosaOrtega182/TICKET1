const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');
const Month=require('./month');






class AdministrativeExpenses extends Model 
{


    async listAllFinancialFlow()
    {
        return await AdministrativeExpenses.findAll();
    }

    async countAllAdministrativeExpenses(id_Budget)
    {
        return await AdministrativeExpenses.count({
            where:{id_presupuesto: id_Budget}
        });
    }

    async countAllEntriesByIdPresupuesto(idPresupuesto)
    {
        return await AdministrativeExpenses.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }



    async countAllEntriesByRow(id_Presupuesto)
    {

        const Op = require('sequelize').Op;
       


        return await AdministrativeExpenses.count(
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
        
        return await AdministrativeExpenses.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addAdministrativeExpenses(id_Presupuesto,mes,id_flujo)
    {
        return await AdministrativeExpenses.findOrCreate(
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



    async getAdministrativeExpensesInnerJoinByIdBudgetAndMonth(id_Budget)
    {
          return await  AdministrativeExpenses.findAll({
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
        return await AdministrativeExpenses.findAll({
       
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
        await AdministrativeExpenses.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await AdministrativeExpenses.findByPk(id);
    }

    async editEntry(ingresos,idFlujo)
    {
        await FinancialFlow.update({  ingresos: ingresos}, {
            where: {
              id_flujo:  idFlujo
            }
          });
    }



        async editTotalMes(total_mes, idPresupuesto, id_gastos)
    {
        await AdministrativeExpenses.update({total_mes:total_mes},
            {
                where: {
                    id_presupuesto:idPresupuesto,
                    id_gastos: id_gastos
                  } 
            }

        )
    }


    async editEntryIdFila(idFila,idPresupuesto)
    {
        await AdministrativeExpenses.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }



    async  findbyPresupuesto(idPresupuesto)
    {
        
        return await AdministrativeExpenses.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_presupuesto: idPresupuesto
            }
          })
    }

    async  findbyFlow(id_flujo)
    {
        
        return await AdministrativeExpenses.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_flujo: id_flujo
            }
          })
    }




}   


AdministrativeExpenses.init({

    id_gastos: 
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
    modelName: 'gastosadministrativos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=AdministrativeExpenses;


