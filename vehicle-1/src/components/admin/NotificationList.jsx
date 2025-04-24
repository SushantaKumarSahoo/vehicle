import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/common/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationList({ notifications, handleViewNotification }) {
  if (!notifications.length) return null;
  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
}