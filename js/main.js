/* ==========================================================================
   Mohamad Zaid A. Shaikh — Portfolio behaviour
   --------------------------------------------------------------------------
   Plain ES6+. No dependencies, no build step.
   Each feature is an independent init*() function, so removing one section
   of markup never breaks the rest of the page.

     1.  Utilities
     2.  Theme toggle
     3.  Mobile navigation
     4.  Sticky header + scroll spy
     5.  Scroll reveal
     6.  Project filter
     7.  Copy to clipboard
     8.  Contact form
     9.  Footer year
   ========================================================================== */

(function () {
  'use strict';

  /* ======================================================================
     1. UTILITIES
     ====================================================================== */

  const $  = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  /** Honour the visitor's "reduce motion" OS setting. */
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Re-trigger a CSS animation on an element.
   * Removing the class, forcing a reflow, then re-adding it is the standard
   * way to restart a one-shot animation in vanilla JS.
   */
  function restartAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth; // force reflow
    el.classList.add(className);
    el.addEventListener(
      'animationend',
      () => el.classList.remove(className),
      { once: true }
    );
  }


  /* ======================================================================
     2. THEME TOGGLE
     The initial value is set by the inline script in <head> (to avoid a
     flash). This only handles the user's clicks from then on.
     ====================================================================== */

  function initThemeToggle() {
    const root = document.documentElement;
    const button = $('[data-theme-toggle]');
    if (!button) return;

    /** What the visitor currently sees: their OS setting, or their choice. */
    const currentIsDark = () =>
      root.getAttribute('data-theme') === 'dark' ||
      (!root.hasAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    function updateLabel() {
      const dark = currentIsDark();
      button.setAttribute(
        'aria-label',
        dark ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }

    button.addEventListener('click', () => {
      const next = currentIsDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* Safari private mode — the choice just won't persist. */
      }
      updateLabel();
    });

    updateLabel();

    // If the visitor has no saved preference, follow the OS live.
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateLabel);
  }


  /* ======================================================================
     3. MOBILE NAVIGATION
     ====================================================================== */

  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const nav = $('#primary-nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      nav.classList.toggle('is-open', open);
    };

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    // Following a link should always close the menu.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a') && isOpen()) setOpen(false);
    });

    // Escape closes it and returns focus to the button that opened it.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Clicking outside dismisses it.
    document.addEventListener('click', (e) => {
      if (isOpen() && !e.target.closest('.site-header__inner')) setOpen(false);
    });

    // The nav is a horizontal bar on desktop, so the open state is irrelevant.
    const desktop = window.matchMedia('(min-width: 62rem)');
    desktop.addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }


  /* ======================================================================
     4. STICKY HEADER + SCROLL SPY
     ====================================================================== */

  function initScrollSpy() {
    const header = $('#site-header');
    if (header) {
      const onScroll = () => {
        header.classList.toggle('is-stuck', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    const links = $$('.nav__link[href^="#"]');
    if (!links.length) return;

    // Map each nav link to its section.
    const targets = links
      .map((link) => {
        const section = $(link.getAttribute('href'));
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    const navHeight = () => $('#site-header')?.offsetHeight ?? 64;

    function setActive(id) {
      targets.forEach(({ link }) => {
        const isCurrent = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    /**
     * A band across the middle of the viewport: whichever section overlaps it
     * is the one you're actually reading. Far cheaper and steadier than
     * recalculating geometry on every scroll frame.
     */
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) setActive(visible[0].target.id);
      },
      {
        rootMargin: `-${Math.round(navHeight() * 0.5)}px 0px -50% 0px`,
        threshold: 0,
      }
    );

    targets.forEach(({ section }) => spy.observe(section));

    // At the very top of the page, "Home" is the active section.
    const onScrollTop = () => {
      if (window.scrollY < navHeight() / 2) setActive('home');
    };
    window.addEventListener('scroll', onScrollTop, { passive: true });
    onScrollTop();
  }


  /* ======================================================================
     5. SCROLL REVEAL
     ====================================================================== */

  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    // With reduced motion, show everything immediately and skip the observer.
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // one-shot: reveal, then stop watching
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    items.forEach((el) => observer.observe(el));

    /**
     * Safety net: an observer never fires for content that is jumped *over*.
     * Someone who opens #contact directly, or whose browser restores a
     * mid-page scroll position, would otherwise find everything above the
     * fold stuck at opacity 0 until they scrolled back up.
     */
    function revealAlreadyPassed() {
      items.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-visible');
      });
    }

    revealAlreadyPassed();
    // Back/forward navigation restores scroll position after this script runs.
    window.addEventListener('pageshow', revealAlreadyPassed);
  }


  /* ======================================================================
     6. PROJECT FILTER
     Each card declares its technologies in `data-tags` (space separated).
     ====================================================================== */

  function initProjectFilter() {
    const grid = $('[data-project-grid]');
    const buttons = $$('[data-filter]');
    const status = $('[data-filter-status]');
    if (!grid || !buttons.length) return;

    const cards = $$('.project-card', grid);
    const labelFor = (btn) => btn.textContent.trim();

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        // Update button styling + ARIA state.
        buttons.forEach((btn) => {
          const active = btn === button;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', String(active));
        });

        let shown = 0;

        cards.forEach((card) => {
          const tags = (card.dataset.tags || '').split(/\s+/);
          const match = filter === 'all' || tags.includes(filter);

          card.hidden = !match;
          if (match) {
            shown += 1;
            if (!prefersReducedMotion()) restartAnimation(card, 'is-filtered-in');
          }
        });

        if (status) {
          status.textContent =
            shown === 0
              ? 'No projects match this filter yet.'
              : `Showing ${shown} of ${cards.length} projects — ${labelFor(button)}.`;
        }
      });
    });
  }


  /* ======================================================================
     7. COPY TO CLIPBOARD
     ====================================================================== */

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback for http:// (e.g. opening index.html straight off the disk)
    // and older browsers.
    return new Promise((resolve, reject) => {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;';
      document.body.appendChild(helper);
      helper.select();

      try {
        document.execCommand('copy')
          ? resolve()
          : reject(new Error('Copy command was rejected.'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(helper);
      }
    });
  }

  function initCopyEmail() {
    const buttons = $$('[data-copy-email]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      const address = button.dataset.copyEmail;
      let timer;

      button.addEventListener('click', async (e) => {
        // The address itself is an <a>; copying is a separate affordance.
        e.preventDefault();

        try {
          await copyText(address);
          button.classList.add('is-copied');
          button.setAttribute('aria-label', 'Email address copied to clipboard');

          clearTimeout(timer);
          timer = setTimeout(() => {
            button.classList.remove('is-copied');
            button.setAttribute('aria-label', 'Copy email address to clipboard');
          }, 2000);
        } catch (err) {
          button.setAttribute('aria-label', 'Could not copy — please copy manually');
        }
      });
    });
  }


  /* ======================================================================
     8. CONTACT FORM
     Two modes, driven by one attribute:
       • data-endpoint=""  -> no backend yet. Validate, then hand the message
                               to the visitor's mail app via mailto:.
       • data-endpoint="https://formspree.io/f/xxxxxxx"
                           -> POST to Formspree and report the real result.
     ====================================================================== */

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const statusBox = $('#cf-status');
    const submitBtn = $('#cf-submit');
    const endpoint = form.dataset.endpoint?.trim();

    /* ---------- validation helpers ---------- */

    function setError(field, message) {
      const errorBox = form.querySelector(`[data-error-for="${field.name}"]`);
      if (message) {
        field.setAttribute('aria-invalid', 'true');
        if (errorBox) errorBox.textContent = message;
      } else {
        field.removeAttribute('aria-invalid');
        if (errorBox) errorBox.textContent = '';
      }
      return !message;
    }

    function validateField(field) {
      const value = field.value.trim();

      if (field.required && !value) {
        return setError(field, `${labelFor(field)} is required.`);
      }
      // Don't nag about optional fields the visitor skipped.
      if (!value) return setError(field, '');

      if (field.type === 'email' && !EMAIL_PATTERN.test(value)) {
        return setError(field, 'Enter a valid email address, e.g. you@example.com.');
      }
      if (field.minLength > 0 && value.length < field.minLength) {
        return setError(
          field,
          `Please write at least ${field.minLength} characters.`
        );
      }
      return setError(field, '');
    }

    const labelFor = (field) => {
      const label = form.querySelector(`label[for="${field.id}"]`);
      return label ? label.textContent.replace(/\s*\(optional\)\s*$/, '').trim() : 'This field';
    };

    const fields = $$('.form-input', form).filter((el) => el.type !== 'hidden');

    // Re-validate on blur, and clear the error as soon as it is fixed.
    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    function showStatus(message, kind) {
      if (!statusBox) return;
      statusBox.textContent = message;
      statusBox.classList.remove('is-success', 'is-error');
      if (kind) statusBox.classList.add(`is-${kind}`);
    }

    function setBusy(busy) {
      if (!submitBtn) return;
      submitBtn.setAttribute('aria-busy', String(busy));
      const label = $('.btn__label', submitBtn);
      if (label) label.textContent = busy ? 'Sending…' : 'Send message';
    }

    /* ---------- submit ---------- */

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate everything, then focus the first problem.
      const results = fields.map(validateField);
      if (results.includes(false)) {
        const firstBad = fields.find((f) => f.getAttribute('aria-invalid') === 'true');
        if (firstBad) firstBad.focus();
        showStatus('Please fix the highlighted fields and try again.', 'error');
        return;
      }

      const data = Object.fromEntries(
        fields.map((field) => [field.name, field.value.trim()])
      );
      data._subject = `Portfolio enquiry from ${data.name}`;

      setBusy(true);
      showStatus('', null);

      // ---- Mode 1: no endpoint configured yet -> open the mail client ----
      if (!endpoint) {
        const body =
          `Name: ${data.name}\nEmail: ${data.email}\n` +
          (data.subject ? `Subject: ${data.subject}\n` : '') +
          `\n${data.message}`;

        const href =
          'mailto:zaidshaikh3543@gmail.com' +
          `?subject=${encodeURIComponent(data._subject)}` +
          `&body=${encodeURIComponent(body)}`;

        window.location.href = href;
        setBusy(false);
        showStatus(
          'Opening your email app with the message ready to send. If nothing happened, email me directly at zaidshaikh3543@gmail.com.',
          'success'
        );
        return;
      }

      // ---- Mode 2: real endpoint (e.g. Formspree) ----
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        form.reset();
        fields.forEach((field) => setError(field, ''));
        showStatus('Thanks — your message is on its way. I usually reply within a day.', 'success');
      } catch (err) {
        showStatus(
          'Something went wrong and the message was not sent. Please email me at zaidshaikh3543@gmail.com instead.',
          'error'
        );
      } finally {
        setBusy(false);
      }
    });
  }


  /* ======================================================================
     9. FOOTER YEAR
     ====================================================================== */

  function initYear() {
    const slot = $('[data-year]');
    if (slot) slot.textContent = String(new Date().getFullYear());
  }


  /* ======================================================================
     BOOT
     ====================================================================== */

  function init() {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initProjectFilter();
    initCopyEmail();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
