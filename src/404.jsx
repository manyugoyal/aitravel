import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black text-center px-6">
      <motion.h1 className="text-9xl font-extrabold text-black" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        404
      </motion.h1>

      <motion.p className="text-xl mt-4 text-gray-400" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        Oops! The page you're looking for doesn't exist.
      </motion.p>

      <motion.div className="mt-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-black transition-all">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
