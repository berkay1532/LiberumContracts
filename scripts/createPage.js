const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // `HtmlPageFactory`
  const htmlPageFactoryAddress = "0xea2DC82269D187F2336B1B243B29D23eB9d62D59";

  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const HtmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Content
  const initialContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Pixel Hop</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        background-color: #f0f0f0;
        overflow: hidden;
        font-family: Arial, sans-serif;
      }
      .game-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(to top, #88c0d0, #eceff4);
        overflow: hidden;
      }
      .ground {
        position: absolute;
        bottom: 0;
        width: 200%;
        height: 100px;
        background: #3b4252;
        animation: groundMove 1.5s linear infinite;
      }
      @keyframes groundMove {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      .dino {
        position: absolute;
        bottom: 100px; /* Dinozorun ayaktayken alt seviyesi 100 px */
        left: 50px;
        width: 50px;
        height: 50px;
        background-color: #bf616a;
        border-radius: 10%;
      }
      .obstacle {
        position: absolute;
        width: 30px;
        height: 50px;
        background-color: #a3be8c;
        border-radius: 5px;
      }
      /* Aşağıdan gelen engeller */
      .obstacle.bottom {
        bottom: 100px; /* 100–150 px aralığında durur */
      }
      /* Yukarıdan gelen engeller */
      .obstacle.top {
        top: 430px; /* 180–230 px aralığında durur */
      }
      .score {
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: 24px;
        color: #2e3440;
      }
      .start-overlay {
        position: absolute;
        top: 20%;
        width: 100%;
        text-align: center;
        font-size: 28px;
        color: #2e3440;
        z-index: 10;
      }
    </style>
  </head>
  <body>
    <div class="game-container" tabindex="0">
      <div class="ground"></div>
      <div class="dino" id="dino"></div>
      <div class="score" id="score">0</div>
      <div class="start-overlay" id="startOverlay">Press Space to start</div>
    </div>
    <script>
      const dino = document.getElementById("dino");
      const gameContainer = document.querySelector(".game-container");
      const scoreElement = document.getElementById("score");
      const startOverlay = document.getElementById("startOverlay");

      let gameStarted = false;
      let isJumping = false;
      let dinoBottom = 100; // Dinozorun ayaktayken alt seviyesi
      let gameSpeed = 5;
      let obstacles = [];
      let score = 0;
      let gameOver = false;

      // Oyun hızını her 5 saniyede bir artır
      function increaseGameSpeed() {
        if (gameOver) return;
        gameSpeed += 0.5;
        setTimeout(increaseGameSpeed, 5000);
      }

      // Dinozor zıplama fonksiyonu
      function jump() {
        if (isJumping || gameOver) return;
        isJumping = true;
        let velocity = 20;
        function animateJump() {
          velocity -= 1;
          dinoBottom += velocity;
          if (dinoBottom <= 100) {
            dinoBottom = 100;
            dino.style.bottom = dinoBottom + "px";
            isJumping = false;
            return;
          }
          dino.style.bottom = dinoBottom + "px";
          requestAnimationFrame(animateJump);
        }
        requestAnimationFrame(animateJump);
      }

      // Engelleri rastgele aralıklarla oluşturma
      function createObstacle() {
        if (gameOver) return;
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
        // Rastgele üst veya alt engel
        const type = Math.random() < 0.5 ? "bottom" : "top";
        obstacle.classList.add(type);
        gameContainer.appendChild(obstacle);

        let obstacleLeft = gameContainer.offsetWidth;
        obstacle.style.left = obstacleLeft + "px";
        obstacles.push(obstacle);

        // 800ms - 2000ms arasında rastgele süre sonra yeni engel
        let randomTime = Math.random() * 1200 + 800;
        setTimeout(createObstacle, randomTime);
      }

      // Engelleri hareket ettirip çarpışmayı denetleme
      function moveObstacles() {
        obstacles.forEach((obstacle, index) => {
          let obstacleLeft = parseInt(obstacle.style.left);
          obstacleLeft -= gameSpeed;
          obstacle.style.left = obstacleLeft + "px";

          // Dinozorun yatay aralığı: 50..100 (width=50)
          // Engel width=30 => Engel x aralığı: obstacleLeft..(obstacleLeft+30)
          const horizontalCollision =
            obstacleLeft < 100 && obstacleLeft + 30 > 50;

          if (obstacle.classList.contains("bottom")) {
            // Alt engel: 100..150 aralığı
            // Dinozorun üstü 150 px'ten aşağıdaysa çarpışma
            if (horizontalCollision && dinoBottom < 150) {
              endGame();
            }
          } else if (obstacle.classList.contains("top")) {
            // Üst engel: 180..230 aralığı
            // Dinozorun üstü (dinoBottom + 50) 180'i aşıyorsa çarpışma
            if (horizontalCollision && dinoBottom + 50 > 180) {
              endGame();
            }
          }

          // Engel ekrandan çıkınca sil
          if (obstacleLeft < -30) {
            obstacles.splice(index, 1);
            obstacle.remove();
            score += 1;
            scoreElement.innerText = score;
          }
        });
      }

      function endGame() {
        gameOver = true;
        alert("Game Over! Score: " + score);
        window.location.reload();
      }

      // Oyun döngüsü
      function gameLoop() {
        if (gameOver) return;
        moveObstacles();
        requestAnimationFrame(gameLoop);
      }

      // Klavye kontrolü
      gameContainer.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
          // İlk Space ile oyunu başlat
          if (!gameStarted) {
            gameStarted = true;
            startOverlay.style.display = "none";
            createObstacle();
            increaseGameSpeed();
            requestAnimationFrame(gameLoop);
          }
          jump();
        }
      });

      // Mouse tıklayınca focus al
      gameContainer.addEventListener("click", () => {
        gameContainer.focus();
      });

      gameContainer.focus();
    </script>
  </body>
</html>
`;
  const name = "pixel-hop";
  console.log("📄 New page is deploying by contract..");

  // createPage func call
  const tx = await HtmlPageFactoryContract.createPage(initialContent, name);
  const receipt = await tx.wait();

  // Search event logs
  const event = receipt.logs.find(
    (log) => log.fragment?.name === "PageCreated"
  );

  if (event) {
    const newPageAddress = event.args[1]; // Take page address from event
    console.log(`✅ Yeni sayfa başarıyla oluşturuldu: ${newPageAddress}`);
  } else {
    console.log("⚠️ Page creation was successful but no event was found.");
  }
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
