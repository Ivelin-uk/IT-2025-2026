// 02-JavaScript Variables - Различни типове променливи
let display = document.getElementById('display');
let current = '';
let isScientificMode = false;
let history = [];
const themes = ['light', 'dark', 'blue', 'green'];
let currentTheme = 'light';

// Инициализация при зареждане на страницата
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadHistory();
    updateHistoryDisplay();
    document.body.className = currentTheme;
});

// 03-JavaScript Simple Calculations - Основни математически операции
function press(val) {
    // 04-JavaScript-conditions - Проверка за валидност
    if (current === 'Грешка' || current === 'Infinity' || current === '-Infinity') {
        current = '';
    }
    
    current += val;
    display.value = current;
}

// 01-JavaScript Output Data - Показване на резултати
function updateDisplay(value) {
    display.value = value;
    current = value.toString();
}

function clearDisplay() {
    current = '';
    display.value = '';
}

function clearEntry() {
    if (current.length > 0) {
        current = current.slice(0, -1);
        display.value = current;
    }
}

// 03-JavaScript Simple Calculations & 05-JavaScript-Functions
function calculate() {
    if (!current) return;
    
    try {
        let expression = current;
        let result;
        
        // Заместваме математическите символи за по-добро изчисление
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        // 04-JavaScript-conditions - Проверка за валиден израз
        if (expression.includes('/0') && !expression.includes('/0.')) {
            throw new Error('Division by zero');
        }
        
        result = eval(expression);
        
        // Проверка за валиден резултат
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Форматиране на резултата
        result = Math.round(result * 100000000) / 100000000;
        
        // Добавяне в историята
        addToHistory(current, result);
        
        // 01-JavaScript Output Data - Показване на резултата
        updateDisplay(result);
        
    } catch (error) {
        display.value = 'Грешка';
        current = '';
    }
}

// 05-JavaScript-Functions - Научни функции
function scientificFunction(func) {
    if (!current && !['Math.PI', 'Math.E'].includes(func)) {
        return;
    }
    
    try {
        let value = parseFloat(current) || 0;
        let result;
        
        // 04-JavaScript-conditions - Различни научни операции
        switch(func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180); // Конвертиране в радиани
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                if (value <= 0) throw new Error('Invalid input for log');
                result = Math.log10(value);
                break;
            case 'ln':
                if (value <= 0) throw new Error('Invalid input for ln');
                result = Math.log(value);
                break;
            case 'sqrt':
                if (value < 0) throw new Error('Invalid input for sqrt');
                result = Math.sqrt(value);
                break;
            case 'pow2':
                result = Math.pow(value, 2);
                break;
            case 'pow3':
                result = Math.pow(value, 3);
                break;
            case 'factorial':
                if (value < 0 || value > 20 || value % 1 !== 0) {
                    throw new Error('Invalid input for factorial');
                }
                result = factorial(value);
                break;
            case 'powx':
                press('^');
                return;
            default:
                return;
        }
        
        // Форматиrane на резултата
        result = Math.round(result * 100000000) / 100000000;
        
        // Добавяне в историята
        addToHistory(`${func}(${value})`, result);
        
        updateDisplay(result);
        
    } catch (error) {
        display.value = 'Грешка';
        current = '';
    }
}

// 05-JavaScript-Functions - Помощна функция за факториел
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    // 06-JavaScript-Loops - Цикъл за изчисляване на факториел
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// 05-JavaScript-Functions - Превключване на научен режим
function toggleScientificMode() {
    isScientificMode = !isScientificMode;
    const scientificButtons = document.getElementById('scientificButtons');
    const modeToggle = document.getElementById('modeToggle');
    
    // 04-JavaScript-conditions - Проверка на режима
    if (isScientificMode) {
        scientificButtons.style.display = 'grid';
        modeToggle.textContent = 'Основен режим';
    } else {
        scientificButtons.style.display = 'none';
        modeToggle.textContent = 'Научен режим';
    }
}

// 05-JavaScript-Functions - Смяна на тема
function switchTheme(theme) {
    // 04-JavaScript-conditions - Проверка за валидна тема
    if (themes.includes(theme)) {
        currentTheme = theme;
        document.body.className = theme;
        saveTheme();
    }
}

// 05-JavaScript-Functions - Запазване на тема в localStorage
function saveTheme() {
    localStorage.setItem('calculatorTheme', currentTheme);
    console.log('=== LocalStorage съдържание след запазване на тема ===');
    console.log('calculatorTheme:', localStorage.getItem('calculatorTheme'));
    console.log('calculatorHistory:', localStorage.getItem('calculatorHistory'));
    console.log('=== Край на LocalStorage съдържание ===');
}

// 05-JavaScript-Functions - Зареждане на тема от localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    // 04-JavaScript-conditions - Проверка за запазена тема
    if (savedTheme && themes.includes(savedTheme)) {
        currentTheme = savedTheme;
    }
}

// 05-JavaScript-Functions - Добавяне в историята
function addToHistory(calculation, result) {
    const historyItem = {
        calculation: calculation,
        result: result,
        timestamp: new Date().toLocaleString('bg-BG')
    };
    
    history.unshift(historyItem); // Добавяме в началото
    
    // 04-JavaScript-conditions - Ограничаване на историята до 50 елемента
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    saveHistory();
    updateHistoryDisplay();
}

// 05-JavaScript-Functions - Запазване на история в localStorage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    console.log('=== LocalStorage съдържание след запазване на история ===');
    console.log('calculatorTheme:', localStorage.getItem('calculatorTheme'));
    console.log('calculatorHistory:', localStorage.getItem('calculatorHistory'));
    console.log('=== Край на LocalStorage съдържание ===');
}

// 05-JavaScript-Functions - Зареждане на история от localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    // 04-JavaScript-conditions - Проверка за запазена история
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (error) {
            history = [];
        }
    }
}

// 05-JavaScript-Functions & 06-JavaScript-Loops - Показване на историята
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    // 06-JavaScript-Loops - Цикъл за показване на всички елементи от историята
    for (let i = 0; i < history.length; i++) {
        const item = history[i];
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => useHistoryItem(item.result);
        
        historyItem.innerHTML = `
            <div class="history-calculation">${item.calculation}</div>
            <div class="history-result">= ${item.result}</div>
        `;
        
        historyList.appendChild(historyItem);
    }
    
    // 04-JavaScript-conditions - Показване на съобщение, ако няма история
    if (history.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">Няма история</div>';
    }
}

// 05-JavaScript-Functions - Използване на елемент от историята
function useHistoryItem(result) {
    updateDisplay(result);
}

// 05-JavaScript-Functions - Изчистване на историята
function clearHistory() {
    // 04-JavaScript-conditions - Потвърждение преди изчистване
    if (confirm('Сигурни ли сте, че искате да изчистите историята?')) {
        history = [];
        saveHistory();
        updateHistoryDisplay();
    }
}

// Обработка на клавиатурни събития
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // 04-JavaScript-conditions - Различни клавиши
    if (key >= '0' && key <= '9' || key === '.') {
        press(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        press(key === '*' ? '×' : key === '/' ? '÷' : key === '-' ? '−' : key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        clearEntry();
    }
});

console.log(localStorage);
