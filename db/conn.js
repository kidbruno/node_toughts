const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '123456', {
    host: 'localhost', 
    dialect: 'mysql',
})

try{
    sequelize.authenticate()
    console.log('Conect Success!')
}catch(err){
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize
