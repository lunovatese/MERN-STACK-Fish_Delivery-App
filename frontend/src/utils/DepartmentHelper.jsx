import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns=[
    {  //first object
       name:"S No",
       selector:(row ) => row.sno
    },
    {   //second object aken kiynne table akata adla colum aka
        name:"Department name",
        selector:(row) => row.dep_name ,
        sortable:true
    },
    {   //second object 
        name:"Department description",
        selector:(row) => row.description 
    },
    {   //third object 
        name:"Action",
        selector:(row) => row.action 
    },
];

 export const DepartmentButtons=({Id,onDepartmentDelete}) => {

    const navigate=useNavigate();
    const handleDelete = async(id) => {

        const confirm=window.confirm("Do you want to delete?")
        if(confirm)
        {
            try
            {
                const response=await axios.delete(`http://localhost:5000/api/department/${id}`,{
                    headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`, },
                });
                if(response.data.success){
                    onDepartmentDelete();
                }            
            }
            catch(error)
            {
                if(error.response && !error.response.data.success){
                    alert(error.response.data.error);
                }
            }   
        }
    };

    return(
        <div className="flex space-x-3">
            <button className="px-5 py-1 bg-teal-600 text-white" onClick={()=>navigate(`/admin-dashboard/department/${Id}`)} > Edit</button>
            <button className="px-5 py-1 bg-red-600 text-white" onClick={()=>handleDelete(Id)} >Delete</button>
        </div>
    )
};

