import mongoose from 'mongoose';
const {ObjectId } = mongoose.Schema;


const moneySchema = new mongoose.Schema(
    {
        title:{
            type:String,
            trim:true,
            required:true,
            maxlength:32
        },
        description:{
            type:String,
            trim:true,
            required:true,
            maxlength:2000
        },
        amount:{
            type:Number,
            trim:true,
            required:true,
            maxlength:32
        },
        category:{
            type:ObjectId,
            ref:'CategorySav',
            require:true
        },
       icon:{
            data:Buffer,
            conentType: String            
        },
        createdBy:{
            type: ObjectId,
            ref: 'USer'
        },
           
     },
      { timestamps: true }
);


module.exports = mongoose.model("Money", moneySchema);