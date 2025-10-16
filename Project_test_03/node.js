// UKTC Node.js Express Server
// Създаден на 15 октомври 2025

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// В памет "база данни"
let data = {
    students: [
        {
            id: 1,
            name: 'Иван Петров',
            age: 20,
            course: 'IT',
            grade: 5.8
        },
        {
            id: 2,
            name: 'Мария Иванова',
            age: 19,
            course: 'Дизайн',
            grade: 6.0
        }
    ],
    courses: ['IT', 'Дизайн', 'Маркетинг', 'Бизнес'],
    stats: {
        totalStudents: 2,
        averageGrade: 5.9
    }
};

let nextId = 3;

// Routes

// Начална страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="bg">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>UKTC Test Server</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    background: rgba(255,255,255,0.1);
                    padding: 30px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                }
                h1 { text-align: center; margin-bottom: 30px; }
                .endpoint {
                    background: rgba(255,255,255,0.2);
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 8px;
                }
                code {
                    background: rgba(0,0,0,0.3);
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                }
                a {
                    color: #ffeb3b;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 UKTC Node.js Test Server</h1>
                <p>Добре дошли в тест сървъра! Сървърът работи успешно на порт ${PORT}.</p>
                
                <h3>📊 API Endpoints:</h3>
                
                <div class="endpoint">
                    <strong>GET <a href="/api/students">/api/students</a></strong><br>
                    Връща всички студенти
                </div>
                
                <div class="endpoint">
                    <strong>GET <a href="/api/students/1">/api/students/:id</a></strong><br>
                    Връща конкретен студент
                </div>
                
                <div class="endpoint">
                    <strong>POST /api/students</strong><br>
                    Добавя нов студент<br>
                    <code>{"name": "Име", "age": 20, "course": "IT", "grade": 5.5}</code>
                </div>
                
                <div class="endpoint">
                    <strong>GET <a href="/api/courses">/api/courses</a></strong><br>
                    Връща всички курсове
                </div>
                
                <div class="endpoint">
                    <strong>GET <a href="/api/stats">/api/stats</a></strong><br>
                    Статистики за студентите
                </div>
                
                <div class="endpoint">
                    <strong>GET <a href="/api/info">/api/info</a></strong><br>
                    Информация за сървъра
                </div>

                <h3>🧪 Тестване:</h3>
                <p>Можете да тествате API endpoints с:</p>
                <ul>
                    <li>Браузър (за GET заявки)</li>
                    <li>curl команди в терминала</li>
                    <li>Postman или подобни инструменти</li>
                </ul>
                
                <div class="endpoint">
                    <strong>Примерни curl команди:</strong><br>
                    <code>curl http://localhost:${PORT}/api/students</code><br>
                    <code>curl -X POST http://localhost:${PORT}/api/students -H "Content-Type: application/json" -d '{"name":"Тест","age":22,"course":"IT","grade":5.0}'</code>
                </div>
            </div>
        </body>
        </html>
    `);
});

// API Routes

// GET всички студенти
app.get('/api/students', (req, res) => {
    console.log('GET /api/students - Заявка за всички студенти');
    res.json({
        success: true,
        count: data.students.length,
        students: data.students
    });
});

// GET студент по ID
app.get('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`GET /api/students/${id} - Заявка за студент с ID ${id}`);
    
    const student = data.students.find(s => s.id === id);
    
    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Студент не е намерен'
        });
    }
    
    res.json({
        success: true,
        student: student
    });
});

// POST нов студент
app.post('/api/students', (req, res) => {
    console.log('POST /api/students - Добавяне на нов студент');
    console.log('Данни:', req.body);
    
    const { name, age, course, grade } = req.body;
    
    // Валидация
    if (!name || !age || !course || grade === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Всички полета са задължителни: name, age, course, grade'
        });
    }
    
    const newStudent = {
        id: nextId++,
        name: name,
        age: parseInt(age),
        course: course,
        grade: parseFloat(grade)
    };
    
    data.students.push(newStudent);
    
    // Обновяваме статистиките
    data.stats.totalStudents = data.students.length;
    data.stats.averageGrade = data.students.reduce((sum, s) => sum + s.grade, 0) / data.students.length;
    data.stats.averageGrade = Math.round(data.stats.averageGrade * 100) / 100;
    
    console.log('Добавен студент:', newStudent);
    
    res.status(201).json({
        success: true,
        message: 'Студент добавен успешно',
        student: newStudent
    });
});

// DELETE студент
app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/students/${id} - Изтриване на студент`);
    
    const studentIndex = data.students.findIndex(s => s.id === id);
    
    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Студент не е намерен'
        });
    }
    
    const deletedStudent = data.students.splice(studentIndex, 1)[0];
    
    // Обновяваме статистиките
    data.stats.totalStudents = data.students.length;
    if (data.students.length > 0) {
        data.stats.averageGrade = data.students.reduce((sum, s) => sum + s.grade, 0) / data.students.length;
        data.stats.averageGrade = Math.round(data.stats.averageGrade * 100) / 100;
    } else {
        data.stats.averageGrade = 0;
    }
    
    console.log('Изтрит студент:', deletedStudent);
    
    res.json({
        success: true,
        message: 'Студент изтрит успешно',
        student: deletedStudent
    });
});

