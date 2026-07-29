import SQLite from 'react-native-sqlite-storage';

// Enable promise-based SQLite
SQLite.enablePromise(true);

const DATABASE_NAME = 'OnePlace.db';

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: DATABASE_NAME, location: 'default' });
};

// Creates tables only if they don't already exist — NEVER drops data.
// Uses ALTER TABLE to add new columns safely to existing installs.
export const createTables = async db => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_number TEXT UNIQUE NOT NULL,
      name TEXT,
      focus_goal TEXT,
      is_active INTEGER DEFAULT 0,
      theme_color TEXT,
      color_mode TEXT DEFAULT 'system',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const categoryTable = `
    CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT,
      FOREIGN KEY (user_id) REFERENCES Users (id),
      UNIQUE(user_id, name)
    );
  `;
  const habitTable = `
    CREATE TABLE IF NOT EXISTS Habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
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
      FOREIGN KEY (user_id) REFERENCES Users (id),
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

    // ── Schema Migrations ──────────────────────────────────────────────────
    // ALTER TABLE is safe to run repeatedly — we catch errors if the
    // column already exists (SQLite has no "ADD COLUMN IF NOT EXISTS").

    const runMigration = async (query) => {
      try {
        await db.executeSql(query);
      } catch (err) {
        if (!err.message.includes('duplicate column name')) {
          console.warn('Migration warning:', query, err.message);
        }
      }
    };

    await runMigration(`ALTER TABLE Users ADD COLUMN is_active INTEGER DEFAULT 0`);
    await runMigration(`ALTER TABLE Habits ADD COLUMN user_id INTEGER`);
    await runMigration(`ALTER TABLE Categories ADD COLUMN user_id INTEGER`);
    await runMigration(`ALTER TABLE Habits ADD COLUMN color TEXT DEFAULT '#3B82F6'`);
    await runMigration(`ALTER TABLE Habits ADD COLUMN icon TEXT DEFAULT 'Activity'`);
    await runMigration(`ALTER TABLE Users ADD COLUMN theme_color TEXT`);
    await runMigration(`ALTER TABLE Users ADD COLUMN color_mode TEXT DEFAULT 'system'`);

    console.log('OnePlace: DB ready');
  } catch (error) {
    console.error('DB Initialization Error: ', error);
  }
};

// ─── Session Management ────────────────────────────────────────────────────

/**
 * Returns the currently active (logged-in) user, or null.
 */
export const getActiveUser = async db => {
  try {
    const results = await db.executeSql(
      `SELECT * FROM Users WHERE is_active = 1 LIMIT 1`,
    );
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Get Active User Error:', error);
    return null;
  }
};

/**
 * Marks a specific user as active (logged in). Clears all others.
 * Pass null for userId to log everyone out.
 */
export const setUserActive = async (db, userId) => {
  try {
    await db.executeSql(`UPDATE Users SET is_active = 0`);
    if (userId) {
      await db.executeSql(
        `UPDATE Users SET is_active = 1 WHERE id = ?`,
        [userId],
      );
    }
  } catch (error) {
    console.error('Set User Active Error:', error);
  }
};

// ─── User Management ───────────────────────────────────────────────────────

export const getUserByPhone = async (db, phoneNumber) => {
  try {
    const results = await db.executeSql(
      `SELECT * FROM Users WHERE phone_number = ? LIMIT 1`,
      [phoneNumber],
    );
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Get User By Phone Error:', error);
    return null;
  }
};

export const createUser = async (db, phoneNumber) => {
  try {
    const [results] = await db.executeSql(
      `INSERT INTO Users (phone_number, is_active) VALUES (?, 0)`,
      [phoneNumber],
    );
    return results.insertId;
  } catch (error) {
    console.error('Create User Error:', error);
    throw error;
  }
};

export const getUserStats = async (db, userId) => {
  try {
    const habitRes = await db.executeSql(
      `SELECT COUNT(*) as total, MAX(streak) as best_streak FROM Habits WHERE user_id = ?`,
      [userId],
    );
    const completionRes = await db.executeSql(
      `SELECT COUNT(*) as total FROM Completions WHERE habit_id IN (SELECT id FROM Habits WHERE user_id = ?)`,
      [userId],
    );
    const stats = habitRes[0].rows.item(0);
    const compStats = completionRes[0].rows.item(0);
    return {
      totalHabits: stats.total || 0,
      bestStreak: stats.best_streak || 0,
      totalCompletions: compStats.total || 0,
    };
  } catch (error) {
    console.error('Get User Stats Error:', error);
    return { totalHabits: 0, bestStreak: 0, totalCompletions: 0 };
  }
};

// ─── Categories ────────────────────────────────────────────────────────────

export const addCategory = async (db, name, userId) => {
  try {
    const insertQuery = `INSERT OR IGNORE INTO Categories (name, user_id) VALUES (?, ?)`;
    const [results] = await db.executeSql(insertQuery, [name, userId]);
    if (results.insertId && results.insertId > 0) {
      return results.insertId;
    }
    // If ignored (already exists), fetch the existing id
    const existing = await db.executeSql(
      `SELECT id FROM Categories WHERE name = ? AND user_id = ?`,
      [name, userId],
    );
    return existing[0].rows.item(0).id;
  } catch (error) {
    console.error('Add Category Error:', error);
    throw error;
  }
};

export const getCategories = async (db, userId) => {
  try {
    const categories = [];
    const results = await db.executeSql(
      `SELECT * FROM Categories WHERE user_id = ?`,
      [userId],
    );
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

// ─── Habits ────────────────────────────────────────────────────────────────

export const getHabits = async (db, userId) => {
  try {
    const habits = [];
    const query = `
      SELECT Habits.*
      FROM Habits
      WHERE Habits.user_id = ?
      ORDER BY Habits.created_at DESC
    `;
    const results = await db.executeSql(query, [userId]);

    const catRes = await db.executeSql(
      `SELECT * FROM Categories WHERE user_id = ?`,
      [userId],
    );
    const catMap = {};
    for (let i = 0; i < catRes[0].rows.length; i++) {
      const row = catRes[0].rows.item(i);
      catMap[row.id] = row.name;
    }

    const completionsRes = await db.executeSql(
      `SELECT habit_id, date(completed_at) as date, metric, mood, notes FROM Completions WHERE habit_id IN (SELECT id FROM Habits WHERE user_id = ?)`,
      [userId],
    );
    const allCompletions = {};
    for (let i = 0; i < completionsRes[0].rows.length; i++) {
      const row = completionsRes[0].rows.item(i);
      if (!allCompletions[row.habit_id]) {
        allCompletions[row.habit_id] = [];
      }
      allCompletions[row.habit_id].push({ ...row, status: 'completed' });
    }

    const d = new Date();
    const todayStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        const item = result.rows.item(index);
        let cats = [];
        try {
          const parsed = JSON.parse(item.category_id);
          if (Array.isArray(parsed)) {
            cats = parsed;
          } else {
            cats = [item.category_id];
          }
        } catch (e) {
          cats = [item.category_id];
        }
        item.category_name = cats
          .map(cId => catMap[cId])
          .filter(Boolean)
          .join(', ');

        item.checklists = item.checklists ? JSON.parse(item.checklists) : [];
        item.history = allCompletions[item.id] || [];
        item.completed_today = item.history.some(h =>
          h.date.startsWith(todayStr),
        );
        habits.push(item);
      }
    });
    return habits;
  } catch (error) {
    console.error('Get Habits Error:', error);
    return [];
  }
};

export const addHabit = async (
  db,
  userId,
  categoryId,
  title,
  scheduleType,
  scheduleValue,
  targetQuantity,
  unit,
  reminderTime,
  checklists,
) => {
  try {
    const insertQuery = `INSERT INTO Habits (user_id, category_id, title, schedule_type, schedule_value, target_quantity, unit, reminder_time, checklists) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [results] = await db.executeSql(insertQuery, [
      userId,
      categoryId,
      title,
      scheduleType,
      scheduleValue,
      targetQuantity,
      unit,
      reminderTime,
      JSON.stringify(checklists || []),
    ]);
    return results.insertId;
  } catch (error) {
    console.error('Add Habit Error:', error);
    throw error;
  }
};

