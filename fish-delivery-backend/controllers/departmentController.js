import Department from "../models/Department.js";

const addDepartment = async(req,res) => {
    try 
    {
        const{dep_name,description} = req.body;
        const newDep = new Department({
            dep_name,description
        })

        await newDep.save()  
        return res.status(200).json({success:true,department:newDep})
    }
    catch(error){
        return res.status(500).json({success:false,error :"Server error in add department"})
    }
}

const getDepartment = async(req,res) => {
    try
    {
        const {id} = req.params;
        const department = await Department.findById(id)
        return res.status(200).json({success:true,department})
    }
    catch(error){
        return res.status(500).json({success:false,error :"Server error in get department"})
    }
}

const getDepartments = async(req,res) => {
    try
    {
        const departments = await Department.find()
        if(!departments || departments.length===0)
        { 
            return res.status(404).json({success:false,error :"No departments found."});
        }
        return res.status(200).json({success:true,departments})
    }
    catch(error){
        return res.status(500).json({success:false,error :"Server error in get departments"})
    }
}

const updateDepartment = async(req,res) => {
    try
    {
        const{id} = req.params;
        const {dep_name,description}=req.body;
        const updateDep = await Department.findByIdAndUpdate({_id:id},{
            dep_name,description
        })
        return res.status(200).json({success:true,updateDep})
    }
    catch(error){
        return res.status(500).json({success:false,error :"Server error in update department"})
    }
}

const deleteDepartment = async(req,res) => {
    try
    {
        const{id} = req.params;
        const deletedep = await Department.findById({_id:id})
        await deletedep.deleteOne()
        return res.status(200).json({success:true,deletedep})
    }
    catch(error){
        return res.status(500).json({success:false,error :"Server error in delete department"})
    }
}

export {addDepartment,getDepartments,getDepartment,updateDepartment,deleteDepartment}