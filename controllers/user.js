import User from "../models/user";
import { errorHandler } from '../helper/dbErroHandler';


exports.userById = (req, res, next, id)=>{
    User.findById(id).exec((err, user) =>{
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    })  
}
 
exports.read = (req,res )=>{     
    var payload =  {
        pageTitle:"Profile ",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),    
            };
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined; 
    let user =  req.profile  
    return res.json({
        user: user ,
        payload:payload       
    });
}

exports.update = (req, res)=>{    
    let user = req.profile;  
     User.findOneAndUpdate(
            {_id:req.profile._id},
            {$set: req.body}, 
            {new: true},
            (err, user)=>{
                if(err){
                    return res.status(400).json({
                        error: 'You are not authorized  to perfom this action'
                    })
                }
               user.hashed_password = undefined;
               user.salt = undefined;  
               res.json(user);
            } ) ;     
};


exports.remove = (req, res)=>{
    let user = req.profile;
    user.remove((err, deletedUser)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            // deletedCategory, 
            message:"User deleted successfully"
        })
    })
}


exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

//fetch all users from the database
exports.listUsers = (req, res )=>{    
    User.find()
        .select('-photo')
        .exec((err, users) =>{
        if(err) {
            return res.status(400).json({
                error: "Users not found"
            });
        }
       return res.status(200).json({
            users: users,
            message: 'all users',
            status: true
        })
    })
}

