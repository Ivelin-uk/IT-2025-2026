// Глобални променливи
const out = document.getElementById('joke');
const statusMessage = document.getElementById('status-message');

// Функция за показване на съобщения за статус
function showStatusMessage(message, isSuccess) {
  statusMessage.innerHTML = `<div class="status-message ${isSuccess ? 'success' : 'error'}">${message}</div>`;
  setTimeout(() => {
    statusMessage.innerHTML = '';
  }, 5000);
}

// Бутон за персонализиран брой шеги
document.getElementById('custom-jokes-btn').onclick = async () => {
    const jokesCount = parseInt(document.getElementById('jokes-count').value);
    
    // Валидация на входните данни
    if (!jokesCount || jokesCount < 1 || jokesCount > 10) {
        showStatusMessage("❌ Моля въведете число между 1 и 10!", false);
        return;
    }

    try {
        out.innerHTML = `<h3>Зареждане на ${jokesCount} шеги...</h3>`;
        
        // Създаваме масив от заявки за API
        const requests = Array(jokesCount).fill().map(() => 
            fetch("https://api.chucknorris.io/jokes/random")
        );
        
        // Изпълняваме всички заявки едновременно
        const responses = await Promise.all(requests);
        
        // Проверяваме дали всички заявки са успешни
        if (!responses.every(r => r.ok)) {
            throw new Error('Some network responses were not ok');
        }
        
        // Извличаме JSON данните от всички отговори
        const jokes = await Promise.all(responses.map(r => r.json()));
        
        // Генерираме HTML съдържание
        let jokesHTML = `<h3>${jokesCount} Chuck Norris шеги:</h3>`;
        jokes.forEach((joke, index) => {
            jokesHTML += `
                <div class="joke-item">
                    <strong>Шега ${index + 1}:</strong> ${joke.value}
                </div>
            `;
        });
        
        out.innerHTML = jokesHTML;
        showStatusMessage(`✅ Успешно заредени ${jokesCount} шеги!`, true);
            
    } catch (error) {
        out.innerHTML = '<h3>Грешка при зареждане на шегите.</h3>';
        showStatusMessage("❌ Грешка при зареждане на шегите!", false);
        console.error('Error:', error);
    }
};
