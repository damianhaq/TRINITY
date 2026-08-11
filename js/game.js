class GameEngine {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // this.state = "MENU"; // MENU, PLAYING, LEVEL_UP, PAUSED, GAMEOVER
    this.gameTime = 0; // seconds
    this.lastFrameTime = performance.now();
    this.keys = {};
    this.mousePos = { x: 0, y: 0 };
    this.isMouseDown = false;
    // this.camera = { x: 0, y: 0 };

    // this.highScore = parseInt(localStorage.getItem('monster_slayer_highscore') || '0', 10);
    // this.activeUpgradesList = [];

    this.player = new Player();
    this.initEvents();
    this.resizeCanvas();
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height / 2;
  }

  initEvents() {
    window.addEventListener("resize", () => this.resizeCanvas());

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      // if (e.code === "Space" && this.state === "PLAYING") {
      //   player.dash();
      // }
      // if (
      //   (e.code === "KeyP" || e.code === "Escape") &&
      //   (this.state === "PLAYING" || this.state === "PAUSED")
      // ) {
      //   this.togglePause();
      // }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.isMouseDown = true;
        // if (this.state === "PLAYING") {
        //   weaponSystem.performPrimaryAttack(
        //     player,
        //     this.mousePos,
        //     this.camera,
        //     enemyManager.enemies,
        //   );
        // }
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    });

    // player.onLevelUpCallback = () => this.triggerLevelUpModal();
    // player.onDeathCallback = () => this.triggerGameOver();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // startGame(className) {
  //   // player.selectClass(className);
  //   enemyManager.reset();
  //   weaponSystem.reset();
  //   particleEngine.particles = [];
  //   particleEngine.floatingTexts = [];

  //   this.gameTime = 0;
  //   this.state = "PLAYING";

  //   // document.getElementById('main-menu').classList.add('hidden');
  //   // document.getElementById('game-over-modal').classList.add('hidden');
  //   // document.getElementById('level-up-modal').classList.add('hidden');
  //   // document.getElementById('pause-modal').classList.add('hidden');

  //   soundManager.ensureContext();
  //   this.updateHUD();
  // }

  // togglePause() {
  //   if (this.state === "PLAYING") {
  //     this.state = "PAUSED";
  //     //   document.getElementById('pause-modal').classList.remove('hidden');
  //   } else if (this.state === "PAUSED") {
  //     this.state = "PLAYING";
  //     //   document.getElementById('pause-modal').classList.add('hidden');
  //   }
  // }

  //   getUpgradeStats(opt) {
  //     const rows = [];
  //     const isNew = (opt.type === 'skill' && weaponSystem.skills[opt.id]?.level === 0);

  //     if (opt.type === 'skill') {
  //       const sk = weaponSystem.skills[opt.id];
  //       const lvl = sk.level;
  //       const nextLvl = lvl + 1;

  //       switch (opt.id) {
  //         case 'fireball': {
  //           const dmgNow = lvl > 0 ? (18 + lvl * 8) : 0;
  //           const dmgNext = 18 + nextLvl * 8;
  //           const shotsNow = Math.min(5, lvl);
  //           const shotsNext = Math.min(5, nextLvl);
  //           const cdNow = lvl > 0 ? Math.max(15, Math.round(60 * player.stats.cdMult)) : null;
  //           const cdNext = Math.max(15, Math.round(Math.max(15, 60 - nextLvl * 3) * player.stats.cdMult));
  //           const aoeNow = lvl > 0 ? (40 + lvl * 10) : 0;
  //           const aoeNext = 40 + nextLvl * 10;
  //           if (lvl > 0) rows.push({ label: 'Obrażenia', cur: dmgNow, next: dmgNext });
  //           else rows.push({ label: 'Obrażenia', cur: null, next: dmgNext });
  //           rows.push({ label: 'Liczba kul', cur: lvl > 0 ? shotsNow : null, next: shotsNext });
  //           rows.push({ label: 'Promień wybuchu', cur: lvl > 0 ? aoeNow + 'px' : null, next: aoeNext + 'px' });
  //           if (cdNow !== null) rows.push({ label: 'Cooldown', cur: (cdNow / 60).toFixed(1) + 's', next: (cdNext / 60).toFixed(1) + 's' });
  //           break;
  //         }
  //         case 'orbs': {
  //           const countNow = lvl > 0 ? (2 + lvl) : 0;
  //           const countNext = 2 + nextLvl;
  //           const dmgNow = lvl > 0 ? Math.round((12 + lvl * 6) * 0.2 * 100) / 100 : 0;
  //           const dmgNext = Math.round((12 + nextLvl * 6) * 0.2 * 100) / 100;
  //           const radNow = lvl > 0 ? (70 + lvl * 8) : 0;
  //           const radNext = 70 + nextLvl * 8;
  //           rows.push({ label: 'Liczba kul', cur: lvl > 0 ? countNow : null, next: countNext });
  //           rows.push({ label: 'Obrażenia/s', cur: lvl > 0 ? dmgNow : null, next: dmgNext });
  //           rows.push({ label: 'Promień orbity', cur: lvl > 0 ? radNow + 'px' : null, next: radNext + 'px' });
  //           break;
  //         }
  //         case 'lightning': {
  //           const dmgNow = lvl > 0 ? (25 + lvl * 12) : 0;
  //           const dmgNext = 25 + nextLvl * 12;
  //           const targNow = lvl > 0 ? (2 + lvl) : 0;
  //           const targNext = 2 + nextLvl;
  //           const cdNext = Math.max(25, Math.round(90 * player.stats.cdMult));
  //           rows.push({ label: 'Obrażenia', cur: lvl > 0 ? dmgNow : null, next: dmgNext });
  //           rows.push({ label: 'Maks. celów', cur: lvl > 0 ? targNow : null, next: targNext });
  //           rows.push({ label: 'Zasięg łańcucha', cur: lvl > 0 ? '250px' : null, next: '250px' });
  //           rows.push({ label: 'Cooldown', cur: lvl > 0 ? (cdNext / 60).toFixed(1) + 's' : null, next: (cdNext / 60).toFixed(1) + 's' });
  //           break;
  //         }
  //         case 'frost': {
  //           const dmgNow = lvl > 0 ? (15 + lvl * 8) : 0;
  //           const dmgNext = 15 + nextLvl * 8;
  //           const radNow = lvl > 0 ? (120 + lvl * 25) : 0;
  //           const radNext = 120 + nextLvl * 25;
  //           const cdNext = Math.max(40, Math.round(120 * player.stats.cdMult));
  //           rows.push({ label: 'Obrażenia nocy', cur: lvl > 0 ? dmgNow : null, next: dmgNext });
  //           rows.push({ label: 'Promień rażenia', cur: lvl > 0 ? radNow + 'px' : null, next: radNext + 'px' });
  //           rows.push({ label: 'Spowolnienie wroga', cur: '50%', next: '50%' });
  //           rows.push({ label: 'Cooldown', cur: lvl > 0 ? (cdNext / 60).toFixed(1) + 's' : null, next: (cdNext / 60).toFixed(1) + 's' });
  //           break;
  //         }
  //         case 'blade': {
  //           const dmgNow = lvl > 0 ? (20 + lvl * 10) : 0;
  //           const dmgNext = 20 + nextLvl * 10;
  //           const rangeNow = lvl > 0 ? (80 + lvl * 15) : 0;
  //           const rangeNext = 80 + nextLvl * 15;
  //           const kbNext = 15 + nextLvl * 5;
  //           const cdNext = Math.max(12, Math.round(40 * player.stats.cdMult));
  //           rows.push({ label: 'Obrażenia', cur: lvl > 0 ? dmgNow : null, next: dmgNext });
  //           rows.push({ label: 'Zasięg', cur: lvl > 0 ? rangeNow + 'px' : null, next: rangeNext + 'px' });
  //           rows.push({ label: 'Odrzut', cur: lvl > 0 ? (15 + lvl * 5) + 'px' : null, next: kbNext + 'px' });
  //           rows.push({ label: 'Cooldown', cur: lvl > 0 ? (cdNext / 60).toFixed(1) + 's' : null, next: (cdNext / 60).toFixed(1) + 's' });
  //           break;
  //         }
  //       }
  //     } else {
  //       switch (opt.id) {
  //         case 'stat_dmg':
  //           rows.push({ label: 'Mnożnik obrażeń', cur: (player.stats.damageMult * 100).toFixed(0) + '%', next: ((player.stats.damageMult + 0.15) * 100).toFixed(0) + '%' });
  //           break;
  //         case 'stat_speed':
  //           rows.push({ label: 'Prędkość ruchu', cur: player.stats.moveSpeed.toFixed(1), next: (player.stats.moveSpeed * 1.15).toFixed(1) });
  //           break;
  //         case 'stat_cd':
  //           rows.push({ label: 'Czas odnowienia', cur: (player.stats.cdMult * 100).toFixed(0) + '%', next: (player.stats.cdMult * 0.88 * 100).toFixed(0) + '%' });
  //           break;
  //         case 'stat_hp':
  //           rows.push({ label: 'Maks. HP', cur: player.maxHp, next: player.maxHp + 25 });
  //           rows.push({ label: 'Leczenie teraz', cur: '—', next: '+40 HP' });
  //           break;
  //         case 'stat_magnet':
  //           rows.push({ label: 'Zasięg magnetu', cur: Math.round(player.stats.magnetRadius) + 'px', next: Math.round(player.stats.magnetRadius * 1.5) + 'px' });
  //           break;
  //       }
  //     }
  //     return { rows, isNew };
  //   }

  //   triggerLevelUpModal() {
  //     this.state = 'LEVEL_UP';

  //     // Pick 3 random upgrade options, prioritise skills not yet maxed
  //     const options = [...weaponSystem.allUpgrades].filter(o => {
  //       if (o.type === 'skill') return weaponSystem.skills[o.id]?.level < weaponSystem.skills[o.id]?.maxLevel;
  //       return true;
  //     });
  //     for (let i = options.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [options[i], options[j]] = [options[j], options[i]];
  //     }
  //     const selectedOptions = options.slice(0, 3);
  //     this.activeUpgradesList = selectedOptions;

  //     const cardsGrid = document.getElementById('upgrade-cards-grid');
  //     cardsGrid.innerHTML = '';

  //     selectedOptions.forEach(opt => {
  //       const card = document.createElement('div');
  //       card.className = 'upgrade-card';

  //       const { rows, isNew } = this.getUpgradeStats(opt);
  //       const sk = opt.type === 'skill' ? weaponSystem.skills[opt.id] : null;
  //       const maxLvl = sk ? sk.maxLevel : 0;
  //       const curLvl = sk ? sk.level : 0;
  //       const nextLvl = curLvl + 1;

  //       // Level pips
  //       let pipsHtml = '';
  //       if (sk) {
  //         pipsHtml = '<div class="level-pips">';
  //         for (let i = 0; i < maxLvl; i++) {
  //           pipsHtml += `<div class="pip ${i < nextLvl ? 'filled' : ''}"></div>`;
  //         }
  //         pipsHtml += '</div>';
  //       }

  //       // Badge
  //       const badge = isNew
  //         ? '<span class="badge-new">NOWY</span>'
  //         : (sk ? `<span class="level-badge-small">Lvl ${nextLvl}</span>` : '');

  //       // Stat rows HTML
  //       const statsHtml = rows.map(r => {
  //         if (r.cur === null) {
  //           return `<div class="stat-row">
  //             <span class="stat-label">${r.label}:</span>
  //             <span class="stat-new">${r.next}</span>
  //           </div>`;
  //         }
  //         return `<div class="stat-row">
  //           <span class="stat-label">${r.label}:</span>
  //           <span class="stat-current">${r.cur}</span>
  //           <span class="stat-arrow">→</span>
  //           <span class="stat-next">${r.next}</span>
  //         </div>`;
  //       }).join('');

  //       card.innerHTML = `
  //         <div class="upgrade-icon">${opt.icon}</div>
  //         <div class="upgrade-details">
  //           <h4>${opt.name} ${badge}</h4>
  //           <div class="desc">${opt.desc}</div>
  //           <div class="upgrade-stats">${statsHtml}</div>
  //           ${pipsHtml}
  //         </div>
  //       `;

  //       card.onclick = () => this.applyUpgrade(opt);
  //       cardsGrid.appendChild(card);
  //     });

  //     document.getElementById('level-up-modal').classList.remove('hidden');
  //   }

  //   applyUpgrade(opt) {
  //     if (opt.type === 'skill') {
  //       const sk = weaponSystem.skills[opt.id];
  //       if (sk && sk.level < sk.maxLevel) {
  //         sk.level++;
  //       }
  //     } else if (opt.type === 'stat') {
  //       switch (opt.id) {
  //         case 'stat_dmg': player.stats.damageMult += 0.15; break;
  //         case 'stat_speed': player.stats.moveSpeed *= 1.15; break;
  //         case 'stat_cd': player.stats.cdMult *= 0.88; break;
  //         case 'stat_hp':
  //           player.maxHp += 25;
  //           player.hp = Math.min(player.maxHp, player.hp + 40);
  //           break;
  //         case 'stat_magnet': player.stats.magnetRadius *= 1.5; break;
  //       }
  //     }

  //     document.getElementById('level-up-modal').classList.add('hidden');
  //     player.invulnerableTimer = 60; // 1 sec protection after level up selection
  //     this.state = 'PLAYING';
  //     this.updateSkillListHUD();
  //   }

  //   triggerGameOver() {
  //     this.state = 'GAMEOVER';

  //     const survivedSecs = Math.floor(this.gameTime);
  //     const mins = Math.floor(survivedSecs / 60);
  //     const secs = survivedSecs % 60;
  //     const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  //     if (player.kills > this.highScore) {
  //       this.highScore = player.kills;
  //       localStorage.setItem('monster_slayer_highscore', this.highScore.toString());
  //     }

  //     document.getElementById('final-time').textContent = timeStr;
  //     document.getElementById('final-kills').textContent = player.kills.toString();
  //     document.getElementById('final-level').textContent = player.level.toString();
  //     document.getElementById('high-score').textContent = this.highScore.toString();

  //     document.getElementById('game-over-modal').classList.remove('hidden');
  //   }

  update(dt) {
    //   if (this.state !== "PLAYING") return;

    this.gameTime += dt;
    // console.log(this.gameTime);

    // 1. Update Player
    this.player.update(this.keys, this.gameTime);

    //   // Continuous attack while holding Left Mouse Button
    //   if (this.isMouseDown) {
    //     weaponSystem.performPrimaryAttack(
    //       player,
    //       this.mousePos,
    //       this.camera,
    //       enemyManager.enemies,
    //     );
    //   }

    //   // 2. Camera Smooth Track
    //   this.camera.x += (player.x - this.canvas.width / 2 - this.camera.x) * 0.1;
    //   this.camera.y += (player.y - this.canvas.height / 2 - this.camera.y) * 0.1;

    //   // 3. Update Weapons & Enemies
    //   weaponSystem.update(
    //     player,
    //     enemyManager.enemies,
    //     this.mousePos,
    //     this.camera,
    //   );
    //   enemyManager.update(
    //     player,
    //     this.gameTime,
    //     this.canvas.width,
    //     this.canvas.height,
    //   );
    //   particleEngine.update();

    //   // 4. Update HUD
    //   this.updateHUD();
  }

  // updateHUD() {
  //   // HP Bar
  //   // const hpPct = Math.max(0, (player.hp / player.maxHp) * 100);
  //   // document.getElementById('hp-bar-fill').style.width = `${hpPct}%`;
  //   // document.getElementById('hp-bar-text').textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
  //   // EXP Bar
  //   // const expPct = Math.max(0, (player.exp / player.nextExp) * 100);
  //   // document.getElementById('exp-bar-fill').style.width = `${expPct}%`;
  //   // document.getElementById('exp-bar-text').textContent = `${Math.ceil(player.exp)} / ${player.nextExp}`;
  //   // document.getElementById('player-level-badge').textContent = `Lvl ${player.level}`;
  //   // Timer & Kills
  //   // const secs = Math.floor(this.gameTime);
  //   // const m = Math.floor(secs / 60).toString().padStart(2, '0');
  //   // const s = (secs % 60).toString().padStart(2, '0');
  //   // document.getElementById('hud-timer').textContent = `${m}:${s}`;
  //   // document.getElementById('hud-kills').textContent = player.kills.toString();
  //   // Dash Cooldown Status
  //   // const dashKey = document.getElementById('hud-dash-key');
  //   // if (player.dashCD <= 0) {
  //   //   dashKey.style.opacity = '1';
  //   //   dashKey.textContent = 'SPACJA (GOTOWY)';
  //   // } else {
  //   //   dashKey.style.opacity = '0.5';
  //   //   const cdSecs = (player.dashCD / 60).toFixed(1);
  //   //   dashKey.textContent = `SPACJA (${cdSecs}s)`;
  //   // }
  //   // Boss HP Bar
  //   // const bossContainer = document.getElementById('boss-hp-container');
  //   // const bossHpFill = document.getElementById('boss-hp-fill');
  //   // const bossHpText = document.getElementById('boss-hp-text');
  //   // const activeBoss = enemyManager.enemies.find(e => e.isBoss && e.alive);
  //   // if (activeBoss) {
  //   //   bossContainer.classList.remove('hidden');
  //   //   bossContainer.style.display = 'flex';
  //   //   const bossPct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
  //   //   bossHpFill.style.width = `${bossPct}%`;
  //   //   bossHpText.textContent = `${Math.round(bossPct)}%`;
  //   //   // Color shifts red as boss HP drops
  //   //   if (bossPct < 25) {
  //   //     bossHpFill.style.background = 'linear-gradient(90deg, #7f1d1d, #f43f5e)';
  //   //   } else if (bossPct < 50) {
  //   //     bossHpFill.style.background = 'linear-gradient(90deg, #dc2626, #fb923c)';
  //   //   } else {
  //   //     bossHpFill.style.background = 'linear-gradient(90deg, #dc2626, #fbbf24)';
  //   //   }
  //   // } else {
  //   //   bossContainer.classList.add('hidden');
  //   //   bossContainer.style.display = 'none';
  //   // }
  // }

  //   updateSkillListHUD() {
  //     const skillsListEl = document.getElementById('hud-skills-list');
  //     skillsListEl.innerHTML = '';
  //     for (let k in weaponSystem.skills) {
  //       const sk = weaponSystem.skills[k];
  //       if (sk.level > 0) {
  //         const slot = document.createElement('div');
  //         slot.className = 'skill-slot';
  //         slot.innerHTML = `${sk.icon} <span class="skill-level">${sk.level}</span>`;
  //         skillsListEl.appendChild(slot);
  //       }
  //     }
  //   }

  draw() {
    // Clear screen
    this.ctx.fillStyle = "#080b12";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Map Grid Background
    // this.drawBackgroundGrid();

    // Draw Game Entities
    // weaponSystem.drawOrbs(this.ctx, player, this.camera);
    // enemyManager.draw(this.ctx, this.camera);
    // weaponSystem.drawProjectiles(this.ctx, this.camera);
    this.player.draw(this.ctx /*, this.camera, this.mousePos*/);
    // particleEngine.draw(this.ctx, this.camera);

    // Hurt screen flash
    // if (player.invulnerableTimer > 30) {
    //   this.ctx.save();
    //   this.ctx.fillStyle = "rgba(244, 63, 94, 0.18)";
    //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //   this.ctx.restore();
    // }

    // Draw Minimap
    // this.drawMinimap();

    // Draw Aim Crosshair Reticle
    // this.drawCrosshair();
  }

  //   drawCrosshair() {
  //     const ctx = this.ctx;
  //     const x = this.mousePos.x;
  //     const y = this.mousePos.y;

  //     // Draw Warrior Melee Range Preview Cone
  //     if (player.characterClass === 'warrior') {
  //       const playerScreenX = player.x - this.camera.x;
  //       const playerScreenY = player.y - this.camera.y;
  //       const aimAngle = Math.atan2(y - playerScreenY, x - playerScreenX);
  //       const range = 115;
  //       const arc = 1.4;

  //       ctx.save();
  //       ctx.fillStyle = 'rgba(244, 63, 94, 0.06)';
  //       ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
  //       ctx.setLineDash([4, 4]);
  //       ctx.lineWidth = 1.5;
  //       ctx.beginPath();
  //       ctx.moveTo(playerScreenX, playerScreenY);
  //       ctx.arc(playerScreenX, playerScreenY, range, aimAngle - arc / 2, aimAngle + arc / 2);
  //       ctx.closePath();
  //       ctx.fill();
  //       ctx.stroke();
  //       ctx.restore();
  //     }

  //     ctx.save();
  //     ctx.strokeStyle = this.isMouseDown ? '#f43f5e' : '#06b6d4';
  //     ctx.lineWidth = 2;
  //     ctx.shadowColor = ctx.strokeStyle;
  //     ctx.shadowBlur = 8;

  //     ctx.beginPath();
  //     ctx.arc(x, y, 8, 0, Math.PI * 2);
  //     ctx.moveTo(x - 14, y); ctx.lineTo(x - 4, y);
  //     ctx.moveTo(x + 4, y); ctx.lineTo(x + 14, y);
  //     ctx.moveTo(x, y - 14); ctx.lineTo(x, y - 4);
  //     ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 14);
  //     ctx.stroke();
  //     ctx.restore();
  //   }

  // drawBackgroundGrid() {
  //   const ctx = this.ctx;
  //   const gridSize = 100;
  //   const startX = -(this.camera.x % gridSize);
  //   const startY = -(this.camera.y % gridSize);

  //   ctx.save();
  //   ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
  //   ctx.lineWidth = 1;

  //   for (let x = startX; x < this.canvas.width; x += gridSize) {
  //     ctx.beginPath();
  //     ctx.moveTo(x, 0);
  //     ctx.lineTo(x, this.canvas.height);
  //     ctx.stroke();
  //   }
  //   for (let y = startY; y < this.canvas.height; y += gridSize) {
  //     ctx.beginPath();
  //     ctx.moveTo(0, y);
  //     ctx.lineTo(this.canvas.width, y);
  //     ctx.stroke();
  //   }
  //   ctx.restore();
  // }

  //   drawMinimap() {
  //     if (!this.minimapCtx) return;
  //     const mctx = this.minimapCtx;
  //     const mw = this.minimapCanvas.width;
  //     const mh = this.minimapCanvas.height;
  //     const scale = 0.05; // map zoom factor

  //     mctx.clearRect(0, 0, mw, mh);

  //     // Draw center cross
  //     mctx.strokeStyle = 'rgba(255,255,255,0.08)';
  //     mctx.beginPath();
  //     mctx.moveTo(mw / 2, 0); mctx.lineTo(mw / 2, mh);
  //     mctx.moveTo(0, mh / 2); mctx.lineTo(mw, mh / 2);
  //     mctx.stroke();

  //     // Player (Green dot)
  //     mctx.fillStyle = '#10b981';
  //     mctx.beginPath();
  //     mctx.arc(mw / 2, mh / 2, 3, 0, Math.PI * 2);
  //     mctx.fill();

  //     // Enemies (Red dots / Gold Boss)
  //     for (const enemy of enemyManager.enemies) {
  //       if (!enemy.alive) continue;
  //       const relX = (enemy.x - player.x) * scale + mw / 2;
  //       const relY = (enemy.y - player.y) * scale + mh / 2;

  //       if (relX >= 0 && relX <= mw && relY >= 0 && relY <= mh) {
  //         mctx.fillStyle = enemy.isBoss ? '#fbbf24' : '#f43f5e';
  //         const r = enemy.isBoss ? 4 : 1.5;
  //         mctx.beginPath();
  //         mctx.arc(relX, relY, r, 0, Math.PI * 2);
  //         mctx.fill();
  //       }
  //     }
  //   }

  loop(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastFrameTime) / 1000);
    this.lastFrameTime = currentTime;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  run() {
    requestAnimationFrame((t) => this.loop(t));
  }
}

let gameEngine;
window.addEventListener("DOMContentLoaded", () => {
  gameEngine = new GameEngine();
  gameEngine.run();
});
