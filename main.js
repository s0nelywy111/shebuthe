document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    const textareas = document.querySelectorAll('textarea');
    
    // Переворот карточки
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
        
        // Автоматически фокусируемся на textarea активной стороны
        setTimeout(() => {
            if (this.classList.contains('flipped')) {
                const backTextarea = document.querySelector('.card-back textarea');
                backTextarea.focus();
            } else {
                const frontTextarea = document.querySelector('.card-front textarea');
                frontTextarea.focus();
            }
        }, 100);
    });
    
    // Останавливаем переворот при клике на textarea
    textareas.forEach(textarea => {
        textarea.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
    
    // Счетчик символов
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const maxLength = 300;
            const currentLength = this.value.length;
            
            if (currentLength === maxLength) {
                this.style.borderColor = 'red';
            } else {
                this.style.borderColor = 'white';
            }
        });
    });
    
    // Элементы интерфейса
    const saveButton = document.querySelector('.save-button');
    const savedCardsContainer = document.querySelector('.saved-cards-container');
    const randomCardButton = document.querySelector('.random-card-button');
    const usedCardsContainer = document.querySelector('.used-cards-container');
    const resetUsedBtn = document.querySelector('.reset-used-btn');
    const clearAllBtn = document.querySelector('.clear-all-btn');
    
    // Массивы данных
    let savedCards = [];
    let usedCards = [];
    let cardCounter = 0;
    
    // Сохранение карточки
    saveButton.addEventListener('click', function() {
        const frontTextarea = document.querySelector('.card-front textarea');
        const backTextarea = document.querySelector('.card-back textarea');
        
        const frontText = frontTextarea.value.trim();
        const backText = backTextarea.value.trim();
        
        if (frontText || backText) {
            savedCards.push({
                front: frontText,
                back: backText
            });
            
            createMiniCard(frontText, backText);
            
            frontTextarea.value = '';
            backTextarea.value = '';
            
            randomCardButton.disabled = false;
        }
    });
    
    // Случайная карточка
    randomCardButton.addEventListener('click', function() {
        const availableCards = savedCards.filter((card, index) => !usedCards.includes(index));
        
        if (availableCards.length === 0) {
            if (savedCards.length === 0) {
                alert('Нет сохраненных карточек для выбора!');
            } else {
                alert('Все карточки уже использованы! Сбросьте использованные или создайте новые.');
            }
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const selectedCard = availableCards[randomIndex];
        
        const originalIndex = savedCards.findIndex(card => 
            card.front === selectedCard.front && card.back === selectedCard.back
        );
        
        const frontTextarea = document.querySelector('.card-front textarea');
        const backTextarea = document.querySelector('.card-back textarea');
        
        frontTextarea.value = selectedCard.front;
        backTextarea.value = selectedCard.back;
        
        usedCards.push(originalIndex);
        createUsedMiniCard(selectedCard.front, selectedCard.back);
        
        const savedMiniCards = savedCardsContainer.children;
        let cardIndex = 0;
        for (let i = 0; i < savedMiniCards.length; i++) {
            if (cardIndex === originalIndex) {
                savedMiniCards[i].style.display = 'none';
                break;
            }
            cardIndex++;
        }
        
        card.classList.remove('flipped');
    });
    
    // Создание мини-карточки
    function createMiniCard(frontText, backText) {
        cardCounter++;
        const miniCard = document.createElement('div');
        miniCard.className = 'mini-card';
        miniCard.style.position = 'relative';
        
        miniCard.innerHTML = `
            <div class="card-number">${cardCounter}</div>
            <div class="mini-card-side mini-card-front">
                <button class="clear-side-btn" onclick="clearSide(this)">C</button>
                <button class="delete-card-btn" onclick="deleteMiniCard(this)">×</button>
                <div class="mini-card-label">Она</div>
                <div class="mini-card-text">${frontText || 'Пусто'}</div>
            </div>
            <div class="divider"></div>
            <div class="mini-card-side mini-card-back">
                <button class="clear-side-btn" onclick="clearSide(this)">C</button>
                <div class="mini-card-label">Он</div>
                <div class="mini-card-text">${backText || 'Пусто'}</div>
            </div>
        `;
        
        savedCardsContainer.appendChild(miniCard);
    }
    
    // Создание использованной мини-карточки
    function createUsedMiniCard(frontText, backText) {
        const miniCard = document.createElement('div');
        miniCard.className = 'mini-card';
        
        miniCard.innerHTML = `
            <div class="mini-card-side mini-card-front">
                <div class="mini-card-label">Она</div>
                <div class="mini-card-text">${frontText || 'Пусто'}</div>
            </div>
            <div class="divider"></div>
            <div class="mini-card-side mini-card-back">
                <div class="mini-card-label">Он</div>
                <div class="mini-card-text">${backText || 'Пусто'}</div>
            </div>
        `;
        
        usedCardsContainer.appendChild(miniCard);
    }
    
    // Удаление всех карточек
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить все карточки?')) {
            savedCardsContainer.innerHTML = '';
            usedCardsContainer.innerHTML = '';
            savedCards = [];
            usedCards = [];
            cardCounter = 0;
            randomCardButton.disabled = true;
        }
    });
    
    // Сброс использованных карточек
    resetUsedBtn.addEventListener('click', function() {
        if (confirm('Сбросить все использованные карточки?')) {
            const savedMiniCards = savedCardsContainer.children;
            for (let i = 0; i < savedMiniCards.length; i++) {
                savedMiniCards[i].style.display = 'block';
            }
            
            usedCards = [];
            usedCardsContainer.innerHTML = '';
        }
    });
    
    // Глобальные функции
    window.deleteMiniCard = function(element) {
        const miniCard = element.closest('.mini-card');
        if (confirm('Удалить эту карточку?')) {
            const index = Array.from(savedCardsContainer.children).indexOf(miniCard);
            savedCards.splice(index, 1);
            miniCard.remove();
            
            if (savedCards.length === 0) {
                randomCardButton.disabled = true;
            }
        }
    };
    
    window.clearSide = function(element) {
        const textElement = element.parentElement.querySelector('.mini-card-text');
        if (confirm('Очистить текст этой стороны?')) {
            textElement.textContent = 'Пусто';
        }
    };
    
    // Изначально деактивируем кнопку
    randomCardButton.disabled = true;
    
    // Горячие клавиши
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && event.target.tagName === 'TEXTAREA') {
            event.target.blur();
            return;
        }
        
        if (event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(event.key) {
            case 'Enter':
            case 's':
            case 'S':
            case 'ы':
                event.preventDefault();
                saveButton.click();
                break;
                
            case ' ':
            case 'f':
            case 'F':
            case 'а':
                event.preventDefault();
                card.classList.toggle('flipped');
                
                setTimeout(() => {
                    if (card.classList.contains('flipped')) {
                        const backTextarea = document.querySelector('.card-back textarea');
                        backTextarea.focus();
                    } else {
                        const frontTextarea = document.querySelector('.card-front textarea');
                        frontTextarea.focus();
                    }
                }, 100);
                break;
                
            case 'r':
            case 'R':
            case 'к':
                event.preventDefault();
                randomCardButton.click();
                break;
                
            case 'Delete':
            case 'd':
            case 'D':
            case 'в':
                event.preventDefault();
                if (confirm('Удалить все сохраненные карточки?')) {
                    clearAllBtn.click();
                }
                break;
        }
    });
});