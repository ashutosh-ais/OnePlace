import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDBConnection, getHabits, getCategories, addHabit, addCompletion, deleteHabit, getCompletions, addCategory, removeCompletion } from '../../database/DatabaseHelper';

export const initializeDatabase = createAsyncThunk(
  'habits/initializeDatabase',
  async () => {
    const db = await getDBConnection();
    const categories = await getCategories(db);
    const habits = await getHabits(db);
    
    // For each habit, fetch its history to build the rich Redux object
    const habitsWithHistory = await Promise.all(habits.map(async (habit) => {
      const completions = await getCompletions(db, habit.id);
      
      // Transform completions into the expected history format
      const history = completions.map(c => ({
        date: c.completed_at.substring(0, 10),
        status: 'completed',
        metric: c.metric,
        mood: c.mood,
        notes: c.notes,
      }));

      // Check if completed today
      const todayStr = new Date().toISOString().split('T')[0];
      const completed_today = history.some(h => h.date.startsWith(todayStr));

      return {
        ...habit,
        history,
        completed_today,
        consistencyScore: habit.streak > 0 ? Math.min(100, habit.streak * 5) : 0 // Basic calculation
      };
    }));

    return { categories, habits: habitsWithHistory };
  }
);

export const createNewCategory = createAsyncThunk(
  'habits/createNewCategory',
  async (name, { dispatch }) => {
    const db = await getDBConnection();
    await addCategory(db, name);
    dispatch(initializeDatabase()); // Refresh
  }
);

export const createRichHabit = createAsyncThunk(
  'habits/createRichHabit',
  async ({ categoryId, title, scheduleType, scheduleValue, targetQuantity, unit, reminderTime, checklists }, { dispatch }) => {
    const db = await getDBConnection();
    await addHabit(db, categoryId, title, scheduleType, scheduleValue, targetQuantity, unit, reminderTime, checklists);
    dispatch(initializeDatabase());
  }
);

export const logHabitCompletion = createAsyncThunk(
  'habits/logHabitCompletion',
  async (payload, { dispatch }) => {
    const { id, metric, mood, notes, dateStr } = payload;
    const db = await getDBConnection();
    await addCompletion(db, id, metric, mood, notes, dateStr);
    dispatch(initializeDatabase());
  }
);

export const undoHabitCompletion = createAsyncThunk(
  'habits/undoHabitCompletion',
  async (payload, { dispatch }) => {
    const db = await getDBConnection();
    // Allow either passing a raw ID for today, or an object {habitId, dateStr}
    if (typeof payload === 'object') {
      await removeCompletion(db, payload.habitId, payload.dateStr);
    } else {
      await removeCompletion(db, payload);
    }
    dispatch(initializeDatabase());
  }
);

export const removeHabit = createAsyncThunk(
  'habits/removeHabit',
  async (habitId, { dispatch }) => {
    const db = await getDBConnection();
    await deleteHabit(db, habitId);
    dispatch(initializeDatabase());
  }
);

const initialState = {
  habits: [],
  categories: [],
  loading: false,
  freezeTokens: 3, // Global static setting for now
  dashboardView: 'agenda', // 'agenda' | 'list' | 'grid'
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setDashboardView: (state, action) => {
      state.dashboardView = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initializeDatabase.pending, state => {
        state.loading = true;
      })
      .addCase(initializeDatabase.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.habits = action.payload.habits;
      })
      .addCase(createRichHabit.pending, state => {
        state.loading = true;
      })
      .addCase(logHabitCompletion.pending, state => {
        state.loading = true;
      });
  },
});

export const { setDashboardView } = habitSlice.actions;
export default habitSlice.reducer;
