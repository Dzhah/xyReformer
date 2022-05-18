console.log("Hello CLI!");

let x = [],
  y = []; //отфильтрованные и отсортированные массивы начальных ОТНОСИТЕЛЬНЫХ координат вершин исходного полигона
let xInitial = 0,
  yInitial = 0; //"Центр масс" - начальные усреднённые X и Y полигона

const isTextEntered = () => {
  const matrixOrigin = document
    .getElementById("inputMassive")
    .value.split(",")
    .map((item) => parseFloat(item));
  const length = matrixOrigin.length - 1;
  for (let i = 0; i < length; i += 2) {
    x.push(matrixOrigin[i]);
    y.push(matrixOrigin[i + 1]);
  }
  // Вычисляем среднее X и среднее Y - то есть "центр массы" полигона
  let initX = 0,
    initY = 0;
  xInitial =
    x.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initX
    ) / x.length;
  yInitial =
    y.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initY
    ) / y.length;
  // Вывод в консоль для дебаггинга -----------------------------------------
  console.log("Угол наклона 1го отрезка : " + Angle(x[0], y[0], x[1], y[1]));
  console.log("Угол наклона 2го отрезка : " + Angle(x[1], y[1], x[2], y[2]));
  console.log("Угол наклона 3го отрезка : " + Angle(x[2], y[2], x[3], y[3]));
  console.log("Угол наклона 4го отрезка : " + Angle(x[3], y[3], x[0], y[0]));
  console.log(x);
  console.log("X центра масс = " + xInitial);
  console.log(y);
  console.log("Y центра масс = " + yInitial);
  // ------------------------------------------------------------------------
  x = x.map((i) => Math.round((i - xInitial) * 10000000) / 10000000);
  y = y.map((i) => Math.round((i - yInitial) * 10000000) / 10000000);
  // Вывод в выходное окно результата
  document.getElementById("outputTextField").value = "x = " + x + "\ny = " + y;

  console.log(x);
  console.log(y);
};

function Distance(x1, y1, x2, y2) {
  return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function Ratio(x1, y1, x2, y2) {
  // вычисление отношения дельты Y к дельте X координат концов отрезка ->
  return (y2 - y1) / (x2 - x1); // -> то есть тангенса угла наклона этого отрезка
}

function Goal(x, y, alfa, lng) {
  // вычисление координат целевой (второй) точки отрезка по заданному ->
  xGoal = x + lng * Math.cos(alfa); // -> углу "alfa" (радианы) наклона к оси х и его длине "lng"
  yGoal = y + lng * Math.sin(alfa);
  return [xGoal, yGoal];
}

function Angle(x1, y1, x2, y2) {
  // вычисление угла наклона (радианы), к оси Х, грани, по координатам её концов
  return Math.atan(Ratio(x1, y1, x2, y2));
}

function maxSide(x, y) {
  // определение индексов координат начала и конца наибольшей грани полигона
  let max = 0,
    iMax = 0,
    iiMax = 0,
    ii = 0,
    lngth = x.length;
  for (let i = 0; i < lngth; i++) {
    i < lngth - 1 ? (ii = i + 1) : (ii = 0);
    dist = Distance(x[i], y[i], x[ii], y[ii]);
    if (dist > max) {
      max = dist;
      iMax = i;
      iiMax = ii;
    }
  }
  return [iMax, iiMax];
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
