/* ============================================================
   LP V4 ULTIMATO — app-v4.js
   Lógica simplificada e ultrarrápida de Conversão, Tracking e Downsell
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     CHECKOUT CONFIGS
     ============================================================ */
  var CHECKOUT = {
    simples:  'https://ggcheckout.app/checkout/v5/9di0QnjSFhxtjUjcvQy8',   // R$19,90
    completo: 'https://ggcheckout.app/checkout/v5/tYv4BiudM81i95gbyR8y',   // R$34,90
    downsell: 'https://ggcheckout.app/checkout/v5/ZQTAihwqOtnsWEFqy3FF'    // R$24,90
  };

  /* ============================================================
     INITIATE CHECKOUT TRACKING
     ============================================================ */
  function fireInitiateCheckout(key) {
    var value = 19.90;
    var label = 'Pacote Simples';
    
    if (key === 'completo') {
      value = 34.90;
      label = 'Pacote Completo';
    } else if (key === 'downsell') {
      value = 24.90;
      label = 'Pacote Completo (Downsell)';
    }

    try {
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: label,
          value: value,
          currency: 'BRL'
        });
      }
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'BRL',
          value: value,
          items: [{
            item_name: label,
            price: value,
            quantity: 1
          }]
        });
      }
      if (window.clarity) {
        window.clarity('event', 'click_checkout_' + key);
      }
    } catch (err) {
      console.warn('InitiateCheckout tracking error:', err);
    }
  }

  function setupCheckoutLinks() {
    // Definir os links estáticos nos elementos corretos
    document.querySelectorAll('[data-checkout]').forEach(function (btn) {
      var key = btn.getAttribute('data-checkout');
      if (key === 'simples') {
        btn.setAttribute('href', '#'); // Simples só abre popup, não vai direto
      } else if (CHECKOUT[key]) {
        btn.setAttribute('href', CHECKOUT[key]);
      }

      btn.addEventListener('click', function (e) {
        if (key === 'simples') {
          e.preventDefault();
          openDownsellModal();
        } else {
          // Dispara pixels ao ir para Completo ou Downsell
          fireInitiateCheckout(key);
        }
      });
    });
  }

  /* ============================================================
     DOWNSELL POPUP MODAL LOGIC
     ============================================================ */
  var downsellModal = document.getElementById('downsell-modal');

  function openDownsellModal() {
    if (downsellModal) {
      downsellModal.classList.add('show');
      downsellModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeDownsellModal() {
    if (downsellModal) {
      downsellModal.classList.remove('show');
      downsellModal.setAttribute('aria-hidden', 'true');
    }
  }

  function setupDownsellModal() {
    if (!downsellModal) return;

    var closeBtn = document.getElementById('downsell-close');
    var declineLink = document.getElementById('downsell-decline');

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeDownsellModal();
      });
    }

    if (declineLink) {
      declineLink.addEventListener('click', function (e) {
        e.preventDefault();
        closeDownsellModal();
        fireInitiateCheckout('simples');
        window.location.href = CHECKOUT.simples;
      });
    }

    // Fechar ao clicar fora do modal
    downsellModal.addEventListener('click', function (e) {
      if (e.target === downsellModal) {
        closeDownsellModal();
      }
    });
  }

  /* ============================================================
     STICKY BOTTOM CTA BAR
     ============================================================ */
  function setupStickyBar() {
    var bar = document.getElementById('sticky-cta-bar');
    if (!bar) return;

    var offerBox1 = document.getElementById('cta-box-1');
    var offerBox2 = document.getElementById('cta-box-2');

    var cta1Visible = false;
    var cta2Visible = false;

    function handleScroll() {
      var scrollY = window.scrollY;
      
      // Mostrar barra apenas depois de rolar 400px
      var shouldShow = scrollY > 400;

      // Ocultar se alguma das seções de CTA principal estiver visível
      if (offerBox1) {
        var rect = offerBox1.getBoundingClientRect();
        cta1Visible = (rect.top < window.innerHeight && rect.bottom > 0);
      }
      if (offerBox2) {
        var rect2 = offerBox2.getBoundingClientRect();
        cta2Visible = (rect2.top < window.innerHeight && rect2.bottom > 0);
      }

      if (shouldShow && !cta1Visible && !cta2Visible) {
        bar.classList.add('show');
      } else {
        bar.classList.remove('show');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Configurar clique para rolar até o primeiro CTA
    var btn = bar.querySelector('.btn-sticky');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (offerBox1) {
          offerBox1.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  /* ============================================================
     LEGAL MODALS (Privacy Policy & Terms of Use)
     ============================================================ */
  var LEGAL_CONTENT = {
    privacy: {
      title: 'Política de Privacidade',
      html: '<p>Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados pessoais ao adquirir nossos produtos digitais.</p>' +
            '<h4>1. Responsabilidade</h4>' +
            '<p>Somos responsáveis pelo infoproduto "Venda para Toda a Sua Cidade". Contato: <strong>moreira.digital2026@gmail.com</strong>.</p>' +
            '<h4>2. Coleta de dados</h4>' +
            '<p>Coletamos nome, e-mail e CPF informados no checkout para envio do link do PDF e controle fiscal de venda. Dados de navegação (cookies, IP) são capturados de forma totalmente anônima para análise de cliques e anúncios.</p>' +
            '<h4>3. Proteção e Retenção</h4>' +
            '<p>Seus dados são protegidos por criptografia de ponta a ponta e nunca serão compartilhados, vendidos ou alugados para terceiros. O processamento financeiro é 100% gerenciado pela plataforma de pagamentos.</p>'
    },
    terms: {
      title: 'Termos de Uso',
      html: '<p>Ao adquirir o produto "Venda para Toda a Sua Cidade", você concorda com as diretrizes de licenciamento digital.</p>' +
            '<h4>1. Licença de Uso Pessoal</h4>' +
            '<p>O material em PDF é de uso estritamente pessoal e intransferível. Fica proibida a revenda, republicação em sites de compartilhamento ou reprodução comercial total/parcial do material sem autorização por escrito.</p>' +
            '<h4>2. Isenção de Resultados</h4>' +
            '<p>O material é meramente educativo e fornece estratégias de vendas. Os resultados dependem da dedicação individual e aplicação das técnicas ensinadas.</p>'
    }
  };

  function setupLegalModals() {
    var modal = document.getElementById('legalModal');
    var title = document.getElementById('legalTitle');
    var body = document.getElementById('legalModalBody');
    if (!modal) return;

    function open(kind) {
      var content = LEGAL_CONTENT[kind];
      if (!content) return;
      title.textContent = content.title;
      body.innerHTML = content.html;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-legal]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open(link.getAttribute('data-legal'));
      });
    });

    document.querySelectorAll('[data-legal-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  function init() {
    setupCheckoutLinks();
    setupDownsellModal();
    setupStickyBar();
    setupLegalModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
