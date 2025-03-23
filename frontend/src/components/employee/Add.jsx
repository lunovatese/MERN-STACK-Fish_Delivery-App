import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {

    const [departments,setDepartments]=useState([]);
    const[formData,setFormData]=useState({});
    const navigate=useNavigate()

    useEffect(() => {
        const getDepartments = async() => {
            const departments=await  fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    },[]);

    const handleChange = (e) => {
        const {name,value,files}=e.target;
        if(name==="image"){
            setFormData((prevData)=>({...prevData,[name]:files[0]}))
        }
        else{
            setFormData((prevData)=>({...prevData,[name]:value}))
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formDataObj = new FormData()

        Object.keys(formData).forEach((key) => {
            formDataObj.append(key,formData[key])   //FormData.append()parameterwenne name akay eta adala value akay
        })

        try{
            const response=await axios.post('http://localhost:5000/api/employee/add',formDataObj,{
                headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`,}
            });

            if(response.data.success){
                navigate("/admin-dashboard/employees");  //admindashbord akata navigate wenawa 
            }
        }
        catch(error)
        {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div> {/*Name */}
                        <label  className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" placeholder="Insert Name" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/*Email */}
                        <label  className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input type="email" name="email" placeholder="Insert Email" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/*employeeId */}
                        <label  className="block text-sm font-medium text-gray-700">Employee Id</label>
                        <input type="text" name="employeeId" placeholder="Insert EmployeeId" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>    
                    <div> {/*dob */}
                        <label  className="block text-sm font-medium text-gray-700">DOB</label>
                        <input type="date" name="dob" placeholder="Insert DOB" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>        
                    <div> {/*Gender  */}
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select name="gender" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div> {/* Marital Status */}
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <select name="maritalStatus" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md" required>
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                    </div>
                    <div> {/* Role */}
                        <label className="block text-sm font-medium text-gray-700">Employee Type</label>
                        <select name="type" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md" required>
                            <option value="">Select Role</option>
                            <option value="Permanent Employee">Permanent Employee</option>
                            <option value="Contract Employee">Contract Employee</option>
                        </select>
                    </div>
                    <div> {/*Designation */}
                        <label  className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" name="designation" placeholder="Insert Designation" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>  
                    <div> {/*Department */}
                        <label  className="block text-sm font-medium text-gray-700">Department</label>
                        <select name="department" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required >
                            <option value="">Select Department</option>
                            {departments && departments.length > 0 ? (
                            departments.map(dep => (
                                <option key={dep._id} value={dep._id}> {dep.dep_name} </option>
                            ))):
                            (<option disabled>Loading...</option>)}
                        </select>
                    </div>  
                    <div> {/*Salary */}
                        <label  className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number" name="salary" placeholder="Insert salary" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    {/*<div> 
                        <label  className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" placeholder="Insert password" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>*/}
                    <div> {/* Image Upload*/ }
                        <label  className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input type="file" name="image" onChange={handleChange} placeholder="Upload Image" className="mt-1 p-2 block w-full border-gray-300 rounded-md"/>
                    </div>
                </div>

                <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white front-bold pay-2 px-4 row-span-1">Add Employee</button>
            </form>
        </div>
    );
};

export default Add;