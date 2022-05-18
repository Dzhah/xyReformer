console.log("Hello CLI!");

let x = [], bzX = 0;  //x = [5, 10, 8, 5]
let y = [], bzY = 0;  //y = [2, 7, 9, 9]

const isTextEntered = () => {

    let rawItem = 0;
    const matrixOrigin = document.getElementById("originalMatrix").value.split(',').map(item => parseFloat(item));
    for (const item of matrixOrigin) {  // сеперация входного массива в два выходных массивов - долгот в X и широт в Y
        rawItem = Math.floor(item);
        if (rawItem >= 67 && rawItem <= 75) { x.push(item) }
        if (rawItem >= 36 && rawItem <= 41) { y.push(item) }
    }
    let initX = 0, initY = 0;
    bzX = x.reduce((previousValue, currentValue) => previousValue + currentValue, initX) / x.length;
    bzY = y.reduce((previousValue, currentValue) => previousValue + currentValue, initY) / y.length;

    console.log("Угол наклона 1го отрезка : " + Angle(x[0], y[0], x[1], y[1]));
    console.log("Угол наклона 2го отрезка : " + Angle(x[1], y[1], x[2], y[2]));
    console.log("Угол наклона 3го отрезка : " + Angle(x[2], y[2], x[3], y[3]));
    console.log("Угол наклона 4го отрезка : " + Angle(x[3], y[3], x[0], y[0]));

    console.log(x);
    console.log(bzX);
    console.log(y);
    console.log(bzY);
    document.getElementById('txtField').value = '  khlkhasoihohawslhli  ' + x + '  dfhaddnbn  ' + y

}

function Distance(x1, y1, x2, y2) {
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function Ratio(x1, y1, x2, y2) {           // вычисление отношения дельты Y к дельте X координат концов отрезка ->
    return (y2 - y1) / (x2 - x1);             // -> то есть тангенса угла наклона этого отрезка
}

function Goal(x, y, alfa, lng) {			// вычисление координат целевой (второй) точки отрезка по заданному ->
    xGoal = x + lng * Math.cos(alfa) 		// -> углу "alfa" (радианы) наклона к оси х и его длине "lng"
    yGoal = y + lng * Math.sin(alfa)
    return [xGoal, yGoal];
}

function Angle(x1, y1, x2, y2) {           // вычисление угла наклона (радианы), к оси Х, грани, по координатам её концов
    return Math.atan(Ratio(x1, y1, x2, y2));
}

function maxSide(x, y) {			        // определение индексов координат начала и конца наибольшей грани полигона
    let max = 0, iMax = 0, iiMax = 0, ii = 0, lngth = x.length;
    for (let i = 0; i < lngth; i++) {
        i < (lngth - 1) ? (ii = i + 1) : (ii = 0);
        dist = Distance(x[i], y[i], x[ii], y[ii]);
        if (dist > max) {
            max = dist;
            iMax = i;
            iiMax = ii;
        }
    }
    return [iMax, iiMax]
}









/*
const func1 = () => {
    let x = [];
    let y = [];

    let rawItem;
    const matrixOrigin = document.getElementById("originalMatrix").value.split(',').map(item => parseFloat(item));
    for (const item of matrixOrigin) {
        rawItem = Math.floor(item);
        if (rawItem >= 67 && rawItem <= 75){x.push(item)};
        if (rawItem >= 36 && rawItem <= 41){y.push(item)};
        // console.log(item,x,y);
    }
    console.log(matrixOrigin);
    console.log(x);
    console.log(y);

    const initialValue = 0;
const sumWithInitial = array1.reduce(
  (previousValue, currentValue) => previousValue + currentValue,
  initialValue
);

console.log(sumWithInitial);


 */