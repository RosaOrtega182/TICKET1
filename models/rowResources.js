const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class RowResources extends Model 
{


    async listAllRowResourcesByIdBudget(id_presupuesto)
    {
        return await RowResources.findAll(
           
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
       

        return await RowResources.findOrCreate(
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
        await RowResources.destroy({
            where: {
              id_fila: id_fila
            }
          });
    }


    
   


    //THIS METHOD IS USED IN BUDGET

    async deleteRowResourcesByIdBudget(id_Budget)
    {
        await RowResources.destroy({
            where: {
              id_presupuesto: id_Budget
            }
          });
    }



    async countAllResources(idBudget)
    {
        return await RowResources.count({
            where:{id_presupuesto: idBudget}
        });
    }


    async findByPrimaryKey(id)
    {
        return await RowResources.findByPk(id);
    }

  
    
}


RowResources.init({

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
    modelName: 'filasrecursos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=RowResources;


