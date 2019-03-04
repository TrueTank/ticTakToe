"use strict";

let ticTakToe = {
    mapValues: [],
    config: {rows: 5, cols: 4, winLength: 4},
    status: 'playing',
    gameElement: document.getElementById('game'),
    phase: 'X',

    init() {
        this.renderMap();
        this.generateMap();
        this.initEventHandlers();
    },

    initEventHandlers() {
        this.gameElement.addEventListener('click', event => this.cellClickHandler(event))
    },

    cellClickHandler(event) {
        // Если клик не нужно обрабатывать, уходим из функции.
        if (!this.isCorrectClick(event)) {
            return;
        }

        // Заполняем ячейку.
        this.fillCell(event);

        // Если кто-то выиграл, заходим в if.
        if (this.hasWon()) {
            // Ставим статус в "остановлено".
            this.setStatusStopped();
            // Сообщаем о победе пользователя.
            this.sayWonPhrase();
        }

        // Меняем фигуру (крестик или нолик).
        this.togglePhase();
    },

    togglePhase() {
        this.phase = this.phase === 'X' ? '0' : 'X';
    },

    sayWonPhrase() {
        let figure = this.phase === 'X' ? 'Крестики' : 'Нолики';
        alert(`${figure} выиграли!`);
    },

    setStatusStopped() {
        this.status = 'stopped';
    },

    hasWon() {
        // проходим по строкам
        for (let i = 0; i < this.config.cols; i++) {
            // проходим по элементам строки
            for (let j = 0; j < this.config.rows; j++) {
                // для каждого элемента мы делаем 4 проверки:
                let isWon = this.checkLine(i, j, 1, 0)
                    // есть ли строчка одинаковых элементов нужной длины с этим элементом
                    || this.checkLine(i, j, 1, 1)
                    // есть ли нисходящая диагональ одинаковых элементов нужной длины с этим элементом
                    || this.checkLine(i, j, 0, 1)
                    // есть ли столбец одинаковых элементов нужной длины с этим элементом
                    || this.checkLine(i, j, 1, -1);
                    // есть ли восходящая диагональ одинаковых элементов нужной длины с этим элементом
                if (isWon) return true;
            }
        }
        return false;
    },

    /**
     * Функция проверки конкретного типа линии для элемента
     * @param x номер столбца элемента
     * @param y номер строки элемента
     * @param factorX множитель для передвижения по столбцам
     * @param factorY множитель для передвижения по строкам
     * @returns {boolean}
     */
    checkLine(x, y, factorX, factorY) {
        // высчитываем координаты последнего элемента линии, которую будем проверять
        let lastLineItemX = x + (this.config.winLength - 1) * factorX;
        let lastLineItemY = y + (this.config.winLength - 1) * factorY;
        // проверяем, существуем ли он, а именно, принадлежит ли карте
        if (!this.isCellEnable(lastLineItemX, lastLineItemY))
            return false; // если не принадлежит, покидаем функцию проверки
        // проходим по каждому элементу линии, длина линии - длина для выигрыша
        for (let i = 0; i < this.config.winLength; i++) {
            // с помощью множителей вычисляем координаты для каждого элемента линии и сравниваем его с текущей фазой игры
            if (this.mapValues[y + i * factorY][x + i * factorX] !== this.phase)
                return false; // если находим хоть один неподходящий элемент, то выходим из цикла
        }
        return true; // возвращаем истину только если прошли предыдущий цикл целиком
    },

    /**
     * Функция проверки существования элемента на карте
     * @param x номер столбца элемента
     * @param y номер строки элемента
     * @returns {boolean}
     */
    isCellEnable(x, y) {
        if (x < this.config.cols && y < this.config.rows && x >= 0 && y >= 0) {
            return true;
        }
        return false;
    },

    fillCell(event) {
        let row = +event.target.dataset.row;
        let col = +event.target.dataset.col;

        this.mapValues[row][col] = this.phase;
        event.target.textContent = this.phase;
    },

    isCorrectClick(event) {
        return this.isStatusPlaying() && this.isClickByCell(event) && this.isCellEmpty(event);
    },

    isStatusPlaying() {
        return this.status === 'playing';
    },

    isClickByCell(event) {
        return event.target.tagName === 'TD';
    },

    isCellEmpty(event) {
        let row = +event.target.dataset.row;
        let col = +event.target.dataset.col;

        return this.mapValues[row][col] === '';
    },

    renderMap() {
        // Пробегаемся по всем линиям.
        for (let row = 0; row < this.config.rows; row++) {
            // Создаем линию.
            const tr = document.createElement('tr');
            // Добавляем линию в таблицу.
            this.gameElement.appendChild(tr);
            // Пробегаемся по всем колонкам.
            for (let col = 0; col < this.config.cols; col++) {
                // Создаем колонку.
                let td = document.createElement('td');
                // Добавляем в data-аттрибуты данные с номерами этой ячейки.
                td.dataset.row = row.toString();
                td.dataset.col = col.toString();
                // Добавляем колонку в линию.
                tr.appendChild(td);
            }
        }
    },

    generateMap() {
        for (let i = 0; i < this.config.rows; i++) {
            this.mapValues[i] = [];
            for (let j = 0; j < this.config.cols; j++) {
                this.mapValues[i][j] = '';
            }
        }
    }
};

window.addEventListener('load', ticTakToe.init());