// GET курсове
app.get('/api/courses', (req, res) => {
    console.log('GET /api/courses - Заявка за курсове');
    res.json({
        success: true,
        courses: data.courses
    });
});

// GET статистики
app.get('/api/stats', (req, res) => {
    console.log('GET /api/stats - Заявка за статистики');
    
    // Изчисляване на курсове статистики
    const courseStats = data.students.reduce((acc, student) => {
        acc[student.course] = (acc[student.course] || 0) + 1;
        return acc;
    }, {});
    
    res.json({
        success: true,
        stats: {
            ...data.stats,
            courseDistribution: courseStats,
            averageAge: data.students.length > 0 
                ? Math.round(data.students.reduce((sum, s) => sum + s.age, 0) / data.students.length * 100) / 100
                : 0
        }
    });
});

// GET информация за сървъра
app.get('/api/info', (req, res) => {
    console.log('GET /api/info - Информация за сървъра');
    res.json({
        success: true,
        server: {
            name: 'UKTC Node.js Test Server',
            version: '1.0.0',
            port: PORT,
            startTime: new Date().toISOString(),
            nodeVersion: process.version,
            platform: process.platform,
            memory: process.memoryUsage(),
            uptime: Math.floor(process.uptime()) + ' секунди'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint не е намерен',
        availableEndpoints: [
            'GET /',
            'GET /api/students',
            'GET /api/students/:id',
            'POST /api/students',
            'DELETE /api/students/:id',
            'GET /api/courses',
            'GET /api/stats',
            'GET /api/info'
        ]
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Сървър грешка:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Вътрешна грешка на сървъра'
    });
});

// Стартиране на сървъра
app.listen(PORT, () => {
    console.log(`
🚀 UKTC Node.js Test Server стартиран успешно!
📍 URL: http://localhost:${PORT}
🕐 Време: ${new Date().toLocaleString('bg-BG')}
📊 Node.js версия: ${process.version}
💻 Платформа: ${process.platform}

📋 API Endpoints:
   GET    /                     - Начална страница
   GET    /api/students         - Всички студенти
   GET    /api/students/:id     - Конкретен студент
   POST   /api/students         - Добави студент
   DELETE /api/students/:id     - Изтрий студент
   GET    /api/courses          - Всички курсове
   GET    /api/stats            - Статистики
   GET    /api/info             - Информация за сървъра

🧪 Тестване:
   curl http://localhost:${PORT}/api/students
   curl http://localhost:${PORT}/api/stats
   
Отворете http://localhost:${PORT} в браузъра за да видите документацията!
    `);
});