import React, { useEffect, useState } from 'react';
//import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {

    //const [departments,setDepartments]=useState([]);
    const[formData,setFormData]=useState({});
    const navigate=useNavigate()

    /*useEffect(() => {
        const getDepartments = async() => {
            const departments=await  fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    },[]);*/

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
            const response=await axios.post('http://localhost:5000/api/supplier/add',formDataObj,{
                headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`,}
            });

            if(response.data.success){
                navigate("/admin-dashboard/suppliers");  //admindashbord akata navigate wenawa 
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
            <h2 className="text-2xl font-bold mb-6">Add New Supplier</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> {/*Supplier id*/}
                        <label  className="block text-sm font-medium text-gray-700">Supplier Id</label>
                        <input type="text" name="supplierId" placeholder="Insert SupplierId" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/*Name */}
                        <label  className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" placeholder="Insert Name" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/*Business */}
                        <label  className="block text-sm font-medium text-gray-700">Business name</label>
                        <input type="text" name="business" placeholder="Insert business name" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/*Email */}
                        <label  className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input type="email" name="email" placeholder="Insert Email" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/*Phone */}
                        <label  className="block text-sm font-medium text-gray-700">Phone number</label>
                        <input type="text" name="phone" placeholder="Insert phone number" title="Phone number should start with '0' and contain 10 digits"  pattern="0[0-9]{9}" onChange={handleChange} className="mt-1 p-2 block w-full border-gray-300 rounded-md"required />
                    </div>
                    <div> {/* Image Upload*/ }
                        <label  className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input type="file" name="image" onChange={handleChange}  className="mt-1 p-2 block w-full border-gray-300 rounded-md"/>
                    </div>
                </div>

                <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white front-bold pay-2 px-4 row-span-1">Add Supplier</button>
            </form>
        </div>
    );
};

export default Add;