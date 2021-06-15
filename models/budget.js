const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');



class Budget extends Model 
{


    async listAllBudgets()
    {
        return await Budget.findAll();
    }

    async countAllBudgets()
    {
        return await Budget.count();
    }

    async addBudget(creationDate,proyect,version)
    {
        return await Budget.findOrCreate(
            {
                where: { proyecto: proyect },
                defaults:
                {
                    fecha_creacion:creationDate,
                    proyecto: proyect,
                    versiones: version
                }
            });
    }


    async findByPrimaryKey(id_Budget)
    {
        return await Budget.findByPk(id_Budget);
    }



    async countAllBudgetsByProyect(proyecto,id_Budget)
    {

        const Op = require('sequelize').Op;
       


        return await Budget.count(
        {
            where:
            {
                proyecto: proyecto,
                id_Presupuesto:  { [Op.ne]: id_Budget }
            }
        });

      
    }


    async editBudget(creationDate,proyect,version,id_Budget)
    {
        await Budget.update({  fecha_creacion: creationDate, proyecto: proyect, versiones:version }, {
            where: {
              id_Presupuesto:  id_Budget
            }
          });
    }


    async deleteBudget(id_Budget)
    {
        await Budget.destroy({
            where: {
              id_Presupuesto: id_Budget
            }
          });
    }


  
    
}


Budget.init({

    id_Presupuesto: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    fecha_creacion:
    {
        type: DataTypes.DATEONLY,
        allowNull: false,
        
    },
    proyecto:
    {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    versiones:
    {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, 
{ 
    sequelize,
    modelName: 'presupuestos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=Budget;


