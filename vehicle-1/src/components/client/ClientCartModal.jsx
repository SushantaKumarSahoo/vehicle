import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";

export default function ClientCartModal({
  showCart,
  setShowCart,
  cart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleRemoveFromCart,
  handleAcceptAllOffers,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-0 sm:p-0 rounded-2xl max-w-lg w-full shadow-2xl border border-purple-200 overflow-hidden"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200">
              <h2 className="text-lg sm:text-xl font-bold text-purple-900 flex items-center gap-2">
                <FaShoppingCart className="text-orange-500" /> Your Cart
              </h2>
              <Button
                onClick={() => setShowCart(false)}
                className="bg-transparent hover:bg-purple-100 text-purple-700 p-1 rounded-full shadow-none"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            {/* Cart Content */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <FaShoppingCart className="w-12 h-12 text-purple-300 mb-2" />
                  <p className="text-base text-purple-700">No items in the cart</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-3 border border-purple-100 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-purple-900 text-base">{post.title}</div>
                        <div className="text-xs text-purple-500 mb-1">
                          ₹{post.price} x {post.quantity}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDecreaseQuantity(post._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-full text-lg font-bold"
                            disabled={post.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="px-2 text-purple-900 font-semibold">{post.quantity}</span>
                          <Button
                            onClick={() => handleIncreaseQuantity(post._id)}
                            className="bg-green-100 hover:bg-green-200 text-green-600 px-2 py-1 rounded-full text-lg font-bold"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-bold text-purple-900">
                          ₹{post.price * post.quantity}
                        </span>
                        <Button
                          onClick={() => handleRemoveFromCart(post._id)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-1 rounded-full text-xs shadow"
                        >
                          Remove
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-purple-100 to-pink-100 border-t border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-base font-bold text-purple-900">
                  Total: ₹{total}
                </div>
                <Button
                  onClick={handleAcceptAllOffers}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Notify Seller for All Items
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}