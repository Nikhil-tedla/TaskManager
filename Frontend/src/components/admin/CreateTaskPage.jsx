import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import { CalendarDays, UserPlus, FileText, ClipboardList, Flag, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CreateTaskPage = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Low",
        status: "Pending",
        dueDate: "",
        assignedTo: []
    });

    const [users, setUsers] = useState([]);
    const navigate=useNavigate();
    useEffect(() => {

        axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            Accept: 'application/json',

        }).then(res => {


            setUsers(res.data)
        })
            .catch(err => console.error("Error fetching users:", err));
    }, []);
    //   console.log("users "+users);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAssignChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        const values = options.map(opt => opt.value);
        setFormData(prev => ({ ...prev, assignedTo: values }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/tasks", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("Task created successfully!");
            navigate("/admin/dashboard")
        } catch (err) {
            console.error("Task creation error:", err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-semibold mb-6 text-blue-700">📝 Create New Task</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

                {/* Title */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1 flex items-center">
                        <ClipboardList className="w-4 h-4 mr-1" /> Title
                    </label>
                    <input
                        name="title"
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Task title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1 flex items-center">
                        <FileText className="w-4 h-4 mr-1" /> Description
                    </label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Task description..."
                    ></textarea>
                </div>

                {/* Priority and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1 flex items-center">
                            <Flag className="w-4 h-4 mr-1" /> Priority
                        </label>
                        <select
                            name="priority"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1 flex items-center">
                            <ClipboardList className="w-4 h-4 mr-1" /> Status
                        </label>
                        <select
                            name="status"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                {/* Due Date */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1 flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1" /> Due Date
                    </label>
                    <input
                        name="dueDate"
                        type="date"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>

                {/* Assigned To */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1 flex items-center">
                        <UserPlus className="w-4 h-4 mr-1" /> Assign To
                    </label>
                    <Select
                        isMulti
                        name="assignedTo"
                        options={users.map(user => ({
                            value: user._id,
                            label: `${user.name} (${user.email})`
                        }))}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        onChange={(selected) =>
                            setFormData((prev) => ({
                                ...prev,
                                assignedTo: selected.map(option => option.value),
                            }))
                        }
                        placeholder="Search and select users..."
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                    >
                        <Send className="w-4 h-4 mr-2" /> Create Task
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTaskPage;
