// Controle para habilitar/desabilitar splash
const SPLASH_ENABLED = true;

// Função para mostrar a splash screen
function showSplashScreen() {
    if (!SPLASH_ENABLED) return;
    if (!navigator.onLine) {
        console.log('Splash screen não exibida: navegador offline.');
        return; // Não mostra a splash screen se estiver offline
    }
    // Criar elementos
    const overlay = document.createElement('div');
    overlay.className = 'splash-overlay';
    
    const container = document.createElement('div');
    container.className = 'splash-container';
    
    // Conteúdo da splash screen
    container.innerHTML = `
        <div class="splash-header">
            <img src="assets/images/logos/logo_escola.png" alt="Logo da Escola" class="splash-logo">
            <h1 class="splash-title">Bem-vindo ao Portal do Aluno Vicente Rijo</h1>
        </div>
        <p class="splash-message">Acesse as ferramentas educacionais </p>
        <div class="splash-buttons">
            <button class="splash-button primary">Entendi</button>
        </div>
    `;
    
    // Adicionar ao DOM
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    // Mostrar com um pequeno delay
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);
    
    // Evento do botão
    const okButton = container.querySelector('.primary');
    function closeSplash() {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    okButton.addEventListener('click', closeSplash);
    // Fechar ao clicar fora
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeSplash();
        }
    });
}

// Mostrar splash screen quando a página carregar
window.addEventListener('load', () => {
    // Verificar se já existe uma splash screen
    if (!document.querySelector('.splash-overlay')) {
        showSplashScreen();
    }
});

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // A função setupCards agora está em app.js
}); 
