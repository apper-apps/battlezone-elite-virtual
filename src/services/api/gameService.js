import weaponData from "@/services/mockData/weapons.json";
import { toast } from "react-toastify";
import { Vector3, calculateDistance3D } from "@/utils/gameUtils";
import audioService from "@/services/audioService";

class GameService {
  constructor() {
    this.gameState = null;
    this.enemies = [];
    this.bullets = [];
    this.pickups = [];
    this.gameStartTime = null;
  }

  async initializeGame() {
    // Add realistic loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const weapons = weaponData.slice(0, 4); // Get first 4 weapons
    
// Initialize player with 3D position
    const player = {
      Id: 1,
      position: new Vector3(0, 0, 20), // x, y, z - start in center, elevated
      health: 100,
      armor: 0,
      weapons: weapons,
      currentWeapon: weapons[0],
      currentAmmo: weapons[0].clipSize,
      maxAmmo: weapons[0].clipSize,
      alive: true,
      kills: 0,
      damage: 0,
      rotation: { x: 0, y: 0, z: 0 } // For 3D orientation
    };
    // Initialize enemies
    this.enemies = this.generateEnemies(8);
    
    // Initialize zone
    const zone = {
      center: { x: 400, y: 300 },
      radius: 250,
      shrinkTime: 180000, // 3 minutes
      damage: 5
    };
    
    // Initialize pickups
    this.pickups = this.generatePickups(10);
    
    // Initialize bullets array
    this.bullets = [];
    
    this.gameStartTime = Date.now();
    
    this.gameState = {
      player,
      enemies: this.enemies,
      zone,
      bullets: this.bullets,
      pickups: this.pickups,
      match: {
        players: [player, ...this.enemies],
        duration: 0
      },
      gameOver: false,
      newKills: []
    };
    
    return this.gameState;
  }

generateEnemies(count) {
    const enemies = [];
    for (let i = 0; i < count; i++) {
      enemies.push({
        Id: i + 2,
        position: new Vector3(
          Math.random() * 600 - 300, // -300 to 300
          Math.random() * 400 - 200, // -200 to 200
          Math.random() * 20 + 10     // 10 to 30 height
        ),
        health: 100,
        armor: Math.random() * 50,
        weapons: [weaponData[Math.floor(Math.random() * weaponData.length)]],
        alive: true,
        lastMoveTime: Date.now(),
        target: null,
        lastShotTime: 0,
        rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 }
      });
    }
    return enemies;
  }

  generatePickups(count) {
    const pickups = [];
    const types = ['health', 'armor', 'ammo'];
    
for (let i = 0; i < count; i++) {
      pickups.push({
        Id: i + 1,
        type: types[Math.floor(Math.random() * types.length)],
        position: new Vector3(
          Math.random() * 700 - 350,  // -350 to 350
          Math.random() * 500 - 250,  // -250 to 250
          5                           // Ground level
        ),
        value: Math.random() * 50 + 25
      });
    }
    return pickups;
  }

  async updateGame(currentState) {
    await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
    
    if (!currentState) return currentState;
    
    const now = Date.now();
    const deltaTime = 16; // 16ms for 60fps
    
    // Update match duration
    currentState.match.duration = now - this.gameStartTime;
    
    // Update zone
    this.updateZone(currentState, deltaTime);
    
    // Update AI enemies
    this.updateEnemies(currentState, deltaTime);
    
    // Update bullets
    this.updateBullets(currentState, deltaTime);
    
    // Check collisions
    this.checkCollisions(currentState);
    
    // Check pickups
    this.checkPickups(currentState);
    
    // Check game over conditions
    this.checkGameOver(currentState);
    
    return { ...currentState };
  }

