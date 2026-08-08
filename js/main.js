// ==========================================
// 1. INICJALIZACJA CANVAS & HIGH-DPI (RETINA / 2K / 4K)
// ==========================================

// Pobieramy element <canvas> z DOM na podstawie jego identyfikatora ID
const canvas = document.getElementById("canvas");
// Pobieramy 2D kontekst renderowania – to obiekt `ctx` odpowiada za wszystkie operacje rysowania
const ctx = canvas.getContext("2d");

// DPR (Device Pixel Ratio) to stosunek fizycznych pikseli ekranu do pikseli CSS.
// Na ekranach High-DPI (np. Retina, monitory 2K/4K) 1 piksel logiczny CSS może odpowiadać np. 2 lub 3 pikselom fizycznym.
let dpr = window.devicePixelRatio || 1;
let width = 1000;
let height = 750;

/**
 * Funkcja dostosowująca wewnętrzny bufor renderowania płótna do zagęszczenia pikseli ekranu.
 * Zapobiega to efektowi "rozpikselowania" lub rozmycia wektorów na nowoczesnych monitorach.
 */
function setupCanvas() {
  dpr = window.devicePixelRatio || 1;

  // Pobieramy rzeczywisty rozmiar elementu w oknie przeglądarki (w pikselach CSS)
  const rect = canvas.getBoundingClientRect();
  width = rect.width || 1000;
  height = rect.height || 750;

  // Ustawiamy właściwy rozmiar bufora wewnętrznego Canvasa (mnożymy przez DPR).
  // Dzięki temu Canvas ma np. 2000x1500 fizycznych pikseli w buforze...
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  // ...ale skalujemy sam kontekst operacji graficznych w dół o wartość DPR.
  // Dzięki temu w kodzie nadal posługujemy się jednostkami logicznymi (np. x=100, y=100),
  // a przeglądarka sama renderuje to w pełnej natywnej rozdzielczości ekranu.
  ctx.scale(dpr, dpr);
}

// Uruchamiamy wstępne ustawienie płótna
setupCanvas();

// Po zmianie rozmiaru okna przeglądarki automatycznie przeliczamy bufor Canvasa
window.addEventListener("resize", setupCanvas);

// ==========================================
// 2. GENEROWANIE ŚCIEŻEK FIGUR (GEOMETRIA)
// ==========================================
// Uwaga: Funkcje te tworzą jedynie matematyczny obrys (ścieżkę), ale same w sobie
// nic nie rysują na ekranie, dopóki nie wywołamy ctx.stroke() lub ctx.fill().

// --- Podstawowe kształty ---

function pathCircle(ctx, x, y, r) {
  ctx.beginPath(); // Rozpoczynamy nową, czystą ścieżkę
  // arc(x, y, promień, kątPoczątkowy, kątKońcowy)
  // Math.PI * 2 oznacza pełne koło (360 stopni w radianach)
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function pathTriangle(ctx, x, y, size, angle = 0) {
  ctx.beginPath();
  ctx.save(); // Zapisujemy aktualny stan macierzy przekształceń Canvasa

  ctx.translate(x, y); // Przesuwamy układ współrzędnych do punktu (x, y) figury
  ctx.rotate(angle); // Obracamy układ o dany kąt (w radianach)

  // Rysujemy trójkąt równoboczny względem nowego środka (0,0)
  ctx.moveTo(0, -size); // Wierzchołek górny
  ctx.lineTo(size * 0.866, size * 0.5); // Wierzchołek prawy dolny (0.866 to cos(30°))
  ctx.lineTo(-size * 0.866, size * 0.5); // Wierzchołek lewy dolny
  ctx.closePath(); // Łączymy ostatni punkt z pierwszym

  ctx.restore(); // Przywracamy poprzedni stan macierzy transformacji
}

function pathRect(ctx, x, y, w, h, angle = 0) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Rysujemy prostokąt ze środkiem w punkcie (0,0)
  ctx.rect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

// --- Zaawansowane kształty ze szkicownika ---

// 1. Krzyż modułowy z kwadratów
function pathSquareCross(ctx, x, y, size, angle = 0) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Dodajemy 5 nakładających się kwadratów do jednej ścieżki
  ctx.rect(-size / 2, -size / 2, size, size); // Środek
  ctx.rect(-size * 1.5, -size / 2, size, size); // Lewe ramię
  ctx.rect(size / 2, -size / 2, size, size); // Prawe ramię
  ctx.rect(-size / 2, -size * 1.5, size, size); // Górne ramię
  ctx.rect(-size / 2, size / 2, size, size); // Dolne ramię

  ctx.closePath();
  ctx.restore();
}

