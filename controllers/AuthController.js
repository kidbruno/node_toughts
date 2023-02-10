const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flash = require('express-flash')

const routes = require('../routes/authRoutes')

module.exports = class AuthController {

    static login(req, res){
        res.render('../views/auth/login')
    }

    static async loginAction(req, res){
        
        const {email, password} = req.body
        
        //checando se existe um usuário com esse email
        const user = await User.findOne({where: {email: email} })
        
        if(! user){
            req.flash('loginError', 'Usuário não encontrado.')
            res.render('../views/auth/login');
            return
        }

        //checando se a senha do usuário está correta
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(passwordMatch == false){
            req.flash('loginError', 'Senha Incorreta.')
            res.render('../views/auth/login');
            return
        }

        //Inicializando a session
        req.session.userid = user.id
        req.session.save(() => {
            res.redirect('/')
        }) 
    }

    static register(req, res){
        res.render('../views/auth/register')
    }

    static async registerAction(req, res){
        
        const {name, email, password, conf_password} = req.body
        const emailexist = await User.findOne({where: {email: email}})

        if(password != conf_password){
            req.flash('message', 'Senha e Confirmação de senha não conferem. ')
            res.render('../views/auth/register')
            return
        }

        if(emailexist){
            req.flash('emailExist', 'Já possui um usuário utilizando esse e-mail, esclha outro.')
            res.render('../views/auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashePassword = bcrypt.hashSync(password, salt)

        const user = {
            name, 
            email,
            password: hashePassword
        }

        try{
            const createdUser =  await User.create(user)

            //inicializando session (para qdo user se registrar o loogin ser feito automático)
            req.session.userid = createdUser.id
            req.session.save(() => {
                res.redirect('/')
            }) 

        }catch(err){
            console.log(err)
        }
    }

    static logout(req, res) {

        if(req.session){
            req.session.destroy()
            res.redirect('/')
        }
    }
}