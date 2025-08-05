/**
 * Simple Task Manager - Core JavaScript functionality
 * Handles task creation, completion, deletion, and persistence
 */

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.init();
    }

    /**
     * Initialize the task manager
     */
    init() {
        this.loadTasks();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    /**
     * Bind event listeners to DOM elements
     */
    bindEvents() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput');
        const filterBtns = document.querySelectorAll('.filter-btn');

        addTaskBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    /**
     * Add a new task
     */
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        var prioritySelect = document.getElementById('prioritySelect');
        var priority = prioritySelect.value;

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            priority:priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.sortTasksByPriority();
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        // Clear input
        taskInput.value = '';
        taskInput.focus();
    }

    /**
     * Toggle task completion status
     * @param {number} taskId - The ID of the task to toggle
     */
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    /**
     * Sort tasks by priority (high -> medium -> low) and then by creation date
     */
    sortTasksByPriority() {
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        
        this.tasks.sort((a, b) => {
            // First sort by completion status (incomplete tasks first)
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }
            
            // Then sort by priority
            var priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];  // inconsistent var
            if (priorityDiff !== 0) {
                return priorityDiff;
            }
            
            // Finally sort by creation date (newest first for same priority)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    /**
     * Delete a task
     * @param {number} taskId - The ID of the task to delete
     */
    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    /**
     * Set the current filter
     * @param {string} filter - The filter to apply ('all', 'pending', 'completed')
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    /**
     * Get filtered tasks based on current filter
     * @returns {Array} Filtered array of tasks
     */
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    /**
     * Render tasks to the DOM
     */
    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        
        // Sort tasks before filtering
        this.sortTasksByPriority();
        const filteredTasks = this.getFilteredTasks();

        // Clear existing tasks
        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    /**
     * Create a DOM element for a task
     * @param {Object} task - The task object
     * @returns {HTMLElement} The task DOM element
     */
    createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;

        const createdDate = new Date(task.createdAt).toLocaleDateString();
        var priorityIcon = this.getPriorityIcon(task.priority);
        var priorityText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="taskManager.toggleTask(${task.id})">
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <span class='priority-badge ${task.priority}'>${priorityIcon} ${priorityText}</span>
            <span class="task-date">${createdDate}</span>
            <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Delete</button>
        `;

        return taskItem;
    }

    /**
     * Get priority icon based on priority level
     * @param {string} priority - The priority level
     * @returns {string} The priority icon
     */   
    getPriorityIcon(priority) {
        switch(priority){
            case 'high':
                return '🔴';
            case 'medium':return '🟡';
            case 'low':
                return '🟢';
            default:
                return '⚪';
        }
    }

    /**
     * Update task statistics
     */
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    }

    /**
     * Save tasks to localStorage
     */
    saveTasks() {
        try {
            localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    }

    /**
     * Load tasks from localStorage
     */
    loadTasks() {
        try {
            const saved = localStorage.getItem('taskManagerTasks');
            if (saved) {
                this.tasks = JSON.parse(saved);
                
                // Ensure backward compatibility - add priority to existing tasks
                this.tasks = this.tasks.map(task=>({
                    ...task,
                    priority: task.priority||'medium'
                }));
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.tasks = [];
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the task manager when the page loads
let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskManager;
}
