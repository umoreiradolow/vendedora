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
            setTimeout(function () { k.classList.add('in'); }, i * 75);
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
     SECTION 8 — BÔNUS SECTION INTERACTIVITY & VIEWPORT REVEAL
     ============================================================ */
  function setupBonusSection() {
    var section = document.getElementById('bonus');
    if (!section) return;

    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.unobserve(section);
          
          if (!fired) {
            fired = true;
            // 0.6s to 1.2s -> Card Bônus 01-07 appear with cascade (0.12s delay between cards)
            var wrappers = section.querySelectorAll('.bonus-card-wrapper');
            wrappers.forEach(function (wrap, idx) {
              setTimeout(function () {
                wrap.classList.add('in');
              }, 300 + idx * 60);
            });
          }
        }
      });
    }, { threshold: 0.12 });
    io.observe(section);

    // Flip card trigger
    var cards = section.querySelectorAll('.bonus-card-inner');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        card.classList.add('flipped');
      });

      var understandBtn = card.querySelector('.btn-bc-understand');
      if (understandBtn) {
        understandBtn.addEventListener('click', function (ev) {
          ev.stopPropagation(); // prevent immediate reflipped since parent card has click listener
          card.classList.remove('flipped');
        });
      }
    });

    // Return CTA smooth scroll to Completo card
    var returnBtn = document.getElementById('btn-bonus-return');
    if (returnBtn) {
      returnBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('oferta-card-completo');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
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

  function setupHeroTimeline() {
    var mockup = document.getElementById('hero-mockup');
    var titleSpans = document.querySelectorAll('#hero-title .w');
    var trigger = document.querySelector('.underline-trigger');
    var subtitle = document.getElementById('hero-subtitle');
    var support = document.getElementById('hero-support');
    var ctaWrap = document.getElementById('hero-cta-container');
    var ctaBtn = document.getElementById('hero-cta');
    var scrollInd = document.getElementById('hero-scroll-indicator');

    // 0.3s -> Mockup appears
    setTimeout(function () {
      if (mockup) mockup.classList.add('in');
    }, 150);

    // 0.8s -> Title word-by-word reveal starts (120ms between words)
    titleSpans.forEach(function (span, index) {
      setTimeout(function () {
        span.classList.add('in');
      }, 400 + index * 60);
    });

    // 1.6s -> Underline grows under "sua cidade inteira"
    setTimeout(function () {
      if (trigger) trigger.classList.add('active');
    }, 400);

    // 2.3s -> Pump pulse emphasis on "sua cidade inteira" once the title reveal and underline are complete
    setTimeout(function () {
      if (trigger) trigger.classList.add('pump-once');
    }, 1150);

    // 1.9s -> Subtitle appears
    setTimeout(function () {
      if (subtitle) subtitle.classList.add('in');
    }, 950);

    // 2.2s -> Supporting text appears
    setTimeout(function () {
      if (support) support.classList.add('in');
    }, 1100);

    // 2.5s -> CTA button appears
    setTimeout(function () {
      if (ctaWrap) ctaWrap.classList.add('in');
    }, 1250);

    // 2.8s -> CTA button pulse loop begins
    setTimeout(function () {
      if (ctaWrap) ctaWrap.classList.add('pulsing');
      if (ctaBtn) ctaBtn.classList.add('pulsing');
    }, 1400);

    // 3.0s -> Scroll indicator appears
    setTimeout(function () {
      if (scrollInd) scrollInd.classList.add('in');
    }, 1500);

    // Also initialize magnetic CTA effect on desktop
    setupMagneticButton();
  }

  function setupMagneticButton() {
    var btn = document.getElementById('hero-cta');
    if (!btn || window.innerWidth < 768) return; // Only on desktop/tablet

    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      // move button by 25% of mouse offset and breathe scale
      btn.style.transform = 'translate3d(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px, 0) scale(1.03)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  function setupFinalCta() {
    const section = document.getElementById('cta-final');
    if (!section) return;
    
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(section);
  }

  /* ============================================================
     CAROUSEL — depoimentos (swipe + dots)
     ============================================================ */
  function setupCarousel() {
    var section = document.getElementById('depoimentos');
    if (!section) return;
    var cards = section.querySelectorAll('.depo-card');
    var dots = section.querySelectorAll('.depo-dot');
    var prevBtn = section.querySelector('.depo-nav-btn.prev');
    var nextBtn = section.querySelector('.depo-nav-btn.next');
    if (cards.length === 0) return;
    
    var currentIndex = 0;
    var timer = null;
    var resumeTimer = null;
    
    function showSlide(index) {
      var prevIndex = currentIndex;
      currentIndex = (index + cards.length) % cards.length;
      
      cards.forEach(function(card, i) {
        card.classList.remove('active', 'exit');
        if (i === prevIndex) {
          card.classList.add('exit');
        }
      });
      
      cards[currentIndex].classList.add('active');
      
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    function nextSlide() {
      showSlide(currentIndex + 1);
    }
    
    function prevSlide() {
      showSlide(currentIndex - 1);
    }
    
    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(nextSlide, 6000);
    }
    
    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }
    
    function handleUserInteraction() {
      stopAutoplay();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAutoplay, 1500);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); handleUserInteraction(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); handleUserInteraction(); });
    
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { showSlide(i); handleUserInteraction(); });
    });
    
    // Swipe gestures on mobile
    var touchStartX = 0;
    var touchEndX = 0;
    var trackContainer = section.querySelector('.depo-carousel-track-container');
    if (trackContainer) {
      trackContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });
      
      trackContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        handleUserInteraction();
      }, { passive: true });
    }
    
    section.addEventListener('mouseenter', stopAutoplay);
    section.addEventListener('mouseleave', startAutoplay);
    
    startAutoplay();
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function setupFaq() {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;
    
    const items = faqSection.querySelectorAll('.faq-accordion-item');
    items.forEach(function (item) {
      const btn = item.querySelector('.faq-accordion-item__btn');
      const answer = item.querySelector('.faq-accordion-item__answer');
      if (!btn || !answer) return;
      
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('is-open');
        
        // Close other items
        items.forEach(function (i) {
          if (i !== item) {
            i.classList.remove('is-open');
            const ans = i.querySelector('.faq-accordion-item__answer');
            if (ans) ans.style.maxHeight = null;
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = null;
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
    
    // Intersection observer to animate entrance & auto-open first item
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          faqSection.classList.add('active');
          
          // Auto-open first item after 0.8s
          setTimeout(function () {
            const firstItem = items[0];
            const firstAnswer = firstItem ? firstItem.querySelector('.faq-accordion-item__answer') : null;
            const firstBtn = firstItem ? firstItem.querySelector('.faq-accordion-item__btn') : null;
            // Only open if the user hasn't interacted/opened anything else yet
            if (firstItem && firstAnswer && firstBtn && !faqSection.querySelector('.faq-accordion-item.is-open')) {
              firstItem.classList.add('is-open');
              firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
              firstBtn.setAttribute('aria-expanded', 'true');
            }
          }, 400);
          
          io.unobserve(faqSection);
        }
      });
    }, { threshold: 0.15 });
    io.observe(faqSection);
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
      // Skip simples checkout on load to prevent external pixel wrappers from intercepting
      if (key === 'simples') return;
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
      var key = btn.getAttribute('data-checkout');
      if (key === 'simples') return; // Handled inside setupDownsell decline trigger
      
      btn.addEventListener('click', function (e) {
        // If they click completo or downsell, immediately block the exit intent popup from showing
        if (key === 'completo' || key === 'downsell') {
          markDownsellAsShown();
        }
        fireInitiateCheckout(key);
      });
    });
  }

  /* ============================================================
     DOWNSELL POPUP MODAL & EXIT INTENT
     ============================================================ */
  var hasShownDownsell = sessionStorage.getItem('hasShownDownsell') === 'true';

  function markDownsellAsShown() {
    hasShownDownsell = true;
    try {
      sessionStorage.setItem('hasShownDownsell', 'true');
    } catch (err) {
      console.warn('sessionStorage is not accessible:', err);
    }
  }

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
        markDownsellAsShown(); // Prevent exit intent popup on redirect
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

    // Intercept clicks on Pacote Simples CTA button (always opens the downsell modal)
    document.querySelectorAll('[data-checkout="simples"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        markDownsellAsShown();
        openDownsellModal();
      });
    });



    // Global capture-phase click listener to set hasShownDownsell = true instantly for checkout links (except first simples click)
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-checkout], #downsell-decline, a[href*="ggcheckout.app"]');
      if (target) {
        var key = target.getAttribute('data-checkout');
        if (key !== 'simples') {
          markDownsellAsShown();
        }
      }
    }, true);

    // Prevent exit-intent modal triggers when the page is unloading / navigating away
    window.addEventListener('beforeunload', function () {
      markDownsellAsShown();
    });
    window.addEventListener('pagehide', function () {
      markDownsellAsShown();
    });
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
     HERO ALTERNATION (Covers <=> Photos every 1.5s)
     ============================================================ */
  // setupHeroAlternate removed in LP V3 in favor of static 3D Book Fan Mockup

  /* ============================================================
     SECTION 2 — A DOR NOMEADA VIEWPORT OBSERVER
     ============================================================ */
  function setupDorReveal() {
    var dor = document.getElementById('dor');
    if (!dor) return;
    var ioDor = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          dor.classList.add('active');
          ioDor.unobserve(dor);
        }
      });
    }, { threshold: 0.15 });
    ioDor.observe(dor);
  }

  /* ============================================================
     SECTION 3 — A VIRADA VIEWPORT OBSERVER & STEP TIMINGS
     ============================================================ */
  function setupViradaReveal() {
    var virada = document.getElementById('virada');
    if (!virada) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          virada.classList.add('active');
          
          var steps = virada.querySelectorAll('.flow-step');
          var arrows = virada.querySelectorAll('.flow-arrow');
          
          // Etapas surgem a partir de 1.4s em sequência (intervalos de 250ms)
          steps.forEach(function (step, idx) {
            setTimeout(function () {
              step.classList.add('in');
            }, 700 + idx * 125);
          });
          
          // Setas surgem logo após a etapa correspondente surgir
          arrows.forEach(function (arrow, idx) {
            setTimeout(function () {
              arrow.classList.add('in');
            }, 700 + idx * 125 + 130);
          });
          
          io.unobserve(virada);
        }
      });
    }, { threshold: 0.15 });
    io.observe(virada);
  }

  /* ============================================================
     SECTION 4 — PROVA DE QUE É PRA ELA VIEWPORT OBSERVER & SPEEDOMETER
     ============================================================ */
  function setupProvaReveal() {
    var section = document.getElementById('prova');
    if (!section) return;
    
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.unobserve(section);
          
          // Disparar os contadores velocímetros em 1.2s
          if (!fired) {
            fired = true;
            setTimeout(function () {
              runSpeedometer('proof-num-alunas', 847, 500);
              runSpeedometer('proof-num-estados', 12, 500);
            }, 600);
          }
        }
      });
    }, { threshold: 0.15 });
    io.observe(section);
  }

  function runSpeedometer(id, target, duration) {
    var el = document.getElementById(id);
    if (!el) return;
    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var progress = Math.min((currentTime - startTime) / duration, 1);
      // Easing cúbico de desaceleração (velocímetro)
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  /* ============================================================
     SECTION 5 — OS 4 VOLUMES VIEWPORT OBSERVER
     ============================================================ */
  function setupVolumesReveal() {
    var section = document.getElementById('volumes');
    if (!section) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.unobserve(section);
        }
      });
    }, { threshold: 0.12 });
    io.observe(section);
  }

  /* ============================================================
     SECTION 6 — DEPOIMENTOS VIEWPORT OBSERVER & TRUST COUNTER
     ============================================================ */
  function setupDepoimentosReveal() {
    var section = document.getElementById('depoimentos');
    if (!section) return;
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.unobserve(section);
          
          if (!fired) {
            fired = true;
            setTimeout(function () {
              animateTrustCounter('trust-counter-vendedoras', 847, 600);
            }, 1000);
          }
        }
      });
    }, { threshold: 0.12 });
    io.observe(section);
  }

  function animateTrustCounter(id, target, duration) {
    var el = document.getElementById(id);
    if (!el) return;
    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var progress = Math.min((currentTime - startTime) / duration, 1);
      var eased = progress * (2 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  /* ============================================================
     SECTION 7 — OFERTA VIEWPORT OBSERVER & PRICE COUNTDOWN
     ============================================================ */
  function setupOfertaReveal() {
    var section = document.getElementById('oferta');
    if (!section) return;
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.unobserve(section);
          
          if (!fired) {
            fired = true;
            
            // 1.0s -> Lista de bônus do Card Completo se revela linha por linha (0.08s delay)
            var bonusItems = section.querySelectorAll('.pc-bonus-item');
            bonusItems.forEach(function (item, idx) {
              setTimeout(function () {
                item.classList.add('in');
              }, 500 + idx * 40);
            });
            
            // 1.8s -> Counter de preço cai de R$134,90 para R$34,90 em 1.2s
            setTimeout(function () {
              runPriceCounter('completo-price-val-row', 134.90, 34.90, 600);
            }, 900);
            
            // 2.0s -> Pulso de borda do card completo começa em loop
            setTimeout(function () {
              var completoCard = document.getElementById('oferta-card-completo');
              if (completoCard) completoCard.classList.add('glow-active');
            }, 2000);
          }
        }
      });
    }, { threshold: 0.12 });
    io.observe(section);
  }

  function runPriceCounter(id, start, end, duration) {
    var el = document.getElementById(id);
    if (!el) return;
    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var progress = Math.min((currentTime - startTime) / duration, 1);
      var eased = progress * (2 - progress);
      var current = start - (start - end) * eased;
      el.innerHTML = 'R$' + current.toFixed(2).replace('.', ',');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  /* ============================================================
     SECTION 9 — GARANTIA VIEWPORT OBSERVER & PULSE ANIMATIONS
     ============================================================ */
  function setupGarantiaSection() {
    var section = document.getElementById('garantia');
    if (!section) return;

    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          section.classList.add('active');
          io.unobserve(section);
          
          if (!fired) {
            fired = true;

            // 0.6s -> Shield pulse active in loop
            setTimeout(function () {
              var shield = document.getElementById('garantia-shield');
              if (shield) shield.classList.add('pulse-active');
            }, 600);

            // 2.0s -> 3 lines of coverage slide in
            var items = section.querySelectorAll('.garantia-cover-item');
            items.forEach(function (item, idx) {
              setTimeout(function () {
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0)';
              }, 2000 + idx * 150);
            });
          }
        }
      });
    }, { threshold: 0.12 });
    io.observe(section);

    // Smooth Scroll triggers for return CTA and discrete link
    var cta = document.getElementById('btn-garantia-cta');
    var link = document.getElementById('link-garantia-discrete');
    
    function scrollToOffer(e) {
      e.preventDefault();
      var target = document.getElementById('oferta');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    if (cta) cta.addEventListener('click', scrollToOffer);
    if (link) link.addEventListener('click', scrollToOffer);
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    setupMarquee();
    setupRealMarquee();
    drawIcons();          // after dynamic content is in the DOM
    setupReveals();
    setupCounter();
    setupHeroTimeline();
    setupDorReveal();
    setupViradaReveal();
    setupProvaReveal();
    setupVolumesReveal();
    setupDepoimentosReveal();
    setupOfertaReveal();
    setupBonusSection();
    setupGarantiaSection();
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
