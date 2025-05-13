import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ onTasksChange }) => {
  // Define icons
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const EditIcon = getIcon('Edit');
  const CheckIcon = getIcon('Check');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CircleIcon = getIcon('Circle');
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const FlagIcon = getIcon('Flag');
  const TagIcon = getIcon('Tag');
  const FilterIcon = getIcon('Filter');
  const SearchIcon = getIcon('Search');
  
  // State management
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasktide-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: ''
  });
  
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('tasktide-categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      { id: 'work', name: 'Work', color: '#3b82f6' },
      { id: 'personal', name: 'Personal', color: '#8b5cf6' },
      { id: 'shopping', name: 'Shopping', color: '#f97316' },
      { id: 'health', name: 'Health', color: '#10b981' }
    ];
  });
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasktide-tasks', JSON.stringify(tasks));
    localStorage.setItem('tasktide-categories', JSON.stringify(categories));
    
    // Update parent component with stats
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, categories, onTasksChange]);
  
  // Handle input changes for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    
    const task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      category: newTask.category,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: ''
    });
    setIsFormExpanded(false);
    
    toast.success("Task added successfully");
  };
  
  // Toggle task completion status
  const toggleTaskCompletion = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    toast.info("Task status updated");
  };
  
  // Delete a task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted");
  };
  
  // Start editing a task
  const startEditTask = (task) => {
    setEditingTask({
      ...task,
      tempTitle: task.title,
      tempDescription: task.description,
      tempDueDate: task.dueDate,
      tempPriority: task.priority,
      tempCategory: task.category
    });
  };
  
  // Update an editing task field
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name.replace('temp', '').toLowerCase()]: value }));
  };
  
  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: editingTask.title.trim(),
              description: editingTask.description.trim(),
              dueDate: editingTask.dueDate,
              priority: editingTask.priority,
              category: editingTask.category,
              updatedAt: new Date().toISOString()
            } 
          : task
      )
    );
    
    setEditingTask(null);
    toast.success("Task updated");
  };
  
  // Cancel task editing
  const cancelEditTask = () => {
    setEditingTask(null);
  };
  
  // Filter tasks based on current filter and search query
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !task.isCompleted) ||
      (filter === 'completed' && task.isCompleted) ||
      (filter === task.priority) ||
      (filter === task.category);
      
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });
  
  // Get category name and color
  const getCategoryInfo = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category || { name: '', color: '#94a3b8' };
  };
  
  // Priority badge class
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <motion.div 
        className="card overflow-hidden"
        animate={{ height: isFormExpanded ? 'auto' : '60px' }}
        initial={false}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PlusIcon className="h-5 w-5 text-primary" />
            <span>Add New Task</span>
          </h2>
          <motion.div
            animate={{ rotate: isFormExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {getIcon('ChevronDown')({ className: "h-5 w-5 text-surface-500" })}
          </motion.div>
        </div>
        
        {isFormExpanded && (
          <motion.form 
            onSubmit={handleAddTask}
            className="mt-4 space-y-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label htmlFor="title" className="label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="What needs to be done?"
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="label">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Add more details about this task..."
                className="input-field min-h-[80px] resize-y"
                rows="3"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="dueDate" className="label flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" /> Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="label flex items-center gap-1">
                  <FlagIcon className="h-4 w-4" /> Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="label flex items-center gap-1">
                  <TagIcon className="h-4 w-4" /> Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newTask.category}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">No Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                type="button" 
                onClick={() => setIsFormExpanded(false)}
                className="btn btn-secondary mr-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
      
      {/* Task Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            Completed
          </button>
          
          <div className="relative group">
            <button 
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 flex items-center gap-1"
            >
              <FilterIcon className="h-4 w-4" />
              <span>More</span>
            </button>
            
            <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-surface-800 shadow-card rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2 text-sm font-medium text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
                Priority
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => setFilter('low')} 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  Low
                </button>
                <button 
                  onClick={() => setFilter('medium')} 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                  Medium
                </button>
                <button 
                  onClick={() => setFilter('high')} 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  High
                </button>
              </div>
              
              {categories.length > 0 && (
                <>
                  <div className="p-2 text-sm font-medium text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700 border-t">
                    Categories
                  </div>
                  <div className="p-2 flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {categories.map(category => (
                      <button 
                        key={category.id}
                        onClick={() => setFilter(category.id)} 
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <span 
                          className="inline-block w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <input 
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 w-full sm:w-56 md:w-64"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
        </div>
      </div>
      
      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-10 rounded-lg border-2 border-dashed border-surface-200 dark:border-surface-700"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
                {getIcon('ClipboardList')({ className: "h-8 w-8 text-surface-400" })}
              </div>
              <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-1">
                {searchQuery 
                  ? "No matching tasks found" 
                  : filter === 'completed' 
                    ? "No completed tasks yet" 
                    : filter === 'active' 
                      ? "No active tasks" 
                      : "No tasks yet"}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {searchQuery 
                  ? "Try a different search term" 
                  : "Add a new task to get started"}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className={`card ${task.isCompleted ? 'bg-surface-50/50 dark:bg-surface-800/50' : ''}`}
              >
                {editingTask && editingTask.id === task.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleEditChange}
                      className="input-field font-medium"
                      placeholder="Task title"
                    />
                    
                    <textarea
                      name="description"
                      value={editingTask.description}
                      onChange={handleEditChange}
                      className="input-field min-h-[60px] resize-y"
                      placeholder="Description (optional)"
                      rows="2"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="label text-xs">Due Date</label>
                        <input
                          type="date"
                          name="dueDate"
                          value={editingTask.dueDate}
                          onChange={handleEditChange}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label className="label text-xs">Priority</label>
                        <select
                          name="priority"
                          value={editingTask.priority}
                          onChange={handleEditChange}
                          className="input-field"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="label text-xs">Category</label>
                        <select
                          name="category"
                          value={editingTask.category}
                          onChange={handleEditChange}
                          className="input-field"
                        >
                          <option value="">No Category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-1">
                      <button 
                        type="button"
                        onClick={cancelEditTask}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={saveEditedTask}
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="flex items-start sm:items-center gap-3">
                      <button 
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="flex-shrink-0 mt-0.5 sm:mt-0 rounded-full transition-colors hover:bg-surface-100 dark:hover:bg-surface-700 p-1 -m-1"
                        aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <CircleIcon className="h-6 w-6 text-surface-400" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium break-words ${
                          task.isCompleted ? 'line-through text-surface-400 dark:text-surface-500' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`mt-1 text-sm break-words ${
                            task.isCompleted ? 'text-surface-400 dark:text-surface-600' : 'text-surface-600 dark:text-surface-400'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-surface-500 dark:text-surface-400">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          )}
                          
                          {task.priority && (
                            <span className={`px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          )}
                          
                          {task.category && (
                            <span 
                              className="px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: getCategoryInfo(task.category).color }}
                            >
                              {getCategoryInfo(task.category).name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditTask(task)}
                          className="p-1.5 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                          aria-label="Edit task"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;