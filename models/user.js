const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotenv=require ('dotenv');
dotenv.config();


class User extends Model 
{
   


/*FUNCTION ADDUSERCREATE
Sequelize proporciona el método create, que combina los métodos build y save en un solo método:
*/

    async addUserCreate(nombre,apellido, email, usuario, password)
    {
        return await User.create(
        {
            nombre: nombre,
            apellido:apellido,
            email: email,
            usuario:usuario,
            password: password
        });

    }



/*FUNCION FINDFIRSTMATCH
Aquí el findOne método obtiene la primera entrada que encuentra (que cumple con las opciones de consulta opcionales, 
si se proporcionan).*/

    async  findFirstMatch(email)
    {
        return await User.findOne(
        { 
            where: 
            { 
                email: email 
            } 
        });
        
    }


    async findByPrimaryKey(id)
    {
        return await User.findByPk(id);
    }




    async editUserDate(email,expireToken)
    {
      
        await User.update({ expireToken:expireToken }, {
            where: {
              email: email
            }
          });
    }


    async editUser(password,id)
    {
        await User.update({ password:password}, {
            where: {
              id:  id
            }
          });
    }


    async knowIfDataExpire(date)
    {

        const Op = require('sequelize').Op;
       


        return await User.count(
        {
            where:
            {
                
                expireToken:  { [Op.gt]: date }
            }
        });

      
    }








    

    compareAsync(param1, param2) 
    {
        return new Promise(function(resolve, reject) 
        {
            bcrypt.compare(param1, param2, function(err, res) 
            {
                if (err) 
                {
                     reject(err);
                } else 
                {
                     resolve(res);
                }
            });
        });
    }



    async generaToken (data)
    {
        try {
            let resultado = jwt.sign({
                data}, process.env.SECRET_KEY
            )
            return resultado
        }catch (err){
            console.log(err)
            throw new Error (err)
        }
    }



    







}






User.init(
{

    nombre:
    {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellido:
    {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email:
    {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    usuario:
    {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    password:
    {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    expireToken:
    {
        type: DataTypes.DATE
    }


}, 
{ 
    sequelize,
    modelName: 'usuarios' 
});



module.exports=User;


