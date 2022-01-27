import path from 'path';


exports.requireLogin = (req, res,next)=>{
    if(req.session && req.session.user){
        return next();
     } else {
        return res.sendFile(path.join(__dirname + '/public/pages/login.html'));
    }
}