// 2. Postać "Pacmana" (Nacięte koło z wycinkiem)
function pathPacmanCut(ctx, x, y, r, angle = 0, cutAngle = Math.PI * 0.3) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.moveTo(0, 0); // Zaczynamy od środka koła
  // Rysujemy łuk z wyłączeniem rozwartości kąta `cutAngle`
  ctx.arc(0, 0, r, cutAngle / 2, Math.PI * 2 - cutAngle / 2);
  ctx.lineTo(0, 0); // Wracamy linią do środka, tworząc otwartą "paszczę"
  ctx.closePath();

  ctx.restore();
}

// 3. Sierp Księżyca (Konstruowany z dwóch nakładających się łuków)
function pathCrescentMoon(ctx, x, y, outerR, innerR_offset_x, angle = 0) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Zewnętrzny łuk (półokrąg od 90° do 270°)
  ctx.arc(0, 0, outerR, Math.PI * 0.5, Math.PI * 1.5);

  // Wewnętrzny łuk wycinający środek (rysowany przeciwnie do ruchu wskazówek zegara: `true`)
  ctx.arc(innerR_offset_x, 0, outerR * 0.8, Math.PI * 1.5, Math.PI * 0.5, true);

  ctx.closePath();
  ctx.restore();
}

// 4. Korona / Zębaty pancerz
function pathCrown(ctx, x, y, w, h, angle = 0) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Rysowanie wielokąta po punktach wierzchołkowych
  ctx.moveTo(-w / 2, h / 2); // Lewy dolny róg
  ctx.lineTo(w / 2, h / 2); // Prawy dolny róg
  ctx.lineTo(w / 2, -h / 2); // Prawy górny bark
  ctx.lineTo(w / 4, -h); // Prawy szpic
  ctx.lineTo(0, -h / 2); // Środkowe wcięcie
  ctx.lineTo(-w / 4, -h); // Lewy szpic
  ctx.lineTo(-w / 2, -h / 2); // Lewy górny bark

  ctx.closePath();
  ctx.restore();
}

// 5. Struktura Orbitalna (Punkty krążące wokół rdzenia)
function pathOrbital(ctx, x, y, centerR, orbitR, numPoints, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Ścieżka centralnego okręgu
  ctx.beginPath();
  ctx.arc(0, 0, centerR, 0, Math.PI * 2);
  ctx.closePath();

  // Matematyczne wyznaczenie pozycji małych kropek po obwodzie orbity
  for (let i = 0; i < numPoints; i++) {
    // Dzielimy pełny kąt (2*PI) na równą liczbę kroków
    const pointAngle = (i / numPoints) * Math.PI * 2;
    // Zamiana współrzędnych biegunowych na kartezjańskie (x = r*cos, y = r*sin)
    const px = Math.cos(pointAngle) * orbitR;
    const py = Math.sin(pointAngle) * orbitR;

    ctx.moveTo(px, py);
    ctx.arc(px, py, orbitR * 0.15, 0, Math.PI * 2);
  }

  ctx.restore();
}

