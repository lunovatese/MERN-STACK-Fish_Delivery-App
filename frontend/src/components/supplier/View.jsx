import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const View = () => {
    
    const{id}=useParams()
    const[supplier,setSupplier]=useState(null)

    useEffect(() => {
        const fetchSupplier = async() => {
            try{
                const response=await axios.get(`http://localhost:5000/api/supplier/${id}`,{
                    headers:{"Authorization":`Bearer ${localStorage.getItem('token')}` },
                });
                if(response.data.success){
                    setSupplier(response.data.supplier)
                }
            }
            catch(error)
            {       
                if(error.response && !error.response.data.success){
                    alert(error.response.data.error)
                }
            }
        };
        fetchSupplier();
    },[]);

    return (
        <>{supplier ? (
            <div className="max-w-3xl mx-auto mt-10 bg-white p-5 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-8 text-center">Supplier Details</h2>
                <div className="grid grid-colos-1 md:grid-cols-2 grap-6"> 
                    <div>   
                        <img src={`http://localhost:5000/public/uploads/${supplier.profileImage}`} className="rounded-full border w-72"/> View
                    </div>
                    <div>
                    <div className="flex space-x-3 mb-5">
                            <p className="text-lg font bold">Supplier ID:</p>
                            <p className="font-medium">{supplier.supplierId}</p>
                        </div>
                        <div className="flex space-x-3 mb-5">
                            <p className="text-lg font bold">Name:</p>
                            <p className="font-medium">{supplier.name}</p>
                        </div>
                        <div className="flex space-x-3 mb-5">
                            <p className="text-lg font bold">Business Name:</p>
                            <p className="font-medium">{supplier.business}</p>
                        </div>
                        <div className="flex space-x-3 mb-5">
                            <p className="text-lg font bold">Email:</p>
                            <p className="font-medium">{supplier.email}</p>
                        </div>
                        <div className="flex space-x-3 mb-5">
                            <p className="text-lg font bold">Phone:</p>
                            <p className="font-medium">{supplier.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        ):<div>Loading .....</div>}</>
    )
}
export default View