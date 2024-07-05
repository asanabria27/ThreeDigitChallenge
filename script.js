$(document).ready(function() {
  let attempts, currentGuess, secretNumber;

  const submitGuess = $("#submit-guess");
  const keyboard = $("#keyboard");
  const grid = $("#grid");

  initGame();

  function generateSecretNumber() {
    let digits = "";
    for (let i = 0; i < 3; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    return digits;
  }

  function createGrid() {
    let gridHtml = "";
    for (let i = 0; i < 9; i++) {
      gridHtml += "<div class='cell'></div>";
    }
    grid.html(gridHtml);
  }

  function checkGuess(guess) {
    let result = ['', '', ''];
    for (let i = 0; i < 3; i++) {
      if (guess[i] === secretNumber[i]) {
        result[i] = 'correct';
      } else if (secretNumber.includes(guess[i])) {
        result[i] = 'present';
      } else {
        result[i] = 'absent';
      }
    }
    return result;
  }

  function updateGrid(guess, result) {
    for (let i = 0; i < 3; i++) {
      let cellIndex = attempts * 3 + i;
      let cell = $("#grid .cell").eq(cellIndex);
      cell.text(guess[i]).addClass(result[i]);
    }
  }

  function handleKeyPressed(digit) {
    if (currentGuess.length < 3) {
      currentGuess += digit;
      let cellIndex = attempts * 3 + currentGuess.length - 1;
      let cell = $('#grid .cell').eq(cellIndex);
      cell.text(digit);
    }
    if (currentGuess.length === 3) {
      submitGuess.prop('disabled', false);
    }
  }

  function handleDeleteDigit() {
    if (currentGuess.length > 0) {
      let cellIndex = attempts * 3 + currentGuess.length - 1;
      let cell = $('#grid .cell').eq(cellIndex);
      cell.text('');
      currentGuess = currentGuess.slice(0, -1);
      submitGuess.prop('disabled', true);
    }
  }

  function initGame() {
    attempts = 0;
    currentGuess = '';
    secretNumber = generateSecretNumber();
    createGrid();
    $('#message').text('').removeClass('text-danger text-success');
    submitGuess.prop('disabled', true);
  }

  function resetCurrentGuess() {
    currentGuess = '';
    submitGuess.prop('disabled', true);
  }

  keyboard.on("click", "button", function() {
    const elementId = $(this).attr("id");

    if (elementId === "restart-game") {
      initGame();
    } else if (elementId === "delete-digit") {
      handleDeleteDigit();
    } else {
      handleKeyPressed($(this).text());
    }
  });

  submitGuess.click(function() {
    if (currentGuess.length !== 3) {
      $('#message').text('Por favor, ingrese una secuencia válida de 3 dígitos.').addClass('text-danger');
      return;
    }

    $('#message').text('').removeClass('text-danger');

    let result = checkGuess(currentGuess);
    updateGrid(currentGuess, result);
    attempts++;

    if (currentGuess === secretNumber) {
      $('#message').text('¡Ganaste! has adivinado el número secreto.').addClass('text-success');
      submitGuess.prop('disabled', true);
    } else if (attempts >= 3) {
      $('#message').text('Has perdido, el número secreto era: ' + secretNumber).addClass('text-danger');
      submitGuess.prop('disabled', true);
    }

    resetCurrentGuess();
  });
});
