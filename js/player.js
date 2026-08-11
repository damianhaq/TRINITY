class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 30;
    // this.characterClass = "warrior"; // warrior, mage, archer

    // this.hp = 100;
    // this.maxHp = 100;
    // this.level = 1;
    // this.exp = 0;
    // this.nextExp = 30;
    // this.kills = 0;
    // this.totalDamageDealt = 0;
    this.pulse = 1;

    this.stats = {
      moveSpeed: 4.5,
      damageMult: 1.0,
      cdMult: 1.0,
      magnetRadius: 130,
      critChance: 0.08,
    };

    // Dash
    // this.isDashing = false;
    // this.dashTimer = 0;
    // this.dashCD = 0;
    // this.maxDashCD = 120; // 2 seconds

    // this.invulnerableTimer = 0;
    // this.onLevelUpCallback = null;
    // this.onDeathCallback = null;
  }

  //   selectClass(className) {
  //     this.characterClass = className;
  //     weaponSystem.reset();

  //     if (className === "warrior") {
  //       this.maxHp = 140;
  //       this.stats.moveSpeed = 4.2;
  //       this.stats.damageMult = 1.1;
  //       this.stats.critChance = 0.05;
  //       weaponSystem.skills.blade.level = 1;
  //       weaponSystem.skills.orbs.level = 1;
  //     } else if (className === "mage") {
  //       this.maxHp = 90;
  //       this.stats.moveSpeed = 4.0;
  //       this.stats.damageMult = 1.35;
  //       this.stats.cdMult = 0.82; // -18% CD
  //       weaponSystem.skills.fireball.level = 1;
  //       weaponSystem.skills.frost.level = 1;
  //     } else if (className === "archer") {
  //       this.maxHp = 105;
  //       this.stats.moveSpeed = 5.2;
  //       this.stats.damageMult = 1.0;
  //       this.stats.critChance = 0.22;
  //       weaponSystem.skills.fireball.level = 1;
  //       weaponSystem.skills.lightning.level = 1;
  //     }

  //     this.hp = this.maxHp;
  //     this.level = 1;
  //     this.exp = 0;
  //     this.nextExp = 30;
  //     this.kills = 0;
  //     this.totalDamageDealt = 0;
  //   }

  //   gainExp(amount) {
  //     this.exp += amount;
  //     if (this.exp >= this.nextExp) {
  //       this.exp -= this.nextExp;
  //       this.level++;
  //       this.nextExp = Math.round(30 * Math.pow(this.level, 1.25));
  //       soundManager.play("levelup");
  //       particleEngine.spawnDamageText(this.x, this.y, "AWANS!", true);
  //       particleEngine.particles.push(
  //         new Particle(this.x, this.y, "#fbbf24", 0, 0, 15, 30, "ring"),
  //       );

  //       if (this.onLevelUpCallback) {
  //         this.onLevelUpCallback();
  //       }
  //     }
  //   }

  //   takeDamage(amount) {
  //     if (this.isDashing || this.invulnerableTimer > 0) return;

  //     this.hp -= amount;
  //     this.invulnerableTimer = 45; // iframe (~0.75s)
  //     soundManager.play("player_hurt");
  //     particleEngine.spawnDamageText(
  //       this.x,
  //       this.y,
  //       "-" + Math.ceil(amount) + " HP",
  //       false,
  //       false,
  //       "#f43f5e",
  //     );

  //     if (this.hp <= 0) {
  //       this.hp = 0;
  //       soundManager.play("gameover");
  //       if (this.onDeathCallback) {
  //         this.onDeathCallback();
  //       }
  //     }
  //   }

  //   dash() {
  //     if (this.dashCD <= 0 && !this.isDashing) {
  //       this.isDashing = true;
  //       this.dashTimer = 14;
  //       this.dashCD = this.maxDashCD;
  //       soundManager.play("dash");
  //       particleEngine.spawnDamageText(this.x, this.y, "UNIK!", false, true);
  //     }
  //   }

  update(keys, gameTime) {
    // console.log(gameTime);

    // if (this.invulnerableTimer > 0) this.invulnerableTimer--;
    // if (this.dashCD > 0) this.dashCD--;

    // Dash motion
    // if (this.isDashing) {
    //   this.dashTimer--;
    //   this.x += this.vx * 2.2;
    //   this.y += this.vy * 2.2;
    //   particleEngine.particles.push(
    //     new Particle(this.x, this.y, "#06b6d4", 0, 0, 8, 12, "circle"),
    //   );
    //   if (this.dashTimer <= 0) {
    //     this.isDashing = false;
    //   }
    //   return;
    // }

    // WASD Input Processing
    let moveX = 0;
    let moveY = 0;
    if (keys["KeyW"] || keys["ArrowUp"]) moveY -= 1;
    if (keys["KeyS"] || keys["ArrowDown"]) moveY += 1;
    if (keys["KeyA"] || keys["ArrowLeft"]) moveX -= 1;
    if (keys["KeyD"] || keys["ArrowRight"]) moveX += 1;

    // Normalize diagonal movement speed
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    const currentSpeed = this.stats.moveSpeed;
    this.vx = moveX * currentSpeed;
    this.vy = moveY * currentSpeed;

    this.x += this.vx;
    this.y += this.vy;

    this.pulse = 1 + Math.sin(gameTime * 4.5) * 0.3;
    this.pulse = gameTime * 30;
  }

  draw(ctx /*, camera, mousePos*/) {
    renderer.drawCyberDash(
      ctx,
      () => renderer.triangle(ctx, this.x, this.y, this.radius),
      "#3ccfe2",
      this.pulse,
    );
    // const screenX = this.x - camera.x;
    // const screenY = this.y - camera.y;
    // Dash Ghost trail
    // if (this.isDashing) {
    //   ctx.save();
    //   ctx.globalAlpha = 0.5;
    //   ctx.fillStyle = "#06b6d4";
    //   ctx.beginPath();
    //   ctx.arc(screenX, screenY, this.radius * 1.2, 0, Math.PI * 2);
    //   ctx.fill();
    //   ctx.restore();
    // }
    // Main Player Body
    // ctx.save();
    // if (this.invulnerableTimer % 4 >= 2) {
    //   ctx.globalAlpha = 0.4;
    // }
    // Class Color Glow
    // let mainColor = "#6366f1";
    // if (this.characterClass === "mage") mainColor = "#06b6d4";
    // if (this.characterClass === "archer") mainColor = "#10b981";
    // ctx.fillStyle = mainColor;
    // ctx.shadowColor = mainColor;
    // ctx.shadowBlur = 15;
    // ctx.beginPath();
    // ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // // Aim Indicator Line
    // const aimAngle = Math.atan2(mousePos.y - screenY, mousePos.x - screenX);
    // ctx.strokeStyle = "#ffffff";
    // ctx.lineWidth = 3;
    // ctx.beginPath();
    // ctx.moveTo(screenX, screenY);
    // ctx.lineTo(
    //   screenX + Math.cos(aimAngle) * (this.radius + 10),
    //   screenY + Math.sin(aimAngle) * (this.radius + 10),
    // );
    // ctx.stroke();
    // ctx.restore();
  }
}

const player = new Player();
