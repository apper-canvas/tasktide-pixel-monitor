import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const HomeIcon = getIcon('Home');
  const LifeBuoyIcon = getIcon('LifeBuoy');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="mb-8">
          <motion.div 
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, times: [0, 0.2, 0.8, 1] }}
            className="mx-auto w-24 h-24 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center mb-4"
          >
            <LifeBuoyIcon className="h-12 w-12 text-primary" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-3">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Oops! The page you're looking for has drifted away. Let's get you back on track.
          </p>
        </div>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl shadow-soft transition-all duration-300 font-medium"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;