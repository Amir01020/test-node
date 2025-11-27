const axios = require('axios');

const API_URL = 'https://test.icorp.uz/interview.php';
const WEBHOOK_URL = 'https://webhook.site/8ef2205b-0cf0-429b-8655-61cf1ff4b551';

console.log('=== ТЕСТ 1: POST запрос ===');
axios.post(API_URL, {
    msg: 'Test message',
    url: WEBHOOK_URL
})
.then(response => {
    console.log('Успех:', response.data);
    const part1 = response.data.part1;
    
    console.log('\n=== ТЕСТ 2: Проверь webhook.site ===');
    console.log('Открой:', WEBHOOK_URL);
    console.log('Найди part2 и введи сюда:');
    
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    readline.question('part2: ', (part2) => {
        readline.close();
        
        const fullCode = part1 + part2;
        console.log('\n=== ТЕСТ 3: GET запрос ===');
        console.log('Полный код:', fullCode);
        
        axios.get(API_URL, { params: { code: fullCode }})
        .then(response => {
            console.log('\nРЕЗУЛЬТАТ:', response.data);
        })
        .catch(error => {
            console.error('Ошибка GET:', error.message);
        });
    });
})
.catch(error => {
    console.error('Ошибка POST:', error.message);
});