// 6. Gwiazda / Rozbłysk Słoneczny
function pathStarBurst(ctx, x, y, innerR, outerR, raysCount = 8, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Środkowe koło
  ctx.beginPath();
  ctx.arc(0, 0, innerR, 0, Math.PI * 2);
  ctx.closePath();

  // Rysowanie odchodzących promieni trójkątnych
  for (let i = 0; i < raysCount; i++) {
    const a = (i / raysCount) * Math.PI * 2;
    const baseW = 0.18; // Szerokość podstawy promienia

    ctx.beginPath();
    ctx.moveTo(
      Math.cos(a - baseW) * (innerR + 4),
      Math.sin(a - baseW) * (innerR + 4),
    );
    ctx.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR); // Szpic promienia
    ctx.lineTo(
      Math.cos(a + baseW) * (innerR + 4),
      Math.sin(a + baseW) * (innerR + 4),
    );
    ctx.closePath();
  }

  ctx.restore();
}

// 7. Wiatrak / Turbina
function pathPinwheel(ctx, x, y, size, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.beginPath();
  // Generowanie 4 skrzydełek odchodzących symetrycznie od środka
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.3, -size * 0.2);
    ctx.lineTo(0, -size);
    ctx.closePath();
    ctx.restore();
  }

  ctx.restore();
}

// 8. Kaskadowy Pancerz / Szewron
function pathChevronShield(ctx, x, y, w, h, layers = 3, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.beginPath();
  const step = h / layers;
  // Generowanie nakładających się warstwowo załamanych linii w kształcie litery "V"
  for (let i = 0; i < layers; i++) {
    const yOffset = -h / 2 + i * step;
    ctx.moveTo(-w / 2, yOffset + step * 0.6);
    ctx.lineTo(0, yOffset);
    ctx.lineTo(w / 2, yOffset + step * 0.6);
  }

  ctx.restore();
}

// 9. Atom / Pierścienie Żyroskopu
function pathAtomRings(ctx, x, y, radius, angle = 0) {
  ctx.save();
  ctx.translate(x, y);

  // Centralne jądro
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
  ctx.closePath();

  // Pierwsza elipsa orbitalna
  ctx.save();
  ctx.rotate(angle);
  ctx.beginPath();
  // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
  ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.restore();

  // Druga elipsa orbitalna skręcona pod innym kątem
  ctx.save();
  ctx.rotate(-angle + Math.PI / 3);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.restore();

  ctx.restore();
}

// ==========================================
// 3. WEKTOROWE RENDERERY LINII (STYLIZE STROKE)
// ==========================================
// Zamiast wolnego i rozmytego `shadowBlur`, nakładamy na siebie kilkukrotnie
// te same ścieżki wektorowe o różnej grubości (`lineWidth`) i przezroczystości (`globalAlpha`).

/**
 * STYL 1: Efekt Neonu / Światła
 * Działa jak warstwy w Photoshopie: najszersza linia pod spodem z niską przezroczystością,
 * a na samej górze wąski, ostry biały rdzeń.
 */
function drawVectorGlow(ctx, pathFn, color, pulse = 1) {
  ctx.save();
  ctx.lineCap = "round"; // Zaokrąglone końce odcinków
  ctx.lineJoin = "round"; // Zaokrąglone miejsca łączenia linii

  // Warstwa 1: Zewnętrzna, najbardziej rozmyta i tętniąca poświata
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.12 * pulse;
  ctx.lineWidth = 18 * pulse;
  pathFn(); // Wywołujemy przekazaną funkcję generującą ścieżkę
  ctx.stroke();

  // Warstwa 2: Średnia, bardziej nasycona poświata
  ctx.globalAlpha = 0.35 * pulse;
  ctx.lineWidth = 8 * pulse;
  pathFn();
  ctx.stroke();

  // Warstwa 3: Środkowy, ostry biały rdzeń dający wrażenie jasnego żarzenia
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  pathFn();
  ctx.stroke();

  ctx.restore();
}

/**
 * STYL 2: Cyber Dash / Przerywany interfejs HUD
 * Wykorzystuje przerywane linie `setLineDash` oraz przesunięcie fazy `lineDashOffset` do animowania ruchu prądu.
 */
