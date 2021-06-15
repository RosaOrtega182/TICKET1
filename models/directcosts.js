const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');

const Month=require('./month');






class DirectCost extends Model 
{


    

    async countAllDirectCosts(id_Budget)
    {
        return await DirectCost.count({
            where:{id_presupuesto: id_Budget}
        });
    }

    async countAllEntriesByIdPresupuesto(idPresupuesto)
    {
        return await DirectCost.count({
            where: {
              id_presupuesto:  idPresupuesto
            }
          });

    }



    async countAllEntriesByRow(id_Presupuesto)
    {

        const Op = require('sequelize').Op;
       


        return await DirectCost.count(
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
        
        return await DirectCost.findAll({
            limit: 1,
            where: {
             id_presupuesto: idPresupuesto
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
    }





    async addDirectCosts(id_Presupuesto,mes,id_flujo)
    {
        return await DirectCost.findOrCreate(
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



    async getDirectCostsInnerJoinByIdBudgetAndMonth(id_Budget)
    {
          return await  DirectCost.findAll({
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
        return await DirectCost.findAll({
       
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
        await DirectCost.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await DirectCost.findByPk(id);
    }

  
    //TOTALESSSSSSSSSSSSSSSSSSSSS
    async editTotalMes(total_mes, idPresupuesto, id_costos)
    {
        await DirectCost.update({total_mes:total_mes},
            {
                where: {
                    id_presupuesto:idPresupuesto,
                    id_costos: id_costos
                  } 
            }

        )
    }



    async editEntryIdFila(idFila,idPresupuesto)
    {
        await DirectCost.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }



    async  findbyPresupuesto(idPresupuesto)
    {
        
        return await DirectCost.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_presupuesto: idPresupuesto
            }
          })
    }



    async  findbyFlow(id_flujo)
    {
        
        return await DirectCost.findAll({
            raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
             id_flujo: id_flujo
            }
          })
    }




}   


DirectCost.init({

    id_costos: 
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
    modelName: 'costosdirectos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=DirectCost;


