import SQLite from 'react-native-sqlite-storage';

// Enable promise-based SQLite
SQLite.enablePromise(true);

const DATABASE_NAME = 'OnePlace.db';

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: DATABASE_NAME, location: 'default' });
};

export const createTables = async db => {
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
      name TEXT UNIQUE,
      icon TEXT,
      color TEXT
    );
  `;
  const habitTable = `
    CREATE TABLE IF NOT EXISTS Habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      schedule_type TEXT,
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
    console.log('OnePlace: Local Database Initialized');
  } catch (error) {
    console.error('DB Initialization Error: ', error);
  }
};

export const seedCategories = async db => {
  const categories = [
    { name: 'Health', icon: 'heart', color: '#EF4444' },
    { name: 'Work', icon: 'briefcase', color: '#3B82F6' },
    { name: 'Mind', icon: 'brain', color: '#8B5CF6' },
  ];
  try {
    for (const cat of categories) {
      await db.executeSql(
        `INSERT OR IGNORE INTO Categories (name, icon, color) VALUES (?, ?, ?)`,
        [cat.name, cat.icon, cat.color]
      );
    }
  } catch (error) {
    console.error('Seed Categories Error:', error);
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
    // Join with Categories to get category details
    const query = `
      SELECT Habits.*, Categories.name as category_name, Categories.icon as category_icon, Categories.color as category_color 
      FROM Habits 
      LEFT JOIN Categories ON Habits.category_id = Categories.id
      ORDER BY Habits.created_at DESC
    `;
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        habits.push(result.rows.item(index));
      }
    });
    return habits;
  } catch (error) {
    console.error('Get Habits Error:', error);
    return [];
  }
};

export const addHabit = async (db, categoryId, title, scheduleType) => {
  try {
    const insertQuery = `INSERT INTO Habits (category_id, title, schedule_type) VALUES (?, ?, ?)`;
    const [results] = await db.executeSql(insertQuery, [categoryId, title, scheduleType]);
    return results.insertId;
  } catch (error) {
    console.error('Add Habit Error:', error);
    throw error;
  }
};

export const addCompletion = async (db, habitId) => {
  try {
    // Insert completion record
    await db.executeSql(`INSERT INTO Completions (habit_id) VALUES (?)`, [habitId]);
    // Increment streak
    await db.executeSql(`UPDATE Habits SET streak = streak + 1 WHERE id = ?`, [habitId]);
  } catch (error) {
    console.error('Add Completion Error:', error);
    throw error;
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