function drawCyberDash(ctx, pathFn, color, dashOffset = 0) {
  ctx.save();
  ctx.lineCap = "butt"; // Proste wykończenie krawędzi przerywanych kresek
  ctx.lineJoin = "miter"; // Ostre połączenia narożników

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  // Tablica [14, 8] oznacza: 14px linii, 8px przerwy
  ctx.setLineDash([14, 8]);
  // Przesuwanie wzoru dające efekt pędzących kresek wzdłuż ścieżki
  ctx.lineDashOffset = -dashOffset;

  // Szerokie, lekko prześwitujące tło
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 7;
  pathFn();
  ctx.stroke();

  // Wewnętrzny ostry promień
  ctx.globalAlpha = 1.0;
  ctx.lineWidth = 2;
  pathFn();
  ctx.stroke();

  ctx.restore();
}

/**
 * STYL 3: Tech Double Line
 * Gruba półprzezroczysta podstawa + cienki ostry obrys na wierzchu.
 */
function drawTechLine(ctx, pathFn, color) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 10;
  pathFn();
  ctx.stroke();

  ctx.globalAlpha = 1.0;
  ctx.lineWidth = 2;
  pathFn();
  ctx.stroke();

  ctx.restore();
}

/**
 * STYL 4: Cyber Solid (Pełne białe wypełnienie + przerywany obrys z poświatą)
 */
function drawCyberSolid(ctx, pathFn, color, dashOffset = 0) {
  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.fillStyle = "#ffffff"; // Kolor wypełnienia wnętrza figury

  // Rysowanie zewnętrznej przerywanej poświaty
  ctx.setLineDash([12, 6]);
  ctx.lineDashOffset = -dashOffset;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 8;
  pathFn();
  ctx.stroke();

  // Wypełnienie i ostre obrysowanie wnętrza
  ctx.globalAlpha = 1.0;
  pathFn();
  ctx.fill(); // Wypełniamy wnętrze figury
  ctx.stroke(); // Nakładamy obrys

  ctx.restore();
}

// ==========================================
// 4. BAZA DANYCH OBIEKTÓW I PARAMETRÓW ANIMACJI
// ==========================================
// Słownik przechowujący pozycje (x, y), parametry fizyczne i dynamiczne modyfikatory dla każdej figury.

const shapes = {
  // Wiersz 1
  circle: { x: 125, y: 125, radius: 40, pulse: 1, color: "#ff0055" },
  triangle: { x: 375, y: 125, size: 45, angle: 0, color: "#00f0ff" },
  rect: {
    x: 625,
    y: 125,
    w: 70,
    h: 70,
    angle: 0,
    yOffset: 0,
    color: "#ffcc00",
  },
  cross: { x: 875, y: 125, size: 22, angle: 0, pulse: 1, color: "#aa00ff" },

  // Wiersz 2
  pacman: {
    x: 125,
    y: 375,
    radius: 38,
    angle: 0,
    cutAngle: Math.PI * 0.3,
    color: "#33ff33",
  },
  moon: { x: 375, y: 375, radius: 40, offset: 18, angle: 0, color: "#dddd00" },
  crown: { x: 625, y: 375, w: 70, h: 35, angle: 0, color: "#ff33aa" },
  orbital: {
    x: 875,
    y: 375,
    centerR: 12,
    orbitR: 32,
    numPoints: 8,
    angle: 0,
    color: "#00ccff",
  },

  // Wiersz 3
  starburst: {
    x: 125,
    y: 625,
    innerR: 18,
    outerR: 42,
    rays: 8,
    angle: 0,
    color: "#ff5500",
  },
  pinwheel: { x: 375, y: 625, size: 42, angle: 0, color: "#00ffaa" },
  chevron: {
    x: 625,
    y: 625,
    w: 60,
    h: 50,
    layers: 3,
    angle: 0,
    color: "#ff00aa",
  },
  atom: { x: 875, y: 625, radius: 40, angle: 0, color: "#3388ff" },
};

