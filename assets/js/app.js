/**
 * app.js - Portal do Aluno Vicente Rijo
 * @author Prof. Bruno Carvalho
 * @version 2.0 (2025)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ====================== INICIALIZAÇÃO ======================
    initParallax();
    setupCards();
    registerServiceWorker();
    checkNetworkStatus();
  
    // Pré-carrega imagens críticas
    preloadImages([
      '/assets/images/logos/logo.png',
      '/assets/images/logos/paralax.webp',
      '/assets/images/icons/search.svg'
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
      // Evento de clique
      card.addEventListener('click', function() {
        trackLinkClick(this.dataset.platform);
        
        // Redirecionamento seguro
        const link = this.querySelector('.card-link');
        if (link) {
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
      });
  
      // Efeito hover via JS (fallback para mobile)
      card.addEventListener('touchstart', function() {
        this.classList.add('card-hover');
      });
      
      card.addEventListener('touchend', function() {
        this.classList.remove('card-hover');
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