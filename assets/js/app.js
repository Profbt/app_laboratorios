/**
 * app.js - Portal do Aluno Vicente Rijo
 * @author Prof. Bruno Carvalho
 * @version 2.0 (2025)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ====================== INICIALIZAÇÃO ======================
    initParallax();
    setupCards();
    setupSearch();
    registerServiceWorker();
    checkNetworkStatus();
  
    // Pré-carrega imagens críticas
    preloadImages([
      '/assets/images/logos/logo.png',
      '/assets/images/logos/paralax.webp',
      '/assets/images/icons/search.png'
    ]);
  });
  
  // ====================== FUNÇÕES PRINCIPAIS ======================
  
  /**
   * Inicializa o efeito parallax com fallback
   */
  function initParallax() {
    try {
      // Verifica se já existe um elemento parallax
      if (document.querySelector('.parallax-bg')) return;
  
      // Cria div parallax
      const parallaxDiv = document.createElement('div');
      parallaxDiv.className = 'parallax-bg';
      
      // Insere no DOM
      document.head.appendChild(style);
      document.body.insertBefore(parallaxDiv, document.body.firstChild);
  
      // Efeito de movimento no scroll
      window.addEventListener('scroll', () => {
        const yOffset = window.pageYOffset;
        parallaxDiv.style.transform = `translateY(${yOffset * 0.3}px)`;
      });
  
    } catch (error) {
      console.error('Erro no parallax:', error);
      // Fallback simples
      document.body.style.backgroundImage = 'url(/assets/images/logos/paralax.webp)';
    }
  }
  
  /**
   * Configura os cards interativos
   */
  function setupCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('click', function() {
        const platform = this.dataset.platform;
        const link = this.querySelector('.card-link');
        
        // Adiciona efeito de clique
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
          if (link) {
            window.open(link.href, '_blank', 'noopener,noreferrer');
          }
        }, 150);

        // Tracking
        trackLinkClick(platform);
      });
  
      // Efeitos touch para mobile
      card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      card.addEventListener('touchend', function() {
        this.style.transform = '';
      });
    });
  }
  
  /**
   * Registra o Service Worker
   */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('SW registrado:', registration.scope);
          })
          .catch(error => {
            console.log('Falha no SW:', error);
          });
      });
    }
  }
  
  // ====================== FUNÇÕES UTILITÁRIAS ======================
  
  /**
   * Trackeia cliques nos links
   * @param {string} platform - Nome da plataforma acessada
   */
  function trackLinkClick(platform) {
    const analyticsData = {
      event: 'platform_access',
      platform: platform,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  
    // Salva no localStorage
    saveToLocalStorage(analyticsData);
    
    // Envia para analytics (simulado)
    if (navigator.onLine) {
      sendToAnalytics(analyticsData);
    }
  }
  
  /**
   * Pré-carrega imagens
   * @param {string[]} imageUrls - Array de URLs de imagens
   */
  function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }
  
  /**
   * Monitora status da rede
   */
  function checkNetworkStatus() {
    const updateNetworkStatus = () => {
      const statusElement = document.getElementById('network-status') || createNetworkStatusElement();
      statusElement.textContent = navigator.onLine ? 'Online' : 'Offline';
      statusElement.style.backgroundColor = navigator.onLine ? '#3D8B37' : '#E74C3C';
    };
  
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
  }
  
  function createNetworkStatusElement() {
    const statusElement = document.createElement('div');
    statusElement.id = 'network-status';
    statusElement.style.position = 'fixed';
    statusElement.style.bottom = '10px';
    statusElement.style.right = '10px';
    statusElement.style.padding = '5px 10px';
    statusElement.style.borderRadius = '3px';
    statusElement.style.color = 'white';
    statusElement.style.zIndex = '1000';
    document.body.appendChild(statusElement);
    return statusElement;
  }
  
  // ====================== FUNÇÕES DE APOIO ======================
  
  function saveToLocalStorage(data) {
    try {
      const logs = JSON.parse(localStorage.getItem('accessLogs') || []);
      logs.push(data);
      localStorage.setItem('accessLogs', JSON.stringify(logs.slice(-100))); // Mantém apenas os 100 últimos
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }
  
  function sendToAnalytics(data) {
    // Simulação de envio para Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'platform_access', {
        platform: data.platform
      });
    }
    
    // Fallback usando Beacon API
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    }
  }
  
  // ====================== POLYFILLS ======================
  // Garante compatibilidade com navegadores antigos
  if (!Node.prototype.insertAdjacentHTML) {
    Node.prototype.insertAdjacentHTML = function(position, text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      
      switch (position.toLowerCase()) {
        case 'beforebegin':
          this.parentNode.insertBefore(div.firstChild, this);
          break;
        case 'afterbegin':
          this.insertBefore(div.firstChild, this.firstChild);
          break;
        case 'beforeend':
          this.appendChild(div.firstChild);
          break;
        case 'afterend':
          this.parentNode.insertBefore(div.firstChild, this.nextSibling);
          break;
      }
    };
  }

  // Nova função de busca
  function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const cards = document.querySelectorAll('.card');
    
    // Previne o envio do formulário
    document.querySelector('.search-form').addEventListener('submit', (e) => {
        e.preventDefault();
    });

    // Função de filtro
    const filterCards = (searchTerm) => {
        searchTerm = searchTerm.toLowerCase().trim();
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const shouldShow = searchTerm === '' || title.includes(searchTerm);
            
            // Adiciona/remove classe para animação
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    };

    // Evento de input para busca em tempo real
    searchInput.addEventListener('input', (e) => {
        filterCards(e.target.value);
    });

    // Evento de clique no botão de busca
    searchButton.addEventListener('click', () => {
        filterCards(searchInput.value);
    });

    // Limpa a busca quando o campo está vazio
    searchInput.addEventListener('blur', () => {
        if (searchInput.value === '') {
            filterCards('');
        }
    });
  }