import multer from 'multer'
import bcrypt from 'bcrypt'
import path  from "path"
import Supplier from '../models/Supplier.js'

const storage=multer.diskStorage({ 
    destination:(req,file,cb) => {
      cb(null,"public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
})

const upload=multer({storage:storage})

const addSupplier = async(req,res) => {
    try{
        const{ supplierId,name,business,email,phone } = req.body;
        const supplier=await Supplier.findOne({email})
        if(supplier){
            return res.status(400).json({success:false,error:"Supplier already registered"});
        }

        const newSupplier=new Supplier({ supplierId,name,business,email, phone, profileImage:req.file?req.file.filename:""})
        await newSupplier.save()
        return res.status(200).json({success:true,message:"Supplier added"})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({sucess:false,error:"AddSupplier server error"})
    }
};

const getSuppliers = async(req,res) => {
    try{
        const suppliers=await Supplier.find().exec()
        if(!suppliers){ 
            return res.status(404).json({success:false,error :"No suppliers found."})
        }
        return res.status(200).json({success:true,suppliers})
    }
    catch(error){
        return res.status(500).json({success:false,error :"Get suppliers server error"})
    }
};


const getSupplier = async (req, res) => {
    try {
      const { id } = req.params; // get the employee id from params
      // Use findById directly with id (not an object)
      const supplier = await Supplier.findById(id)
      if (!supplier) {
        return res.status(404).json({ success: false, error: "Supplier not found" });
      }
      return res.status(200).json({ success: true, supplier });
    } catch (error) {
      console.error("Get Supplier Error:", error);
      return res.status(500).json({ success: false, error: "Get supplier server error" });
    }
  };



const updateSupplier = async(req,res) => {
    try{
        const{id}=req.params;
        const{supplierId,name,business,email,phone,} = req.body;

        const supplier=await Supplier.findById(id)
        if(!supplier){
            return res.status(404).json({success:false,error :"Supplier not found"}) 
        }

        const updateSupplier=await Supplier.findByIdAndUpdate({_id:id},{supplierId,name,business,email,phone})
        if(!updateSupplier){
            return res.status(404).json({success:false,error :"Supplier not updated not found"}) 
        }
        return res.status(200).json({success:true,message :"Employee updated"}) 
    }
    catch(error)
    {
        return res.status(500).json({success:false,error :"Update supplier server error"})
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByIdAndDelete(id);
        if (!supplier) {
            return res.status(404).json({ success: false, error: "Supplier not found" });
        }
        return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Delete supplier server error" });
    }
};


export {addSupplier,upload,getSuppliers,getSupplier,updateSupplier,deleteSupplier}
