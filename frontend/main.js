const button = document.querySelector('.btn-submit');

// 버튼 클릭 이벤트에 대한 리스너를 추가.
button.addEventListener('click', () => {
  
  // Title과 Description 필드를 선택.
  const titleInput = document.querySelector('.Title-input');
  const descriptionInput = document.querySelector('.des-input');

  // Title과 Description 필드의 값들을 가져옴.
  const titleValue = titleInput.value.trim();
  const descriptionValue = descriptionInput.value.trim();

  // 기존의 경고 메시지를 모두 제거.
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());
  const existingAlertss = document.querySelectorAll('.alerts');
  existingAlertss.forEach(alert => alert.remove());

  // Title이 비어있는지 확인합니다.
  if (titleValue === '') {
    // Title 입력란 아래에 경고 메시지를 생성합니다.
    const titleAlert = document.createElement('div');
    titleAlert.classList.add('alert');
    titleAlert.innerText = '↪ Title을 입력해주세요.';
    const titleBlock = document.querySelector('.Title-block');
    titleBlock.appendChild(titleAlert);
  }

  // Description이 비어있는지 확인.
  if (descriptionValue === '') {
    // Description 입력란 아래에 경고 메시지를 생성합니다.
    const descriptionAlert = document.createElement('div');
    descriptionAlert.classList.add('alert');
    descriptionAlert.innerText = '↪ Description을 입력해주세요.';
    const desBlock = document.querySelector('.des-block');
    desBlock.appendChild(descriptionAlert);
  }

  // Word List에서 입력된 단어의 개수를 가져옵니다.
  const wordInputs = document.querySelectorAll('.word');
  const wordCount = Array.from(wordInputs).filter(input => input.value.trim() !== '').length;

  // 최소 10개의 단어가 입력되었는지 확인합니다.
    if (wordCount < 10) {
    // Word List 맨 하단에 경고 메시지를 생성합니다.
    const wordAlert = document.createElement('div');
    wordAlert.classList.add('alerts');
    wordAlert.innerText = '↪ Word List에 최소 10개의 단어를 입력해주세요.';
    const wordWorthBlock = document.querySelector('.word-block5');
    wordWorthBlock.insertAdjacentElement('afterend', wordAlert);
    return;
  }

  
  // Validate word inputs
  const validWords = Array.from(wordInputs)
    .map(input => input.value.trim())
    .filter(word => /^[a-zA-Z]+$/.test(word));

  if (validWords.length !== wordCount) {
    // Word List 맨 하단에 경고 메시지를 생성합니다.
    const wordAlert = document.createElement('div');
    wordAlert.classList.add('alerts');
    wordAlert.innerText = '↪ Word List에 올바른 알파벳 단어만 입력해주세요.';
    const wordWorthBlock = document.querySelector('.word-block5');
    wordWorthBlock.insertAdjacentElement('afterend', wordAlert);
  } else {
    const data = {
      title: titleValue,
      description: descriptionValue,
      words: validWords
    };

    fetch('/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          console.log('Data saved successfully');
          // 데이터가 성공적으로 저장되었을 때의 처리를 수행합니다.
          if (response.status === 200) {
            // 200 상태 코드일 경우 DB에 데이터 저장 및 게임 페이지로 이동
            return response.json().then(result => {
              console.log('DB에 데이터 저장 완료:', result);
              window.location.href = 'game.html';
            });
          } else {
            console.log('DB에 데이터 저장 실패:', response.status);
          }
        } else {
          console.error('Failed to save data:', response.status);
          // 데이터 저장에 실패했을 때의 처리를 수행합니다.
        }
      });
  }
});

