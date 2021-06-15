const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class RowAdministrativeExpenses extends Model 
{


    async listAllRowAdministrativeExpensesByIdBudget(id_presupuesto)
    {
        return await RowAdministrativeExpenses.findAll(
           
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
       

        return await RowAdministrativeExpenses.findOrCreate(
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
        await RowAdministrativeExpenses.destroy({
            where: {
              id_fila: id_fila
            }
          });
    }


    //THIS METHOD IS USED IN BUDGET

    async deleteAdministrativeExpensesByIdBudget(id_Budget)
    {
        await RowAdministrativeExpenses.destroy({
            where: {
              id_presupuesto: id_Budget
            }
          });
    }



    async countAllAdministrativeExpenses(idBudget)
    {
        return await RowAdministrativeExpenses.count({
            where:{id_presupuesto: idBudget}
        });
    }

  
    
}


RowAdministrativeExpenses.init({

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
    modelName: 'filasgastosadministrativos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=RowAdministrativeExpenses;


