/* ==========================================================
   Bankai Retro — script.js (Part 3)
   Features:
   - Dynamic product loading from data/products.json (fetch / AJAX). The HTML already
     contains the kit cards (images, alt text); the script rebuilds them for search and filters.
   - Search, filter and sort on the Products page
   - Gallery lightbox (modal) for kit images
   - Accordion (Enquiry FAQ)
   - Scroll reveal animation (respects reduced-motion settings)
   - Mobile navigation menu (toggle button on small screens)
   - Form validation (HTML5 Constraint Validation API + custom messages)
   - Enquiry form: validated, processed with fetch, cost/availability reply
   - Contact form: validated, compiled into an email (mailto)
   - Interactive Leaflet map on the Contact page
   All user-entered text is written to the page with textContent
   (never innerHTML) so it cannot inject markup.
   ========================================================== */

(function () {
  'use strict';

  var DATA_URL = 'data/products.json';
  var CONTACT_RECIPIENT = 'hello@bankairetro.co.za';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Small helpers ---------- */
  function $(selector, root) { return (root || document).querySelector(selector); }
  function $all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function money(amount) { return 'R' + amount; }

  function stockInfo(product) {
    if (product.stock <= 0) { return { label: 'Sold out', level: 'out' }; }
    if (product.stock === 1) { return { label: 'Last one', level: 'low' }; }
    return { label: 'In stock', level: 'in' };
  }

  /* ---------- AJAX: load product data once ---------- */
  var productsPromise = null;
  function loadProducts() {
    if (!productsPromise) {
      productsPromise = fetch(DATA_URL)
        .then(function (response) {
          if (!response.ok) { throw new Error('HTTP ' + response.status); }
          return response.json();
        })
        .then(function (data) { return data.products; });
    }
    return productsPromise;
  }

  /* ---------- Scroll reveal animation ---------- */
  var revealObserver = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  }

  function reveal(nodes) {
    nodes.forEach(function (node, i) {
      node.style.transitionDelay = (i * 60) + 'ms';
      if (revealObserver) { revealObserver.observe(node); }
      else { node.classList.add('is-visible'); }
    });
  }

  /* ---------- Product card ---------- */
  function imagePlaceholder() {
    return el('span', 'placeholder-img', 'Kit photo coming soon');
  }

  function createCard(product, onOpen, options) {
    var settings = options || {};
    var card = el('article', 'product-card' + (settings.animate === false ? ' is-visible' : ' reveal'));
    card.dataset.club = product.club;
    card.dataset.era = product.era;

    var media = el('button', 'card-media');
    media.type = 'button';
    media.setAttribute('aria-label', 'View larger image of ' + product.name);

    var img = new Image();
    img.src = product.image;
    img.alt = product.alt;
    img.width = 400;
    img.height = 400;
    img.loading = settings.eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', function () {
      media.classList.add('is-missing');
      media.replaceChildren(imagePlaceholder());
    });
    media.appendChild(img);
    media.addEventListener('click', function () { onOpen(product, media); });
    card.appendChild(media);

    card.appendChild(el('h3', null, product.name));
    card.appendChild(el('p', 'card-blurb', product.blurb));

    var meta = el('p', 'card-meta');
    meta.appendChild(el('span', null, 'Size ' + product.size + ' | ' + money(product.price)));
    var stock = stockInfo(product);
    meta.appendChild(el('span', 'badge badge-' + stock.level, stock.label));
    card.appendChild(meta);

    var link = el('a', 'card-link', product.stock > 0 ? 'Enquire about this kit' : 'Join the waiting list');
    link.href = 'enquiry.html?kit=' + encodeURIComponent(product.id);
    card.appendChild(link);

    return card;
  }

  /* ---------- Lightbox (gallery modal) ---------- */
  var lightbox = (function () {
    var overlay, stage, caption, closeBtn, prevBtn, nextBtn;
    var items = [];
    var index = 0;
    var returnFocus = null;

    function build() {
      overlay = el('div', 'lightbox');
      overlay.hidden = true;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Kit image viewer');

      var box = el('div', 'lightbox-box');
      closeBtn = el('button', 'lightbox-close', '\u00D7');
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close image viewer');
      prevBtn = el('button', 'lightbox-nav lightbox-prev', '\u2039');
      prevBtn.type = 'button';
      prevBtn.setAttribute('aria-label', 'Previous kit');
      nextBtn = el('button', 'lightbox-nav lightbox-next', '\u203A');
      nextBtn.type = 'button';
      nextBtn.setAttribute('aria-label', 'Next kit');
      stage = el('div', 'lightbox-stage');
      caption = el('p', 'lightbox-caption');
      caption.setAttribute('aria-live', 'polite');

      box.appendChild(closeBtn);
      box.appendChild(prevBtn);
      box.appendChild(stage);
      box.appendChild(nextBtn);
      box.appendChild(caption);
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      closeBtn.addEventListener('click', close);
      prevBtn.addEventListener('click', function () { show(index - 1); });
      nextBtn.addEventListener('click', function () { show(index + 1); });
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) { close(); }
      });
      document.addEventListener('keydown', onKey);
    }

    function show(i) {
      if (!items.length) { return; }
      index = (i + items.length) % items.length;
      var product = items[index];

      var img = new Image();
      img.src = product.image;
      img.alt = product.alt;
      img.addEventListener('error', function () {
        stage.replaceChildren(imagePlaceholder());
      });
      stage.replaceChildren(img);

      var stock = stockInfo(product);
      caption.textContent = product.name + ' \u2014 Size ' + product.size + ', ' +
        money(product.price) + ' (' + stock.label + ')';

      var single = items.length < 2;
      prevBtn.hidden = single;
      nextBtn.hidden = single;
    }

    function open(list, product, trigger) {
      if (!overlay) { build(); }
      items = list;
      returnFocus = trigger || null;
      overlay.hidden = false;
      document.body.classList.add('no-scroll');
      show(Math.max(0, items.indexOf(product)));
      closeBtn.focus();
    }

    function close() {
      if (!overlay || overlay.hidden) { return; }
      overlay.hidden = true;
      document.body.classList.remove('no-scroll');
      if (returnFocus) { returnFocus.focus(); }
    }

    function onKey(event) {
      if (!overlay || overlay.hidden) { return; }
      if (event.key === 'Escape') { close(); }
      else if (event.key === 'ArrowLeft') { show(index - 1); }
      else if (event.key === 'ArrowRight') { show(index + 1); }
      else if (event.key === 'Tab') {
        // Keep keyboard focus inside the dialog while it is open.
        var focusable = [prevBtn, nextBtn, closeBtn].filter(function (b) { return !b.hidden; });
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }

    return { open: open };
  })();

  function renderCards(container, list) {
    // Cards written in the HTML (data-static) are replaced without a second fade-in.
    var animate = !container.hasAttribute('data-static');
    container.removeAttribute('data-static');
    var cards = list.map(function (product, i) {
      return createCard(product, function (p, trigger) { lightbox.open(list, p, trigger); },
        { animate: animate, eager: i < 3 });
    });
    container.replaceChildren.apply(container, cards);
    if (animate) { reveal(cards); }
  }

  function showLoadError(container) {
    var message = el('p', 'load-error',
      'Sorry, we could not load the kits right now. Please refresh the page and try again.');
    message.setAttribute('role', 'alert');
    container.replaceChildren(message);
  }

  /* ---------- Home page: featured kits ---------- */
  function initFeatured() {
    var grid = $('#featured-grid');
    if (!grid) { return; }
    loadProducts().then(function (products) {
      renderCards(grid, products.filter(function (p) { return p.featured; }));
    }).catch(function (error) {
      console.error('Could not load featured kits:', error);
      showLoadError(grid);
    });
  }

  /* ---------- Products page: search, filter, sort ---------- */
  function fillSelect(select, values) {
    values.forEach(function (value) {
      var option = el('option', null, value);
      option.value = value;
      select.appendChild(option);
    });
  }

  function unique(list) {
    return list.filter(function (value, i) { return list.indexOf(value) === i; });
  }

  function initProducts() {
    var grid = $('#product-list');
    if (!grid) { return; }

    var search = $('#search');
    var club = $('#filter-club');
    var era = $('#filter-era');
    var sort = $('#sort');
    var inStock = $('#in-stock');
    var reset = $('#reset-filters');
    var count = $('#result-count');
    var empty = $('#no-results');

    $('#filter-form').addEventListener('submit', function (event) { event.preventDefault(); });

    loadProducts().then(function (products) {
      fillSelect(club, unique(products.map(function (p) { return p.club; })).sort());
      fillSelect(era, unique(products.map(function (p) { return p.era; })).sort());

      function apply() {
        var query = search.value.trim().toLowerCase();
        var list = products.filter(function (p) {
          var text = (p.name + ' ' + p.club + ' ' + p.season + ' ' + p.era).toLowerCase();
          return (!club.value || p.club === club.value) &&
                 (!era.value || p.era === era.value) &&
                 (!inStock.checked || p.stock > 0) &&
                 (!query || text.indexOf(query) !== -1);
        });

        var sorters = {
          'price-asc': function (a, b) { return a.price - b.price; },
          'price-desc': function (a, b) { return b.price - a.price; },
          'year-asc': function (a, b) { return a.season - b.season; },
          'year-desc': function (a, b) { return b.season - a.season; },
          'name': function (a, b) { return a.name.localeCompare(b.name); }
        };
        if (sorters[sort.value]) { list = list.slice().sort(sorters[sort.value]); }

        renderCards(grid, list);
        empty.hidden = list.length > 0;
        count.textContent = 'Showing ' + list.length + ' of ' + products.length + ' kits';
      }

      [search, club, era, sort, inStock].forEach(function (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      });
      reset.addEventListener('click', function () {
        search.value = '';
        club.value = '';
        era.value = '';
        sort.value = 'featured';
        inStock.checked = false;
        apply();
        search.focus();
      });

      apply();
    }).catch(function (error) {
      console.error('Could not load products:', error);
      showLoadError(grid);
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    $all('.accordion').forEach(function (accordion) {
      accordion.classList.add('is-ready');
      $all('.accordion-trigger', accordion).forEach(function (trigger) {
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) { return; }
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        trigger.addEventListener('click', function () {
          var open = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
          panel.classList.toggle('is-open', !open);
        });
      });
    });
  }

  /* ---------- Form validation ---------- */
  function errorBox(field) { return document.getElementById(field.id + '-error'); }

  function setFieldError(field, message) {
    var box = errorBox(field);
    if (box) { box.textContent = message || ''; }
    field.classList.toggle('has-error', Boolean(message));
    if (message) { field.setAttribute('aria-invalid', 'true'); }
    else { field.removeAttribute('aria-invalid'); }
  }

  function checkPhone(field) {
    field.setCustomValidity('');
    var raw = field.value.trim();
    if (!raw) { return; }
    var digits = raw.replace(/\D/g, '');
    var national = digits.indexOf('27') === 0 ? '0' + digits.slice(2) : digits;
    if (national.length !== 10 || national.charAt(0) !== '0') {
      field.setCustomValidity('Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.');
    }
  }

  function messageFor(field) {
    var v = field.validity;
    var label = field.dataset.label || 'This field';
    if (v.valueMissing) { return label + ' is required.'; }
    if (v.typeMismatch) { return 'Enter a valid email address, e.g. name@example.com.'; }
    if (v.tooShort) { return label + ' must be at least ' + field.minLength + ' characters.'; }
    if (v.tooLong) { return label + ' must be ' + field.maxLength + ' characters or fewer.'; }
    if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch || v.badInput) {
      return field.dataset.rangeMessage || (label + ' is not a valid value.');
    }
    if (v.patternMismatch) { return field.dataset.patternMessage || (label + ' is not in the right format.'); }
    return field.validationMessage;
  }

  function validateField(field) {
    if (field.name === 'phone') { checkPhone(field); }
    if (field.checkValidity()) { setFieldError(field, ''); return true; }
    setFieldError(field, messageFor(field));
    return false;
  }

  function formFields(form) {
    return $all('input, select, textarea', form);
  }

  function validateForm(form) {
    var firstInvalid = null;
    formFields(form).forEach(function (field) {
      if (!validateField(field) && !firstInvalid) { firstInvalid = field; }
    });
    if (firstInvalid) { firstInvalid.focus(); }
    return !firstInvalid;
  }

  function liveValidate(form) {
    formFields(form).forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        // Only re-check fields that are already showing an error.
        if (field.classList.contains('has-error')) { validateField(field); }
      });
    });
  }

  function selectedText(select) {
    return select.options[select.selectedIndex].text;
  }

  /* ---------- Enquiry form (AJAX + cost/availability response) ---------- */
  function addRow(list, label, value) {
    var row = el('div', 'response-row');
    row.appendChild(el('dt', null, label));
    row.appendChild(el('dd', null, value));
    list.appendChild(row);
  }

  function buildEnquiryResponse(data, product) {
    var wrap = el('div', 'response-card');
    wrap.appendChild(el('h2', null, 'Thanks, ' + data.name.split(' ')[0] + '. Here is your enquiry reply'));

    var list = el('dl', 'response-list');
    addRow(list, 'Enquiry type', data.typeLabel);

    if (!product) {
      addRow(list, 'Request', 'Custom or unlisted kit');
      addRow(list, 'Cost', 'Quoted after we review your details');
      addRow(list, 'Availability', 'We will search for it and let you know what we find');
    } else {
      var total = product.price * data.quantity;
      var stock = stockInfo(product);
      var availability;
      if (product.stock <= 0) {
        availability = 'Sold out right now. We can add you to the waiting list.';
      } else if (data.quantity > product.stock) {
        availability = 'Only ' + product.stock + ' in stock. We would need to source ' +
          (data.quantity - product.stock) + ' more.';
      } else {
        availability = stock.label + ' (' + product.stock + ' available)';
      }
      addRow(list, 'Kit', product.name);
      addRow(list, 'Size requested', data.size +
        (data.size !== product.size ? ' (listed in size ' + product.size + ', so this would be sourced)' : ''));
      addRow(list, 'Quantity', String(data.quantity));
      addRow(list, 'Price each', money(product.price));
      addRow(list, 'Estimated total', money(total));
      addRow(list, 'Availability', availability);
    }
    wrap.appendChild(list);

    wrap.appendChild(el('p', 'response-note',
      'Collection at our market stalls is free. Courier costs are confirmed when we reply. ' +
      'We will email ' + data.email + ' within 24\u201348 hours to confirm.'));
    return wrap;
  }

  function initEnquiry() {
    var form = $('#enquiry-form');
    if (!form) { return; }
    var kitSelect = $('#kit');
    var output = $('#enquiry-response');
    var submit = $('button[type="submit"]', form);

    liveValidate(form);

    // Fill the kit list from the same data file the Products page uses.
    loadProducts().then(function (products) {
      products.forEach(function (p) {
        var option = el('option', null, p.name + (p.stock <= 0 ? ' (sold out)' : ''));
        option.value = p.id;
        kitSelect.appendChild(option);
      });
      var custom = el('option', null, 'Other / not listed (custom request)');
      custom.value = 'custom';
      kitSelect.appendChild(custom);

      // Pre-select a kit when arriving from a product card link (?kit=id).
      var wanted = new URLSearchParams(window.location.search).get('kit');
      if (wanted && $all('option', kitSelect).some(function (o) { return o.value === wanted; })) {
        kitSelect.value = wanted;
      }
    }).catch(function (error) {
      console.error('Could not load kit list:', error);
      var custom = el('option', null, 'Other / not listed (custom request)');
      custom.value = 'custom';
      kitSelect.appendChild(custom);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      output.replaceChildren();
      if (!validateForm(form)) { return; }

      var data = {
        name: $('#name', form).value.trim(),
        email: $('#email', form).value.trim(),
        kit: kitSelect.value,
        size: $('#size', form).value,
        quantity: parseInt($('#quantity', form).value, 10),
        typeLabel: selectedText($('#enquiry-type', form))
      };

      submit.disabled = true;
      submit.textContent = 'Checking stock...';

      loadProducts().then(function (products) {
        var product = products.filter(function (p) { return p.id === data.kit; })[0] || null;
        output.replaceChildren(buildEnquiryResponse(data, product));
        output.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        form.reset();
      }).catch(function (error) {
        console.error('Enquiry could not be processed:', error);
        var message = el('p', 'load-error',
          'Sorry, we could not check stock right now. Please try again, or email ' + CONTACT_RECIPIENT + '.');
        message.setAttribute('role', 'alert');
        output.replaceChildren(message);
      }).then(function () {
        submit.disabled = false;
        submit.textContent = 'Send Enquiry';
      });
    });
  }

  /* ---------- Contact form (compiled into an email) ---------- */
  function buildEmail(data) {
    var singleLine = function (text) { return text.replace(/[\r\n]+/g, ' '); };
    var subject = '[Website: ' + data.typeLabel + '] Message from ' + singleLine(data.name);
    var lines = [
      'Hi Bankai Retro team,',
      '',
      data.message,
      '',
      '---',
      'Name: ' + singleLine(data.name),
      'Email: ' + singleLine(data.email),
      'Phone: ' + (data.phone ? singleLine(data.phone) : 'Not provided'),
      'Message type: ' + data.typeLabel,
      'Sent from the Bankai Retro website contact form'
    ];
    var body = lines.join('\r\n');
    var href = 'mailto:' + CONTACT_RECIPIENT +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    return { subject: subject, body: body, href: href };
  }

  function initContact() {
    var form = $('#contact-form');
    if (!form) { return; }
    var output = $('#email-preview');

    liveValidate(form);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      output.replaceChildren();
      if (!validateForm(form)) { return; }

      var data = {
        name: $('#contact-name', form).value.trim(),
        email: $('#contact-email', form).value.trim(),
        phone: $('#contact-phone', form).value.trim(),
        typeLabel: selectedText($('#message-type', form)),
        message: $('#message', form).value.trim()
      };
      var email = buildEmail(data);

      var card = el('div', 'response-card');
      card.appendChild(el('h2', null, 'Your email is ready to send'));
      card.appendChild(el('p', null, 'Check the details below, then open it in your email app.'));

      var list = el('dl', 'response-list');
      addRow(list, 'To', CONTACT_RECIPIENT);
      addRow(list, 'Subject', email.subject);
      card.appendChild(list);
      card.appendChild(el('pre', 'email-body', email.body));

      var actions = el('div', 'response-actions');
      var open = el('a', 'btn', 'Open in email app');
      open.href = email.href;
      var copy = el('button', 'btn btn-secondary', 'Copy email text');
      copy.type = 'button';
      copy.addEventListener('click', function () {
        var text = 'To: ' + CONTACT_RECIPIENT + '\nSubject: ' + email.subject + '\n\n' + email.body;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            copy.textContent = 'Copied';
          }).catch(function () { copy.textContent = 'Copy failed'; });
        } else {
          copy.textContent = 'Copy not supported';
        }
      });
      actions.appendChild(open);
      actions.appendChild(copy);
      card.appendChild(actions);

      card.appendChild(el('p', 'response-note',
        'No email app set up? Use "Copy email text" and paste the message into Gmail, Outlook or any other mail service.'));

      output.replaceChildren(card);
      output.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ---------- Interactive map (Leaflet + OpenStreetMap) ---------- */
  function initMap() {
    var container = $('#map');
    if (!container) { return; }

    var places = [
      { name: 'Braamfontein Market Stall', detail: 'Neighbourgoods Market, 73 Juta Street. Saturdays, 09:00\u201315:00.', lat: -26.1930, lng: 28.0390 },
      { name: 'FNB Stadium Matchday Pop-Up', detail: 'FNB Stadium Grounds, Nasrec. Selected home matchdays.', lat: -26.2349, lng: 27.9824 }
    ];

    if (!window.L) {
      container.classList.add('map-fallback');
      container.textContent = 'The map could not load. Find us at Neighbourgoods Market, 73 Juta Street, Braamfontein, and at the FNB Stadium grounds in Nasrec.';
      return;
    }

    var map = window.L.map(container, { scrollWheelZoom: false });
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    var markers = places.map(function (place) {
      var popup = el('div');
      popup.appendChild(el('strong', null, place.name));
      popup.appendChild(el('br'));
      popup.appendChild(document.createTextNode(place.detail));
      return window.L.marker([place.lat, place.lng], { title: place.name })
        .addTo(map).bindPopup(popup);
    });

    map.fitBounds(window.L.latLngBounds(places.map(function (p) { return [p.lat, p.lng]; })),
      { padding: [40, 40] });

    $all('.map-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        var i = parseInt(button.dataset.place, 10);
        var place = places[i];
        if (!place) { return; }
        map.setView([place.lat, place.lng], 15, { animate: !reduceMotion });
        markers[i].openPopup();
        container.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
  }

  /* ---------- Mobile navigation menu ---------- */
  function initNav() {
    var header = $('header');
    var toggle = $('.nav-toggle');
    var menu = $('#site-nav');
    if (!header || !toggle || !menu) { return; }

    // The menu only collapses once JavaScript is running, so it never gets stuck hidden.
    header.classList.add('nav-ready');

    function setOpen(open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close the menu after choosing a link, or when the window grows to desktop size.
    $all('a', menu).forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    window.matchMedia('(min-width: 769px)').addEventListener('change', function (event) {
      if (event.matches) { setOpen(false); }
    });
  }

  /* ---------- Start ---------- */
  initNav();
  initFeatured();
  initProducts();
  initAccordion();
  initEnquiry();
  initContact();
  initMap();
})();
