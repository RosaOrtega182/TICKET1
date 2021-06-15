const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class RowCosts extends Model 
{


    async listAllRowCostsByIdBudget(id_presupuesto)
    {
        return await RowCosts.findAll(
           
        {
            raw: true,
            nest: true ,
            where: 
            {
              id_presupuesto: id_presupuesto
            }
        });
    }



    async addRow(nombre, id_presupuesto)
    {
       

        return await RowCosts.findOrCreate(
            {
                where: { nombre: nombre},
                defaults:
                {
                    nombre: nombre,
            id_presupuesto:id_presupuesto
                }
            });

    }



    async deleteRowbyIdRow(id_fila)
    {
        await RowCosts.destroy({
            where: {
              id_fila: id_fila
            }
          });
    }

    async deleteRowbyName(nombre)
    {
        await RowCosts.destroy({
            where: {
              nombre: nombre
            }
          });
    }


    //THIS METHOD IS USED IN BUDGET

    async deleteRowCostsByIdBudget(id_Budget)
    {
        await RowCosts.destroy({
            where: {
              id_presupuesto: id_Budget
            }
          });
    }



    async countAllCosts(idBudget)
    {
        return await RowCosts.count({
            where:{id_presupuesto: idBudget}
        });
    }

  
    
}


RowCosts.init({

    id_fila: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:
    {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    id_presupuesto:
    {
        type: DataTypes.INTEGER
      /*  references: 
        {
            model: 'presupuestos',
            key: 'id_Presupuesto'
        }*/
    }
}, 
{ 
    sequelize,
    modelName: 'filascostos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=RowCosts;


