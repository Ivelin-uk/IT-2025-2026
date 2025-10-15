const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// База данни в паметта (в реален проект би била MongoDB или MySQL)
let students = [
    {
        id: 1,
        firstName: "Иван",
        lastName: "Петров", 
        email: "ivan.petrov@uktc.edu",
        age: 20,
        course: "IT",
        year: 2,
        gpa: 5.8,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        firstName: "Мария",
        lastName: "Иванова",
        email: "maria.ivanova@uktc.edu", 
        age: 19,
        course: "Дизайн",
        year: 1,
        gpa: 6.0,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        firstName: "Георги",
        lastName: "Димитров",
        email: "georgi.dimitrov@uktc.edu",
        age: 21,
        course: "IT",
        year: 3,
        gpa: 5.5,
        createdAt: new Date().toISOString()
    }
];

let nextId = 4;

// Routes

// GET /api/students - Вземи всички студенти
app.get('/api/students', (req, res) => {
    console.log('GET /api/students - Заявка за всички студенти');
    res.json({
        success: true,
        count: students.length,
        data: students
    });
});

// GET /api/students/:id - Вземи конкретен студент
app.get('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    
    console.log(`GET /api/students/${id} - Заявка за студент с ID ${id}`);
    
    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Студентът не е намерен'
        });
    }
    
    res.json({
        success: true,
        data: student
    });
});

// POST /api/students - Добави нов студент
app.post('/api/students', (req, res) => {
    console.log('POST /api/students - Добавяне на нов студент');
    console.log('Данни:', req.body);
    
    const { firstName, lastName, email, age, course, year, gpa } = req.body;
    
    // Валидация
    if (!firstName || !lastName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Име, фамилия и имейл са задължителни полета'
        });
    }
    
    // Проверка за дублиран имейл
    const existingStudent = students.find(s => s.email === email);
    if (existingStudent) {
        return res.status(400).json({
            success: false,
            message: 'Студент с този имейл вече съществува'
        });
    }
    
    const newStudent = {
        id: nextId++,
        firstName,
        lastName,
        email,
        age: age || 18,
        course: course || 'Неопределен',
        year: year || 1,
        gpa: gpa || 0,
        createdAt: new Date().toISOString()
    };
    
    students.push(newStudent);
    
    console.log('Добавен студент:', newStudent);
    
    res.status(201).json({
        success: true,
        message: 'Студентът е добавен успешно',
        data: newStudent
    });
});

// PUT /api/students/:id - Редактирай студент
app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === id);
    
    console.log(`PUT /api/students/${id} - Редактиране на студент`);
    console.log('Нови данни:', req.body);
    
    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Студентът не е намерен'
        });
    }
    
    const { firstName, lastName, email, age, course, year, gpa } = req.body;
    
    // Валидация
    if (!firstName || !lastName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Име, фамилия и имейл са задължителни полета'
        });
    }
    
    // Проверка за дублиран имейл (освен текущия студент)
    const existingStudent = students.find(s => s.email === email && s.id !== id);
    if (existingStudent) {
        return res.status(400).json({
            success: false,
            message: 'Студент с този имейл вече съществува'
        });
    }
    
    // Обновяване на данните
    students[studentIndex] = {
        ...students[studentIndex],
        firstName,
        lastName,
        email,
        age: age || students[studentIndex].age,
        course: course || students[studentIndex].course,
        year: year || students[studentIndex].year,
        gpa: gpa || students[studentIndex].gpa,
        updatedAt: new Date().toISOString()
    };
    
    console.log('Обновен студент:', students[studentIndex]);
    
    res.json({
        success: true,
        message: 'Студентът е обновен успешно',
        data: students[studentIndex]
    });
});

// DELETE /api/students/:id - Изтрий студент
app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === id);
    
    console.log(`DELETE /api/students/${id} - Изтриване на студент`);
    
    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Студентът не е намерен'
        });
    }
    
    const deletedStudent = students.splice(studentIndex, 1)[0];
    
    console.log('Изтрит студент:', deletedStudent);
    
    res.json({
        success: true,
        message: 'Студентът е изтрит успешно',
        data: deletedStudent
    });
});

// GET /api/students/search/:query - Търсене на студенти
app.get('/api/students/search/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    console.log(`GET /api/students/search/${query} - Търсене на студенти`);
    
    const results = students.filter(s => 
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.course.toLowerCase().includes(query)
    );
    
    res.json({
        success: true,
        count: results.length,
        query: query,
        data: results
    });
});

// GET /api/stats - Статистики
app.get('/api/stats', (req, res) => {
    console.log('GET /api/stats - Статистики за студентите');
    
    const totalStudents = students.length;
    const averageAge = students.reduce((sum, s) => sum + s.age, 0) / totalStudents;
    const averageGPA = students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents;
    
    const courseStats = students.reduce((acc, s) => {
        acc[s.course] = (acc[s.course] || 0) + 1;
        return acc;
    }, {});
    
    const yearStats = students.reduce((acc, s) => {
        acc[`${s.year} курс`] = (acc[`${s.year} курс`] || 0) + 1;
        return acc;
    }, {});
    
    const stats = {
        totalStudents,
        averageAge: Math.round(averageAge * 100) / 100,
        averageGPA: Math.round(averageGPA * 100) / 100,
        courseDistribution: courseStats,
        yearDistribution: yearStats
    };
    
    console.log('Статистики:', stats);
    
    res.json({
        success: true,
        data: stats
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Грешка в сървъра:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Грешка в сървъра'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint не е намерен'
    });
});

// Стартиране на сървъра
app.listen(PORT, () => {
    console.log(`
🚀 Students API Server стартиран успешно!
📍 Адрес: http://localhost:${PORT}
📊 API Endpoints:
   GET    /api/students          - Всички студенти
   GET    /api/students/:id      - Конкретен студент  
   POST   /api/students          - Добави студент
   PUT    /api/students/:id      - Редактирай студент
   DELETE /api/students/:id      - Изтрий студент
   GET    /api/students/search/:query - Търсене
   GET    /api/stats             - Статистики
   
🎯 Примери за тестване:
   curl http://localhost:${PORT}/api/students
   curl http://localhost:${PORT}/api/stats
    `);
});