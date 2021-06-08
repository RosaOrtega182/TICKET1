const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const moment=require('moment');



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

    async addBudget(fechaCreacion,proyecto,version)
    {
        return await Budget.findOrCreate(
            {
                where: { proyecto: proyecto },
                defaults:
                {
                    fecha_creacion:fechaCreacion,
                    proyecto: proyecto,
                    versiones: version
                }
            });
    }


    async findByPrimaryKey(id)
    {
        return await Budget.findByPk(id);
    }



    async countAllBudgetsByProyecto(proyecto,id)
    {

        const Op = require('sequelize').Op;
       


        return await Budget.count(
        {
            where:
            {
                proyecto: proyecto,
                id_Presupuesto:  { [Op.ne]: id }
            }
        });

      
    }


    async editBudget(fecha_creacion,proyecto,versiones,id_Presupuesto)
    {
        await Budget.update({  fecha_creacion: fecha_creacion, proyecto: proyecto, versiones:versiones }, {
            where: {
              id_Presupuesto:  id_Presupuesto
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


