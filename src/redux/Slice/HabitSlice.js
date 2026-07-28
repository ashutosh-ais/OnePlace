import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDBConnection, getHabits, getCategories, addHabit, addCompletion, deleteHabit, seedCategories } from '../../database/DatabaseHelper';

export const initializeDatabase = createAsyncThunk(
  'habits/initializeDatabase',
  async () => {
    const db = await getDBConnection();
    await seedCategories(db);
    const categories = await getCategories(db);
    const habits = await getHabits(db);
    return { categories, habits };
  }
);

export const createNewHabit = createAsyncThunk(
  'habits/createNewHabit',
  async ({ categoryId, title, scheduleType }, { dispatch }) => {
    const db = await getDBConnection();
    await addHabit(db, categoryId, title, scheduleType);
    const habits = await getHabits(db);
    return habits;
  }
);

export const markHabitCompleted = createAsyncThunk(
  'habits/markHabitCompleted',
  async (habitId, { dispatch }) => {
    const db = await getDBConnection();
    await addCompletion(db, habitId);
    const habits = await getHabits(db);
    return habits;
  }
);

export const removeHabit = createAsyncThunk(
  'habits/removeHabit',
  async (habitId, { dispatch }) => {
    const db = await getDBConnection();
    await deleteHabit(db, habitId);
    const habits = await getHabits(db);
    return habits;
  }
);

const initialState = {
  habits: [],
  categories: [],
  loading: false,
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
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
      .addCase(createNewHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(markHabitCompleted.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(removeHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
      });
  },
});

export default habitSlice.reducer;
