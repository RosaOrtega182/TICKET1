const passport= require('passport');
const bcrypt= require('bcryptjs');
const User= require('../models/user')
const user = User.build();
const jwt = require('jsonwebtoken')
const dotenv=require ('dotenv');
dotenv.config();
const Str = require('@supercharge/strings');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);




  






/* GET REGISTER USER*/
exports.registerUserGet=(req,res,next)=>
{
   res.render('register');
}




/* POST REGISTER AND ADD USER*/

exports.registerAndAddUserPost=async(req,res,next)=>
{
   
    let nombre= req.body.nombre;
    let apellido= req.body.apellido;
    let email=req.body.email;
    let usuario=req.body.usuario;
    let password=req.body.password;
    let password2=req.body.password2;
    
  
   
    req.checkBody('nombre','El campo nombre debe de tener un valor').notEmpty();
    req.checkBody('apellido','El campo nombre debe de tener un valor').notEmpty();
    req.checkBody('email','El campo email debe de tener un valor').notEmpty();
    req.checkBody('email','El campo email debe de ser un mail valido').isEmail();
    req.checkBody('usuario','El campo usuario debe de tener un valor').notEmpty();
    req.checkBody('password','El campo contrasena debe de tener un valor').notEmpty();
    req.checkBody('password2','No coincide con su primera constraseña').equals(password);
   
   
    let errors= req.validationErrors();
   
    if(errors)
    {
       
            res.render('register',
            { 
                errors: errors,
                user: null
            });  
        
    }
    else
    {

        const instanceFindFisrtMatch=  await user.findFirstMatch(email);
        {
            if(instanceFindFisrtMatch===null)
            {
                bcrypt.genSalt(10,function (err, salt) 
                {
                    bcrypt.hash(password, salt, async function (err, hash)
                    {
                        if (err)
                        {
                            console.log(err);
                        }
                    
                        password = hash;
                        const instanceaddUserCreate= await user.addUserCreate(nombre,apellido,email,usuario,password);

                        if (instanceaddUserCreate===null)
                        {
                            req.flash('danger','El usuario no se creo');
                        }
                        else
                        {
                            req.flash('success', 'Se creó satisfactoriamente el usuario!');
                          
                                res.redirect('/login')
                            
                        }
                    });
                });
            }
            else
            {
                req.flash('danger','El nombre de usuario ya existe, escoja otro.');
               
                    res.redirect('/register');
                
                
            }
        }      
    }
}




/* GET LOGIN*/
exports.loginUserGet=(req,res,next)=>
{
   if(res.locals.user) 
   {
       
       res.redirect('/');
   }


   res.render('login');

}


/* POST LOGIN*/
exports.loginUserPost=async (req,res,next)=>
{  
 
    passport.authenticate('local', function(err, userio, info) {
        if (err) { return next(err); }
        if (!userio) 
        {
            
         req.flash('danger',info.message);
         res.redirect('/login');
        }
        else
        {

        req.logIn(userio, async function(err) {
            if (err) { return next(err); }
            let usuario= userio.email;
            let token= await jwt.sign(
                {
                usuario
                }, process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                })
            
                req.session.token=token;
             
                   res.redirect('/')
             
             

          });
        }
           
        
       
      })(req, res, next);


  

}


/* GET PASSWORD USER*/
exports.forgotPasswordGet=(req,res,next)=>
{
   res.render('password');
}


exports.forgotPasswordPost= async(req,res,next)=>
{

    let email=req.body.email;
    //const random_WithFiftySymbols = Str.random(35)  

    //const token = random_WithFiftySymbols;
    const instanceUser= await user.findFirstMatch(email);
    if (instanceUser===null)
    {
        req.flash('danger','El email no existe');
    }
    else
    {

       
        //let resetToken = token;
        let expireToken = Date.now() + 3600000;
        const instanceUserEdited= await user.editUserDate(email,expireToken);
        
           transporter.sendMail({
                to: instanceUser.email,
                from:"rosirijilla@hotmail.com",
                subject:"password reset",
                html:`
                <p>You requested for password reset</p>
                <h5>click in this <a href="http://localhost:3000/resetPassword/${instanceUser.id}">link</a> to reset password</h5>
                `
            })
            req.flash('success', 'Revisa tu correo!');
            res.redirect('/forgotPassword');


           
    }


}






/* GET PASSWORD USER*/
exports.resetPasswordGet=(req,res,next)=>
{
    let idUser= req.params.idUser;

   res.render('resetPassword',{
    id: idUser
   });
}

exports.resetPasswordPost=async(req,res,next)=>
{
    let id= req.params.idUser;
    let password=req.body.password;
    let password2=req.body.password2

    req.checkBody('password','El campo contrasena debe de tener un valor').notEmpty();
    req.checkBody('password2','No coincide con su primera constraseña').equals(password);
   
   
    
   
    let errors= req.validationErrors();
   
    if(errors)
    {
        res.render('resetPassword');
    }
    else
    {

       
        const expireDate = await user.knowIfDataExpire(Date.now());
        console.log(expireDate);


        if(expireDate===0)
        {

            req.flash('danger','Intenta otra vez la sesión ha expirado');
            res.render('forgotPassword');
              
       
        }
        else
        {
          
           
                bcrypt.genSalt(10,function (err, salt) 
                {
                    bcrypt.hash(password, salt, async function (err, hash)
                    {
                        if (err)
                        {
                            console.log(err);
                        }
                    
                        password = hash;
                        const instanceaddUserUpdated= await user.editUser(password,id);

                        if (instanceaddUserUpdated===null)
                        {
                            req.flash('danger','La contraseña no se actualizo no se actualizo');
                        }
                        else
                        {
                            req.flash('success', 'Se actualizo la contraseña!');
                          
                                res.redirect('/login')
                          
                        }
                    });
                });

            



           
        }
    }





}



/* GET LOGOUT*/
exports.logoutUserGet=(req,res,next)=>
{
    req.logout();
    delete req.session.token; 
    req.flash('success', 'Has cerrado sesión!');
    res.redirect('/users/login');
}
