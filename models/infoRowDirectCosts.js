const {DataTypes, Model}= require ('sequelize');
const sequelize= require('./conexion');
const RowDirectCosts= require('./rowDirectCosts');



class InfoRowDirectCosts extends Model 
{
    async addInfoRow(id_costos,id_fila)
    {
        return await InfoRowDirectCosts.create(
        {
            id_costos:id_costos,
            id_fila: id_fila
        });

    }


    async findByPrimaryKey(id)
    {
        return await InfoRowDirectCosts.findByPk(id);
    }


    async editValorInfoFila(valor,id_info)
    {
        await InfoRowDirectCosts.update({  valor: valor}, {
            where: {
              id_info:  id_info
            }
          });
    }




async getDirectCostsInnerJoinByIdBudgetAndIdMonthAndIdFlow(id_info)
    {
        return await InfoRowDirectCosts.findAll({
       
           raw: true,
            nest: true ,// unflattens but does not fix problem
            where: {
                id_info:id_info
            },
          
          include: { all: true }

         
          });
          
    }

    async getSum(id_costos)
    {
        return await InfoRowDirectCosts.sum('valor',
        {
            where:{id_costos:id_costos}
        }

        );
    }


//TOTALESSSSSSSSSSSSSSSSSSSSSSSS
    async getInfoRowDirectCostsInnerJoinByIdDirectCosts()
    {
        return await InfoRowDirectCosts.findAll({
       
           raw: true,
           nest: true ,// unflattens but does not fix problem
        
            
            include: [
                {model: RowDirectCosts }
              ], 
            order: [ [ 'id_fila', 'ASC' ], [ 'id_costos', 'ASC' ]]
        
          });
    }

 /*   async deleteEntryColumn(idFlow)
    {
        await Entry.destroy({
            where: {
              id_flujo: idFlow
            }
          });
    }

    async findByPrimaryKey(id)
    {
        return await Entry.findByPk(id);
    }

    async editEntry(ingresos,idFlujo)
    {
        await FinancialFlow.update({  ingresos: ingresos}, {
            where: {
              id_flujo:  idFlujo
            }
          });
    }


    async editEntryIdFila(idFila,idPresupuesto)
    {
        await Entry.update({  id_fila: idFila}, {
            where: {
              id_presupuesto:  idPresupuesto
            }
          });
    }*/




}   


InfoRowDirectCosts.init({

    id_info: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_costos:
    {
        type: DataTypes.INTEGER
      /*  references: 
        {
            model: 'presupuestos',
            key: 'id_Presupuesto'
        }*/
    },
    id_fila:
    {
        type: DataTypes.INTEGER
    },
   

    valor:
    {
        type: DataTypes.DECIMAL(7,2)
        
    }
   
}, 
{ 
    sequelize,
    modelName: 'infofilascostosdirectos' ,
    // don't add the timestamp attributes (updatedAt, createdAt)
   // timestamps: false
});



module.exports=InfoRowDirectCosts;


