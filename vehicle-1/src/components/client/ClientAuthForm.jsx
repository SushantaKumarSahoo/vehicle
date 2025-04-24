import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientAuthForm({
  isLogin,
  setIsLogin,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
}) {
  return (
    <div className="absolute top-0 left-0 w-full flex justify-center items-center z-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-xl shadow-xl border border-purple-200 max-w-sm w-full mt-8 flex flex-col items-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-900 flex items-center justify-center gap-2">
          <Truck className="w-8 h-8 text-orange-500" />
          Client {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleAuth} className="flex flex-col gap-4 w-full">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-purple-200 p-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-xs sm:text-sm text-center text-purple-700 w-full">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-purple-600 hover:text-purple-800 font-semibold underline"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}