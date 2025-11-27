const express = require('express');
const axios = require('axios');

const API_URL = 'https://test.icorp.uz/interview.php';
const PORT = 3000;

let firstPart = '';
let secondPart = '';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Получен webhook:', req.body);
    secondPart = req.body.code || req.body.part || JSON.stringify(req.body);
    console.log('Вторая часть кода получена:', secondPart);
    res.status(200).send('OK');
    
    completeFinalStep()
        .then(() => {
            server.close();
            process.exit(0);
        })
        .catch(error => {
            console.error('Ошибка:', error.message);
            server.close();
            process.exit(1);
        });
});

const server = app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Запусти ngrok в другом терминале:');
    console.log(`ngrok http ${PORT}`);
    console.log('Затем скопируй HTTPS URL из ngrok и введи его ниже...\n');
});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Введи ngrok URL: ', (ngrokUrl) => {
    readline.close();
    
    step1_sendPost(ngrokUrl.trim())
        .catch(error => {
            console.error('Ошибка:', error.message);
            server.close();
            process.exit(1);
        });
});

function step1_sendPost(webhookUrl) {
    console.log('\nШаг 1: Отправка POST-запроса...');
    
    const payload = {
        msg: 'Hello from Amin',
        url: `${webhookUrl}/webhook`
    };
    
    console.log('Payload:', payload);
    
    return axios.post(API_URL, payload)
        .then(response => {
            console.log('Ответ получен:', response.data);
            firstPart = response.data.code || response.data.part || response.data;
            console.log('Первая часть кода:', firstPart);
        });
}

function completeFinalStep() {
    console.log('\nШаг 3: Объединение кодов и отправка GET-запроса...');
    
    const fullCode = firstPart + secondPart;
    console.log('Объединенный код:', fullCode);
    
    return axios.get(API_URL, {
        params: { code: fullCode }
    })
    .then(response => {
        console.log('\nФИНАЛЬНЫЙ РЕЗУЛЬТАТ:');
        console.log('Исходное сообщение:', response.data);
        console.log('Объединенный ключ:', fullCode);
    });
}