import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks/user-dashboard-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,

        Accept: 'application/json',

      }
    }).then(res => {
      setData(res.data);
    })
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div>Loading...</div>;

  const { stats, charts, recentTasks } = data;


  const pieData = [
    { name: "Pending", value: charts.taskDistribution.Pending },
    { name: "In Progress", value: charts.taskDistribution.InProgress },
    { name: "Completed", value: charts.taskDistribution.Completed },
  ];

  const barData = [
    { name: "Low", value: charts.taskPriorityLevels.Low },
    { name: "Medium", value: charts.taskPriorityLevels.Medium },
    { name: "High", value: charts.taskPriorityLevels.High },
  ];

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      {console.log(stats)};
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <StatCard title="All Tasks" value={stats.alltasks} color="bg-blue-500" />
        <StatCard title="Pending Tasks" value={stats.pendingTasks} color="bg-yellow-500" />
        <StatCard title="In Progress Tasks" value={stats.inProgressTasks} color="bg-orange-500" />
        <StatCard title="Completed Tasks" value={stats.completedTasks} color="bg-green-500" />
        <StatCard title="Overdue Tasks" value={stats.overdueTask} color="bg-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Task Status Distribution</h2>
          <div className="flex items-start">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="ml-20  mt-20 flex flex-col justify-content-center align-items-center"  >
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center mb-5    ">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="bg-white p-4 rounded-xl shadow-md flex">
          <h2 className="text-lg font-semibold mb-2">Task Priority Levels</h2>
          <div className="mt-15">
            <BarChart width={400} height={250} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
          </div>
          
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Priority</th>
              <th className="py-2 px-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2 px-3">{task.title}</td>
                <td className="py-2 px-3">{task.status}</td>
                <td className="py-2 px-3">{task.priority}</td>
                <td className="py-2 px-3">{new Date(task.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl shadow-md text-white ${color}`}>
    <h3 className="text-md font-medium">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default UserDashboard;
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// } from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// const UserDashboard = () => {
//   const [stats, setStats] = useState({});
//   const [charts, setCharts] = useState({});
//   const [recentTasks, setRecentTasks] = useState([]);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/tasks/user-dashboard-data",{
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
    
//             Accept: 'application/json',
    
//           }
//         });
        
//         setStats(res.data.stats);
//         setCharts(res.data.charts);
//         setRecentTasks(res.data.recentTasks);
//       } catch (err) {
//         console.error("Failed to load dashboard data:", err);
//       }
//     };

//     fetchDashboard();
//   }, []);

//   return (
//     <div className="space-y-10">
//           {/* Stat Cards */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
//             <StatCard title="All Tasks" value={stats.alltasks} color="bg-blue-500" />
//             <StatCard title="Pending Tasks" value={stats.pendingTasks} color="bg-yellow-500" />
//             <StatCard title="In Progress Tasks" value={stats.inProgressTasks} color="bg-orange-500" />
//             <StatCard title="Completed Tasks" value={stats.completedTasks} color="bg-green-500" />
//             <StatCard title="Overdue Tasks" value={stats.overdueTask} color="bg-red-500" />
//           </div>
    
//           {/* Charts Section */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-white p-4 rounded-xl shadow-md">
//               <h2 className="text-lg font-semibold mb-2">Task Status Distribution</h2>
//               <div className="flex items-start">
//                 <PieChart width={400} height={300}>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={120}
//                     label
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//                 <div className="ml-20  mt-20 flex flex-col justify-content-center align-items-center"  >
//                   {pieData.map((entry, index) => (
//                     <div key={index} className="flex items-center mb-5    ">
//                       <div
//                         className="w-4 h-4 rounded-full mr-2"
//                         style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                       ></div>
//                       <span className="text-sm">{entry.name}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
    
    
//             <div className="bg-white p-4 rounded-xl shadow-md flex">
//               <h2 className="text-lg font-semibold mb-2">Task Priority Levels</h2>
//               <div className="mt-15">
//                 <BarChart width={400} height={250} data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" fill="#8884d8" />
//               </BarChart>
//               </div>
              
//             </div>
//           </div>
    
//           {/* Recent Tasks */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            
//             <table className="w-full text-left table-fixed">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="py-2 px-3">Title</th>
//                   <th className="py-2 px-3">Status</th>
//                   <th className="py-2 px-3">Priority</th>
//                   <th className="py-2 px-3">Due Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentTasks.map((task, idx) => (
//                   <tr key={idx} className="border-b">
//                     <td className="py-2 px-3">{task.title}</td>
//                     <td className="py-2 px-3">{task.status}</td>
//                     <td className="py-2 px-3">{task.priority}</td>
//                     <td className="py-2 px-3">{new Date(task.dueDate).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//   );
// };
// const StatCard = ({ title, value, color }) => (
//   <div className={`p-4 rounded-xl shadow-md text-white ${color}`}>
//     <h3 className="text-md font-medium">{title}</h3>
//     <p className="text-2xl font-bold">{value}</p>
//   </div>
// );
// export default UserDashboard;
