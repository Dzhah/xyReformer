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
let l = []; //абсолютные длины сторон полигона
let a = []; //абсолютные углы наклона сторон полигона в радианах
let maxSideAngle = 0; // Угол наклона наидлиннейшей стороны полигона (радианы)
let polygonEdgesNumber = 0; //количество углов/граней полигона 
let deltaAngleTmp = [];
let nextDx = 0;
let nextDy = 0;

/* #endregion */

// ~~~ Функция обработки окна ввода _КООРДИНАТ_ВЕРШИН_ПОЛИГОНА_ ~~~
let isPolygonVertices = () => {

   let polygonVerticesString = document.getElementById("polygonVerticesID").value.split(",").map((item) => parseFloat(item));
   let length = polygonVerticesString.length - 1;
   x = [];
   y = [];
   /* #region  Сортируем входную строку на два массива X[] и Y[] */
   for (let i = 0; i < length; i += 2) {
      y.push(polygonVerticesString[i]);
      x.push(polygonVerticesString[i + 1]);
   };
   
   if (x.length != y.length) { alert( "Что-то не так с введёнными координатами! Число X-координат не равно числу Y-координат!!!", x.length, y.length ); };
   polygonEdgesNumber = x.length; //Определили количество углов/граней полигона - polygonEdgesNumber
   polygonCenterCalculation();
   absoluteToRelativeCoordinatesConversion();
   polygonOrthogonalization();
   polygonRotation();
   resultOutput();   
};
  
/* #endregion */

// ~~~ Функция вычисления среднего X и среднего Y координат вершин полигона - то есть его "центр масс"
function polygonCenterCalculation() {
   let initX = 0;
   let initY = 0;
   xInitial = r07(x.reduce( (previousValue, currentValue) => previousValue + currentValue, initX ) / polygonEdgesNumber);
   yInitial = r07(y.reduce( (previousValue, currentValue) => previousValue + currentValue, initY ) / polygonEdgesNumber);
   xPointToMove = xInitial; // xPointToMove = xPointToMove ? xPointToMove : xInitial;
   yPointToMove = yInitial;

   console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=' );
   document.getElementById("pointToMoveXYID").value = xPointToMove + ', ' + yPointToMove;
};

// ~~~ Функция преобразования абсолютных координат вершин полигона в относительные
function absoluteToRelativeCoordinatesConversion() {
   xR = x.map((item) => (r07(item - xInitial)));
   yR = y.map((item) => (r07(item - yInitial)));
};

// ~~~ Функция ортогонализации полигона
function polygonOrthogonalization() {
   if (polygonEdgesNumber === 4) {
      let [iStart, iEnd] = maxSideIdxs();        // Определили индексы координат вершин наибольшей стороны полигона - iStart, iEnd
      let i3End = (iEnd + 1) % polygonEdgesNumber;   // Определяем индексы X,Y третьей вершины
      let i4End = (i3End + 1) % polygonEdgesNumber; // Определяем индексы X,Y четвёртой вершины 

// XXX -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 

/* TODO     * Не важно как там определяется угол, главное то, что прибавление +90 градусов на поворот по часовой стрелке работает.
            * Вообще не нужно что бы и прямоугольные  и многоуголные и любые полигоны обрабатывать - нужно только прямоугольные.
            * Остальные, отличные от прямоугольных, не обрабатываются на ортогональность, - только на поворот и перемещение.
            * ∆X=L/sqrt(1+(∆Y/k∆X)^2)
            * ∆Y=L*(∆Y/k∆X)/sqrt(1+(∆Y/k∆X)^2)
            * x’=x∙cos(α)-y∙sin(α);
            * y’=x∙sin(α)+y∙cos(α);
            * 
            * truePolygoneWidth = Math.abs(1.278481*Math.sin(maxSideAngle)) * polygoneWidth
            * 
            * */

      let dYdX = (y[iEnd] - y[iStart]) / (x[iEnd] - x[iStart]);  

      maxSideAngle = Math.atan(dYdX);
      polygoneWidth = document.getElementById("polygoneWidthID").value;
      truePolygoneWidth = polygoneWidth //(1+0.278481*Math.abs(Math.sin(maxSideAngle))) * polygoneWidth; // [ ] Додумать     

      let incrementY = (truePolygoneWidth * 0.000000262) / Math.sqrt(1 + dYdX**2); 
      let incrementX = (truePolygoneWidth * 0.000000262) * dYdX / Math.sqrt(1 + dYdX**2);
      
      console.log('polygoneWidth :', polygoneWidth);
      console.log('truePolygoneWidth :', truePolygoneWidth);

      xR[i3End] = xR[iEnd] + 1.278481 * incrementX; // 1.6345 * incrementX
      yR[i3End] = yR[iEnd] - 0.782178 * incrementY;

      xR[i4End] = xR[iStart] + 1.278481 * incrementX; // 1.6345 * incrementX
      yR[i4End] = yR[iStart] - 0.782178 * incrementY;

   };
};

