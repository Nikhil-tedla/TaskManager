// import { useEffect, useState } from 'react';

// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const UserProfileView = () => {
//   const { user, setUser } = useAuth();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // Fetch profile data initially
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res= await axios.get(`http://localhost:5000/api/auth/profile`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//         setFormData({
//           name: res.data.name,
//           email: res.data.email,
//           password: '',
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//         await axios.put(`http://localhost:5000/api/auth/profile`, formData,{
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//       setUser(res.data); 
//       setMessage('Profile updated successfully!');
//     } catch (err) {
//       setMessage('Update failed. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">User Profile</h2>

//       {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Name</label>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             type="text"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Email</label>
//           <input
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             type="email"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Password (leave blank to keep same)</label>
//           <input
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             type="password"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? 'Updating...' : 'Update Profile'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UserProfileView;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Pencil, Save,X } from 'lucide-react';

const UserProfileView = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res= await axios.get(`http://localhost:5000/api/auth/profile`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });  
        setFormData({ name: res.data.name, email: res.data.email, password: '' });
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/api/auth/profile`, formData,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
      setUser(res.data);
      setFormData({ ...formData, password: '' }); // clear password field
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Profile</h2>
        {!editing ? (
          <button onClick={handleEdit} title="Edit">
            <Pencil className="w-5 h-5 text-blue-600" />
          </button>
        ) : (
          <div className='flex justify-between items-center gap-4 '><button onClick={handleSave} title="Save" disabled={loading}>
          <Save className="w-5 h-5 text-green-600" />
        </button>
        <button onClick={() => setEditing(false)} className="text-gray-500"><X/></button>
        </div>
          
        )}
      </div>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded"
          />
        </div>

        {editing && (
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
