document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    const textareas = document.querySelectorAll('textarea'); // вместо inputs
    
    // Переворот карточки
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
        
        // Автоматически фокусируемся на textarea активной стороны
        setTimeout(() => {
            if (this.classList.contains('flipped')) {
                // Карточка перевернута - фокус на заднюю сторону (голубую)
                const backTextarea = document.querySelector('.card-back textarea');
                backTextarea.focus();
            } else {
                // Карточка лицевой стороной - фокус на переднюю сторону (розовую)
                const frontTextarea = document.querySelector('.card-front textarea');
                frontTextarea.focus();
            }
        }, 100); // небольшая задержка для завершения анимации поворота
    });
    
    // Останавливаем переворот при клике на input
    textareas.forEach(textarea => {
        textarea.addEventListener('click', function(event) {
            event.stopPropagation(); // останавливает всплытие события
        });
    });
    
    // Счетчик символов
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const maxLength = 288;
            const currentLength = this.value.length;
            
            if (currentLength === maxLength) {
                this.style.borderColor = 'red'
            } else {
                this.style.borderColor = '#0984e3';
            }
        });
    });
    
    // Функция сохранения карточки
    const saveButton = document.querySelector('.save-button');
    const savedCardsContainer = document.querySelector('.saved-cards-container');
    
    // Функция случайной карточки
    const randomCardButton = document.querySelector('.random-card-button');
    let savedCards = []; // массив для хранения сохраненных карточек
    
    // Добавьте переменные
    const usedCardsContainer = document.querySelector('.used-cards-container');
    const resetUsedBtn = document.querySelector('.reset-used-btn');
    let usedCards = []; // массив использованных карточек
    let cardCounter = 0; // счетчик карточек

    randomCardButton.addEventListener('click', function() {
        // Фильтруем неиспользованные карточки
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
        
        // Находим оригинальный индекс в savedCards
        const originalIndex = savedCards.findIndex(card => 
            card.front === selectedCard.front && card.back === selectedCard.back
        );
        
        const frontTextarea = document.querySelector('.card-front textarea');
        const backTextarea = document.querySelector('.card-back textarea');
        
        frontTextarea.value = selectedCard.front;
        backTextarea.value = selectedCard.back;
        
        // Добавляем в использованные
        usedCards.push(originalIndex);
        createUsedMiniCard(selectedCard.front, selectedCard.back);
        
        // Удаляем из сохраненных (визуально)
        const savedMiniCards = savedCardsContainer.children;
        let cardIndex = 0;
        for (let i = 0; i < savedMiniCards.length; i++) {
            if (cardIndex === originalIndex) {
                savedMiniCards[i].style.display = 'none'; // скрываем карточку
                break;
            }
            cardIndex++;
        }
        
        // Если карточка перевернута, поверните ее обратно
        card.classList.remove('flipped');
    });

    saveButton.addEventListener('click', function() {
        const frontTextarea = document.querySelector('.card-front textarea');
        const backTextarea = document.querySelector('.card-back textarea');
        
        const frontText = frontTextarea.value.trim();
        const backText = backTextarea.value.trim();
        
        if (frontText || backText) {
            // Сохраняем в массив
            savedCards.push({
                front: frontText,
                back: backText
            });
            
            createMiniCard(frontText, backText);
            
            // Очистить основную карточку
            frontTextarea.value = '';
            backTextarea.value = '';
            
            // Активировать кнопку случайной карточки
            randomCardButton.disabled = false;
        }
    });
    
    // Обновите функцию createMiniCard для добавления нумерации
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
            <div class="divider">Но</div>
            <div class="mini-card-side mini-card-back">
                <button class="clear-side-btn" onclick="clearSide(this)">C</button>
                <div class="mini-card-label">Он</div>
                <div class="mini-card-text">${backText || 'Пусто'}</div>
            </div>
        `;
        
        savedCardsContainer.appendChild(miniCard);
    }

    // Функция создания мини-карточки в использованных
    function createUsedMiniCard(frontText, backText) {
        const miniCard = document.createElement('div');
        miniCard.className = 'mini-card';
        
        miniCard.innerHTML = `
            <div class="mini-card-side mini-card-front">
                <div class="mini-card-label">Она</div>
                <div class="mini-card-text">${frontText || 'Пусто'}</div>
            </div>
            <div class="divider">Но</div>
            <div class="mini-card-side mini-card-back">
                <div class="mini-card-label">Он</div>
                <div class="mini-card-text">${backText || 'Пусто'}</div>
            </div>
        `;
        
        usedCardsContainer.appendChild(miniCard);
    }
    
    function deleteMiniCard(element) {
        element.parentElement.remove();
    }
    
    // Функция удаления всех карточек
    const clearAllBtn = document.querySelector('.clear-all-btn');
    
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

    // Функция сброса использованных карточек
    resetUsedBtn.addEventListener('click', function() {
        if (confirm('Сбросить все использованные карточки?')) {
            // Показываем все скрытые карточки в сохраненных
            const savedMiniCards = savedCardsContainer.children;
            for (let i = 0; i < savedMiniCards.length; i++) {
                savedMiniCards[i].style.display = 'block';
            }
            
            usedCards = [];
            usedCardsContainer.innerHTML = '';
        }
    });

    // Глобальная функция для удаления одной карточки
    window.deleteMiniCard = function(element) {
        const miniCard = element.closest('.mini-card');
        if (confirm('Удалить эту карточку?')) {
            const index = Array.from(savedCardsContainer.children).indexOf(miniCard);
            savedCards.splice(index, 1); // удаляем из массива
            miniCard.remove();
            
            // Деактивируем кнопку если карточек не осталось
            if (savedCards.length === 0) {
                randomCardButton.disabled = true;
            }
        }
    };

    // Функция очистки одной стороны
    window.clearSide = function(element) {
        const textElement = element.parentElement.querySelector('.mini-card-text');
        if (confirm('Очистить текст этой стороны?')) {
            textElement.textContent = 'Пусто';
        }
    };

    // Изначально деактивируем кнопку
    randomCardButton.disabled = true;

    // Хоткеи
    document.addEventListener('keydown', function(event) {
        // Если нажат Escape и фокус на textarea - убираем фокус
        if (event.key === 'Escape' && event.target.tagName === 'TEXTAREA') {
            event.target.blur(); // убираем фокус с textarea
            return;
        }
        
        // Проверяем, что фокус не на textarea (чтобы не мешать печатанию)
        if (event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(event.key) {
            case 'Enter':
            case 's':
            case 'S':
            case 'ы':  // русская 's'
                event.preventDefault();
                saveButton.click();
                break;
                
            case ' ':  // пробел
            case 'f':
            case 'F':
            case 'а':  // русская 'f'
                event.preventDefault();
                card.classList.toggle('flipped');
                
                // Автоматически фокусируемся на textarea активной стороны при хоткее
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
            case 'к':  // русская 'r'
                event.preventDefault();
                randomCardButton.click();
                break;
                
            case 'Delete':
            case 'd':
            case 'D':
            case 'в':  // русская 'd'
                event.preventDefault();
                if (confirm('Удалить все сохраненные карточки?')) {
                    clearAllBtn.click();
                }
                break;
        }
    });
});