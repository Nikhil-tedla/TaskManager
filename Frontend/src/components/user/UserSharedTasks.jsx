import axios from 'axios';
import React, { useEffect, useState } from 'react'

const UserSharedTasks = () => {
    const [sharedTasks, setSharedTasks] = useState([])
    //console.log(sharedTasks)
    useEffect(() => {

        const fetchSharedTasks = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/shared-tasks`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            
                
                setSharedTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch shared tasks:", error);
            }
        };

        fetchSharedTasks();
    }, []);


    return (
        <div>
            
            {(sharedTasks.length === 0) ?
                (<div>
                    <h2>No Shared content</h2>
                </div>) :
                (<>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                        {sharedTasks.filter((item) => item.taskId).map((item) => (
                            
                            <div key={item.taskId._id} className="relative bg-white shadow-md rounded-xl p-5 border-l-8 min-h-[200px]">
                                <div className="absolute top-3 right-3 flex space-x-4">
                                    <p><strong>Shared By: </strong>
                                        {item.sharedBy && item.sharedBy.name
                                            ? `${item.sharedBy.name} (${item.sharedBy.email})`
                                            : "No one"}
                                    </p>
                                </div>
                                <h2 className="text-xl font-semibold mb-1">{item.taskId.title}</h2>
                                <p className="text-sm text-gray-600 mb-2">{item.taskId.description || "No description"}</p>
                                <p><strong>Status:</strong> {item.taskId.status}</p>
                                <p><strong>Priority:</strong> {item.taskId.priority}</p>
                                <p><strong>Due:</strong> {new Date(item.taskId.dueDate).toLocaleDateString()}</p>

                                <p><strong>Assigned To:</strong> {item.taskId.assignedTo?.map((u) => u.name).join(", ") || "-"}</p>

                            </div>
                        ))}

                    </div></>
                )

            }
        </div>






    );

}

export default UserSharedTasks