import React, {useState}from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddDepartment = () => {
 
    const [department,setDepartment]=useState({//creat state variable
        dep_name:'',
        description:''
    })//object crete

    const navigate=useNavigate()

    const handleChange = (e) => {
        const{name,value} = e.target;
        setDepartment({...department,[name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()   
        try{
            const response = await axios.post('http://localhost:5000/api/department/add',department,{
                headers:{"Authorization":`Bearer ${localStorage.getItem('token')}` } 
            })
            if(response.data.success){
                navigate("/admin-dashboard/departments")
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
        <div className="container">
          <div className="card w-96">
            <h2 className="text-2xl font-bold mb-6">Add New Department</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="dep_name" className="label">Department Name</label>
                <input type="text" name="dep_name" placeholder="Department Name" onChange={handleChange} className="input" required />
              </div>
              <div>
                <label htmlFor="description" className="label">Description</label>
                <textarea name="description" placeholder="Description" onChange={handleChange} className="input" rows="4"></textarea>
              </div>
              <button type="submit" className="btn bg-teal text-white w-full">Add Department</button>
            </form>
          </div>
        </div>
      );
}

export default AddDepartment