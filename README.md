# Aesthetic 2D Canvas Geometry & Vector Styles

Lekki, napisany w czystym JavaScript (Vanilla JS) silnik do renderowania i animowania geometrycznych kształtów 2D na HTML5 Canvas. Projekt prezentuje zaawansowane techniki rysowania czystych, ostrych linii wektorowych (efekty neonowe, cyber-dash, pancerze tech) z zachowaniem pełnej płynności i wsparcia dla wyświetlaczy o wysokiej rozdzielczości (High-DPI / Retina).

---

## 🚀 Kluczowe Funkcje

- **Czysty JavaScript (Zero Dependencies):** Kod działa bezpośrednio w przeglądarce bez użycia silników zewnętrznych czy bibliotek.
- **Ostrość High-DPI (Retina / 2K / 4K):** Automatyczna obsługa `window.devicePixelRatio`, eliminująca efekty rozmycia i pikselozy na nowoczesnych ekranach.
- **Wektorowe Efekty Linii (Bez wolnego `shadowBlur`):**
  - **Vector Glow:** Wielowarstwowy efekt neonu ze świetlnym, ostrym rdzeniem.
  - **Cyber Dash:** Animowane, przerywane linie HUD z pędzącym przesunięciem fazowym.
  - **Tech Line:** Podwójne linie techniczne z przeświecającą bazą.
  - **Cyber Solid:** Pełne białe wypełnienie połączone z dynamicznym obrysem.
- **Rozbudowana Geometria:** 12 autorskich kształtów renderowanych proceduralnie (m.in. struktura orbitalna, sierpy, gwiazdy, turbiny, pancerze szewronowe, pierścienie atomu).
- **Pętla Gry (Delta Time Engine):** Płynne animacje synchronizowane z `requestAnimationFrame`, niezależne od częstotliwości odświeżania monitora (FPS).

---

## 📁 Struktura Projektu

```text
.
├── index.html     # Główny plik HTML zawierający element <canvas>
├── style.css      # Stylizacja tła i osadzenie płótna na środku ekranu
└── main.js        # Główny skrypt JS: konfiguracja High-DPI, ścieżki figur, style linii, pętla gry
```
