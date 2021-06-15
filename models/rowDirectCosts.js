const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class RowDirectCosts extends Model 
{


    async listAllRowDirectCostsByIdBudget(id_presupuesto)
    {
        return await RowDirectCosts.findAll(
           
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
       

        return await RowDirectCosts.findOrCreate(
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
        await RowDirectCosts.destroy({
            where: {
              id_fila: id_fila
            }
          });
    }


    //THIS METHOD IS USED IN BUDGET

    async deleteRowDirectCostsByIdBudget(id_Budget)
    {
        await RowDirectCosts.destroy({
            where: {
              id_presupuesto: id_Budget
            }
          });
    }



    async countAllDirectCosts(idBudget)
    {
        return await RowDirectCosts.count({
            where:{id_presupuesto: idBudget}
        });
    }

  
    
}


RowDirectCosts.init({

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
    modelName: 'filascostosdirectos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=RowDirectCosts;


