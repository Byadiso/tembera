import  express from 'express';
import  { errorHandler } from "../helper/dbErroHandler";
import session from 'express-session';
import Notification from '../models/notification';


const router = express.Router();


exports.getNotification = (req,res)=>{ 
    var payload =  {
    pageTitle:"Notification ",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),    
        };
    res.status(200).render("notificationsPage", payload);
};

exports.getAllNotification = async(req,res)=>{ 
    var searchObj = { userTo: req.session.user._id, notificationType: { $ne: "newMessage"}};
    if(req.query.unreadOnly != undefined && req.query.unreadOnly== "true"){
        searchObj.opened = false;
    }
    Notification.find(searchObj)
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1})
    .then((results)=>res.status(200).send(results))
    .catch(error => {     
        console.log(error);
        res.sendStatus(400)
    })
 };

 
exports.singleMarkAsOpened = async(req,res)=>{    
    Notification.findByIdAndUpdate(req.params.id, { opened: true })
    .then(()=>res.sendStatus(204))
    .catch(error => {     
       console.log(error);
       res.sendStatus(400)   
        })   
    };

  
exports.markAsOpened = async(req,res)=>{    
    Notification.updateMany({ userTo: req.session.user._id } ,  { opened: true })
    .then(()=>res.sendStatus(204))
    .catch(error => {     
       console.log(error);
       res.sendStatus(400)   
        })   
    };

exports.latestNotification = async(req,res)=>{    
        Notification.findOne({ userTo: req.session.user._id })
        .populate("userTo")
        .populate("userFrom")
        .sort({ createdAt: -1})
        .then((results)=>res.status(200).send(results))
        .catch(error => {     
            console.log(error);
            res.sendStatus(400)    
        })
    }


    
module.exports = router;