// Globalne przesunięcie kreskowania używane we wszystkich obiektach ze stylem HUD
let globalDashOffset = 0;

// ==========================================
// 5. LOGIKA I AKTUALIZACJA STANUS (UPDATE LOOP)
// ==========================================

/**
 * Przelicza stan gry, fizykę oraz parametry animacji obiektów.
 * @param {number} dt - Delta Time (czas w sekundach od ostatniej klatki)
 * @param {number} time - Łączny czas działania aplikacji (w milisekundach)
 */
function update(dt, time) {
  // Math.sin() tworzy płynną falę harmoniczną od -1 do 1.
  // Idealne do tworzenia efektu oddychania, pulsowania i floatowania!

  // --- Wiersz 1 ---
  // Tętnienie grubości promienia koła
  shapes.circle.pulse = 1 + Math.sin(time * 0.005) * 0.3;

  // Obrót trójkąta (używamy delta time 'dt', aby prędkość była niezależna od FPS)
  shapes.triangle.angle += 1.2 * dt;

  // Obrót i unoszenie się prostokąta w głąb i w górę
  shapes.rect.angle -= 0.6 * dt;
  shapes.rect.yOffset = Math.sin(time * 0.003) * 14;

  // Obrót i pulsowanie krzyża
  shapes.cross.angle += 0.8 * dt;
  shapes.cross.pulse = 1 + Math.sin(time * 0.004) * 0.2;

  // --- Wiersz 2 ---
  shapes.pacman.angle -= 1.0 * dt;
  // Płynne otwieranie i zamykanie pyska Pacmana
  shapes.pacman.cutAngle = Math.PI * (0.15 + 0.15 * Math.sin(time * 0.006));

  shapes.moon.angle += 0.5 * dt;
  shapes.moon.offset =
    shapes.moon.radius * (0.3 + 0.1 * Math.sin(time * 0.002));

  // Kołysanie się korony na boki
  shapes.crown.angle = Math.PI * 0.03 * Math.sin(time * 0.001);

  shapes.orbital.angle -= 2.0 * dt;

  // --- Wiersz 3 ---
  shapes.starburst.angle += 0.4 * dt;
  shapes.pinwheel.angle -= 2.5 * dt; // Szybki obrót wiatraka
  shapes.chevron.angle = Math.sin(time * 0.002) * 0.2; // Lekkie przechyły pancerza
  shapes.atom.angle += 1.8 * dt; // Obrót orbity wokół jądra

  // Pędzące kreski HUD przesuwają się w czasie
  globalDashOffset += 45 * dt;
}

// ==========================================
// 6. RENDEROWANIE SCENY (RENDER LOOP)
// ==========================================

/**
 * Rysuje klatkę obrazu.
 * Wyczyści starą klatkę i wywołuje odpowiednie style dla wszystkich 12 figur.
 */
