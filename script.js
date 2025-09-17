/*
 * Existing sitewide behaviors + Help Center tweaks
 */
$(document).ready(function () {
  // Change string for My Activities
  $('.nav-wrapper .dropdown-menu .my-activities').html('See my tickets');

  // Change placeholder for search bar
  $('#query').attr('placeholder', 'Hi, how can we help?');
  if (window.HelpCenter && HelpCenter.user && HelpCenter.user.role != 'anonymous') {
    const firstName = HelpCenter.user.name.split(" ")[0];
    $('#query').attr('placeholder', `Hi ${firstName}, how can we help?`);
  }

  // Other existing code you had (comment expansion, mark as solved, smooth scroll etc.)
  // ... ensure you keep all those existing handlers if they’re working now ...
});

/*
 * New form logic for ticket form 40202845830427
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof ticketForm === 'undefined' || ticketForm != 40202845830427) return;

  // === Your field IDs ===
  const FIELD = {
    firstName: '41134679554331',
    lastName:  '41134723405595',
    startDate: '41134762486555',
    computerUse: '41134825610779',
    termFlag:   '41135204750107'
  };

  const terminationFormURL = 'https://support.upicsolutions.zendesk.com/hc/en-us/requests/new?ticket_form_id=XXXXXX';

  const qSubject = 'input[name="request[subject]"]';
  const qDescription = 'textarea[name="request[description]"]';

  // Helpers
  const $ = (sel) => document.querySelector(sel);
  const getVal = (fid) => {
    const el = $(`#request_custom_fields_${fid}`);
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  };
  const prettyDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };
  function hideGardenField(ctrl) {
    if (!ctrl) return;
    const fieldWrap = ctrl.closest('[data-garden-id="forms.field"]');
    if (fieldWrap) {
      fieldWrap.setAttribute('hidden', '');
      return;
    }
    // fallback: hide input/textarea + label
    ctrl.setAttribute('hidden', '');
    const lblId = ctrl.getAttribute('aria-labelledby');
    if (lblId) {
      const lbl = document.getElementById(lblId);
      if (lbl) lbl.setAttribute('hidden', '');
    }
  }

  // Build subject + description
  function buildTexts() {
    const first = getVal(FIELD.firstName);
    const last  = getVal(FIELD.lastName);
    const start = prettyDate(getVal(FIELD.startDate));

    const subjectPieces = [];
    if (first || last) subjectPieces.push(`New User: ${first} ${last}`.trim());
    if (start) subjectPieces.push(`Start ${start}`);
    const subject = subjectPieces.join(' | ');

    let description = `Request for new user ${[first, last].filter(Boolean).join(' ') || '(name pending)'}.`;
    if (start) description += ` Start date: ${start}.`;
    description += ' Please provision accounts, access, and equipment per standards.';

    const subjEl = $(qSubject);
    if (subjEl) {
      subjEl.value = subject;
      hideGardenField(subjEl);
    }

    const descEl = $(qDescription);
    if (descEl) {
      descEl.value = description;
      hideGardenField(descEl);
    }
  }

  // Section headings
  function insertHeading(beforeSelector, text) {
    const el = $(beforeSelector);
    if (!el) return;
    const heading = document.createElement('div');
    heading.className = 'custom-section-heading';
    heading.textContent = text;
    el.parentNode.insertBefore(heading, el);
  }
  function addHeadings() {
    insertHeading(`#request_custom_fields_${FIELD.firstName}`, 'NEW EMPLOYEE INFORMATION');
    insertHeading(`#request_custom_fields_${FIELD.computerUse}`, 'COMPUTER SETUP INFORMATION');
  }

  // Termination notice logic
  function ensureTerminationNotice() {
    const host = $(`#request_custom_fields_${FIELD.termFlag}`);
    if (!host || $('#termination-notice')) return;
    const msg = document.createElement('div');
    msg.id = 'termination-notice';
    msg.className = 'termination-note';
    msg.style.display = 'none';
    msg.innerHTML =
      `If "No", please fill out the ` +
      `<a href="${terminationFormURL}" target="_blank" rel="noopener noreferrer">Employee Termination Form</a> ` +
      `(if applicable).<br>Note: The form will open in a new window.`;
    host.parentNode.insertBefore(msg, host.nextSibling);
  }
  function updateTerminationNotice() {
    const el = $(`#request_custom_fields_${FIELD.termFlag}`);
    const note = $('#termination-notice');
    if (!el || !note) return;
    const val = (el.value || '').toLowerCase();
    note.style.display = val === 'no' ? 'block' : 'none';
  }

  // Wire up events
  function wireEvents() {
    [FIELD.firstName, FIELD.lastName, FIELD.startDate].forEach(fid => {
      const sel = `#request_custom_fields_${fid}`;
      const el = $(sel);
      if (el) {
        el.addEventListener('input', buildTexts);
        el.addEventListener('change', buildTexts);
      }
    });
    const termEl = $(`#request_custom_fields_${FIELD.termFlag}`);
    if (termEl) {
      termEl.addEventListener('input', updateTerminationNotice);
      termEl.addEventListener('change', updateTerminationNotice);
    }
  }

  // Inject needed CSS (once)
  (function injectCSS() {
    if ($('#_custom_form_css')) return;
    const style = document.createElement('style');
    style.id = '_custom_form_css';
    style.textContent = `
      .custom-section-heading {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 1.1rem;
        font-weight: 700;
        border-bottom: 1px solid #ddd;
        padding-bottom: 4px;
      }
      .termination-note {
        margin: 12px 0;
        padding: 10px;
        background: #fff3cd;
        border: 1px solid #ffe58f;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
  })();

  // Initial run of form-logic
  addHeadings();
  ensureTerminationNotice();
  buildTexts();
  updateTerminationNotice();
  wireEvents();

  // Observe for DOM changes (in case form is rendered later / re-rendered)
  const mo = new MutationObserver(() => {
    addHeadings();
    ensureTerminationNotice();
    buildTexts();
    updateTerminationNotice();
  });
  mo.observe(document.body, { childList: true, subtree: true });

});
