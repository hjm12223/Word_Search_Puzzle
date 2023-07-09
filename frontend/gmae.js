// 보드 생성 함수
async function createBoard() {
    const boardContainer = document.getElementById('board-container');
  
    // 데이터베이스에서 정답 데이터 가져오기
    const response = await fetch('/get-answer-data');
    if (response.ok) {
      const data = await response.json();
  
      // 14x14 보드 생성
      const boardSize = 14;
      const board = document.createElement('div');
      board.classList.add('board');
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
  
          // 정답 데이터인 경우 해당 값을 출력
          if (data[i][j]) {
            cell.textContent = data[i][j];
          } else {
            // 정답 데이터가 아닌 경우 랜덤한 알파벳 생성
            const randomAlphabet = getRandomAlphabet();
            cell.textContent = randomAlphabet;
          }
  
          board.appendChild(cell);
        }
      }
  
      // 보드를 화면에 추가
      boardContainer.appendChild(board);
    } else {
      console.error('Failed to fetch answer data:', response.status);
    }
  }
  
  // 랜덤한 알파벳 생성
  function getRandomAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }
  
  // 보드 생성 호출
  createBoard();
  