export const updateHabit = async (db, habitId, fields) => {
  try {
    const allowed = [
      'title', 'category_id', 'schedule_type', 'schedule_value',
      'target_quantity', 'unit', 'reminder_time', 'checklists',
      'color', 'icon',
    ];
    const keys = Object.keys(fields).filter(k => allowed.includes(k));
    if (keys.length === 0) { return; }

    const setClauses = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k =>
      k === 'checklists' ? JSON.stringify(fields[k]) : fields[k],
    );
    values.push(habitId);

    await db.executeSql(
      `UPDATE Habits SET ${setClauses} WHERE id = ?`,
      values,
    );
  } catch (error) {
    console.error('Update Habit Error:', error);
    throw error;
  }
};

// ─── Streak Calculation ────────────────────────────────────────────────────

export const recalculateStreak = async (db, habitId) => {
  try {
    const habitRes = await db.executeSql(
      `SELECT schedule_type, schedule_value FROM Habits WHERE id = ?`,
      [habitId],
    );
    if (habitRes[0].rows.length === 0) {
      return 0;
    }
    const habit = habitRes[0].rows.item(0);

    const compRes = await db.executeSql(
      `SELECT date(completed_at) as cDate FROM Completions WHERE habit_id = ? ORDER BY date(completed_at) DESC`,
      [habitId],
    );
    const completedDates = new Set();
    for (let i = 0; i < compRes[0].rows.length; i++) {
      completedDates.add(compRes[0].rows.item(i).cDate);
    }

    let currentStreak = 0;
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 365; i++) {
      const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      const dayName = days[d.getDay()];

      let isRequired = true;
      if (habit.schedule_type === 'Specific Days') {
        const val = habit.schedule_value || '';
        if (!val.includes(dayName)) {
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
            break;
          }
        }
      }

      d.setDate(d.getDate() - 1);
    }

    await db.executeSql(`UPDATE Habits SET streak = ? WHERE id = ?`, [
      currentStreak,
      habitId,
    ]);
    return currentStreak;
  } catch (error) {
    console.error('Recalculate streak error:', error);
    return 0;
  }
};

