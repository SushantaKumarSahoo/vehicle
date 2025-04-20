import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Add cart icon
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Search, Shield, User, ArrowLeft } from "lucide-react";
import axios from "../utils/axios";


export default function ClientPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchText, setSearchText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const navigate = useNavigate();

  // Get cart key based on user email
  const getCartKey = (email) => {
    return `cart_${email}`;
  };
  useEffect(() => {
    const savedAuth = localStorage.getItem("client-auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("client-auth", isAuthenticated);
  }, [isAuthenticated]);

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Load posts on authentication and set up polling
  useEffect(() => {
    let pollInterval;

    if (isAuthenticated) {
      // Initial fetch
      fetchPosts();

      // Set up polling every 5 seconds
      pollInterval = setInterval(fetchPosts, 5000);
    }

    // Cleanup interval on unmount or when authentication changes
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isAuthenticated]);

  // Load cart data from localStorage on page load with expiration check
  useEffect(() => {
    if (currentUserEmail) {
      
      const cartKey = getCartKey(currentUserEmail);
      

      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        const { data, expires } = JSON.parse(savedCart);
        if (expires && new Date().getTime() < expires) {
          setCart();
        } else {
          // Clear expired cart data
          localStorage.removeItem(cartKey);
          setCart([]);
        }
      }
    }
  }, [currentUserEmail]);

  // Update cart in localStorage whenever cart changes with expiration
  useEffect(() => {
    if (cart.length > 0 && currentUserEmail) {
      const cartKey = getCartKey(currentUserEmail);
      const expires = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days from now
      localStorage.setItem(cartKey, JSON.stringify({ data: cart, expires }));
    } else if (currentUserEmail) {
      const cartKey = getCartKey(currentUserEmail);
      localStorage.removeItem(cartKey);
    }
  }, [cart, currentUserEmail]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await axios.post("/api/login", {
          email,
          password,
        });
        setIsAuthenticated(true);
        setCurrentUserEmail(email);
        alert(response.data.message);
      } catch (error) {
        alert(
          error?.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } else {
      try {
        const response = await axios.post("/api/signup", {
          fullName,
          email,
          password,
        });
        setCurrentUserEmail(email);
        alert(response.data.message);
      } catch (error) {
        alert(
          error?.response?.data?.message || "Signup failed. Please try again."
        );
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail("");
    localStorage.removeItem("client-auth");
    navigate("/");
  };

  // Add to cart logic
  const handleAddToCart = (post) => {
    
    setCart((prevCart) => {
      console.log("handleAddToCart Executed")
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === post._id
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        
        updatedCart[existingItemIndex].quantity += 1; 
        // Increment the quantity by 1
        return updatedCart;
      } else {
        return [...prevCart, { ...post, quantity: 1 }];
      }
    });
  };

  // Accept offer logic for all cart items
  const handleAcceptAllOffers = async () => {
    try {
      const cartSummary = cart.map((item) => ({
        postId: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      }));

      const totalAmount = cartSummary.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const itemsList = cartSummary
        .map(
          (item) =>
            `${item.quantity} units of ${item.title} (₹${item.totalPrice})`
        )
        .join("\n");

      const response = await axios.post("/api/notify-seller", {
        items: cartSummary,
        totalAmount,
        message: `User has requested the following items:\n${itemsList}\n\nTotal Amount: ₹${totalAmount}`,
      });

      alert(response.data.message || "All offers accepted and admin notified.");
      setCart([]); // Clear cart after successful notification
      setShowCart(false); // Close cart modal
    } catch (error) {
      alert("Failed to notify admin. Please try again.");
    }
  };

  // Increase item quantity in cart
  const handleIncreaseQuantity = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
      return updatedCart;
    });
  };

  // Decrease item quantity in cart
  const handleDecreaseQuantity = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updatedCart;
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const filteredPosts = posts.filter((post) => {
    const matchesAvailability =
      availabilityFilter === "all" ||
      post.availability.toLowerCase() === availabilityFilter;
    const matchesPrice =
      !maxPrice || parseFloat(post.price) <= parseFloat(maxPrice);
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesAvailability && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 sm:p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          onClick={isAuthenticated ? handleLogout : () => navigate("/")}
          className={`absolute top-4 sm:top-6 left-4 sm:left-6 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2`}
        >
          <ArrowLeft className="w-4 h-4" />
          {isAuthenticated ? "Logout" : "Go to Home"}
        </Button>

        {/* Cart Icon */}
        <Button
          onClick={() => setShowCart(true)}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center gap-2 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="bg-white text-purple-900 px-2 py-1 rounded-full text-xs font-bold">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </Button>

        {/* Cart Modal */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl max-w-lg w-full shadow-2xl border border-purple-200"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-purple-900">
                  Your Cart
                </h2>
                {cart.length === 0 ? (
                  <p className="text-sm sm:text-base text-purple-700">
                    No items in the cart
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((post, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 p-3 border-b border-purple-200 bg-white/50 rounded-lg"
                      >
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <p className="text-sm sm:text-base text-purple-900">
                            {post.title} (x{post.quantity})
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleIncreaseQuantity(post._id)}
                              className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow hover:shadow-lg transition-all duration-300"
                            >
                              +
                            </Button>
                            <Button
                              onClick={() => handleDecreaseQuantity(post._id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow hover:shadow-lg transition-all duration-300"
                            >
                              -
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <p className="text-sm sm:text-base font-semibold text-purple-900">
                            ₹{post.price * post.quantity}
                          </p>
                          <Button
                            onClick={() => handleRemoveFromCart(post._id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-full shadow hover:shadow-lg transition-all duration-300"
                          >
                            Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-purple-200">
                      <p className="text-sm sm:text-base font-semibold text-purple-900">
                        Total: ₹
                        {cart.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )}
                      </p>
                      <Button
                        onClick={handleAcceptAllOffers}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Notify Seller for All Items
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => setShowCart(false)}
                  className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                >
                  Close Cart
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-xl shadow-xl border border-purple-200 max-w-sm w-full"
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-900">
                <Truck className="inline-block w-8 h-8 mr-2 text-orange-500" />
                Client {isLogin ? "Login" : "Sign Up"}
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
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
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
              className="mb-4 flex flex-col sm:flex-row gap-4 bg-white/50 p-4 rounded-xl shadow-lg border border-purple-200"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-purple-900">
                    {post.title}
                  </h3>
                  <p className="text-sm sm:text-base mb-1 text-purple-700">
                    Price: ₹{post.price}
                  </p>
                  <p className="text-sm sm:text-base mb-4 text-purple-700">
                    Availability: {post.availability}
                  </p>
                  <Button
                    onClick={() =>{
                      handleAddToCart(post);
                      
                    } }
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Add to Cart
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
