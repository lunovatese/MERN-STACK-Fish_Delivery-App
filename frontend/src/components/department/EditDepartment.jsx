import axios from "axios"
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from "react"

const EditDepartment = () => {
    const {id}=useParams();  //useParams()kiyana function aken thamy  URL aken id aka labaganne  // Get the department ID from the URL
    const [department,setDepartment]=useState([]) ;// State to hold department data
    const [depLoading,setDepLoading]=useState(false);// Loading state  //flas wlin kiyanne 
    const navigate=useNavigate()

    useEffect(() => {
   
        const fetchDepartments = async() => {
   
            setDepLoading(true); // Start loading
            try{
                const response=await axios.get(`http://localhost:5000/api/department/${id}`,{
                headers:{"Authorization":`Bearer ${localStorage.getItem('token')}` },
                });

                if(response.data.success){
                    setDepartment(response.data.department)
                }
            }
            catch(error)
            {
                if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            }
            finally{
                setDepLoading(false) // Stop loading once the data is fetched
            }
        };
        fetchDepartments();
    },[]);

    const handleChange = (e) => {
        const{name,value}=e.target;
        setDepartment({...department,[name]:value})
    }

    const handleSubmit = async(e) => {

        e.preventDefault()  //pass data to server side

        const response=await axios.put(`http://localhost:5000/api/department/${id}`,department,{
            headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`, }
        });

        if(response.data.success){
            navigate("/admin-dashboard/departments")   //admindashbord akata navigate wenawa 
        }
    }


    return (
        <>
          {depLoading ? <div>Loading.....</div> :        
            <div className="card w-96">
              <h2 className="text-2xl font-bold mb-6">Edit Department</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="dep_name" className="label">Department Name</label>
                  <input type="text" name="dep_name" placeholder="Department Name" onChange={handleChange} value={department.dep_name} className="input" required /> 
                </div>
                <div>
                  <label htmlFor="description" className="label">Description</label>
                  <textarea name="description" placeholder='Description' onChange={handleChange} value={department.description} className="input" rows="4"></textarea>
                </div>
                <button type="submit" className="btn bg-teal text-white w-full">Edit Department</button>
              </form>
            </div>
          }
        </>
      );
}

export default EditDepartment