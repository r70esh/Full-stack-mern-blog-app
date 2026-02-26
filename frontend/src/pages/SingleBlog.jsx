import { useContext } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const SingleBlog = () => {
  const { id } = useParams();
  const { blogData, API_URL } = useContext(StoreContext); // Use API_URL from Context

  // Find the specific blog
  const blog = blogData?.find((b) => b._id === id);

  // Loading/Not Found State
  if (!blog) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl font-semibold text-gray-500">Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 p-5 max-w-3xl flex flex-col gap-3 items-center justify-center mx-auto py-8 mt-10 shadow-sm">
      <img
        className="transition-transform duration-300 hover:scale-105 rounded-lg w-full object-cover"
        src={`${API_URL}/images/${blog.image}`} // Dynamic Image URL
        alt={blog.title}
      />
      <h1 className="text-3xl font-bold mt-4">{blog.title}</h1>
      <p className="text-[#4B6BFB] font-medium uppercase tracking-wider">{blog.category}</p>
      
      <div className="bg-gray-50 p-6 rounded-md w-full my-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.description}</p>
      </div>

      <div className="flex gap-4 items-center justify-center border-t border-gray-100 pt-6 w-full">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-800">Author: {blog.author?.name}</p>
          <img
            className="w-10 h-10 rounded-full border border-gray-300"
            src={`${API_URL}/images/${blog.author?.image}`} // Dynamic Author Image URL
            alt={blog.author?.name}
          />
        </div>
        <span className="text-gray-400">|</span>
        <p className="text-gray-600">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default SingleBlog;