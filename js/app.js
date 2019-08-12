let cardClasses = document.getElementsByClassName('card');
let movesOutput = document.querySelector('.moves'); // for outputting the moves
let listOfOpenCards = [];  // create array for a list of open cards
let matchingCards = document.getElementsByClassName('match');
let timerInterval = 0; 
let timer;

// upon loading page - start the timer and make the cards
let startingTime = makeTheCards();
// calls the event listener function for clicking on the restart button
document.querySelector('.restart').addEventListener('click', restart);
// calls the event listener function for clicking on the play again button
document.querySelector('.playAgain').addEventListener('click', restart);
// call the event listener function for clicking on the modal X - close button
document.querySelector('.close').addEventListener('click', close);
// call the event listener function upon loading page
document.querySelector('.deck').addEventListener('click', listeningFunction);

function listeningFunction(e) { // **eventlistener function**
  if(e.target.nodeName === 'LI') {
    let isItOpen = e.target.classList.contains('show');
    if (isItOpen === false) { // prevents clicking on a card that is already showing
      if (listOfOpenCards.length <= 2) { // prevents opening more than 2 cards per turn
        listOfOpenCards.push(e.target); // add the card to a list of open cards

        displayCard(listOfOpenCards); // calls display the open card function
        if (listOfOpenCards.length === 2) { // check if have 2 cards open
          moveCounter(listOfOpenCards);
          if (listOfOpenCards[0].firstElementChild.className ===
            listOfOpenCards[1].firstElementChild.className) { //check if cards match
            listOfOpenCards = lockCardsOpen(listOfOpenCards);//calls function to lock cards open
          }
          else { //if cards do not match , remove the cards from list and hide cards
            addNoGoAnimation(listOfOpenCards);
            setTimeout(function removeCards() {
              listOfOpenCards = cardsNotMatching(listOfOpenCards);
            }, 1500);
          };
        };
      };
    };
  };
  checkIfAllMatched(matchingCards, startingTime);
};

// display the open card
function displayCard(listOfOpenCards) {
  if (listOfOpenCards.length <= 2) {  // prevents more than 2 cards displaying
    for (listOfOpenCard of listOfOpenCards) {
      listOfOpenCard.classList.add('show', 'open');
    };
  };
};

//   - add each card's HTML to the page
function createEachCardsHTML(shuffledCards) {
  const cardClass = document.getElementsByClassName('card');
  for (let i = 0; i < shuffledCards.length; i++) {
    const card = document.createElement('i');
    card.className = shuffledCards[i];
    cardClass[i].appendChild(card);
  };
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// if cards don't match remove cards from the list and hide cards
function cardsNotMatching(listOfOpenCards) {
  for (listOfOpenCard of listOfOpenCards) {
    listOfOpenCard.classList.remove('open', 'show', 'noMatch');
    listOfOpenCard.removeAttribute('style'); // removing style red
  }
  return listOfOpenCards = [];
}

// lock the cards in the open position
function lockCardsOpen(listOfOpenCards) {
  for (listOfOpenCard of listOfOpenCards) {
    listOfOpenCard.classList.add('match');
    listOfOpenCard.classList.remove('open');
    listOfOpenCard.classList.add('rotate'); //add rotate to card
  };
  setTimeout(function removeRotate() { // set a 1sec timer so that cards rotate b4 remove rotate
    for (cardClass of cardClasses) {
      cardClass.classList.remove('rotate');
    }
  }, 1000);
  return listOfOpenCards = [];
};

// moveCounter
function moveCounter (listOfOpenCards) {
  if (listOfOpenCards.length < 3) {
    let moves = document.querySelector('.moves');
    let moveCount = parseInt(moves.textContent, 10);
    moveCount += 2;
    moves.textContent = moveCount;
    let stars = document.getElementsByClassName('fa fa-star');
    if (moveCount === 26) {
      stars[2].style.visibility = 'hidden';
    }
    if (moveCount === 36) {
      stars[1].style.visibility = 'hidden';
    }
  };
};

// check if all cards matched
function checkIfAllMatched(matchingCards, startingTime) {
  if (matchingCards.length === 16) {
    stopTimer();
    let moves = document.querySelector('.moves');
    let moveCount = moves.textContent;
    let numberStars;
    const displayModal = document.querySelector('.modal');
    displayModal.style.display = 'block';
    timerInterval --;
    const minutes = Math.floor(timerInterval / 60);
    const seconds = timerInterval - minutes * 60;    
    const timeClass = document.querySelector('.time');
    if (minutes === 1) {
      timeClass.textContent = 'time to win: ' + minutes + ' minute ' + parseInt(seconds) + ' seconds';
    }
    else {
      timeClass.textContent = 'time to win: ' + minutes + ' minutes ' + parseInt(seconds) + ' seconds';
    }
    if (moveCount < 26){
      numberStars = 3;
    }
    else if (moveCount < 36){
      numberStars = 2;
    }
    else {
      numberStars = 1;
    }
    let starRatings = document.querySelector('.starRating');
    starRatings.textContent = 'with a star rating of: ' + numberStars;
  };
};

// restart the game function
function restart() {
  stopTimer();  
  movesOutput.textContent = '0';
  let classCards = document.getElementsByClassName('card');
  for (classCard of classCards) {
    classCard.classList.remove('match', 'open', 'show', 'rotate');
    classCard.firstElementChild.remove();
  };
  document.querySelector('.modal').style.display = 'none';
  makeTheCards();
  let stars = document.getElementsByClassName('fa fa-star')
  for (star of stars) {
    star.removeAttribute('style');
  }
};

// make the cards function
function makeTheCards() {
  const cardList = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor",
      "fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
      "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt",
      "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];
  const shuffledCards = shuffle(cardList);
  createEachCardsHTML(shuffledCards);
  timerInterval =  0; // set the timer value to 0
  timer = setInterval(startTimer, 1000);
}

// animation for when the pair of cards don't match
function addNoGoAnimation(listOfOpenCards) {
  for (listOfOpenCard of listOfOpenCards) {
    listOfOpenCard.classList.add('noMatch');
    listOfOpenCard.style.backgroundColor = 'red';
  }
}

// close the modal
function close() {
  document.querySelector('.modal').style.display = 'none';
}

// starting timer
function startTimer () {
  document.querySelector('.timerDisplay').textContent = timerInterval + ' seconds';
  timerInterval ++;
  };

// stopping the game timer
function stopTimer() {
  clearInterval(timer);
};