const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');




class Month extends Model 
{


    async listAllMonths()
    {
        return await Month.findAll();
    }

    async countAllBudgets()
    {
        return await Month.count();
    }


    



  
    
}


Month.init({

    id_mes: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:
    {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, 
{ 
    sequelize,
    modelName: 'meses' ,
    // don't add the timestamp attributes (updatedAt, createdAt)

    timestamps: false
});



module.exports=Month;


