import SQLite from 'react-native-sqlite-storage';

// Enable promise-based SQLite
SQLite.enablePromise(true);

const DATABASE_NAME = 'OnePlace.db';

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: DATABASE_NAME, location: 'default' });
};

export const createTables = async db => {
  // Drop tables for a clean slate in development, allowing schema upgrades
  await db.executeSql(`DROP TABLE IF EXISTS Completions`);
  await db.executeSql(`DROP TABLE IF EXISTS Habits`);
  await db.executeSql(`DROP TABLE IF EXISTS Categories`);
  await db.executeSql(`DROP TABLE IF EXISTS Users`);

  const userTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      focus_goal TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const categoryTable = `
    CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );
  `;
  const habitTable = `
    CREATE TABLE IF NOT EXISTS Habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      schedule_type TEXT,
      schedule_value TEXT,
      target_quantity INTEGER DEFAULT 1,
      unit TEXT,
      reminder_time TEXT,
      checklists TEXT, 
      streak INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Categories (id)
    );
  `;
  const completionTable = `
    CREATE TABLE IF NOT EXISTS Completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      metric INTEGER,
      notes TEXT,
      mood TEXT,
      FOREIGN KEY (habit_id) REFERENCES Habits (id)
    );
  `;

  try {
    await db.executeSql(userTable);
    await db.executeSql(categoryTable);
    await db.executeSql(habitTable);
    await db.executeSql(completionTable);
    console.log('OnePlace: Local Database Initialized with Clean Advanced Schema');
  } catch (error) {
    console.error('DB Initialization Error: ', error);
  }
};

export const addCategory = async (db, name) => {
  try {
    const insertQuery = `INSERT OR IGNORE INTO Categories (name) VALUES (?)`;
    const [results] = await db.executeSql(insertQuery, [name]);
    return results.insertId;
  } catch (error) {
    console.error('Add Category Error:', error);
    throw error;
  }
};

export const getCategories = async db => {
  try {
    const categories = [];
    const results = await db.executeSql(`SELECT * FROM Categories`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        categories.push(result.rows.item(index));
      }
    });
    return categories;
  } catch (error) {
    console.error('Get Categories Error:', error);
    return [];
  }
};

export const getHabits = async db => {
  try {
    const habits = [];
    const query = `
      SELECT Habits.*, Categories.name as category_name 
      FROM Habits 
      LEFT JOIN Categories ON Habits.category_id = Categories.id
      ORDER BY Habits.created_at DESC
    `;
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        const item = result.rows.item(index);
        item.checklists = item.checklists ? JSON.parse(item.checklists) : [];
        habits.push(item);
      }
    });
    return habits;
  } catch (error) {
    console.error('Get Habits Error:', error);
    return [];
  }
};

export const addHabit = async (db, categoryId, title, scheduleType, scheduleValue, targetQuantity, unit, reminderTime, checklists) => {
  try {
    const insertQuery = `INSERT INTO Habits (category_id, title, schedule_type, schedule_value, target_quantity, unit, reminder_time, checklists) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [results] = await db.executeSql(insertQuery, [categoryId, title, scheduleType, scheduleValue, targetQuantity, unit, reminderTime, JSON.stringify(checklists || [])]);
    return results.insertId;
  } catch (error) {
    console.error('Add Habit Error:', error);
    throw error;
  }
};

export const recalculateStreak = async (db, habitId) => {
  try {
    const habitRes = await db.executeSql(`SELECT schedule_type, schedule_value FROM Habits WHERE id = ?`, [habitId]);
    if (habitRes[0].rows.length === 0) return 0;
    const habit = habitRes[0].rows.item(0);

    const compRes = await db.executeSql(`SELECT date(completed_at) as cDate FROM Completions WHERE habit_id = ? ORDER BY date(completed_at) DESC`, [habitId]);
    const completedDates = new Set();
    for (let i = 0; i < compRes[0].rows.length; i++) {
      completedDates.add(compRes[0].rows.item(i).cDate);
    }

    let currentStreak = 0;
    let d = new Date();
    d.setHours(0,0,0,0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 365; i++) { // Check up to 1 year back
      const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const todayStr = days[d.getDay()];
      
      let isRequired = true;
      if (habit.schedule_type === 'Specific Days') {
        const val = habit.schedule_value || '';
        if (!val.includes(todayStr)) {
          isRequired = false;
        }
      }

      if (isRequired) {
        if (completedDates.has(dateStr)) {
          currentStreak++;
        } else {
          if (i === 0) {
            // Missing today doesn't break streak yet
          } else {
            // Missing a required past day breaks the streak
            break;
          }
        }
      }

      d.setDate(d.getDate() - 1);
    }

    await db.executeSql(`UPDATE Habits SET streak = ? WHERE id = ?`, [currentStreak, habitId]);
    return currentStreak;
  } catch (error) {
    console.error("Recalculate streak error:", error);
    return 0;
  }
};

export const addCompletion = async (db, habitId, metric, mood, notes, inputDateStr = null) => {
  try {
    const d = new Date();
    // Use inputDateStr if provided, otherwise today
    const dateStr = inputDateStr || new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    const checkQuery = `SELECT id FROM Completions WHERE habit_id = ? AND date(completed_at) = ?`;
    const checkRes = await db.executeSql(checkQuery, [habitId, dateStr]);
    if (checkRes[0].rows.length > 0) return; // already completed on this date

    // Insert with the specific date (time set to 12:00:00 to avoid timezone issues)
    await db.executeSql(`INSERT INTO Completions (habit_id, metric, mood, notes, completed_at) VALUES (?, ?, ?, ?, ?)`, 
      [habitId, metric, mood, notes, `${dateStr} 12:00:00`]
    );
    
    await recalculateStreak(db, habitId);
  } catch (error) {
    console.error('Add Completion Error:', error);
    throw error;
  }
};

export const removeCompletion = async (db, habitId, inputDateStr = null) => {
  try {
    const d = new Date();
    const dateStr = inputDateStr || new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    const checkQuery = `SELECT id FROM Completions WHERE habit_id = ? AND date(completed_at) = ?`;
    const checkRes = await db.executeSql(checkQuery, [habitId, dateStr]);
    if (checkRes[0].rows.length > 0) {
      await db.executeSql(`DELETE FROM Completions WHERE habit_id = ? AND date(completed_at) = ?`, [habitId, dateStr]);
      await recalculateStreak(db, habitId);
    }
  } catch (error) {
    console.error('Remove Completion Error:', error);
    throw error;
  }
};

export const getCompletions = async (db, habitId) => {
  try {
    const completions = [];
    const results = await db.executeSql(`SELECT * FROM Completions WHERE habit_id = ? ORDER BY completed_at DESC`, [habitId]);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        completions.push(result.rows.item(index));
      }
    });
    return completions;
  } catch (error) {
    console.error('Get Completions Error:', error);
    return [];
  }
};

export const deleteHabit = async (db, habitId) => {
  try {
    await db.executeSql(`DELETE FROM Completions WHERE habit_id = ?`, [habitId]);
    await db.executeSql(`DELETE FROM Habits WHERE id = ?`, [habitId]);
  } catch (error) {
    console.error('Delete Habit Error:', error);
    throw error;
  }
};

export const createLocalUser = async (db, name, focusGoal) => {
  const insertQuery = `INSERT INTO Users (name, focus_goal) VALUES (?, ?)`;
  const [results] = await db.executeSql(insertQuery, [name, focusGoal]);
  return results.insertId;
};
