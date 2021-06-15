const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class RowSummaryCostsResources extends Model 
{


    async listAllRowSummaryCostByIdBudget(id_presupuesto)
    {
        return await RowSummaryCostsResources.findAll(
           
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
       

        return await RowSummaryCostsResources.findOrCreate(
            {
                where: { nombre: nombre},
                defaults:
                {
                    nombre: nombre,
            id_presupuesto:id_presupuesto
                }
            });

    }



    async deleteRowbyName(nombre)
    {
        await RowSummaryCostsResources.destroy({
            where: {
              nombre: nombre
            }
          });
    }


    //THIS METHOD IS USED IN BUDGET

    async deleteRowSummaryCostsResourcesByIdBudget(id_Budget)
    {
        await RowSummaryCostsResources.destroy({
            where: {
              id_presupuesto: id_Budget
            }
          });
    }



    async countAllSummaryCostsResources(idBudget)
    {
        return await RowSummaryCostsResources.count({
            where:{id_presupuesto: idBudget}
        });
    }

  
    
}


RowSummaryCostsResources.init({

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
    modelName: 'filasresumencostosrecursos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=RowSummaryCostsResources;


