/* ============================================================
   Venda para Toda a Sua Cidade — app.js
   Vanilla JS: scroll reveals, marquee, counter, carousel,
   accordion, progress bar, sticky CTA, text reveal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- LUCIDE ICONS ---------- */
  function drawIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /* ============================================================
     BÔNUS — build cards (front/back) for sequential flip
     ============================================================ */
  var BONUSES = [
    { n: '01', nm: 'Checklist de Lançamento',        icon: 'rocket',         desc: 'O passo a passo para colocar seu produto no ar sem esquecer de nada.' },
    { n: '02', nm: 'Kit de Descrições e Mensagens',  icon: 'message-circle', desc: 'Textos prontos para descrever seus pratos e responder clientes.' },
    { n: '03', nm: 'Planner Semanal da Vendedora',   icon: 'calendar',       desc: 'Organize produção, compras e pedidos sem se perder na semana.' },
    { n: '04', nm: 'Guia de Fotografia',             icon: 'camera',         desc: 'Fotos que dão água na boca usando só o seu celular.' },
    { n: '05', nm: 'Guia de Avaliações',             icon: 'star',           desc: 'Como conquistar avaliações 5 estrelas e atrair mais clientes.' },
    { n: '06', nm: 'Calculadora de Preço',           icon: 'calculator',     desc: 'Cobre o preço certo e garanta seu lucro em cada pedido.' },
    { n: '07', nm: 'Guia de Embalagens',             icon: 'package',        desc: 'Embalagens que protegem, encantam e fazem o cliente voltar.' }
  ];

  function buildBonus() {
    var grid = document.getElementById('bonus-grid');
    if (!grid) return;
    grid.innerHTML = ''; // Clear container
    BONUSES.forEach(function (b) {
      var row = document.createElement('div');
      row.className = 'bonus-row';
      
      row.innerHTML =
        '<div class="bonus-header">' +
          '<div class="ico"><i data-lucide="' + b.icon + '"></i></div>' +
          '<div class="meta">' +
            '<div class="num">Bônus ' + b.n + '</div>' +
            '<div class="nm">' + b.nm + '</div>' +
          '</div>' +
          '<div class="chevron"><i data-lucide="chevron-down"></i></div>' +
        '</div>' +
        '<div class="bonus-body">' +
          '<div class="bonus-content">' + b.desc + '</div>' +
        '</div>';
      grid.appendChild(row);
    });
  }

  /* ============================================================
     MARQUEE — duplicate content for seamless loop
     ============================================================ */
  function setupMarquee() {
    var track = document.getElementById('marquee-track');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  /* ============================================================
     INTERSECTION OBSERVER — scroll reveals + triggers
     ============================================================ */
  function setupReveals() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        // staggered groups (check-list, vol-list)
        if (el.dataset.stagger) {
          var kids = el.querySelectorAll('.reveal, .reveal-l');
          kids.forEach(function (k, i) {
            setTimeout(function () { k.classList.add('in'); }, i * 150);
          });
        } else {
          el.classList.add('in');
        }
        io.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    // observe stagger containers
    document.querySelectorAll('.check-list, .vol-list').forEach(function (g) {
      g.dataset.stagger = '1';
      io.observe(g);
    });

    // observe standalone reveals (not inside a stagger container)
    document.querySelectorAll('.reveal, .reveal-l').forEach(function (el) {
      if (el.closest('.check-list, .vol-list')) return;
      io.observe(el);
    });
  }

  /* ============================================================
     COUNTER — 0 → 7
     ============================================================ */
  function setupCounter() {
    var num = document.getElementById('counter-num');
    if (!num) return;
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || done) return;
        done = true;
        var target = 7, start = null, dur = 1500;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          num.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.disconnect();
      });
    }, { threshold: 0.5 });
    io.observe(num);
  }

  /* ============================================================
     BÔNUS FLIP — sequential when grid enters viewport
     ============================================================ */
  function setupBonusFlip() {
    var grid = document.getElementById('bonus-grid');
    if (!grid) return;
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || fired) return;
        fired = true;
        var rows = grid.querySelectorAll('.bonus-row');
        rows.forEach(function (row, i) {
          setTimeout(function () {
            row.classList.add('revealed');
            // expand to reveal description slightly after sliding in
            setTimeout(function () {
              row.classList.add('expanded');
            }, 180);
          }, i * 220);
        });
        io.disconnect();
      });
    }, { threshold: 0.15 });
    io.observe(grid);

    // tap to toggle expand
    grid.addEventListener('click', function (ev) {
      var header = ev.target.closest('.bonus-header');
      if (header) {
        var row = header.closest('.bonus-row');
        if (row) row.classList.toggle('expanded');
      }
    });
  }

  /* ============================================================
     SHIELD pop (garantia)
     ============================================================ */
  function setupShield() {
    var shield = document.getElementById('shield');
    if (!shield) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { shield.classList.add('in'); io.disconnect(); }
      });
    }, { threshold: 0.5 });
    io.observe(shield);
  }

  /* ============================================================
     TEXT REVEAL — split into words, reveal on view
     ============================================================ */
  function splitWords(el) {
    if (!el) return [];
    var text = el.textContent.trim();
    el.textContent = '';
    var words = text.split(' ');
    var spans = [];
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      spans.push(s);
    });
    return spans;
  }

  function revealWords(spans, baseDelay) {
    spans.forEach(function (s, i) {
      s.animate(
        [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 500, delay: baseDelay + i * 150, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' }
      );
    });
  }

  function setupHeroTitle() {
    var title = document.getElementById('hero-title');
    if (!title) return;
    var spans = splitWords(title);
    // hero is above the fold — reveal on load
    requestAnimationFrame(function () { revealWords(spans, 250); });
  }

  function setupFinalCta() {
    var title = document.getElementById('cta-final-title');
    if (!title) return;
    var lines = title.querySelectorAll('span');
    var groups = [];
    lines.forEach(function (ln) { groups.push(splitWords(ln)); });
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || fired) return;
        fired = true;
        var delay = 0;
        groups.forEach(function (g) {
          revealWords(g, delay);
          delay += g.length * 150 + 200;
        });
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(title);
  }

  /* ============================================================
     CAROUSEL — depoimentos (swipe + dots)
     ============================================================ */
  function setupCarousel() {
    var track = document.getElementById('depo-track');
    var dotsBox = document.getElementById('depo-dots');
    var prevBtn = document.getElementById('depo-prev');
    var nextBtn = document.getElementById('depo-next');
    if (!track || !dotsBox) return;
    var slides = track.children.length;
    var index = 0;

    for (var i = 0; i < slides; i++) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Depoimento ' + (i + 1));
      (function (n) { b.addEventListener('click', function () { go(n); }); })(i);
      dotsBox.appendChild(b);
    }
    var dots = dotsBox.children;

    function go(n) {
      index = Math.max(0, Math.min(slides - 1, n));
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('active', j === index);
    }
    go(0);

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        go(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        go(index + 1);
      });
    }

    // touch swipe
    var startX = 0, dx = 0, dragging = false;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; dragging = true; dx = 0; }, { passive: true });
    track.addEventListener('touchmove', function (e) { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
    track.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function setupFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // close others
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-a').style.maxHeight = '0px';
          }
        });
        if (isOpen) {
          item.classList.remove('open');
          a.style.maxHeight = '0px';
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================================
     PROGRESS BAR
     ============================================================ */
  function setupProgress() {
    var bar = document.getElementById('progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     STICKY CTA — show after 3s, hide while #oferta visible
     ============================================================ */
  function setupSticky() {
    var sticky = document.getElementById('sticky');
    if (!sticky) return;

    var hero = document.getElementById('hero');
    var offer = document.getElementById('oferta');

    var heroVisible = true;
    var offerVisible = false;

    function refresh() {
      if (!heroVisible && !offerVisible) {
        sticky.classList.add('show');
      } else {
        sticky.classList.remove('show');
      }
    }

    if (hero) {
      var ioHero = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          heroVisible = e.isIntersecting;
          refresh();
        });
      }, { threshold: 0 });
      ioHero.observe(hero);
    }

    if (offer) {
      var ioOffer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          offerVisible = e.isIntersecting;
          refresh();
        });
      }, { threshold: 0.1 });
      ioOffer.observe(offer);
    }
  }

  /* ============================================================
     CTA SCROLL — scroll to the middle between simples and completo
     ============================================================ */
  function setupCtaScroll() {
    document.querySelectorAll('a[href="#oferta"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var simples = document.querySelector('.price-card.simples');
        var completo = document.querySelector('.price-card.completo');
        if (simples && completo) {
          var simplesRect = simples.getBoundingClientRect();
          var completoRect = completo.getBoundingClientRect();

          var simplesTopDoc = simplesRect.top + window.scrollY;
          var completoBottomDoc = completoRect.bottom + window.scrollY;
          var middleDoc = (simplesTopDoc + completoBottomDoc) / 2;

          var targetScrollY = middleDoc - (window.innerHeight / 2);

          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        } else {
          var target = document.getElementById('oferta');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ============================================================
     CHECKOUT LINKS & TRACKING
     ============================================================ */
  var CHECKOUT = {
    simples:  'https://ggcheckout.app/checkout/v5/9di0QnjSFhxtjUjcvQy8',   // Pacote Simples (R$19,90)
    completo: 'https://ggcheckout.app/checkout/v5/tYv4BiudM81i95gbyR8y',   // Pacote Completo (R$34,90)
    downsell: 'https://ggcheckout.app/checkout/v5/ZQTAihwqOtnsWEFqy3FF'    // Downsell (R$24,90)
  };
  function setupCheckout() {
    document.querySelectorAll('[data-checkout]').forEach(function (a) {
      var key = a.getAttribute('data-checkout');
      if (CHECKOUT[key] && CHECKOUT[key] !== '#') a.setAttribute('href', CHECKOUT[key]);
    });
  }

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
      console.warn('Tracking InitiateCheckout failed:', err);
    }
  }

  function setupCheckoutTracking() {
    document.querySelectorAll('[data-checkout]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var key = btn.getAttribute('data-checkout');
        // If it's simples and we haven't shown downsell yet, we don't trigger checkout yet
        if (key === 'simples' && !hasShownDownsell) {
          return;
        }
        fireInitiateCheckout(key);
      });
    });
  }

  /* ============================================================
     DOWNSELL POPUP MODAL & EXIT INTENT
     ============================================================ */
  var hasShownDownsell = false;

  function openDownsellModal() {
    var modal = document.getElementById('downsell-modal');
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeDownsellModal() {
    var modal = document.getElementById('downsell-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function setupDownsell() {
    var modal = document.getElementById('downsell-modal');
    if (!modal) return;

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
        // Trigger initiate checkout event for simples package
        fireInitiateCheckout('simples');
        // Redirect to Simples checkout
        if (CHECKOUT.simples && CHECKOUT.simples !== '#') {
          window.location.href = CHECKOUT.simples;
        } else {
          // Fallback scroll to offers
          var offerSec = document.getElementById('oferta');
          if (offerSec) offerSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Intercept clicks on Pacote Simples CTA button
    document.querySelectorAll('[data-checkout="simples"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (!hasShownDownsell) {
          e.preventDefault();
          hasShownDownsell = true;
          openDownsellModal();
        } else {
          // If already shown once, let the click go through naturally (to simples checkout)
          if (CHECKOUT.simples === '#') {
            e.preventDefault();
            var offerSec = document.getElementById('oferta');
            if (offerSec) offerSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Exit Intent - Desktop (detect mouse leaving top of the screen)
    document.addEventListener('mouseleave', function (e) {
      if (e.clientY < 20 && !hasShownDownsell) {
        hasShownDownsell = true;
        openDownsellModal();
      }
    });

    // Exit Intent - Mobile (History API back-button interception)
    if (window.history && window.history.pushState) {
      // Setup history states to intercept back button
      try {
        window.history.pushState({ exitIntent: true }, '');
        window.history.pushState({ main: true }, '');

        window.addEventListener('popstate', function (e) {
          if (e.state && e.state.exitIntent && !hasShownDownsell) {
            hasShownDownsell = true;
            openDownsellModal();
            // Re-push main state to allow back navigation subsequent clicks to work
            window.history.pushState({ main: true }, '');
          }
        });
      } catch (err) {
        console.warn('History API not fully supported or restricted:', err);
      }
    }
  }

  /* ============================================================
     REAL MARQUEE — duplicate content for infinite loop
     ============================================================ */
  function setupRealMarquee() {
    var track = document.getElementById('real-track');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    buildBonus();
    setupMarquee();
    setupRealMarquee();
    drawIcons();          // after dynamic content is in the DOM
    setupReveals();
    setupCounter();
    setupBonusFlip();
    setupShield();
    setupHeroTitle();
    setupFinalCta();
    setupCarousel();
    setupFaq();
    setupProgress();
    setupSticky();
    setupCheckout();
    setupCtaScroll();
    setupDownsell();
    initLegal();
    setupCheckoutTracking();
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

  function initLegal() {
    var modal = document.getElementById('legalModal');
    var title = document.getElementById('legalTitle');
    var body = document.getElementById('legalModalBody');
    if (!modal) return;

    function open(kind) {
      var c = LEGAL_CONTENT[kind];
      if (!c) return;
      title.textContent = c.title;
      body.innerHTML = c.html;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-legal]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(a.getAttribute('data-legal'));
      });
    });

    document.querySelectorAll('[data-legal-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