updateZone(gameState, deltaTime) {
    const zone = gameState.zone;
    zone.shrinkTime -= deltaTime;
    
    if (zone.shrinkTime <= 0) {
      zone.radius = Math.max(50, zone.radius - 0.5);
      zone.shrinkTime = 5000; // Reset shrink timer
    }
    
    // Damage players outside zone (use 2D distance for compatibility)
    const player = gameState.player;
    if (player.alive) {
      const distance = Math.sqrt(
        Math.pow((player.position.x || 0) - zone.center.x, 2) +
        Math.pow((player.position.y || 0) - zone.center.y, 2)
      );
      
      if (distance > zone.radius) {
        player.health -= zone.damage * (deltaTime / 1000);
        if (player.health <= 0) {
          player.alive = false;
          toast.error("You died in the zone!");
        }
      }
    }
  }

  updateEnemies(gameState, deltaTime) {
    const now = Date.now();
    const aliveEnemies = this.enemies.filter(enemy => enemy.alive);
    
    aliveEnemies.forEach(enemy => {
      // Simple AI movement
      if (now - enemy.lastMoveTime > 1000) {
        const moveX = (Math.random() - 0.5) * 60;
        const moveY = (Math.random() - 0.5) * 60;
        
        enemy.position.x = Math.max(50, Math.min(750, enemy.position.x + moveX));
        enemy.position.y = Math.max(50, Math.min(550, enemy.position.y + moveY));
        enemy.lastMoveTime = now;
      }
      
      // AI shooting
      if (now - enemy.lastShotTime > 2000) {
        const player = gameState.player;
        if (player.alive) {
          const distance = Math.sqrt(
            Math.pow(player.position.x - enemy.position.x, 2) +
            Math.pow(player.position.y - enemy.position.y, 2)
          );
          
          if (distance < 150) {
            this.enemyShoot(enemy, player.position);
            enemy.lastShotTime = now;
          }
        }
      }
      
      // Zone damage for enemies
      const zone = gameState.zone;
      const distance = Math.sqrt(
        Math.pow(enemy.position.x - zone.center.x, 2) +
        Math.pow(enemy.position.y - zone.center.y, 2)
      );
      
      if (distance > zone.radius) {
        enemy.health -= zone.damage * (deltaTime / 1000);
        if (enemy.health <= 0) {
          enemy.alive = false;
        }
      }
    });
  }

  enemyShoot(enemy, targetPosition) {
    const angle = Math.atan2(
      targetPosition.y - enemy.position.y,
      targetPosition.x - enemy.position.x
    );
    
    // Add some inaccuracy
    const inaccuracy = (Math.random() - 0.5) * 0.5;
    const finalAngle = angle + inaccuracy;
    
    this.bullets.push({
      position: { ...enemy.position },
      velocity: {
        x: Math.cos(finalAngle) * 8,
        y: Math.sin(finalAngle) * 8
      },
      owner: enemy.Id,
      damage: 25,
      range: 200
    });
  }

