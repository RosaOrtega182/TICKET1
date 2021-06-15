const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class Row extends Model 
{


    async listAllRowEntriesByIdBudget(id_presupuesto)
    {
        return await Row.findAll(
           
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
       

        return await Row.findOrCreate(
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
        await Row.destroy({
            where: {
              id_fila: id_fila
            }
          });
    }


    //THIS METHOD IS USED IN BUDGET

    async deleteRowEntryByIdBudget(id_Budget)
    {
        await Row.destroy({
            where: {
              id_presupuesto: id_Budget
            }
          });
    }



    async countAllEntries(idBudget)
    {
        return await Row.count({
            where:{id_presupuesto: idBudget}
        });
    }

  
    
}


Row.init({

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
    modelName: 'filas' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=Row;


