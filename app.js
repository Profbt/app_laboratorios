document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    setupCards();
    setupSearch();
    registerServiceWorker();
    checkNetworkStatus();
});

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const shouldShow = title.includes(searchTerm);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    });
} 