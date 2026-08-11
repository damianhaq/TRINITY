export class VectorShapeRenderer {
  /**
   * @param {HTMLCanvasElement|string} canvas - Element canvas lub jego ID
   */
  constructor(canvas) {
    this.canvas =
      typeof canvas === "string" ? document.getElementById(canvas) : canvas;
    if (!this.canvas) {
      throw new Error("VectorShapeRenderer: Nie znaleziono elementu canvas.");
    }

    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    this.width = 0;
    this.height = 0;

    this.resize();
  }

  /**
   * Obsługa skalowania pod ekrany High-DPI (Retina / 2K / 4K)
   */
  resize() {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.width = rect.width || this.canvas.width || 800;
    this.height = rect.height || this.canvas.height || 600;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Czyszczenie obszaru roboczego
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // ==========================================
  // STYLE RENDEROWANIA LINII
  // ==========================================

  /**
   * Efekt neonu / poświaty
   */
  drawGlow(pathFn, color, pulse = 1) {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.12 * pulse;
    ctx.lineWidth = 18 * pulse;
    pathFn();
    ctx.stroke();

    ctx.globalAlpha = 0.35 * pulse;
    ctx.lineWidth = 8 * pulse;
    pathFn();
    ctx.stroke();

    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    pathFn();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Przerywany styl cyfrowy / HUD
   */
  drawCyberDash(pathFn, color, dashOffset = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 8]);
    ctx.lineDashOffset = -dashOffset;

    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 7;
    pathFn();
    ctx.stroke();

    ctx.globalAlpha = 1.0;
    ctx.lineWidth = 2;
    pathFn();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Styl podwójnej linii technicznej
   */
  drawTechLine(pathFn, color) {
    const ctx = this.ctx;
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
   * Białe wypełnienie z przerywaną poświatą
   */
  drawCyberSolid(pathFn, color, dashOffset = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.fillStyle = "#ffffff";

    ctx.setLineDash([12, 6]);
    ctx.lineDashOffset = -dashOffset;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 8;
    pathFn();
    ctx.stroke();

    ctx.globalAlpha = 1.0;
    pathFn();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // ==========================================
  // ŚCIEŻKI GEOMETRYCZNE (GENERATORY)
  // ==========================================

  circle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
  }

  triangle(x, y, size, angle = 0) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.866, size * 0.5);
    ctx.lineTo(-size * 0.866, size * 0.5);
    ctx.closePath();
    ctx.restore();
  }

  rect(x, y, w, h, angle = 0) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.rect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }

  squareCross(x, y, size, angle = 0) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.rect(-size * 1.5, -size / 2, size, size);
    ctx.rect(size / 2, -size / 2, size, size);
    ctx.rect(-size / 2, -size * 1.5, size, size);
    ctx.rect(-size / 2, size / 2, size, size);
    ctx.closePath();
    ctx.restore();
  }

  pacman(x, y, r, angle = 0, cutAngle = Math.PI * 0.3) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, cutAngle / 2, Math.PI * 2 - cutAngle / 2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.restore();
  }

  crescentMoon(x, y, outerR, innerR_offset_x, angle = 0) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.arc(0, 0, outerR, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(
      innerR_offset_x,
      0,
      outerR * 0.8,
      Math.PI * 1.5,
      Math.PI * 0.5,
      true,
    );
    ctx.closePath();
    ctx.restore();
  }

  crown(x, y, w, h, angle = 0) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.moveTo(-w / 2, h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(w / 2, -h / 2);
    ctx.lineTo(w / 4, -h);
    ctx.lineTo(0, -h / 2);
    ctx.lineTo(-w / 4, -h);
    ctx.lineTo(-w / 2, -h / 2);
    ctx.closePath();
    ctx.restore();
  }

  orbital(x, y, centerR, orbitR, numPoints, angle = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, centerR, 0, Math.PI * 2);
    ctx.closePath();

    for (let i = 0; i < numPoints; i++) {
      const pointAngle = (i / numPoints) * Math.PI * 2;
      const px = Math.cos(pointAngle) * orbitR;
      const py = Math.sin(pointAngle) * orbitR;
      ctx.moveTo(px, py);
      ctx.arc(px, py, orbitR * 0.15, 0, Math.PI * 2);
    }
    ctx.restore();
  }

  starBurst(x, y, innerR, outerR, raysCount = 8, angle = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, innerR, 0, Math.PI * 2);
    ctx.closePath();

    for (let i = 0; i < raysCount; i++) {
      const a = (i / raysCount) * Math.PI * 2;
      const baseW = 0.18;
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(a - baseW) * (innerR + 4),
        Math.sin(a - baseW) * (innerR + 4),
      );
      ctx.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
      ctx.lineTo(
        Math.cos(a + baseW) * (innerR + 4),
        Math.sin(a + baseW) * (innerR + 4),
      );
      ctx.closePath();
    }
    ctx.restore();
  }

  pinwheel(x, y, size, angle = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();

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

  chevronShield(x, y, w, h, layers = 3, angle = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    const step = h / layers;

    for (let i = 0; i < layers; i++) {
      const yOffset = -h / 2 + i * step;
      ctx.moveTo(-w / 2, yOffset + step * 0.6);
      ctx.lineTo(0, yOffset);
      ctx.lineTo(w / 2, yOffset + step * 0.6);
    }
    ctx.restore();
  }

  atomRings(x, y, radius, angle = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    ctx.closePath();

    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
    ctx.restore();

    ctx.save();
    ctx.rotate(-angle + Math.PI / 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
    ctx.restore();

    ctx.restore();
  }
}
