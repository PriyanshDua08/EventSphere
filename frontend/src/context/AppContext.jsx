import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null | {userId, name, role, email}
  const [subEvents, setSubEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]); // current user's registrations (raw, with .event)
  const [loading, setLoading] = useState(true);

  const fetchSubEvents = useCallback(async () => {
    const { data } = await api.get('/subevents');
    setSubEvents(data);
    return data;
  }, []);

  const fetchMyRegistrations = useCallback(async () => {
    const { data } = await api.get('/registrations/me');
    setRegistrations(data);
    return data;
  }, []);

  // Bootstrap: restore session from token, load sub-events
  useEffect(() => {
    (async () => {
      await fetchSubEvents();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    })();
  }, [fetchSubEvents]);

  // Load registrations whenever a participant logs in
  useEffect(() => {
    if (user?.role === 'participant') fetchMyRegistrations();
    else setRegistrations([]);
  }, [user, fetchMyRegistrations]);

  async function signup({ name, email, password, role }) {
    const { data } = await api.post('/auth/signup', { name, email, password, role });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  function isRegistered(subEventId) {
    return registrations.some(r => r.subEventId === subEventId || r.event?.subEventId === subEventId);
  }

  async function register(subEventId) {
    await api.post('/registrations', { subEventId });
    await Promise.all([fetchSubEvents(), fetchMyRegistrations()]);
  }

  async function checkIn(registrationId) {
    await api.patch(`/registrations/${registrationId}/checkin`);
  }

  async function getRegistrationsForSubEvent(subEventId) {
    const { data } = await api.get(`/registrations/subevent/${subEventId}`);
    return data.map(r => ({ ...r, subEventId, participantName: r.participantId?.name }));
  }

  async function createSubEvent(payload) {
    await api.post('/subevents', payload);
    await fetchSubEvents();
  }

  async function updateSubEvent(subEventId, payload) {
    await api.put(`/subevents/${subEventId}`, payload);
    await fetchSubEvents();
  }

  async function deleteSubEvent(subEventId) {
    await api.delete(`/subevents/${subEventId}`);
    await fetchSubEvents();
  }

  const myRegistrations = registrations.map(r => ({ ...r, subEventId: r.event?.subEventId }));

  return (
    <AppContext.Provider value={{
      user, signup, login, logout, loading,
      subEvents, registrations, myRegistrations,
      isRegistered, register, checkIn, getRegistrationsForSubEvent,
      createSubEvent, deleteSubEvent, updateSubEvent,
      refreshSubEvents: fetchSubEvents,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
























































































































































































































































































































































































































































// // Import React hooks and context utilities
// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// // Import your API client (axios or similar)
// import api from '../api/client';

// Create a new Context object for tasks
// This will allow any component to access task-related state and functions
// const TaskContext = createContext(null);

// export function TaskProvider({ children }) {
//   // -------------------- STATE --------------------
//   // Holds the currently logged-in user (null if not logged in)
//   const [user, setUser] = useState(null); // {id, name, email}
//   // Holds the list of tasks fetched from the backend
//   const [tasks, setTasks] = useState([]);
//   // Loading flag to show spinners until bootstrap finishes
//   const [loading, setLoading] = useState(true);

  // -------------------- API CALLS --------------------
  // Fetch all tasks from the server
  // useCallback ensures the function reference is stable across renders
  // const fetchTasks = useCallback(async () => {
  //   const { data } = await api.get('/tasks');
  //   setTasks(data); // update state with fetched tasks
  //   return data;    // return data for optional chaining
  // }, []);

  // -------------------- BOOTSTRAP --------------------
  // On first render, restore session from localStorage token
  // and load tasks from the backend
  // useEffect(() => {
  //   (async () => {
  //     // Check if a token exists in localStorage
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
          // Validate token and fetch user info
      
          // If token is invalid, remove it
      //     localStorage.removeItem('token');
      //   }
      // }
      // Fetch tasks regardless of login state
      // await fetchTasks();
      // Mark loading as complete
  //     setLoading(false);
  //   })();
  // }, [fetchTasks]);

  // -------------------- AUTH FUNCTIONS --------------------
  // Signup new user
  // async function signup({ name, email, password }) {
  //   const { data } = await api.post('/auth/signup', { name, email, password });
  //   localStorage.setItem('token', data.token); // save token
  //   setUser(data.user); // set user state
  //   return data.user;
  // }

  // Login existing user


  // -------------------- TASK CRUD --------------------
  // Create a new task
  // async function createTask(payload) {
  //   await api.post('/tasks', payload);
  //   await fetchTasks(); // refresh tasks after creation
  // }

  // Update an existing task
 // Import React hooks and context utilities
/

  // -------------------- BOOTSTRAP --------------------
  // On first render, restore session from localStorage token
  // and load tasks from the backend
 // 

  // -------------------- AUTH FUNCTIONS --------------------
  // Signup new user
  // save token
  //   setUser(data.user); // set user state
  //   return data.user;
  // }

  // // Logout user
  // function logout() {
  //   localStorage.removeItem('token'); // clear token
  //   setUser(null); // reset user state
  // }

  // -------------------- TASK CRUD --------------------
  // Create a new task
// 

  // Update an existing task
  // async function updateTask(taskId, payload) {
  //   await api.put(`/tasks/${taskId}`, payload);
  //   await fetchTasks(); // refresh tasks after update
  // }

  // Delete a task
  // async function deleteTask(taskId) {
  //   await api.delete(`/tasks/${taskId}`);
  //   await fetchTasks(); // refresh tasks after deletion
  // }

  // Toggle completion status of a task
  // async function toggleComplete(taskId) {
  //   await api.patch(`/tasks/${taskId}/toggle`);
  //   await fetchTasks(); // refresh tasks after toggle
  // }

  // -------------------- CONTEXT VALUE --------------------
  // Expose state and functions to all children components


// -------------------- CUSTOM HOOK --------------------
// Convenience hook to access TaskContext
// export function useTasks() {
//   const ctx = useContext(TaskContext);
//   if (!ctx) throw new Error('useTasks must be used within TaskProvider');
//   return ctx;
// }


  // Delete a task
  // async function deleteTask(taskId) {
  //   await api.delete(`/tasks/${taskId}`);
  //   await fetchTasks(); // refresh tasks after deletion
  // }

  // Toggle completion status of a task
  // async function toggleComplete(taskId) {
  //   await api.patch(`/tasks/${taskId}/toggle`);
  //   await fetchTasks(); // refresh tasks after toggle
  // }

  // -------------------- CONTEXT VALUE --------------------
  // Expose state and functions to all children components
//   return (
//     <TaskContext.Provider value={{
//       user, signup, login, logout, loading, // auth-related
//       tasks, createTask, updateTask, deleteTask, toggleComplete, // task-related
//       refreshTasks: fetchTasks, // manual refresh
//     }}>
//       {children}
//     </TaskContext.Provider>
//   );
// }

// -------------------- CUSTOM HOOK --------------------
// Convenience hook to access TaskContext
// export function useTasks() {
//   const ctx = useContext(TaskContext);
//   if (!ctx) throw new Error('useTasks must be used within TaskProvider');
//   return ctx;
// }
// 
  // // Holds the list of tasks fetched from the backend
  // const [tasks, setTasks] = useState([]);
  // // Loading flag to show spinners until bootstrap finishes
  // const [loading, setLoading] = useState(true);

  // // -------------------- API CALLS --------------------
  // // Fetch all tasks from the server
  // // useCallback ensures the function reference is stable across renders
  // const fetchTasks = useCallback(async () => {
  //   const { data } = await api.get('/tasks');
    // setTasks(data); // update state with fetched tasks
  //   return data;    // return data for optional chaining
  // }, []);

  // // -------------------- BOOTSTRAP --------------------
  // // On first render, restore session from localStorage token
  // // and load tasks from the backend
  // useEffect(() => {
  //   (async () => {
  //     // Check if a token exists in localStorage
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
          // Validate token and fetch user info
  //         const { data } = await api.get('/auth/me');
  //         setUser(data); // set logged-in user
  //       } catch {
  //         // If token is invalid, remove it
  //         localStorage.removeItem('token');
  //       }
  //     }
  //     // Fetch tasks regardless of login state
  //     await fetchTasks();
  //     // Mark loading as complete
  //     setLoading(false);
  //   })();
  // }, [fetchTasks]);

  // -------------------- AUTH FUNCTIONS --------------------
  // Signup new user
  // async function signup({ name, email, password }) {
  //   const { data } = await api.post('/auth/signup', { name, email, password });
  //   localStorage.setItem('token', data.token); // save token
  //   setUser(data.user); // set user state
  //   return data.user;
  // }

  // Login existing user
  // async function login(email, password) {
  //   const { data } = await api.post('/auth/login', { email, password });
  //   localStorage.setItem('token', data.token); // save token
  //   setUser(data.user); // set user state
  //   return data.user;
  // }

  // Logout user
  // function logout() {
  //   localStorage.removeItem('token'); // clear token
  //   setUser(null); // reset user state
  // }

  // -------------------- TASK CRUD --------------------
  // Create a new task
  // async function createTask(payload) {
  //   await api.post('/tasks', payload);
  //   await fetchTasks(); // refresh tasks after creation
  // }

  // Update an existing task
  // async function updateTask(taskId, payload) {
  //   await api.put(`/tasks/${taskId}`, payload);
  //   await fetchTasks(); // refresh tasks after update
  // }

  // Delete a task
  // async function deleteTask(taskId) {
  //   await api.delete(`/tasks/${taskId}`);
  //   await fetchTasks(); // refresh tasks after deletion
  // }

  // Toggle completion status of a task
  // async function toggleComplete(taskId) {
  //   await api.patch(`/tasks/${taskId}/toggle`);
  //   await fetchTasks(); // refresh tasks after toggle
  // }

  // -------------------- CONTEXT VALUE --------------------
  // Expose state and functions to all children components
//   return (
//     <TaskContext.Provider value={{
//       user, signup, login, logout, loading, // auth-related
//       tasks, createTask, updateTask, deleteTask, toggleComplete, // task-related
//       refreshTasks: fetchTasks, // manual refresh
//     }}>
//       {children}
//     </TaskContext.Provider>
//   );
// }

// -------------------- CUSTOM HOOK --------------------
// Convenience hook to access TaskContext
// export function useTasks() {
//   const ctx = useContext(TaskContext);
//   if (!ctx) throw new Error('useTasks must be used within TaskProvider');
//   return ctx;
// }


