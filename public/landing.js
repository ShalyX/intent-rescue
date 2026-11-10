(() => {
  const menuButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');

  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 650) closeMenu();
    }, { passive: true });
  }

  const cases = {
    F1: {
      image: '/public/landing/osiali-f1-preview.webp',
      alt: 'Actual OSIALI F1 captured investigation showing an unresolved destination delivery and unobserved refund.',
      kicker: 'FAILED / UNRESOLVED · LTC → ETH',
      title: 'The transfer reaches an evidence boundary.',
      description: 'Source deposit, 1Click intake, and intent/solver evidence are present. Destination delivery and refund evidence are not observed in this captured evidence set.',
      status: 'Failed / unresolved',
      boundary: 'Destination delivery',
      href: '/app/?demo=F1'
    },
    F2: {
      image: '/public/landing/osiali-f2-preview.webp',
      alt: 'Actual OSIALI F2 captured investigation showing a source-reported refund and an unobserved destination delivery.',
      kicker: 'SOURCE-REPORTED REFUND · USDC → xDAI',
      title: 'A refund is present in the captured evidence.',
      description: 'The captured source snapshot reports a refund. Destination delivery is not observed in this evidence set; this is not a claim of independent chain-finality verification.',
      status: 'Refund reported by source',
      boundary: 'Destination delivery',
      href: '/app/?demo=F2'
    },
    F3: {
      image: '/public/landing/osiali-f3-preview.webp',
      alt: 'Actual OSIALI F3 captured investigation showing a source-reported successful withdrawal.',
      kicker: 'SOURCE-REPORTED COMPLETION · ZEC → ETH',
      title: 'The captured source reports a successful withdrawal.',
      description: 'The source snapshot reports a successful withdrawal. Refund evidence is not observed; the captured record is not a claim of independent chain-finality verification.',
      status: 'Successful withdrawal reported',
      boundary: 'Refund',
      href: '/app/?demo=F3'
    }
  };

  const tabs = [...document.querySelectorAll('[data-case]')];
  const image = document.querySelector('#case-preview');
  const panel = document.querySelector('#case-panel');
  if (tabs.length && image && panel) {
    const fields = {
      imageId: document.querySelector('#case-image-id'),
      kicker: document.querySelector('#case-kicker'),
      title: document.querySelector('#case-title'),
      description: document.querySelector('#case-description'),
      status: document.querySelector('#case-status'),
      boundary: document.querySelector('#case-boundary'),
      open: document.querySelector('#case-open')
    };

    const selectCase = id => {
      const item = cases[id];
      if (!item) return;
      const tab = tabs.find(candidate => candidate.dataset.case === id);
      if (!tab) return;
      tabs.forEach(candidate => {
        const selected = candidate === tab;
        candidate.setAttribute('aria-selected', String(selected));
        candidate.tabIndex = selected ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tab.id);
      image.src = item.image;
      image.alt = item.alt;
      fields.imageId.textContent = id;
      fields.kicker.textContent = item.kicker;
      fields.title.textContent = item.title;
      fields.description.textContent = item.description;
      fields.status.textContent = item.status;
      fields.boundary.textContent = item.boundary;
      fields.open.href = item.href;
      fields.open.textContent = 'Inspect ' + id + ' in OSIALI';
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      fields.open.append(' ', arrow);
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectCase(tab.dataset.case));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].focus();
        selectCase(tabs[next].dataset.case);
      });
    });
  }
})();
