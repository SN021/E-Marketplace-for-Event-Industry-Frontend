"use client";

import { ShieldOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <ShieldOff className="w-20 h-20 text-red-500" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold text-red-600 mb-2"
      >
        403 - Forbidden
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-gray-600 max-w-md mb-6"
      >
        You don't have permission to access this page. Please contact an
        administrator if you think this is a mistake.
      </motion.p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => router.push("/dashboard")}
        className="inline-flex items-center gap-2 bg-primary/90 text-white px-4 py-2 rounded-md text-sm hover:primary transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back Home
      </motion.button>
    </div>
  );
}
