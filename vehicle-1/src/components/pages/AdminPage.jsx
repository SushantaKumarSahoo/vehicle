import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import axios from "../utils/axios";
import { Button } from "@/components/common/Button";
import AdminVehicleForm from "@/components/admin/AdminVehicleForm";
import AdminVehicleList from "@/components/admin/AdminVehicleList";
import NotificationList from "@/components/admin/NotificationList";

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

      {/* Logout/Back Button - always on top */}
      <div className="w-full flex z-[999] top-0 left-0 bg-transparent">
        <Button
          onClick={() => {
            if (isAuthenticated) setIsAuthenticated(false);
            navigate("/");
          }}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 text-sm sm:text-base bg-gradient-to-r z-50 from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAuthenticated ? "Logout" : "Go to Home"}
        </Button>
      </div>
      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
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
              <NotificationList
                notifications={notifications}
                handleViewNotification={handleViewNotification}
              />
              <AdminVehicleForm
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                newAvailability={newAvailability}
                setNewAvailability={setNewAvailability}
                newPrice={newPrice}
                setNewPrice={setNewPrice}
                newSpecs={newSpecs}
                setNewSpecs={setNewSpecs}
                handleAddVehicle={handleAddVehicle}
              />
              <AdminVehicleList
                posts={posts}
                filteredPosts={filteredPosts}
                editingPostId={editingPostId}
                setEditingPostId={setEditingPostId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editAvailability={editAvailability}
                setEditAvailability={setEditAvailability}
                editPrice={editPrice}
                setEditPrice={setEditPrice}
                editSpecs={editSpecs}
                setEditSpecs={setEditSpecs}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                availabilityFilter={availabilityFilter}
                setAvailabilityFilter={setAvailabilityFilter}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}