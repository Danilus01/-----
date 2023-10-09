let started = false; // Устанавливается в значение true, когда нажимаем кнопку start
let timer; // Контролируем эволюцию
let evolutionSpeed = 500; // Одна секунда между поколениями

const rows = 25;
const cols = 25;

let currGen = [rows];
let nextGen = [rows];
// Создание двумерного массива
function createGenArrays() {
    for (let i = 0; i < rows; i++) {
        currGen[i] = new Array(cols);
        nextGen[i] = new Array(cols);
    }
}

// Заполнение элементов массива нулями 
function initGenArrays() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            currGen[i][j] = 0;
            nextGen[i][j] = 0;
        }
    }
}

function createWorld() { //Строит таблицу
    let world = document.querySelector('#world');

    let tbl = document.createElement('table');
    tbl.setAttribute('id', 'worldgrid');
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('td');

            cell.setAttribute('id', i + '_' + j); //Добавляем каждой ячейке id чтобы отслеживать сосотояние 
            cell.setAttribute('class', 'dead'); //Добавляем класс мертвой для каждой ячейки 
            cell.addEventListener('click', cellClick); // прослушиваем кликли 

            tr.appendChild(cell);
        }
        tbl.appendChild(tr);
    }
    world.appendChild(tbl);
}

function cellClick() { // Обработка нажатий
    let loc = this.id.split("_");
    let row = Number(loc[0]); // Получаем i
    let col = Number(loc[1]); //Получаем j
    // Переключить ячейку на живую или мертвую
    if (this.className === 'alive') {
        this.setAttribute('class', 'dead');
        currGen[row][col] = 0;

    } else {
        this.setAttribute('class', 'alive');
        currGen[row][col] = 1;

    }
}

// Cоздадим функцию createNextGen (), которая будет перебирать каждую ячейку, 
//получать счетчик соседей с помощью getNeighborCount () и использовать его с правилами,
// чтобы определить, текущая ячейка должна остаться в живых, ожить, остаться мертвой или умереть.

function createNextGen() {
    for (row in currGen) {
        for (col in currGen[row]) {

            let neighbors = getNeighborCount(row, col);


            // Если жив 
            if (currGen[row][col] == 1) {

                if (neighbors < 2) {
                    nextGen[row][col] = 0;
                } else if (neighbors == 2 || neighbors == 3) {
                    nextGen[row][col] = 1;
                } else if (neighbors > 3) {
                    nextGen[row][col] = 0;
                }
            } else if (currGen[row][col] == 0) {
                // Если мертв или пуст

                if (neighbors == 3) {
                    nextGen[row][col] = 1; //Если есть три соседа рождается новая жизнь 
                }
            }
        }
    }
}

function getNeighborCount(row, col) { // Функция для подсчета количества соседей для данной ячейки
    let count = 0;
    let nrow = Number(row);
    let ncol = Number(col);

    // Убеждемся, что мы не в первом ряду
    if (nrow - 1 >= 0) {
        // Проверяем соседа сверху
        if (currGen[nrow - 1][ncol] == 1)
            count++;
    }
    // Убеждаемся, что мы не в первой ячейки 
    // В верхнем левом углу
    if (nrow - 1 >= 0 && ncol - 1 >= 0) {
        //Провверяем соседа сверху слева
        if (currGen[nrow - 1][ncol - 1] == 1)
            count++;
    }
    // Убедждаемся, что мы не находимся в первой строке последнего столбца
    // Верхний правый угол
    if (nrow - 1 >= 0 && ncol + 1 < cols) {
        //Проверяем соседа сверху справа 
        if (currGen[nrow - 1][ncol + 1] == 1)
            count++;
    }
    // Убеждаемся, что мы не в первой колонке 
    if (ncol - 1 >= 0) {
        // Проверяем соседа слева
        if (currGen[nrow][ncol - 1] == 1)
            count++;
    }
    // Убеждаемся, что мы не в последней колонке
    if (ncol + 1 < cols) {
        // Проверяем соседа спарва 
        if (currGen[nrow][ncol + 1] == 1)
            count++;
    }
    // Убедждаемся, что мы не находимся в левом нижнем углу 
    if (nrow + 1 < rows && ncol - 1 >= 0) {
        //Проверяем соседа снизу слева
        if (currGen[nrow + 1][ncol - 1] == 1)
            count++;
    }
    //  Убедждаемся, что мы не находимся в правом нижнем углу
    if (nrow + 1 < rows && ncol + 1 < cols) {
        //Проверяем соседа снизу справа
        if (currGen[nrow + 1][ncol + 1] == 1)
            count++;
    }


    // Убеждаемся, что мы не в последнем ряду
    if (nrow + 1 < rows) {
        // Проверяем соседа снизу
        if (currGen[nrow + 1][ncol] == 1)
            count++;
    }


    return count;
}


function updateCurrGen() { // Принимает значние массива следующего поколения и помещаем их в массив текущего поколения 
    for (row in currGen) {
        for (col in currGen[row]) {
            // Обновляем следующее поколение по результатам работы функции cerateNextGen
            currGen[row][col] = nextGen[row][col];
            // Устанавливаем функцию обратно в пустое занчение 
            nextGen[row][col] = 0;
        }
    }
}

function updateWorld() { //Функция обновления поля
    let cell = '';
    for (row in currGen) {
        for (col in currGen[row]) {
            cell = document.getElementById(row + '_' + col);
            if (currGen[row][col] == 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'alive');
            }
        }
    }
}

function startStopGol() { // Функция запуска и остановки игры 
    let startstop = document.querySelector('#btnstartstop');

    if (!started) { //Если кнопка нажата, то вызываем evolve
        started = true;
        startstop.value = 'Стоп';
        evolve();
    } else {
        started = false;
        startstop.value = 'Старт';
        clearTimeout(timer);
    }
}

function resetWorld() { // Кнопка сброса
    location.reload(); //перезагружает ресурс из текущего URL подобно кнопке обновления браузера
}

function evolve() {
    createNextGen(); //Правила
    updateCurrGen(); // Установка текущего значения  из нового поколения 
    updateWorld(); // Обновление мира 

    if (started) {
        timer = setTimeout(evolve, evolutionSpeed);
    }
}

//это событие, которое срабатывает, когда вся страница полностью загружена и готова к манипуляции.window.onload = () => {
createWorld();
createGenArrays(); // Нынешнее и последующее поколение 
initGenArrays(); // Установка для всех массивов 0