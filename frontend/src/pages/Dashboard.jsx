import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext"; // Import your context

const Dashboard = () => {
  const { API_URL } = useContext(StoreContext); // Get the dynamic URL from context
  const [activeTab, setActiveTab] = useState("list");
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
  });
  
  const [blogs, setBlogs] = useState([]);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Use FormData for multipart/form-data (required for images)
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      const res = await axios.post(
        `${API_URL}/blog/create`, // Dynamic URL
        data, // Use 'data' (the FormData object), not 'formData'
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(res.data.message);
      
      // Reset form correctly
      setFormData({
        title: "",
        category: "",
        description: "",
        image: null,
      });
      setActiveTab("list"); // Switch to list after posting
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blog/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(res.data.blogs);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [API_URL]);

  const removeBlog = async (blogId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/blog/delete/${blogId}`, // Dynamic URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="flex h-auto">
      {/* Sidebar - Changed background to match button colors for better UI */}
      <div className="w-64 border-r border-gray-300 bg-gray-900 text-white p-6 min-h-screen">
        <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
        <button
          className={`w-full text-left py-2 px-4 mb-2 rounded ${
            activeTab === "post" ? "bg-orange-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("post")}
        >
          Post a Blog
        </button>
        <button
          className={`w-full text-left py-2 px-4 rounded ${
            activeTab === "list" ? "bg-orange-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List of Blogs
        </button>
      </div>

      <div className="flex-1 p-6">
        {activeTab === "post" ? (
          <div>
            <h2 className="text-xl font-bold">Post a new blog</h2>
            <div className="mt-8">
              <form onSubmit={submitHandler} className="w-1/2 flex flex-col gap-3">
                <input
                  name="title"
                  value={formData.title}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Title"
                  className="border border-gray-300 rounded-md p-2 outline-none w-full"
                  required
                />
                <input
                  name="category"
                  value={formData.category}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Category"
                  className="border border-gray-300 rounded-md p-2 outline-none w-full"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChangeHandler}
                  placeholder="Description"
                  className="border border-gray-300 rounded-md p-2 outline-none w-full h-32"
                  required
                />

                <div>
                  <label className="block mb-1">Choose Image</label>
                  <input
                    onChange={fileHandler}
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-md p-2 outline-none w-full"
                    required
                  />
                </div>
                <button className="bg-black text-white w-full rounded-full border-none cursor-pointer py-2 hover:bg-gray-800 transition">
                  Post Blog
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-4 h-auto">
            <h2 className="text-xl font-semibold mb-4">List of Blogs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Title</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Image</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="text-center">
                      <td className="border px-4 py-2 text-left">{blog.title}</td>
                      <td className="border px-4 py-2">{blog.category}</td>
                      <td className="border px-4 py-2">
                        <img
                          src={`${API_URL}/images/${blog.image}`} // Dynamic Image URL
                          alt={blog.title}
                          className="w-16 h-16 object-cover mx-auto rounded"
                        />
                      </td>
                      <td
                        className="border px-4 py-2 cursor-pointer text-red-500 font-bold hover:bg-red-50"
                        onClick={() => removeBlog(blog._id)}
                      >
                        Remove
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;