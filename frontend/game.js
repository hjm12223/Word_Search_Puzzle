// // 이전 데이터 삭제
// async function clearData() {
//   const response = await fetch('/clear-data', {
//     method: 'POST',
//   });
//   if (response.ok) {
//     console.log('Data cleared successfully');
//   } else {
//     console.error('Failed to clear data:', response.status);
//   }
// }

// clearData()
//   .then(() => createBoard())
//   .catch(error => console.error('Failed to clear data:', error));


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

        // 정답 데이터인 경우 해당 알파벳을 출력
        const dataIndex = i * boardSize + j;
        const answer = data[dataIndex];
        if (answer) {
          const alphabet = answer.substring(0, 1); // 첫 번째 알파벳 추출
          cell.textContent = alphabet;
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
// 보드 생성 호출 전에 이전 데이터 삭제
