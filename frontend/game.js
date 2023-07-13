
function getRandomAlphabet() {
  const alphabets = 'abcdefghijklmnopqrstuvwxyz';
  const randomIndex = Math.floor(Math.random() * alphabets.length);
  return alphabets[randomIndex];
}


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
    const boardArray = [];

    for (let i = 0; i < boardSize; i++) {
      boardArray.push([]);
      for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // 정답 데이터인 경우 해당 알파벳을 출력
        const dataIndex = i * boardSize + j;
        const answer = data[dataIndex];
        if (answer) {
          const characters = Array.isArray(answer) ? answer : answer.split(', '); // 문자열을 문자 배열로 변환
          const randomIndex = Math.floor(Math.random() * characters.length); // 문자 배열에서 랜덤한 인덱스 선택
          const word = characters[randomIndex]; // 선택한 인덱스의 단어
          const randomAlphabet = getRandomAlphabetFromWord(word); // 단어에서 랜덤한 알파벳 추출
          cell.textContent = randomAlphabet;
        }
        
        else {
          // 정답 데이터가 아닌 경우 랜덤한 알파벳 생성
          const randomAlphabet = getRandomAlphabet();
          cell.textContent = randomAlphabet;
        }

        boardArray[i].push(cell);
        board.appendChild(cell);
      }
    }
    function getRandomAlphabetFromWord(word) {
      const randomIndex = Math.floor(Math.random() * word.length); // 단어의 길이에서 랜덤한 인덱스 선택
      return word[randomIndex]; // 선택한 인덱스의 알파벳 반환
    }
    
    // 보드를 화면에 추가
    boardContainer.appendChild(board);

    // 데이터베이스에서 단어들 가져오기
    fetch('/get-word-data')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch word data');
        }
      })
      .then(data => {
        const words = data.words;

        // 단어 연결선 생성
        for (const word of words) {
          connectWord(boardArray, word);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    console.error('Failed to fetch answer data:', response.status);
  }
}



// 단어 연결선 생성 함수
function connectWord(boardArray, word) {
  const directions = [
    [-1, -1], // 대각선 상단 좌측
    [-1, 0], // 상단
    [-1, 1], // 대각선 상단 우측
    [0, -1], // 좌측
    [0, 1], // 우측
    [1, -1], // 대각선 하단 좌측
    [1, 0], // 하단
    [1, 1], // 대각선 하단 우측
  ];

  const wordLength = word.length;
  const boardSize = boardArray.length;

  // 보드 탐색
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = boardArray[row][col];

      // 현재 셀과 연결된 모든 방향 탐색
      for (const direction of directions) {
        const [dx, dy] = direction;
        let found = true;

        // 단어의 첫 번째 알파벳과 일치하는지 확인
        if (cell.textContent === word[0]) {
          // 단어의 나머지 알파벳들이 연결되어 있는지 확인
          for (let i = 1; i < wordLength; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;

            // 보드 범위를 벗어나거나 단어의 알파벳과 일치하지 않으면 종료
            if (
              newRow < 0 ||
              newRow >= boardSize ||
              newCol < 0 ||
              newCol >= boardSize ||
              boardArray[newRow][newCol].textContent !== word[i]
            ) {
              found = false;
              break;
            }
          }

          // 단어가 연결되어 있다면 연결선을 표시
          if (found) {
            for (let i = 0; i < wordLength; i++) {
              const newRow = row + i * dx;
              const newCol = col + i * dy;
              boardArray[newRow][newCol].classList.add('connected');
            }
          }
        }
      }
    }
  }
}
createBoard();