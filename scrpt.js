/* #region  Глобальные переменные */
let x = [];
let y = []; //X и Y - отфильтрованные и отсортированные массивы начальных ОТНОСИТЕЛЬНЫХ координат вершин исходного полигона
let xA = [];
let yA = [];
let l = []; //абсолютные длины сторон полигона
let a = []; //углы наклона сторон полигона в радианах
let xInitial = 0;
let yInitial = 0; //"Центр масс" - начальные усреднённые X и Y полигона
let lngth = 0; //количество углов/граней полигона
/* #endregion */
// ------------------ основная функция подсчёта по потере фокуса с окна ввода -----------------------
const isTextEntered = () => {
  const matrixOrigin = document
    .getElementById("inputMassive")
    .value.split(",")
    .map((item) => parseFloat(item));
  const length = matrixOrigin.length - 1;
  /* #region  Сортируем входную строку на два массива X[] и Y[] */
  for (let i = 0; i < length; i += 2) {
    y.push(matrixOrigin[i]);
    x.push(matrixOrigin[i + 1]);
  }
  /* #endregion */
  /* #region  Вычисляем среднее X и среднее Y - то есть "центр массы" полигона */
  let initX = 0;
  let initY = 0;
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
  /* #endregion */
  /* #region  Преобразуем абсолютные координаты в относительные */
  x = x.map((i) => Math.round((i - xInitial) * 10000000) / 10000000);
  y = y.map((i) => Math.round((i - yInitial) * 10000000) / 10000000);
  /* #endregion */

  console.log("массив относительных координат X\n" + x);
  console.log("массив относительных координат Y\n" + y);

  lngth = x.length;
  if (lngth === y.length && lngth === 4) {
    let [iStart, iEnd] = maxSide(x, y); // 1. Определили наибольшую сторону. iStart, iEnd - индексы начальной и конечной точек наибольшей стороны полигона.
    let iiEnd = (iEnd + 1) * (iEnd != 3); // Определяем индекс третьей точки
    let iiiEnd = (iiEnd + 1) * (iiEnd != 3); // Определяем индекс четвёртой точки. Число Пи примерно 1,5707963. Math.round(l/0.00000026517190441087) = 600
    /* #region  Вывод в консоль */
    console.log("массив длин сторон\n" + l);
    console.log("массив углов сторон\n" + a); // 0.000132585952205435 < ? < 0.000185620333087609;  600 это 0.0015571939506689588 юзать Math.abs() и Math.sign(x)
    /* #endregion */
    const wPolygone =
      0.00000026517190441087 * document.getElementById("inputWidth").value;
    x[iiEnd] =
      x[iEnd] + 1.278481 * wPolygone * Math.cos(a[iStart] - 1.5707963268);
    y[iiEnd] = y[iEnd] + wPolygone * Math.sin(a[iStart] - 1.5707963268);

    dX = x[iEnd] - x[iStart];
    dY = y[iEnd] - y[iStart];
    x[iiiEnd] = x[iiEnd] - dX;
    y[iiiEnd] = y[iiEnd] - dY;
    xA = x.map((i) => i + xInitial);
    yA = y.map((i) => i + yInitial);
    // Вывод в выходное окно результата
    outputString =
      yA[0] +
      "," +
      xA[0] +
      "," +
      yA[1] +
      "," +
      xA[1] +
      "," +
      yA[2] +
      "," +
      xA[2] +
      "," +
      yA[3] +
      "," +
      xA[3];

    document.getElementById("outputTextField").value = outputString;
    /* #region  Вывод в консоль */
    console.log(
      "--------------- a[iStart] + 1.655477151 = ",
      (a[iStart] * 180) / Math.PI,
      (1.486115503 * 180) / Math.PI
    );
    console.log(
      "координата третьей точки от наибольшей стороны =",
      x[iiEnd],
      y[iiEnd]
    );
    console.log(
      "iStart, iEnd, iiEnd, iiiEnd, a[iStart] :",
      iStart,
      iEnd,
      iiEnd,
      iiiEnd,
      a[iStart]
    );
    console.log("массив относительных координат X\n" + x);
    console.log("массив относительных координат Y\n" + y);
    console.log("массив абсолютных координат X\n" + x.map((i) => i + xInitial));
    console.log("массив абсолютных координат Y\n" + y.map((i) => i + yInitial));
    console.log(
      "строка вывода абсолютных координат \n" +
        yA[0] +
        "," +
        xA[0] +
        "," +
        yA[1] +
        "," +
        xA[1] +
        "," +
        yA[2] +
        "," +
        xA[2] +
        "," +
        yA[3] +
        "," +
        xA[3]
    );
    /* #endregion */
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

function reviewAngle(xRv, yRv) {
  return arctg(yRv / (xRv * 1.278481));
}

function reviewLong(lng, anAngle) {
  //длина*(1+0.278481*cos(a)) когда вертикально - cos=0 а коэфф=1 , Когда горизонтально cos=1 а коэфф=1.278481
  return lng * (1 + 0.278481 * Math.cos(anAngle));
}

function Distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function Ratio(x1, y1, x2, y2) {
  // вычисление отношения дельты Y к дельте X координат концов отрезка ->
  return (1.278481 * (y2 - y1)) / (x2 - x1); // -> то есть тангенса угла наклона этого отрезка
}

function Goal(x, y, alfa, lng) {
  // вычисление координат целевой (второй) точки отрезка по заданному ->
  let xGoal = x + lng * Math.cos(alfa); // -> углу "alfa" (радианы) наклона к оси х и его длине "lng"
  let yGoal = y + lng * Math.sin(alfa);
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
// 1.430898542518610	81.9844474
// 1.570796326794900	90
// 1.655477151	      94.85185384
// 1.486115503        85.14814616

/* #region TODO*/
// TODO:  Сделать проверку на ортогональность, для этого:
// TODO:     - 0. Всё нижеперечисленное проделываем только если число вершин равно четырём!!!
// TODO:     - 1. Определить наибольшую сторону.
// TODO:     - 2. Выбираем поле input width (по умолчанию там 600) и умножаем на 0.00000026517190441087 - получаем ширину полигона
// TODO:     - 3. Строим ширинную сторону полигона под 90 градусов к наибольшей стороне. Отмечаем уже третью координату к двум имеющимся.
// TODO:     - 4. От только что построенной грани строим следующую под 90 градусов и с длиной, равной наибольшей стороне полигона. Отмечаем этим последнюю, 4-ю точку.

// TODO:     - 5. ОБЯЗАТЕЛЬНО УБЕДИСЬ, что, по х (68) и по y (38) одинаковые шкалы. То есть 600 по х это 600 и по y.
//                Для этого: Построй большой эталонный полигон-квадрат и общитай его
/*
68.756076			38.518472
68.755218			38.518471
68.755218			38.519143
68.756077			38.519143
0.0008585			0.0006715
2560				2560
0.0000003353515625	0.0000002623046875
x/y = 1.278481
длина*(1+0.278481*cos(a)) когда вертикально - cos=0 а коэфф=1 , Когда горизонтально cos=1 а коэфф=1.278481	
      
tg(a) = y/(x*1.278481) = y/x * 1/1.278481
a = arctg (y/x * 1/1.278481)

 	

*/
/* #endregion */
