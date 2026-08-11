class Renderer {
  // ==========================================
  // STYLE RENDEROWANIA LINII
  // ==========================================

  /**
   * Efekt neonu / poświaty
   */
  drawGlow(ctx, pathFn, color, pulse = 1) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.save();
    ctx.filter = `blur(${4 * pulse}px)`; // Rozmycie gausowskie GPU
    ctx.strokeStyle = color;
    ctx.lineWidth = 6 * pulse;
    ctx.globalAlpha = 0.8;
    pathFn();
    ctx.stroke();
    ctx.restore();

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
  drawCyberDash(ctx, pathFn, color, dashOffset = 0) {
    ctx.save();
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    ctx.save();
    ctx.filter = `blur(${4}px)`; // Rozmycie gausowskie GPU
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 8]);
    ctx.lineDashOffset = -dashOffset;

    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 7;
    pathFn();
    ctx.stroke();
    ctx.restore();

    ctx.globalAlpha = 1.0;
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 8]);
    ctx.lineDashOffset = -dashOffset;
    ctx.strokeStyle = "#ffffff";
    pathFn();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Styl podwójnej linii technicznej
   */
  drawTechLine(ctx, pathFn, color) {
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
  drawCyberSolid(ctx, pathFn, color, dashOffset = 0) {
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

  circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }

  triangle(ctx, x, y, size, angle = 0) {
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

  rect(ctx, x, y, w, h, angle = 0) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.rect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }

  squareCross(ctx, x, y, size, angle = 0) {
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

  pacman(ctx, x, y, r, angle = 0, cutAngle = Math.PI * 0.3) {
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

  crescentMoon(ctx, x, y, outerR, innerR_offset_x, angle = 0) {
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

  crown(ctx, x, y, w, h, angle = 0) {
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

  orbital(ctx, x, y, centerR, orbitR, numPoints, angle = 0) {
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

  starBurst(ctx, x, y, innerR, outerR, raysCount = 8, angle = 0) {
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

  pinwheel(ctx, x, y, size, angle = 0) {
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

  chevronShield(ctx, x, y, w, h, layers = 3, angle = 0) {
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

  atomRings(ctx, x, y, radius, angle = 0) {
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

const renderer = new Renderer();
