document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const card = document.getElementById('main-card');
    const flipBtn = document.getElementById('flip-btn');
    const saveBtn = document.getElementById('save-btn');
    const randomBtn = document.getElementById('random-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const resetUsedBtn = document.getElementById('reset-used-btn');
    
    const frontTextarea = document.getElementById('front-textarea');
    const backTextarea = document.getElementById('back-textarea');
    
    const savedContainer = document.getElementById('saved-container');
    const usedContainer = document.getElementById('used-container');
    const savedCount = document.getElementById('saved-count');
    const usedCount = document.getElementById('used-count');
    
    // Табы
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Данные
    let savedCards = [];
    let usedCards = [];
    let cardCounter = 0;
    
    // Переворот карточки
    flipBtn.addEventListener('click', function() {
        card.classList.toggle('flipped');
        
        setTimeout(() => {
            if (card.classList.contains('flipped')) {
                backTextarea.focus();
            } else {
                frontTextarea.focus();
            }
        }, 300);
    });
    
    // Сохранение карточки
    saveBtn.addEventListener('click', function() {
        const frontText = frontTextarea.value.trim();
        const backText = backTextarea.value.trim();
        
        if (frontText || backText) {
            savedCards.push({
                front: frontText,
                back: backText
            });
            
            createSavedCard(frontText, backText);
            updateStats();
            clearInputs();
            
            randomBtn.disabled = false;
            clearAllBtn.style.display = 'block';
        }
    });
    
    // Случайная карточка
    randomBtn.addEventListener('click', function() {
        const availableCards = savedCards.filter((card, index) => !usedCards.includes(index));
        
        if (availableCards.length === 0) {
            if (savedCards.length === 0) {
                alert('📝 Нет сохраненных карточек!');
            } else {
                alert('✅ Все карточки использованы! Сбросьте их или создайте новые.');
            }
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const selectedCard = availableCards[randomIndex];
        
        const originalIndex = savedCards.findIndex(card => 
            card.front === selectedCard.front && card.back === selectedCard.back
        );
        
        frontTextarea.value = selectedCard.front;
        backTextarea.value = selectedCard.back;
        
        usedCards.push(originalIndex);
        createUsedCard(selectedCard.front, selectedCard.back);
        hideCard(originalIndex);
        updateStats();
        
        card.classList.remove('flipped');
    });
    
    // Удаление всех карточек
    clearAllBtn.addEventListener('click', function() {
        if (confirm('🗑️ Удалить все карточки?')) {
            savedCards = [];
            usedCards = [];
            cardCounter = 0;
            
            savedContainer.innerHTML = '<div class="empty-state"><p>📝 Пока нет сохраненных карточек</p><small>Создайте первую карточку!</small></div>';
            usedContainer.innerHTML = '<div class="empty-state"><p>🎯 Пока нет использованных карточек</p><small>Используйте "Случайная карточка"</small></div>';
            
            updateStats();
            randomBtn.disabled = true;
            clearAllBtn.style.display = 'none';
            resetUsedBtn.style.display = 'none';
        }
    });
    
    // Сброс изученных
    resetUsedBtn.addEventListener('click', function() {
        if (confirm('↩️ Сбросить все использованые карточки?')) {
            showAllCards();
            usedCards = [];
            usedContainer.innerHTML = '<div class="empty-state"><p>🎯 Пока нет использованных карточек</p><small>Используйте "Случайная карточка"</small></div>';
            updateStats();
            resetUsedBtn.style.display = 'none';
        }
    });
    
    // Переключение табов
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
    
    // Создание сохраненной карточки
    function createSavedCard(frontText, backText) {
        cardCounter++;
        
        if (savedContainer.querySelector('.empty-state')) {
            savedContainer.innerHTML = '';
        }
        
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `
            <div class="card-item-number">${cardCounter}</div>
            <button class="delete-btn" onclick="deleteCard(this, ${cardCounter - 1})">×</button>
            
            <div class="card-item-side">
                <div class="card-item-label">💗 Она</div>
                <div class="card-item-text">${frontText || 'Пусто'}</div>
            </div>
            
            <div class="card-item-divider"></div>
            
            <div class="card-item-side">
                <div class="card-item-label">💙 Он</div>
                <div class="card-item-text">${backText || 'Пусто'}</div>
            </div>
        `;
        
        savedContainer.appendChild(cardItem);
    }
    
    // Создание изученной карточки
    function createUsedCard(frontText, backText) {
        if (usedContainer.querySelector('.empty-state')) {
            usedContainer.innerHTML = '';
        }
        
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `
            <div class="card-item-side">
                <div class="card-item-label">💗 Она</div>
                <div class="card-item-text">${frontText || 'Пусто'}</div>
            </div>
            
            <div class="card-item-divider"></div>
            
            <div class="card-item-side">
                <div class="card-item-label">💙 Он</div>
                <div class="card-item-text">${backText || 'Пусто'}</div>
            </div>
        `;
        
        usedContainer.appendChild(cardItem);
        resetUsedBtn.style.display = 'block';
    }
    
    // Скрытие карточки
    function hideCard(index) {
        const cards = savedContainer.querySelectorAll('.card-item');
        if (cards[index]) {
            cards[index].style.opacity = '0.3';
            cards[index].style.pointerEvents = 'none';
        }
    }
    
    // Показать все карточки
    function showAllCards() {
        const cards = savedContainer.querySelectorAll('.card-item');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }
    
    // Обновление статистики
    function updateStats() {
        savedCount.textContent = savedCards.length;
        usedCount.textContent = usedCards.length;
    }
    
    // Очистка полей ввода
    function clearInputs() {
        frontTextarea.value = '';
        backTextarea.value = '';
    }
    
    // Глобальная функция удаления карточки
    window.deleteCard = function(button, index) {
        if (confirm('🗑️ Удалить эту карточку?')) {
            savedCards.splice(index, 1);
            button.parentElement.remove();
            
            if (savedCards.length === 0) {
                savedContainer.innerHTML = '<div class="empty-state"><p>📝 Пока нет сохраненных карточек</p><small>Создайте первую карточку!</small></div>';
                randomBtn.disabled = true;
                clearAllBtn.style.display = 'none';
            }
            
            updateStats();
        }
    };
    
    // Автофокус на textarea при клике на карточку
    card.addEventListener('click', function(e) {
        if (e.target.tagName !== 'TEXTAREA') {
            if (card.classList.contains('flipped')) {
                backTextarea.focus();
            } else {
                frontTextarea.focus();
            }
        }
    });
});