function render() {
  // Czyszczenie całego obszaru Canvas przed wyrenderowaniem nowej klatki
  ctx.clearRect(0, 0, width, height);

  // Wiersz 1
  drawVectorGlow(
    ctx,
    () =>
      pathCircle(ctx, shapes.circle.x, shapes.circle.y, shapes.circle.radius),
    shapes.circle.color,
    shapes.circle.pulse,
  );
  drawCyberDash(
    ctx,
    () =>
      pathTriangle(
        ctx,
        shapes.triangle.x,
        shapes.triangle.y,
        shapes.triangle.size,
        shapes.triangle.angle,
      ),
    shapes.triangle.color,
    globalDashOffset,
  );
  drawTechLine(
    ctx,
    () =>
      pathRect(
        ctx,
        shapes.rect.x,
        shapes.rect.y + shapes.rect.yOffset,
        shapes.rect.w,
        shapes.rect.h,
        shapes.rect.angle,
      ),
    shapes.rect.color,
  );
  drawVectorGlow(
    ctx,
    () =>
      pathSquareCross(
        ctx,
        shapes.cross.x,
        shapes.cross.y,
        shapes.cross.size,
        shapes.cross.angle,
      ),
    shapes.cross.color,
    shapes.cross.pulse,
  );

  // Wiersz 2
  drawCyberSolid(
    ctx,
    () =>
      pathPacmanCut(
        ctx,
        shapes.pacman.x,
        shapes.pacman.y,
        shapes.pacman.radius,
        shapes.pacman.angle,
        shapes.pacman.cutAngle,
      ),
    shapes.pacman.color,
    globalDashOffset,
  );
  drawVectorGlow(
    ctx,
    () =>
      pathCrescentMoon(
        ctx,
        shapes.moon.x,
        shapes.moon.y,
        shapes.moon.radius,
        shapes.moon.offset,
        shapes.moon.angle,
      ),
    shapes.moon.color,
    shapes.moon.pulse,
  );
  drawCyberSolid(
    ctx,
    () =>
      pathCrown(
        ctx,
        shapes.crown.x,
        shapes.crown.y,
        shapes.crown.w,
        shapes.crown.h,
        shapes.crown.angle,
      ),
    shapes.crown.color,
    globalDashOffset,
  );
  drawTechLine(
    ctx,
    () =>
      pathOrbital(
        ctx,
        shapes.orbital.x,
        shapes.orbital.y,
        shapes.orbital.centerR,
        shapes.orbital.orbitR,
        shapes.orbital.numPoints,
        shapes.orbital.angle,
      ),
    shapes.orbital.color,
  );

  // Wiersz 3
  drawVectorGlow(
    ctx,
    () =>
      pathStarBurst(
        ctx,
        shapes.starburst.x,
        shapes.starburst.y,
        shapes.starburst.innerR,
        shapes.starburst.outerR,
        shapes.starburst.rays,
        shapes.starburst.angle,
      ),
    shapes.starburst.color,
  );
  drawCyberDash(
    ctx,
    () =>
      pathPinwheel(
        ctx,
        shapes.pinwheel.x,
        shapes.pinwheel.y,
        shapes.pinwheel.size,
        shapes.pinwheel.angle,
      ),
    shapes.pinwheel.color,
    globalDashOffset,
  );
  drawTechLine(
    ctx,
    () =>
      pathChevronShield(
        ctx,
        shapes.chevron.x,
        shapes.chevron.y,
        shapes.chevron.w,
        shapes.chevron.h,
        shapes.chevron.layers,
        shapes.chevron.angle,
      ),
    shapes.chevron.color,
  );
  drawVectorGlow(
    ctx,
    () =>
      pathAtomRings(
        ctx,
        shapes.atom.x,
        shapes.atom.y,
        shapes.atom.radius,
        shapes.atom.angle,
      ),
    shapes.atom.color,
  );
}

// ==========================================
// 7. GŁÓWNA PĘTLI GRY (GAME LOOP Z DELTA TIME)
// ==========================================

// Przechowuje czas wyrenderowania poprzedniej klatki (w milisekundach)
let lastTime = performance.now();

/**
 * Główna pętla renderująca synchronizowana ze zleceniem odświeżania monitora (np. 60Hz / 144Hz)
 * @param {number} currentTime - Znacznik czasu przekazany automatycznie przez requestAnimationFrame
 */
function gameLoop(currentTime) {
  // Obliczamy różnicę czasu (delta time) w sekundach między obecną a poprzednią klatką
  // Dzielenie przez 1000 przelicza milisekundy na sekundy.
  // Math.min(..., 0.1) zabezpiecza pętlę przed zbyt dużym skokiem czasu, np. gdy przełączymy kartę w przeglądarce.
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  // 1. Aktualizacja logiki i pozycji obiektów
  update(dt, currentTime);

  // 2. Rysowanie obiektów na ekranie
  render();

  // 3. Prośba do przeglądarki o wywołanie kolejnego kroku pętli przed odświeżeniem ekranu
  requestAnimationFrame(gameLoop);
}

// Pierwsze, startowe wywołanie pętli gry
requestAnimationFrame(gameLoop);
