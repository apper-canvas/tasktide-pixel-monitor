import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const WaveIcon = getIcon('Wave');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const ListChecksIcon = getIcon('ListChecks');
  
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  
  // Get time-based welcome message
  useEffect(() => {
    const hours = new Date().getHours();
    let message = "";
    
    if (hours >= 5 && hours < 12) {
      message = "Good morning";
    } else if (hours >= 12 && hours < 18) {
      message = "Good afternoon";
    } else {
      message = "Good evening";
    }
    
    setWelcomeMessage(message);
  }, []);
  
  // Update stats when tasks change
  const updateStats = (tasks) => {
    setStats({
      total: tasks.length,
      completed: tasks.filter(task => task.isCompleted).length,
      pending: tasks.filter(task => !task.isCompleted).length
    });
  };

  // Current date display
  const currentDate = format(new Date(), 'EEEE, MMMM do');

  useEffect(() => {
    console.log('abcd', abcd);
  }, [])
  
  return (
    <div className="min-h-screen">
      <header className="pt-16 pb-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskTide
              </h1>
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 15 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <WaveIcon className="h-7 w-7 text-primary" />
              </motion.div>
            </div>
            <p className="text-lg text-surface-600 dark:text-surface-400 mt-2">
              {welcomeMessage}! Today is {currentDate}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[100px] p-3 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <ListChecksIcon className="h-5 w-5 text-primary" />
                <span className="text-surface-600 dark:text-surface-400 text-sm">Total</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            
            <div className="flex-1 min-w-[100px] p-3 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-surface-600 dark:text-surface-400 text-sm">Completed</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            
            <div className="flex-1 min-w-[100px] p-3 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-surface-600 dark:text-surface-400 text-sm">Pending</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pb-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        <MainFeature onTasksChange={updateStats} />
      </main>
      
      <footer className="py-6 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-500 dark:text-surface-400">
        <p>© {new Date().getFullYear()} TaskTide. Streamline your productivity.</p>
      </footer>
    </div>
  );
};

export default Home;
