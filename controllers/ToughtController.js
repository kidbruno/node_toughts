const Tought = require('../models/Tought');
const User = require('../models/User');

const { Op } = require('sequelize')

module.exports = class ToughtController {

    static async showToughts(req, res){

        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }else{
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%`} 
            },
        })
        //passando o (includes: User) para poder pegar tbm o nome do usuário dono do pensamenro pr exibi-lo

        const toughts = toughtsData.map((result) => result.get( {plain: true})) //pegar somente os resultados

        let toughtsQty = toughts.length
        if(toughtsQty === 0){
            toughtsQty = false
        }

        res.render('../views/toughts/home', {toughts, search, toughtsQty})
    }

    static async dashboard(req, res){

        const userId = req.session.userid

        const user = await User.findOne({ 
            where:{ 
                id : userId
            }, 
            include: Tought, 
            plain: true 
        })

        if(!user){
            res.redirect('/login')
        }

        // console.log(user.Toughts)
        
        const toughts = user.Toughts.map((result) => result.dataValues)
        // console.log(toughts)

        let emptyToughts = false

        if(toughts.length === 0){
            emptyToughts = true
        } 

        res.render('../views/toughts/dashboard', {toughts, emptyToughts})
    }

    static createTought(req, res){
        res.render('../views/toughts/create')
    }

    static async createToughtAction(req, res){

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        // console.log(tought.UserId)

        try{
            await Tought.create(tought)
            res.render('../views/toughts/dashboard')

        }catch(err){
            console.log(err)
        }
    }

    static async editTought(req, res){

        const id = req.params.id

        try{
            const tought = await Tought.findOne({raw: true, where: {id} })
            console.log(tought)
            res.render('../views/toughts/edit', {tought})

        }catch(err){
            console.log(err)
        }
    }

    static async editToughtAction(req, res){

        const id = req.body.id
        const title = req.body.title
        // const title = {
        //     title: req.body.title
        // }

        try{
            await Tought.update({title}, { where: {id: id} })
            res.redirect('/toughts/dashboard')
        
        }catch(err){
            console.log(err)
        }
    }

    static async delete(req, res){

        const id = req.body.id
        const userId = req.session.userid      

        try{
            await Tought.destroy({where: {id, UserId: userId} })
            res.redirect('/toughts/dashboard')
        
        }catch(err){
            console.log(err)
        }

    }
} 