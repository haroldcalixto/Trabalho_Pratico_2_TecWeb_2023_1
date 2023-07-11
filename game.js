/*
    Trabalho Prático 2 - HTML/CSS/JS - 11/07/2023;
    Disciplina: Tecnologias Web;
    Professor: Fischer Ferreira;
    Semestre: 2023.1;

    Equipe:
    Aluno: Harold Calixto de Albuquerque - Matrícula: 499735;
    Aluno: Alexandre Gomes Camelo - Matrícula: 504315;
    Aluno: Joaquim Walisson Portela de Sousa - Matrícula: 472152;

    Projeto: Desenvolvimento do Jogo Racer Rush - Jogo de Corrida;
*/

// Declaração e inicialização várias variáveis para controlar os estados do jogo.
const player = document.getElementById('player');
let playerLeft = 175;
let opponents = [];
let pontos = 0;
let isGameOver = false;
let createOpponentInterval;
let velocidade = 2;
let vidas = 5;
let cenas = ['../imagens/nova-pista-dia.png', '../imagens/nova-pista-noite.png', '../imagens/nova-pista-neve.png', '../imagens/nova-pista-cerracao.png'];

// Função responsável por criar uma animação de movimento do plano de fundo do jogo.
function background() {
  const container = document.getElementById('game-container');
  let position = 0;
  let frameCount = 0;

  function updateBackground() {
    if (frameCount % 5 === 0) {
      position += velocidade * 5;
      container.style.backgroundPositionY = position + 'px';
    }

    frameCount++;

    if (!isGameOver) {
      requestAnimationFrame(updateBackground);
    }
  } 

  updateBackground();
}

// Função responsável por alterar os cenários escolhidos.
function cenario(int){
  let cenarioEscolhido = cenas[int];
  let gameContainer = document.getElementById('game-container');
  gameContainer.style.backgroundImage = 'url('+cenarioEscolhido+')';
}

// Função responsável por monitorar os eventos para capturar as teclas pressionadas pelo usuário.
document.addEventListener('keydown', function(event) {
  if (!isGameOver) {
    if (event.key === 'ArrowLeft') {
      isMovingLeft = true;
      Esquerda();
    } else if (event.key === 'ArrowRight') {
      isMovingRight = true;
      Direita();
    }
  }
});

// Função responsável por monitorar os eventos para capturar as teclas pressionadas pelo usuário.
document.addEventListener('keyup', function(event) {
  if (!isGameOver) {
    if (event.key === 'ArrowLeft') {
      isMovingLeft = false;
    } else if (event.key === 'ArrowRight') {
      isMovingRight = false;
    }
  }
});

let isMovingLeft = false;
let isMovingRight = false;

// Função responsável por mover o jogador para a esquerda.
function Esquerda() {
  if (playerLeft > 100) {
    playerLeft -= 5; // Ajuste o valor para uma movimentação mais suave.
    player.style.left = playerLeft + 'px';
  }
  if (isMovingLeft) {
    requestAnimationFrame(Esquerda);
  }
}

// Função responsável por mover o jogador para a direita.
function Direita() {
  if (playerLeft < 450) {
    playerLeft += 5; // Ajuste o valor para uma movimentação mais suave.
    player.style.left = playerLeft + 'px';
  }
  if (isMovingRight) {
    requestAnimationFrame(Direita);
  }
}

// Função responsável por criar um novo oponente no jogo.
function criarOponente() {
  const opponent = document.createElement('div');
  opponent.classList.add('carro-oponente');
  opponent.style.left = 100 + Math.random() * 350 + 'px';
  document.getElementById('game-container').appendChild(opponent);
  opponents.push(opponent);
}

// Função responsável por mover um novo oponente no jogo.
function moverOponente() {
  for (let i = 0; i < opponents.length; i++) {
    let opponent = opponents[i];
    let opponentTop = parseInt(window.getComputedStyle(opponent).getPropertyValue('top'));

    if (opponentTop >= 800) {
      opponent.remove();
      opponents.splice(i, 1);
      adicionarPontuacao();
    }
    opponent.style.top = opponentTop + velocidade + 'px';

    if (colisao(player, opponent)) {
      pontos -= 30;
      if (pontos < 0) {
        pontos = 0;
      }
      document.getElementById('pontos').innerText = 'Pontuação: ' + pontos;

      vidas--;
      if (vidas === 0) {
        fimDeJogo();
        return;
      }
      document.getElementById('vida').innerText = 'Vidas: ' + vidas;
    }
  }

  if (!isGameOver) {
    requestAnimationFrame(moverOponente);
  }
}

// Função responsável por adicionar pontuação ao jogador no jogo.
function adicionarPontuacao() {
  pontos = pontos + 10;
  document.getElementById('pontos').innerText = 'Pontuação: ' + pontos;

  adicionarVelocidade();
}

// Função que verifica se ocorreu uma colisão entre o jogador e um oponente no jogo.
function colisao(player, opponent) {
  let playerRect = player.getBoundingClientRect();
  let opponentRect = opponent.getBoundingClientRect();

  if (
    playerRect.top < opponentRect.bottom &&
    playerRect.right > opponentRect.left &&
    playerRect.bottom > opponentRect.top &&
    playerRect.left < opponentRect.right
  ) {
    opponent.remove();

    velocidade -= 10;
    if (velocidade < 0){
      velocidade = 3;
    }

    return true;
  } else {
    return false; // Não há colisão
  }
}

// Função que atualiza a exibição da velocidade do jogo.
function mostrarVelocidade() {
  const speedElement = document.getElementById('velocidade');
  speedElement.innerText = 'Velocidade: ' + velocidade * 10 + ' Km/h';
}

// Função responsável por aumentar gradualmente a velocidade do jogo em intervalos regulares.
function adicionarVelocidade() {
  const maxVelocidade = 15; // Velocidade máxima
  const incrementoVelocidade = 0.25; // Incremento de velocidade por intervalo
  const intervalo = 2000; // Intervalo de tempo em milissegundos

  function aumentarVelocidade() {
    if (velocidade < maxVelocidade) {
      velocidade += incrementoVelocidade;
      mostrarVelocidade();
      setTimeout(aumentarVelocidade, intervalo);
    }
  }

  setTimeout(aumentarVelocidade, intervalo);
}

// Função responsável por encerrar o jogo quando ocorre uma condição de término.
function fimDeJogo() {
  isGameOver = true;
  cancelAnimationFrame(moverOponente);
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-btn').style.display = 'block';
  clearInterval(createOpponentInterval);
}

// Função responsável por iniciar o jogo quando o jogador decide começar ou reiniciar.
function iniciarJogo() {
  isGameOver = false;
  pontos = 0;
  vidas = 5;
  velocidade = 4;

  document.getElementById('pontos').textContent = 'Pontuação:' + pontos;
  document.getElementById("velocidade").textContent = "Velocidade: " + velocidade + " Km/h";
  document.getElementById('vida').textContent = 'Vidas: ' + vidas;
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'none';
  playerLeft = 175;

  player.style.left = playerLeft + 'px';
  opponents.forEach(function(opponent) {
    opponent.remove();
  });
  opponents = [];

  moverOponente();
  background();
  createOpponentInterval = setInterval(function() {
    criarOponente();
  }, 2000);
}

// Chamada da função para iniciar o jogo.
iniciarJogo();