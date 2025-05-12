import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Save } from "lucide-react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();


const ViewTaskUser = () => {
    const [tasks, setTasks] = useState([]);
    const [activeField, setActiveField] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    const [statusSummary, setStatusSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [formData, setFormData] = useState({});
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const statusColors = {
        "All": "bg-blue-500",
        "Pending": "bg-yellow-500",
        "In Progress": "bg-orange-500",
        "Completed": "bg-green-500",
    };
    

    const statusCounts = {
        "All": statusSummary.all,
        "Pending": statusSummary.pendingTasks,
        "In Progress": statusSummary.inProgressTasks,
        "Completed": statusSummary.completedTasks,
    };

    
    const handleEdit = (task) => {
        setEditingTaskId(task._id);
        setFormData({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate.split("T")[0],
            
        });
    };


    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase())
            || task.priority.toLowerCase().includes(searchTerm.toLowerCase()) || task.status.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === "All" || task.status === filterStatus;
        const matchesDate = !filterDate || task.dueDate?.slice(0, 10) <= filterDate;
        return matchesSearch && matchesStatus && matchesDate;
    }

    );
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSave = async (taskId) => {
        try {
            const updatedPayload = {
                ...formData,
                
            };
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedPayload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setEditingTaskId(null);
            fetchTasks();
        } catch (err) {
            console.error("Update failed", err);
        }
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);

    };

    const fetchTasks = async () => {
        axios
            .get("http://localhost:5000/api/tasks", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: 'application/json',
                },
            })
            .then((res) => {
                setTasks(res.data.tasks);
                setStatusSummary(res.data.statusSummary);
                console.log(res.data.statusSummary)
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });

    }
    const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const formatted = res.data.map(user => ({
            value: user._id,
            label: user.name
        }));

       
        setUsers(formatted);


    };


    useEffect(() => {
        fetchTasks(),
        fetchUsers()






    }, []);
    const formatTitle = (str) => {
        return str
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())
            .replace("Alltasks", "All Tasks");
        // // };
    }
    const StatCard = ({ title, value, color, onClick, isActive }) => (
        <div className={`p-4 rounded-xl shadow-md cursor-pointer transition ${isActive ? "ring-1 ring-black-500 scale-105" : ""
            } ${color}`} onClick={onClick}>
            <h2 className="text-sm ">{title}</h2>
            <p className="text-xl">{value}</p>
        </div>
    );

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">{filterStatus}</h1>
                <div className="flex flex-wrap justify-center items-center gap-4 mb-4"><div>
                    <label className="mr-2 font-medium">Filter by Due Date:</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border rounded p-1"
                    />
                </div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="px-3 py-1 border rounded-md text-sm w-100"
                    onChange={handleSearchChange}
                    value={searchTerm}
                /></div>
                

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* {Object.entries(statusSummary).map(([key, value]) => (
                    <StatCard
                        key={key}
                        title={formatTitle(key)}
                        value={value}
                        color={statusColors[key] || "bg-gray-500"}
                        onClick={()=>setFilterStatus(formatTitle(key))}
                    /> */}
                {Object.entries(statusCounts).map(([status, count]) => (
                    <StatCard
                        key={status}
                        title={status}
                        value={count}
                        color={statusColors[status] || "bg-gray-500"}
                        onClick={() => setFilterStatus(status)}
                        isActive={filterStatus === status}
                    />
                ))}
            </div>






            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTasks.map((task) => (
                    <div key={task._id} className="relative bg-white shadow-md rounded-xl p-5 border-l-8 min-h-[200px]"
                        style={{ borderColor: task.status === "Completed" ? "#4ade80" : task.status === "In Progress" ? "#fb923c" : "#facc15" }}>

                        <div className="absolute top-3 right-3 flex space-x-4">
                            {editingTaskId === task._id ? (
                                <>
                                    <button onClick={() => handleSave(task._id)} className="text-green-600"><Save /></button>
                                    <button onClick={() => setEditingTaskId(null)} className="text-gray-500">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(task)} className="text-blue-500"><Pencil size={25} /></button>
                                    
                                </>
                            )}
                        </div>

                        {editingTaskId === task._id ? (
                            <>  {activeField && (
                                <p className="text-sm text-blue-600 mb-2">Currently editing: <strong>{activeField}</strong></p>
                            )}
                                
                                <select name="status" className="w-2/3 mb-1 border rounded p-1" value={formData.status} onChange={handleChange} onFocus={() => setActiveField("Status")}>
                                    <option>Pending</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                                

                                
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-1">{task.title}</h2>
                                <p className="text-sm text-gray-600 mb-2">{task.description || "No description"}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Priority:</strong> {task.priority}</p>
                                <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                                <p><strong>Assigned To:</strong> {task.assignedTo?.map((u) => u.name).join(", ") || "-"}</p>
                            </>
                        )}


                    </div>
                ))}

            </div>

        </div>

    );
};

export default ViewTaskUser;
