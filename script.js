// script.js

const NUM_CARDS = 16; // Double the number of cards
const API_URL = 'https://dog.ceo/api/breeds/image/random';
let flippedCards = [];
let matchedCards = [];
let canClick = true; // Add a flag to control when cards can be clicked
let revealedCards = 0; // Add a variable to keep track of the number of revealed cards

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(imageURL) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url(${imageURL})`;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    card.appendChild(cardInner);

    card.addEventListener('click', () => {
        if (!canClick || card.classList.contains('revealed') || revealedCards >= 2) return;
    
        cardInner.style.transform = 'rotateY(180deg)';
        card.classList.add('revealed');
        flippedCards.push(card);
        revealedCards++;

        if (revealedCards === 2) {
            canClick = false;
            setTimeout(checkMatch, 800);
        }
    });

    return card;
}

function createBoard() {
    const memoryGame = document.querySelector('.memory-game');
    const dogImages = [];

    // Fetch dog images and duplicate them to create pairs
    for (let i = 0; i < NUM_CARDS / 2; i++) {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                const imageURL = data.message;
                dogImages.push(imageURL);
                dogImages.push(imageURL);

                if (dogImages.length === NUM_CARDS) {
                    const shuffledDogImages = shuffleArray(dogImages);

                    shuffledDogImages.forEach((imageURL) => {
                        const card = createCard(imageURL);
                        memoryGame.appendChild(card);
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching dog images:', error);
            });
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.querySelector('.card-back').style.backgroundImage === card2.querySelector('.card-back').style.backgroundImage) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        revealedCards = 0; // Reset the revealed cards counter

        if (matchedCards.length === NUM_CARDS) {
            setTimeout(() => alert('Congratulations! You won!'), 500);
        }
    } else {
        setTimeout(() => {
            card1.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
            card2.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
            card1.classList.remove('revealed');
            card2.classList.remove('revealed');
            flippedCards = [];
            revealedCards = 0; // Reset the revealed cards counter
        }, 800);
    }

    canClick = true; // Reset canClick to allow clicking on the next cards
}

const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetGame);

function resetGame() {
    const memoryGame = document.querySelector('.memory-game');
    memoryGame.innerHTML = '';
    matchedCards = [];
    flippedCards = [];
    canClick = true;
    revealedCards = 0; // Reset the revealed cards counter
    createBoard();
}

createBoard();
