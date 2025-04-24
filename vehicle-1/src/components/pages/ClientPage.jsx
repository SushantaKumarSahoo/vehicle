import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ArrowLeft } from "lucide-react";
import axios from "../utils/axios";
import ClientAuthForm from "@/components/client/ClientAuthForm";
import ClientCartModal from "@/components/client/ClientCartModal";
import ClientFilterBar from "@/components/client/ClientFilterBar";
import ClientVehicleList from "@/components/client/ClientVehicleList";

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
  const getCartKey = (email) => `cart_${email}`;

  useEffect(() => {
    const savedAuth = localStorage.getItem("client-auth");
    if (savedAuth === "true") setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("client-auth", isAuthenticated);
  }, [isAuthenticated]);

  // Fetch posts from API
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
      fetchPosts();
      pollInterval = setInterval(fetchPosts, 5000);
    }
    return () => pollInterval && clearInterval(pollInterval);
  }, [isAuthenticated]);

  // Load cart data from localStorage on page load with expiration check
  useEffect(() => {
    if (currentUserEmail) {
      const cartKey = getCartKey(currentUserEmail);
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const { data, expires } = JSON.parse(savedCart);
        if (expires && new Date().getTime() < expires) {
          setCart(data);
        } else {
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
        const response = await axios.post("/api/login", { email, password });
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
        const response = await axios.post("/api/signup", { fullName, email, password });
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
      const existingItemIndex = prevCart.findIndex((item) => item._id === post._id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
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
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity in cart
  const handleDecreaseQuantity = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
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
      {/* Auth Form */}
      {!isAuthenticated && (
        <ClientAuthForm
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuth={handleAuth}
        />
      )}

      {/* Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629807473015-41699c4471b5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-pink-800/5 to-orange-700/5"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Bar */}
        <Button
          onClick={isAuthenticated ? handleLogout : () => navigate("/")}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 text-sm sm:text-base bg-gradient-to-r z-50 from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAuthenticated ? "Logout" : "Go to Home"}
        </Button>

        {/* Cart Button */}
        {isAuthenticated && (
          <Button
            onClick={() => setShowCart(true)}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center gap-2 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="bg-white text-purple-900 px-2 py-1 rounded-full text-xs font-bold">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </Button>
        )}

        {/* Cart Modal */}
        {isAuthenticated && (
          <ClientCartModal
            showCart={showCart}
            setShowCart={setShowCart}
            cart={cart}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleRemoveFromCart={handleRemoveFromCart}
            handleAcceptAllOffers={handleAcceptAllOffers}
          />
        )}

        {/* Main Content */}
        {isAuthenticated && (
          <div className="max-w-7xl mx-auto mt-8 p-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-900 flex items-center gap-2">
              <Truck className="w-6 h-6 text-orange-500" />
              Available Construction Vehicles
            </h2>
            <ClientFilterBar
              availabilityFilter={availabilityFilter}
              setAvailabilityFilter={setAvailabilityFilter}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              searchText={searchText}
              setSearchText={setSearchText}
            />
            <ClientVehicleList
              filteredPosts={filteredPosts}
              handleAddToCart={handleAddToCart}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}