// ─── Completions ───────────────────────────────────────────────────────────

export const addCompletion = async (
  db,
  habitId,
  metric,
  mood,
  notes,
  inputDateStr = null,
) => {
  try {
    const d = new Date();
    const dateStr =
      inputDateStr ||
      new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

    const checkQuery = `SELECT id FROM Completions WHERE habit_id = ? AND date(completed_at) = ?`;
    const checkRes = await db.executeSql(checkQuery, [habitId, dateStr]);
    if (checkRes[0].rows.length > 0) {
      return;
    }

    await db.executeSql(
      `INSERT INTO Completions (habit_id, metric, mood, notes, completed_at) VALUES (?, ?, ?, ?, ?)`,
      [habitId, metric, mood, notes, `${dateStr} 12:00:00`],
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
    const dateStr =
      inputDateStr ||
      new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

    const checkQuery = `SELECT id FROM Completions WHERE habit_id = ? AND date(completed_at) = ?`;
    const checkRes = await db.executeSql(checkQuery, [habitId, dateStr]);
    if (checkRes[0].rows.length > 0) {
      await db.executeSql(
        `DELETE FROM Completions WHERE habit_id = ? AND date(completed_at) = ?`,
        [habitId, dateStr],
      );
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
    const results = await db.executeSql(
      `SELECT * FROM Completions WHERE habit_id = ? ORDER BY completed_at DESC`,
      [habitId],
    );
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
    await db.executeSql(`DELETE FROM Completions WHERE habit_id = ?`, [
      habitId,
    ]);
    await db.executeSql(`DELETE FROM Habits WHERE id = ?`, [habitId]);
  } catch (error) {
    console.error('Delete Habit Error:', error);
    throw error;
  }
};
