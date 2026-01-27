
import { AppData, StorageKeys, StudyPost, ActivityLog, User } from '../types';

const INITIAL_DATA: AppData = {
  posts: [],
  logs: [],
};

export const getAppData = (): AppData => {
  const data = localStorage.getItem(StorageKeys.APP_DATA);
  return data ? JSON.parse(data) : INITIAL_DATA;
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(StorageKeys.APP_DATA, JSON.stringify(data));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(StorageKeys.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(StorageKeys.CURRENT_USER);
  }
};

export const addPost = (post: StudyPost, logs: ActivityLog[]) => {
  const data = getAppData();
  data.posts.unshift(post);
  data.logs = [...logs, ...data.logs].slice(0, 100); // Keep last 100 logs
  saveAppData(data);
};

export const updatePost = (updatedPost: StudyPost) => {
  const data = getAppData();
  const index = data.posts.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    data.posts[index] = updatedPost;
    saveAppData(data);
  }
};

export const addLog = (log: ActivityLog) => {
  const data = getAppData();
  data.logs.unshift(log);
  if (data.logs.length > 100) data.logs.pop();
  saveAppData(data);
};

// Function to reset rankings (conceptually for monthly reset)
export const checkMonthlyReset = () => {
  const lastResetMonth = localStorage.getItem('last_reset_month');
  const currentMonth = new Date().getMonth();
  
  if (lastResetMonth === null || parseInt(lastResetMonth) !== currentMonth) {
    // We don't delete data, we just calculate the ranking based on the current month.
    // The requirement says "ranking zera todo dia 01", which we handle in the ranking component logic.
    localStorage.setItem('last_reset_month', currentMonth.toString());
  }
};
