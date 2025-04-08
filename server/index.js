import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import { createHmac } from 'crypto';
import { randomBytes } from 'crypto';
import session from 'express-session';

const app = express();
const PORT = 5275;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к папке dist
const distPath = path.join(__dirname, '..', 'dist');

// Настройка подключения к базе данных MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'musicShop',
});

// Проверка подключения к базе данных
db.connect((err) => {
    if (err) {
        console.error('❌ Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('✅ Подключение к базе данных успешно установлено');
});

// Middleware
app.use(bodyParser.json());

// Обслуживаем статические файлы из dist
app.use(express.static(distPath));

// Добавляем middleware для обслуживания других статических ресурсов
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/src', express.static(path.join(__dirname, '..', 'src')));

// Настройка сессий
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Функция для хэширования пароля
function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = createHmac('sha256', salt).update(password).digest('hex');
    return `${salt}:${hash}`;
}

// Функция для проверки пароля
function verifyPassword(password, hashedPassword) {
    const [salt, hash] = hashedPassword.split(':');
    const hashVerify = createHmac('sha256', salt).update(password).digest('hex');
    return hash === hashVerify;
}

// Middleware для проверки прав администратора
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Доступ запрещен. Требуются права администратора.');
};

// Обработка авторизации
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Ошибка запроса к базе данных:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const user = results[0];

        if (!verifyPassword(password, user.password)) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.json({ success: true, role: user.role });
    });
});

// API эндпоинт для записи на консультацию
app.post('/api/consultation', (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    const DataTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO Consultations (name, email, message, DataTime) VALUES (?, ?, ?, ?)';
    db.execute(query, [name, email, message, DataTime], (err, results) => {
        if (err) {
            console.error('Ошибка при вставке данных:', err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        res.status(201).json({ message: 'Запись на консультацию успешно создана' });
    });
});

// Маршрут для страницы админа (доступен только для админов)
app.get('/admin', isAdmin, (req, res) => {
    const filePath = path.join(distPath, '../src/pages/adminPanel.html');
    res.sendFile(filePath);
});

// API эндпоинт для получения данных таблицы
app.get('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const query = `SELECT * FROM ${tableName}`;

    db.execute(query, (err, results) => {
        if (err) {
            console.error('Ошибка при получении данных:', err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        res.status(200).json(results);
    });
});

// API эндпоинт для удаления строк таблицы
app.post('/api/delete', (req, res) => {
    const { tableName, rows } = req.body;

    if (!tableName || !rows || !Array.isArray(rows) || rows.length === 0) {
        console.error('Некорректные данные для удаления', { tableName, rows });
        return res.status(400).json({ success: false, message: 'Некорректные данные для удаления' });
    }

    const columnNames = Object.keys(rows[0]);

    let deleteQueries = rows.map(row => {
        const conditions = columnNames.map(col => `${col} = ${mysql.escape(row[col])}`).join(' AND ');
        return `DELETE FROM ${tableName} WHERE ${conditions}`;
    });

    deleteQueries = deleteQueries.join('; ');

    console.log('SQL запросы на удаление:', deleteQueries);

    db.query(deleteQueries, (err, results) => {
        if (err) {
            console.error('Ошибка при удалении данных:', err);
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }

        res.status(200).json({ success: true });
    });
});

// API эндпоинт для обновления строк таблицы
app.post('/api/update', (req, res) => {
    const { tableName, rowData } = req.body;

    if (!tableName || !rowData) {
        return res.status(400).json({ success: false, message: 'Некорректные данные для обновления' });
    }

    console.log('Received data for update:', rowData);

    const columnNames = Object.keys(rowData);
    const idColumn = columnNames.find(col => col.toLowerCase().includes('id'));
    const idValue = rowData[idColumn];

    if (!idColumn || !idValue) {
        return res.status(400).json({ success: false, message: 'Не найдено поле идентификатора' });
    }

    const updates = columnNames.map(col => `${col} = ${mysql.escape(rowData[col])}`).join(', ');
    const query = `UPDATE ${tableName} SET ${updates} WHERE ${idColumn} = ${mysql.escape(idValue)}`;

    console.log('Executing query:', query);

    db.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка при обновлении данных:', err);
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }

        res.status(200).json({ success: true });
    });
});

app.post('/api/add', (req, res) => {
    const { tableName, rowData } = req.body;

    if (!tableName || !rowData) {
        return res.status(400).json({ success: false, message: 'Некорректные данные для добавления' });
    }

    const columns = Object.keys(rowData);
    const values = columns.map(col => mysql.escape(rowData[col])).join(', ');

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values})`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка при добавлении данных:', err);
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }

        res.status(200).json({ success: true });
    });
});

// API эндпоинт для получения статистики консультаций
app.get('/api/consultations/stats', (req, res) => {
    const query = `
      SELECT DATE(DataTime) AS date, COUNT(*) AS count
      FROM Consultations
      GROUP BY DATE(DataTime)
      ORDER BY DATE(DataTime)
    `;

    db.execute(query, (err, results) => {
        if (err) {
            console.error('Ошибка при получении статистики консультаций:', err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        res.status(200).json(results);
    });
});

app.get('/api/tables/:tableName', (req, res) => {
    const { tableName } = req.params;
    const query = `SELECT * FROM ${tableName}`;

    db.execute(query, (err, results) => {
        if (err) {
            console.error('Ошибка при получении данных:', err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        res.status(200).json(results);
    });
});

// Отдача HTML-файлов напрямую, если они есть (например, aboutUs.html, catalog.html)
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(distPath, `${page}.html`);
    res.sendFile(filePath);
});

// Корневой маршрут — index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// 404 fallback
app.use((req, res) => {
    res.status(404).sendFile(path.join(distPath, 'index.html'));
});

// Старт сервера
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});