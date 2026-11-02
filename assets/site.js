// Casewright landing page: sends the signup form to Formspree without leaving the page.
// Setup: create a Formspree form and replace YOUR_FORM_ID in index.html's <form action>.
(function () {
  'use strict';

  var form = document.getElementById('signup-form');
  if (!form) return;

  var errorEl = document.getElementById('su-error');
  var thanksEl = document.getElementById('signup-thanks');
  var thanksName = document.getElementById('thanks-name');
  var submitBtn = document.getElementById('su-submit');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorEl.hidden = true;

    var name = form.elements.name.value.trim();
    var firm = form.elements.firm.value.trim();
    var email = form.elements.email.value.trim();

    if (!name || !firm) {
      showError('Please add your name and firm.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showError('Please enter a valid work email.');
      form.elements.email.focus();
      return;
    }
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      showError('Signups are not connected yet. Please check back soon.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var first = name.split(/\s+/)[0];
        thanksName.textContent = first ? ', ' + first : '';
        form.hidden = true;
        thanksEl.hidden = false;
        thanksEl.focus();
      })
      .catch(function () {
        showError('Something went wrong sending your request. Please try again in a minute.');
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request pilot information';
      });
  });
})();