// ~~~ Функция вывода результата
function resultOutput() {
   let outputStringR = (yR[0]+yPointToMove) + "," + (xR[0]+xPointToMove) + "," + (yR[1]+yPointToMove) + "," + (xR[1]+xPointToMove) + "," + (yR[2]+yPointToMove) + "," + (xR[2]+xPointToMove) + "," + (yR[3]+yPointToMove) + "," + (xR[3]+xPointToMove);
   let outputStringFin = (r07(yFin[0]+yPointToMove)) + "," + (r07(xFin[0]+xPointToMove)) + "," + (r07(yFin[1]+yPointToMove)) + "," + (r07(xFin[1]+xPointToMove)) + "," + (r07(yFin[2]+yPointToMove)) + "," + (r07(xFin[2]+xPointToMove)) + "," + (r07(yFin[3]+yPointToMove)) + "," + (r07(xFin[3]+xPointToMove));
   document.getElementById("outputTextField").value = outputStringR + "\n" + outputStringFin;
};

// ~~~ Функция поворота координат вершин полигона на заданное кол-во градусов
function polygonRotation() {
   for (let i = 0; i < 4; i++) {
      xFin[i] = r07(1.278481*(0.782178*xR[i]*Math.cos(-1*polygonAngleRad) - yR[i]*Math.sin(-1*polygonAngleRad)));
      yFin[i] = r07(0.782178*xR[i]*Math.sin(-1*polygonAngleRad) + yR[i]*Math.cos(-1*polygonAngleRad));
   }
};

// ~~~ Функция обработки окна ввода _УГЛА_ПОВОРОТА_ ~~~
let isPolygonAngle = () => {
   polygonAngleRad = parseFloat(
      document.getElementById("polygonAngleID")
      .value.replace(",", ".")  * Math.PI / 180 //=1° × π/180
      );
   document.getElementById("polygonAngleID").value = Math.round(1000*polygonAngleRad * 180/Math.PI)/1000; //=1 рад × 180/π
   console.log('polygonAngle в радианах :', polygonAngleRad);
   polygonRotation();
   resultOutput(); 
};

// ~~~ Функция обработки окна ввода _ШРИНЫ_ПОЛИГОНА_ ~~~
let isPolygoneWidth = () => {
   polygoneWidth = parseFloat(
      document.getElementById("polygoneWidthID").value.replace(",", ".")
   );
   document.getElementById("polygoneWidthID").value = polygoneWidth;
   console.log("polygoneWidthID = ", polygoneWidth);
   polygonCenterCalculation();
   absoluteToRelativeCoordinatesConversion();
   polygonOrthogonalization();
   polygonRotation();
   resultOutput();  
};

// ~~~ Функция обработки окна ввода _КООРДИНАТЫ_ПЕРЕМЕЩЕНИЯ_ полигона ~~~
let isPointToMoveXY = () => { EnterPointToMove(); };

// ~~~ Функция ВВОДА _КООРДИНАТЫ_ПЕРЕМЕЩЕНИЯ_ полигона ~~~
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

// ~~~ Функция определение индексов координат начала и конца наибольшей грани полигона ~~~
function maxSideIdxs() {
   let max = 0;
   let iMax = 0;
   let iiMax = 0;
   let ii = 0;
   for (let i = 0; i < polygonEdgesNumber; i++) {
      ii = (i + 1) % polygonEdgesNumber;
      dist = distance(x[i], y[i], x[ii], y[ii]);
      a.push(ratio(x[i], y[i], x[ii], y[ii]));
      l.push(dist);
      if (dist > max) { max = dist; iMax = i; iiMax = ii; }
   }

   for (let i = 0; i < polygonEdgesNumber; i++) {                                                  // [ ]  ВРЕМЕННАЯ СТРОКА ДЛЯ ОЦЕНКИ УГЛОВ
      ii = (i + 1) % polygonEdgesNumber;                                                           // [ ]  ВРЕМЕННАЯ СТРОКА ДЛЯ ОЦЕНКИ УГЛОВ
      deltaAngleTmp.push(Math.round( 10 * (180 * (Math.atan(a[ii]*1.28*1.28)-Math.atan(a[i]*1.28*1.28))/Math.PI))/10); // [ ]  ВРЕМЕННАЯ СТРОКА ДЛЯ ОЦЕНКИ УГЛОВ
      console.log("i = " + i + "," + " Разность углов (Next-i) = " + deltaAngleTmp[i]);            // [ ]  ВРЕМЕННАЯ СТРОКА ДЛЯ ОЦЕНКИ УГЛОВ
      console.log("i = " + i + "," + " Угол (i) = " + Math.round(1800*Math.atan(a[i]*1.28*1.28)/Math.PI)/10);          // [ ]  ВРЕМЕННАЯ СТРОКА ДЛЯ ОЦЕНКИ УГЛОВ
   }                                                                                               // [ ]  ВРЕМЕННАЯ СТРОКА ДЛЯ ОЦЕНКИ УГЛОВ

   console.log('iMax, iiMax :', iMax, iiMax);
   return [iMax, iiMax];   
};

// ~~~ Функция вычисления гипотенузы (длины грани полигона)
function distance(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2) }; 

// ~~~ Функция вычисления ИДЕАЛЬНОГО отношения ∆Y/(∆X*k) - тангенсов углов наклона граней полигона
function ratio(x1, y1, x2, y2) { return (y2 - y1) / (x2 - x1); };

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

