import React, { useEffect,useState } from "react";
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import axios from "axios";

const DepartmentList = () => {

    const[departments,setDepartments] = useState([]);
    const[depLoading,setDepLoading] = useState(false)
    const[filteredDepartments,setFilteredDepartments]=useState([])

    const onDepartmentDelete = () => {
        fetchDepartments()
    }
 
    const fetchDepartments = async() => {
        setDepLoading(true)
        try
        {
            const response = await axios.get('http://localhost:5000/api/department',{//line 21
                headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`  },
            })

            if(response.data.success)
            {
                let sno=1;
                console.log(response.data)

                const data = await response.data.departments.map((dep) => (
                {
                    _id:dep._id,
                    sno:sno++, 
                    dep_name:dep.dep_name,
                    description:dep.description,
                    action:(<DepartmentButtons Id={dep._id} onDepartmentDelete={onDepartmentDelete}/>),
                }));
                setDepartments(data); // Update department state with fetched data
                setFilteredDepartments(data)
            }
        }
        catch(error)
        {      
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
        finally{
            setDepLoading(false) 
        }
    };

    useEffect(() => {
        fetchDepartments();//line 53
    },[]);

    const filterDepartments = (e) => {
        const records = departments.filter( (dep) =>
            dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilteredDepartments(records)
    }

    return (
        <>
            { depLoading ? <div>Loading...</div> :  //loading display 
                <div className="p-5">
                    <div className='text-center'>
                        <h3 className='text-2xl font-bold'>Manage Departments</h3>
                    </div>
                    <div className='flex justify-between items-center'>
                        <input type="text" placeholder='Search By Dep Name' className="px-4 py-0.5  border" onChange={filterDepartments}/>
                        <Link to="/admin-dashboard/add-department" className="px-4 py-1 bg-teal-600 rounded text-white">ADD New Department</Link>
                    </div>
                    <div className="mt-5">
                        <DataTable
                            columns={columns}//assign the column
                            data={filteredDepartments}
                            pagination/>
                    </div>
                </div>
            }
        </>
    );
};

export default DepartmentList