updateBullets(gameState, deltaTime) {
    this.bullets = this.bullets.filter(bullet => {
      // Update 3D bullet position
      const velocity = bullet.velocity;
      bullet.position = bullet.position.add(velocity.multiply(deltaTime / 1000));
      
      const speed = velocity.magnitude();
      bullet.range -= speed * (deltaTime / 1000);
      
      // Remove bullets that are out of bounds or out of range
      const pos = bullet.position;
      return pos.x > -400 && pos.x < 400 &&
             pos.y > -300 && pos.y < 300 &&
             pos.z > 0 && pos.z < 100 &&
             bullet.range > 0;
    });
    
    gameState.bullets = this.bullets;
  }

  checkCollisions(gameState) {
    const player = gameState.player;
    
    this.bullets.forEach((bullet, bulletIndex) => {
      // Check player hit
      if (bullet.owner !== player.Id && player.alive) {
        const distance = Math.sqrt(
          Math.pow(player.position.x - bullet.position.x, 2) +
          Math.pow(player.position.y - bullet.position.y, 2)
        );
        
        if (distance < 15) {
          let damage = bullet.damage;
          
          if (player.armor > 0) {
            const armorAbsorb = Math.min(player.armor, damage * 0.7);
            player.armor -= armorAbsorb;
            damage -= armorAbsorb;
          }
          
          player.health -= damage;
          
          if (player.health <= 0) {
            player.alive = false;
            toast.error("You were eliminated!");
          }
          
          this.bullets.splice(bulletIndex, 1);
        }
      }
      
      // Check enemy hits
      this.enemies.forEach(enemy => {
        if (bullet.owner === player.Id && enemy.alive) {
          const distance = Math.sqrt(
            Math.pow(enemy.position.x - bullet.position.x, 2) +
            Math.pow(enemy.position.y - bullet.position.y, 2)
          );
          
          if (distance < 15) {
            enemy.health -= bullet.damage;
            
            if (enemy.health <= 0) {
              enemy.alive = false;
              player.kills++;
              player.damage += bullet.damage;
              
              gameState.newKills = gameState.newKills || [];
              gameState.newKills.push({
                killer: "You",
                victim: `Enemy ${enemy.Id}`,
                weapon: player.currentWeapon?.type || "Unknown"
              });
              
              toast.success(`Enemy eliminated! (+${bullet.damage} damage)`);
            }
            
            this.bullets.splice(bulletIndex, 1);
          }
        }
      });
    });
  }

  checkPickups(gameState) {
    const player = gameState.player;
    
    this.pickups.forEach((pickup, index) => {
      const distance = Math.sqrt(
        Math.pow(player.position.x - pickup.position.x, 2) +
        Math.pow(player.position.y - pickup.position.y, 2)
      );
      
      if (distance < 20) {
        switch (pickup.type) {
          case 'health':
            player.health = Math.min(100, player.health + pickup.value);
            toast.success(`+${Math.floor(pickup.value)} Health`);
            break;
          case 'armor':
            player.armor = Math.min(100, player.armor + pickup.value);
            toast.success(`+${Math.floor(pickup.value)} Armor`);
            break;
          case 'ammo':
            player.currentAmmo = Math.min(player.maxAmmo, player.currentAmmo + 30);
            toast.success("+30 Ammo");
            break;
        }
        
        this.pickups.splice(index, 1);
      }
    });
    
    gameState.pickups = this.pickups;
  }

  checkGameOver(gameState) {
    const aliveEnemies = this.enemies.filter(enemy => enemy.alive).length;
    const player = gameState.player;
    
    if (!player.alive) {
      gameState.gameOver = true;
      gameState.placement = aliveEnemies + 1;
      gameState.totalPlayers = 10;
    } else if (aliveEnemies === 0) {
      gameState.gameOver = true;
      gameState.placement = 1;
      gameState.totalPlayers = 10;
      toast.success("Victory! You are the last one standing!");
    }
  }

async movePlayer(gameState, dx, dy, dz = 0) {
    const player = gameState.player;
    if (!player.alive) return gameState;
    
    // Store old position for audio detection
    const oldPosition = player.position.clone ? player.position.clone() : new Vector3(player.position.x, player.position.y, player.position.z);
    
    // Update 3D position with bounds checking
    const newX = Math.max(-375, Math.min(375, (player.position.x || 0) + dx));
    const newY = Math.max(-275, Math.min(275, (player.position.y || 0) + dy));
    const newZ = Math.max(10, Math.min(50, (player.position.z || 20) + dz));
    
    player.position = new Vector3(newX, newY, newZ);
    
    return gameState;
  }

async shootWeapon(gameState, targetX, targetY, targetZ = 0) {
    const player = gameState.player;
    if (!player.alive || player.currentAmmo <= 0) return gameState;
    
    // Calculate 3D shooting direction
    const playerPos = player.position;
    const direction = new Vector3(
      targetX - playerPos.x,
      targetY - playerPos.y,
      targetZ - playerPos.z
    ).normalize();
    
    const weapon = player.currentWeapon;
    const speed = 120; // Faster for 3D
    
    this.bullets.push({
      position: playerPos.clone ? playerPos.clone() : new Vector3(playerPos.x, playerPos.y, playerPos.z),
      velocity: direction.multiply(speed),
      owner: player.Id,
      damage: weapon.damage,
      range: weapon.range,
      startTime: Date.now()
    });
    
    player.currentAmmo--;
    
    // Auto-reload when empty
    if (player.currentAmmo <= 0) {
      setTimeout(() => {
        player.currentAmmo = weapon.clipSize;
        audioService.playSound('reload', 0.5);
        toast.info('Reloaded!');
      }, 1500);
    }
    
    return gameState;
  }

  async selectWeapon(gameState, weapon) {
    const player = gameState.player;
    if (!player.alive) return gameState;
    
    player.currentWeapon = weapon;
    player.maxAmmo = weapon.clipSize;
    
    return gameState;
  }
}

export default new GameService();