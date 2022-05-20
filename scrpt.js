console.log("Hello CLI!");

let x = [],
  y = [], //X и Y - отфильтрованные и отсортированные массивы начальных ОТНОСИТЕЛЬНЫХ координат вершин исходного полигона
  l = [], //абсолютные длины сторон полигона
  a = []; //углы наклона сторон полигона в радианах
let xInitial = 0,
  yInitial = 0; //"Центр масс" - начальные усреднённые X и Y полигона
let lngth = 0; //"количество углов/граней полигона
const isTextEntered = () => {
  const matrixOrigin = document
    .getElementById("inputMassive")
    .value.split(",")
    .map((item) => parseFloat(item));
  const length = matrixOrigin.length - 1;
  // Сортируем входную строку на два массива X[] и Y[]
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
  // console.log("Угол наклона 1го отрезка : " + Angle(x[0], y[0], x[1], y[1]));
  // console.log("Угол наклона 2го отрезка : " + Angle(x[1], y[1], x[2], y[2]));
  // console.log("Угол наклона 3го отрезка : " + Angle(x[2], y[2], x[3], y[3]));
  // console.log("Угол наклона 4го отрезка : " + Angle(x[3], y[3], x[0], y[0]));
  // console.log(x);
  // console.log("X центра масс = " + xInitial);
  // console.log(y);
  // console.log("Y центра масс = " + yInitial);
  // ------------------------------------------------------------------------
  x = x.map((i) => Math.round((i - xInitial) * 10000000) / 10000000);
  y = y.map((i) => Math.round((i - yInitial) * 10000000) / 10000000);
  // Вывод в выходное окно результата
  document.getElementById("outputTextField").value = "x = " + x + "\ny = " + y;
  console.log("массив относительных координат X\n" + x);
  console.log("массив относительных координат Y\n" + y);

  // TODO:  Сделать проверку на ортогональность, для этого:

  // TODO:     - 0. Всё нижеперечисленное проделываем только если число вершин равно четырём!!!

  // TODO:     - 1. Определить наибольшую сторону.

  // TODO:     - 2. Если следующая, от наибольшей, сторона равна 600+/-100 и в поле ввода ширины 600 а не что-то введённое иное, то утвердить её как равную 600.
  
  // TODO:     - 3. Если не 600 а другое, то берём это другое и строим это другое под 90 градусов к наибольшей стороне. Отмечаем уже третью координату к двум имеющимся.

  // TODO:     - 4. От только что построенной грани строим следующую под 90 градусов и с длиной, равной наибольшей стороне полигона. Отмечаем этим последнюю, 4-ю точку.

  lngth = x.length;
  if (lngth === y.length && lngth === 4) {
    let [iStart, iEnd] = maxSide(x, y); // 1. Определили наибольшую сторону. iStart, iEnd - индексы начальной и конечной точек наибольшей стороны полигона.
    let iiEnd = (iEnd + 1) * (iEnd != 3); // Определяем индекс третьей точки
    let iiiEnd = (iiEnd + 1) * (iiEnd != 3); // Определяем индекс четвёртой точки. Число Пи примерно 1,5707963. Math.round(l/0.00000026517190441087) = 600
    console.log("массив длин сторон\n" + l); // Если следующая, от наибольшей, сторона равна 600+/-100 то утвердить её как равную 600
    console.log("массив углов сторон\n" + a); // 0.000132585952205435 < ? < 0.000185620333087609;  600 это 0.0015571939506689588 юзать Math.abs() и Math.sign(x)
  }
};


function maxSide(x, y) {
  // определение индексов координат начала и конца наибольшей грани полигона
  let max = 0,
    iMax = 0,
    iiMax = 0,
    ii = 0;
  for (let i = 0; i < lngth; i++) {
    i < lngth - 1 ? (ii = i + 1) : (ii = 0);
    dist = Distance(x[i], y[i], x[ii], y[ii]);
    a.push(Angle(x[i], y[i], x[ii], y[ii]));
    l.push(dist);

    if (dist > max) {
      max = dist;
      iMax = i;
      iiMax = ii;
    }
  }
  return [iMax, iiMax];
}

function Distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
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
 
//-0,227599714703223	-13,04050307
// 1,430988089423410	81,98957806
//-0,221467955494986	-12,68917915
// 1,430898542518610	81,9844474
// 1,570796326794900	90


