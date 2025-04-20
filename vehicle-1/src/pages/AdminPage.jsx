import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Search, Shield, User, ArrowLeft, Bell, Plus, Edit, Trash, Save, X } from "lucide-react";
import axios from "../utils/axios";

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchText, setSearchText] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newAvailability, setNewAvailability] = useState("available");
  const [newPrice, setNewPrice] = useState("");
  const [newSpecs, setNewSpecs] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAvailability, setEditAvailability] = useState("available");
  const [editPrice, setEditPrice] = useState("");
  const [editSpecs, setEditSpecs] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios.get("/api/posts").then((res) => setPosts(res.data));
      axios.get("/api/notifications").then((res) => setNotifications(res.data));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(() => {
        axios.get("/api/notifications").then((res) => setNotifications(res.data));
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post("/api/adlogin", { email, password });
        setIsAuthenticated(true);
        alert(response.data.message);
      } else {
        const response = await axios.post("/api/adsignup", { fullName, email, password });
        alert(response.data.message);
      }
    } catch (error) {
      alert(`${isLogin ? "Login" : "Signup"} failed. Please try again.`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/posts", {
        title: newTitle,
        availability: newAvailability,
        price: newPrice,
        specs: newSpecs,
      });
      setPosts([...posts, response.data]);
      setNewTitle("");
      setNewAvailability("available");
      setNewPrice("");
      setNewSpecs("");
      alert("Vehicle added successfully!");
      axios.get("/api/notifications").then((res) => setNotifications(res.data));
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleEditPost = async (postId) => {
    try {
      const updatedPost = {
        title: editTitle,
        availability: editAvailability,
        price: editPrice,
        specs: editSpecs,
      };
      const response = await axios.put(`/api/posts/${postId}`, updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? response.data : post))
      );
      setEditingPostId(null);
      alert("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  const handleViewNotification = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isViewing: true } : n))
      );
      setTimeout(async () => {
        await axios.delete(`/api/notifications/${id}`);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }, 5000);
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete notification.");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesAvailability =
      availabilityFilter === "all" || post.availability.toLowerCase() === availabilityFilter;
    const matchesPrice = !maxPrice || parseFloat(post.price) <= parseFloat(maxPrice);
    const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesAvailability && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 sm:p-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10"></div>
      
      {/* Background Image for Hero Section */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629807473015-41699c4471b5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-pink-800/5 to-orange-700/5"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Button
          onClick={() => {
            if (isAuthenticated) {
              handleLogout();
            } else {
              navigate("/");
            }
          }}
          className={`absolute top-4 sm:top-6 left-4 sm:left-6 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2`}
        >
          <ArrowLeft className="w-4 h-4" />
          {isAuthenticated ? "Logout" : "Go to Home"}
        </Button>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 p-6 sm:p-8 rounded-xl shadow-xl border border-purple-200 max-w-sm w-full backdrop-blur-sm"
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-900">
                <Shield className="inline-block w-8 h-8 mr-2 text-orange-500" />
                Admin {isLogin ? "Login" : "Sign Up"}
              </h1>
              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </form>
              <p className="mt-4 text-xs sm:text-sm text-center text-purple-700">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button 
                  className="text-purple-600 hover:text-purple-800 font-semibold underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto mt-8 p-4">
            <AnimatePresence>
              {notifications.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-orange-50/90 to-pink-50/90 border-2 border-orange-200 rounded-xl p-4 mb-8 shadow-lg backdrop-blur-sm"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-500" />
                    Notifications
                  </h3>
                  <ul className="space-y-2">
                    {notifications.map((note) => (
                      <motion.li 
                        key={note._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-white/50 rounded-lg border border-purple-200"
                      >
                        <div className={note.isViewing ? "opacity-50 transition-opacity text-sm sm:text-base text-purple-900" : "text-sm sm:text-base text-purple-900"}>
                          {note.message}{" "}
                          <span className="text-xs text-purple-600">
                            ({new Date(note.createdAt).toLocaleString()})
                          </span>
                        </div>
                        {!note.isViewing && (
                          <Button
                            onClick={() => handleViewNotification(note._id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow hover:shadow-lg transition-all duration-300"
                          >
                            Mark as Viewed
                          </Button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 p-4 sm:p-6 rounded-xl shadow-xl border-2 border-purple-200 mb-8 backdrop-blur-sm"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-purple-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Add a New Vehicle
              </h3>
              <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Vehicle Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
                <input
                  type="number"
                  placeholder="Price per day"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Vehicle Specifications"
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  required
                  className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Add Vehicle
                </Button>
              </form>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-semibold mb-4 text-purple-900 flex items-center gap-2"
            >
              <Truck className="w-6 h-6 text-orange-500" />
              Available Construction Vehicles
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-col sm:flex-row gap-4 bg-white/50 p-4 rounded-xl shadow-lg border-2 border-purple-200 backdrop-blur-sm"
            >
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by Title"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border-2 border-purple-200 p-2 pl-10 rounded-lg text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </motion.div>

            {filteredPosts.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm sm:text-base text-purple-700 text-center p-4 bg-white/50 rounded-xl border-2 border-purple-200 backdrop-blur-sm"
              >
                No vehicles match the selected criteria.
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 backdrop-blur-sm"
                  >
                    {editingPostId === post._id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <select
                          className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={editAvailability}
                          onChange={(e) => setEditAvailability(e.target.value)}
                        >
                          <option value="available">Available</option>
                          <option value="booked">Booked</option>
                        </select>
                        <input
                          type="number"
                          className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                        <textarea
                          className="border-2 border-purple-200 p-2 rounded-lg w-full text-sm sm:text-base min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={editSpecs}
                          onChange={(e) => setEditSpecs(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleEditPost(post._id)} 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button 
                            onClick={() => setEditingPostId(null)} 
                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <h4 className="font-bold text-base sm:text-lg text-purple-900">{post.title}</h4>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingPostId(post._id);
                                setEditTitle(post.title);
                                setEditAvailability(post.availability);
                                setEditPrice(post.price);
                                setEditSpecs(post.specs);
                              }}
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeletePost(post._id)}
                              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                            >
                              <Trash className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-purple-700">Availability: {post.availability}</p>
                        <p className="text-xs sm:text-sm text-purple-700">Price: ₹{post.price} / day</p>
                        <p className="text-sm sm:text-base text-purple-900">{post.specs}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
