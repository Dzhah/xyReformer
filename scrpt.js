/* #region  Глобальные переменные */
let polygoneWidth = 0; // ВЫСОТА полигона
let truePolygoneWidth = 0; // Скорректированная, с учётом х-сжатого визуального холста карты, ВЫСОТА полигона которую надо обеспечить в результате
let polygonAngleRad = 0; // Скорректированный, с учётом х-сжатого визуального холста карты, угол в РАДИАНАХ на который надо повернуть полигон (если надо)
let xPointToMove = 0; // X,Y координаты целевой точки, для возможного перемещения полигона. Если заданно 0,0 то при первом
let yPointToMove = 0; //     определении они приравниваются к xInitial, yInitial
let x = [];
let y = []; //X и Y - отфильтрованные и отсортированные массивы начальных визуальных АБСОЛЮТНЫХ координат вершин исходного полигона
let xR = [];
let yR = []; //XR и YR - отфильтрованные и отсортированные массивы начальных визуальных ОТНОСИТЕЛЬНЫХ координат вершин исходного полигона
let xFin = [];
let yFin = []; //XFin и YFin - масси окончательных ОТНОСИТЕЛЬНЫХ координат вершин исходного полигона включающих поворот
let xInitial = 0;
let yInitial = 0; //"Центр масс" - начальные усреднённые X и Y полигона
let maxSideAngle = 0; // Угол наклона наидлиннейшей стороны полигона (радианы)
let polygonEdgesNumber = 0; //количество углов/граней полигона 
let deltaAngleTmp = [];
let nextDx = 0;
let nextDy = 0;
/* #endregion */

// ~~~ Функция обработки окна ввода _КООРДИНАТ_ВЕРШИН_ПОЛИГОНА_ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~
let isPolygonVertices = () => {

   let polygonVerticesString = document.getElementById("polygonVerticesID").value.split(",").map((item) => parseFloat(item));
   x = [];
   y = [];
   let lng = polygonVerticesString.length - 1;
   for (let i = 0; i < lng; i += 2) {
      y.push(polygonVerticesString[i]);
      x.push(polygonVerticesString[i + 1]);
   };
   if (x.length != y.length) { alert( "Что-то не так с введёнными координатами! Число X-координат не равно числу Y-координат!!!", x.length, y.length ); };
   polygonEdgesNumber = x.length;
   polygonCenterCalculation();
   absoluteToRelativeCoordinatesConversion();
   polygonOrthogonalization();
   polygonRotation();
   resultOutput();   
};

// ~~~ Функция вычисления среднего X и среднего Y координат вершин полигона - то есть его "центр масс"
function polygonCenterCalculation() {
   xInitial = x.reduce( (i, ii) => i + ii, 0) / polygonEdgesNumber;
   yInitial = y.reduce( (i, ii) => i + ii, 0) / polygonEdgesNumber;
   xPointToMove = xInitial;
   yPointToMove = yInitial;
   document.getElementById("pointToMoveXYID").value = xPointToMove + ', ' + yPointToMove;
};

// ~~~ Функция преобразования абсолютных координат вершин полигона в относительные
function absoluteToRelativeCoordinatesConversion() {
   xR = x.map((item) => (item - xInitial));
   console.log('xR :', xR);
   yR = y.map((item) => (item - yInitial));
   console.log('yR :', yR);

};

// ~~~ Функция ортогонализации полигона
function polygonOrthogonalization() {
   if (polygonEdgesNumber === 4) {
      let [iStart, iEnd] = maxSideIdxs();
      let i3End = (iEnd + 1) % polygonEdgesNumber;
      let i4End = (i3End + 1) % polygonEdgesNumber;
      let tmpDiff = (x[iEnd] - x[iStart]) ? (x[iEnd] - x[iStart]) : 0.0000000000000000001;
      let dYdX = (y[iEnd] - y[iStart]) / tmpDiff;
      maxSideAngle = Math.atan(dYdX);
      polygoneWidth = document.getElementById("polygoneWidthID").value;
      truePolygoneWidth = polygoneWidth / (1+0.278481*Math.abs(Math.sin(maxSideAngle)))
      let incrementY = (truePolygoneWidth * 0.000000335) / Math.sqrt(1 + dYdX**2); 
      let incrementX = (truePolygoneWidth * 0.000000262) * dYdX / Math.sqrt(1 + dYdX**2);
      xR[i3End] = xR[iEnd] + 1.278481 * 1.278481 * incrementX;
      yR[i3End] = yR[iEnd] - 0.782178 * incrementY;
      xR[i4End] = xR[iStart] + 1.278481 * 1.278481 * incrementX;
      yR[i4End] = yR[iStart] - 0.782178 * incrementY;
      let massPoint = xR[iStart] + xR[iEnd] + xR[i3End] + xR[i4End] + yR[iStart] + yR[iEnd] + yR[i3End] + yR[i4End];
      let xAlt = xR.slice();
      let yAlt = yR.slice();
      xAlt[i3End] = xR[iEnd] - 1.278481 * 1.278481 * incrementX;
      yAlt[i3End] = yR[iEnd] + 0.782178 * incrementY;
      xAlt[i4End] = xR[iStart] - 1.278481 * 1.278481 * incrementX;
      yAlt[i4End] = yR[iStart] + 0.782178 * incrementY;
      let massPointAlt = xR[iStart] + xR[iEnd] + xAlt[i3End] + xAlt[i4End] + yR[iStart] + yR[iEnd] + yAlt[i3End] + yAlt[i4End];
      if (Math.abs(massPointAlt) < Math.abs(massPoint)) {
         xR = xAlt;
         yR = yAlt;
      };
   };
};

