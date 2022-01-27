const mongoose = require('mongoose');
const crypto = require ('crypto');


const {ObjectId } = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({

        notificationType: String,
        opened:{type: Boolean, default: false},
        entityId: ObjectId       
    }, 
    { timestamps: true }
);


NotificationSchema.statics.insertNotification = async ( notificationType, entityId)=>{
    var data = {
        notificationType: notificationType,
        entityId:entityId
    };
    await Notification.deleteOne(data).catch(error => console.log(error));
    return Notification.create(data).catch(error => console.log(error));
}

var Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;