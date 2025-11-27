const express = require('express');
const axios = require('axios');

const API_URL = 'https://test.icorp.uz/interview.php';
const PORT = 3000;
const WEBHOOK_URL = 'https://webhook.site/8ef2205b-0cf0-429b-8655-61cf1ff4b551';

let firstPart = '';
let secondPart = '';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook получен:', req.body);
    secondPart = req.body.part2 || '';
    console.log('Вторая часть кода:', secondPart);
    res.status(200).send('OK');
    
    setTimeout(() => {
        step3_sendGet()
            .then(() => {
                server.close();
                process.exit(0);
            })
            .catch(error => {
                console.error('Ошибка:', error.message);
                server.close();
                process.exit(1);
            });
    }, 1000);
});

const server = app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    step1_sendPost();
});

function step1_sendPost() {
    console.log('\nШаг 1: Отправка POST-запроса...');
    
    const payload = {
        msg: 'Amir',
        url: WEBHOOK_URL
    };
    
    return axios.post(API_URL, payload)
        .then(response => {
            console.log('Ответ получен:', response.data);
            firstPart = response.data.part1 || '';
            console.log('Первая часть кода:', firstPart);
        })
        .catch(error => {
            console.error('Ошибка:', error.message);
        });
}

function step3_sendGet() {
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