// ~~~ Функция поворота координат вершин полигона на заданное кол-во градусов
function polygonRotation() {
   for (let i = 0; i < polygonEdgesNumber; i++) {
      xFin[i] = r07(1.278481*(0.782178*xR[i]*Math.cos(-1*polygonAngleRad) - yR[i]*Math.sin(-1*polygonAngleRad)));
      yFin[i] = r07(0.782178*xR[i]*Math.sin(-1*polygonAngleRad) + yR[i]*Math.cos(-1*polygonAngleRad));
   };
};

// ~~~ Функция вывода результата
function resultOutput() {
   let outputStringFin = (r07(yFin[0]+yPointToMove) + ',' + r07(xFin[0]+xPointToMove));
   for (let i = 1; i < polygonEdgesNumber; i++) {
      outputStringFin += ',' + r07(yFin[i] + yPointToMove) + ',' + r07(xFin[i] + xPointToMove);
   };
   document.getElementById("outputTextField").value = outputStringFin;
};

// ~~~ Функция ВВОДА _УГЛА_ПОВОРОТА_ полигона ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~
let isPolygonAngle = () => {
   polygonAngleRad = parseFloat(document.getElementById("polygonAngleID").value.replace(",", ".")  * Math.PI / 180);
   document.getElementById("polygonAngleID").value = Math.round(1000*polygonAngleRad * 180/Math.PI)/1000;
   polygonRotation();
   resultOutput(); 
};

// ~~~ Функция обработки окна ВВОДА _ШРИНЫ_ПОЛИГОНА_ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~
let isPolygoneWidth = () => {
   polygoneWidth = parseFloat(document.getElementById("polygoneWidthID").value.replace(",", "."));
   document.getElementById("polygoneWidthID").value = polygoneWidth;
   polygonCenterCalculation();
   absoluteToRelativeCoordinatesConversion();
   polygonOrthogonalization();
   polygonRotation();
   resultOutput();  
};

// ~~~ Функция ВВОДА _КООРДИНАТЫ_ПЕРЕМЕЩЕНИЯ_ полигона ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~
let isPointToMoveXY = () => { EnterPointToMove(); };

// ~~~ Функция обработки окна ввода координаты перемещения полигона
function EnterPointToMove() {
   let pointToMove = document.getElementById("pointToMoveXYID").value;
   if (pointToMove[pointToMove.length - 1] === "°") {
      isPointFromGoogleEarth = false;
      pointToMove.pop;
      pointToMove = pointToMove.replace("°", ",").split(",").map((item) => parseFloat(item));
      [xPointToMove, yPointToMove] = [pointToMove[1], pointToMove[0]];
   } else {
      pointToMove = pointToMove.split(",").map((item) => parseFloat(item));
      [xPointToMove, yPointToMove] = [pointToMove[0], pointToMove[1]];
   }
   document.getElementById("pointToMoveXYID").value = xPointToMove + ", " + yPointToMove;
   resultOutput();  
};

// ~~~ Функция определение индексов координат начала и конца наибольшей грани полигона 
function maxSideIdxs() {
   let max = 0;
   let iMax = 0;
   let iiMax = 0;
   let ii = 0;
   for (let i = 0; i < polygonEdgesNumber; i++) {
      ii = (i + 1) % polygonEdgesNumber;
      dist = Math.hypot(x[i] - x[ii], y[i] - y[ii]);
      if (dist > max) { max = dist; iMax = i; iiMax = ii; }
   };
   return [iMax, iiMax];   
};

// ~~~ Функция округление до 7-го знака после запятой
function r07(q){ return Math.round(q * 10000000)/10000000 } ;

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

Math.round(l/0.00000026517190441087) = 600

deltaAngleTmp.push(Math.round( 10 * (180 * (Math.atan(a[ii]*1.28*1.28)-Math.atan(a[i]*1.28*1.28))/Math.PI))/10);
console.log("i = " + i + "," + " Разность углов (Next-i) = " + deltaAngleTmp[i]); 
console.log("i = " + i + "," + " Угол (i) = " + Math.round(1800*Math.atan(a[i]*1.28*1.28)/Math.PI)/10); 

for (let i = 0; i < polygonEdgesNumber; i++) { ii = (i + 1) % polygonEdgesNumber;
i = 0, Разность углов (Next-i) = 90
i = 0, Угол (i) = -79.7
i = 1, Разность углов (Next-i) = -90.2
i = 1, Угол (i) = 10.2
i = 2, Разность углов (Next-i) = 90.2
i = 2, Угол (i) = -80
i = 3, Разность углов (Next-i) = -90
i = 3, Угол (i) = 10.2

*/

