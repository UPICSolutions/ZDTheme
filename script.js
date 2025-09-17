/*
 * jQuery v1.9.1 included
 */

$(document).ready(function () {
  // ===== Your existing sitewide behaviors (kept) =====

  // MW-Notification Banner (label=alert)
  $.get("/api/v2/help_center/" + $('html').attr('lang').toLowerCase() + "/articles.json?label_names=alert")
    .done(function (data) {
      $.each(data.articles, function (index, item) {
        var banner = '<div class="ns-box ns-bar ns-effect-slidetop ns-type-notice ns-show"><div class="ns-box-inner"><span class="megaphone"></span><p><a href="' + item.html_url + '">' + item.title + '</a>' + item.body + '</p></div><span class="ns-close"></span></div>';
        $('.alertbox').append(banner);
      });
      $('.ns-close').on('click', function () { $(".alertbox").remove(); });
    });

  // My Activities text
  $('.nav-wrapper .dropdown-menu .my-activities').html('See my tickets');

  // Search placeholder
  $('#query').attr('placeholder', 'Hi, how can we help?');
  if (window.HelpCenter && HelpCenter.user && HelpCenter.user.role !== 'anonymous') {
    $('#query').attr('placeholder', 'Hi ' + HelpCenter.user.name.split(" ")[0] + ', how can we help?');
  }

  // Request page interactions (kept)
  var $commentContainerTextarea = $(".comment-container textarea"),
      $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function () { $commentContainerFormControls.show(); });
  if ($commentContainerTextarea.val() !== "") { $commentContainerFormControls.show(); }

  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
      $requestCommentFields = $(".request-container .comment-container .comment-fields"),
      $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function () {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
      $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
      $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  var $requestCommentTextarea = $(".request-container .comment-container textarea");
  $requestCommentTextarea.on("input", function () {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });
  if ($requestCommentTextarea.val() === "") { $requestCommentSubmitButton.prop("disabled", true); }

  $("#request-status-select, #request-organization-select").on("change", function () { search(); });
  $("#quick-search").on("keypress", function (e) { if (e.which === 13) search(); });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  function toggleNavigation(toggleElement) {
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
    toggleElement.setAttribute("aria-expanded", !isExpanded);
  }
  $(".header .icon-menu").on("click", function (e) { e.stopPropagation(); toggleNavigation(this); });
  $(".header .icon-menu").on("keyup", function (e) { if (e.keyCode === 13) { e.stopPropagation(); toggleNavigation(this); } });
  $("#user-nav").on("keyup", function (e) {
    if (e.keyCode === 27) { e.stopPropagation(); this.setAttribute("aria-expanded", false); $(".header .icon-menu").attr("aria-expanded", false); }
  });
  if ($("#user-nav").children().length === 0) { $(".header .icon-menu").hide(); }

  $("#request-organization select").on("change", function () { this.form.submit(); });
  $(".collapsible-nav, .collapsible-sidebar").on("click", function (e) { e.stopPropagation(); var isExpanded = this.getAttribute("aria-expanded") === "true"; this.setAttribute("aria-expanded", !isExpanded); });
});

/* ===========================================================
 * New-hire form logic for ticket form 40202845830427
 * ===========================================================
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof ticketForm === 'undefined' || ticketForm != 40202845830427) return;

  // Custom field IDs (from your list)
  const ID = {
    // identity & org
    firstName: '41134679554331',
    lastName:  '41134723405595',
    title:     '41134724350107',
    dept:      '41134726133275',
    startDate: '41134762486555',
    reportsTo: '41134776240411',
    officePhone: '41134772943259',
    cellPhone:   '41134746346907',

    // email
    needsEmail:     '41134919788827',   // dropdown
    prefNewEmail:   '41134940312091',
    existingEmail:  '41134950735899',
    replacingYN:    '41134970741659',   // dropdown
    replacingWho:   '41135043430427',
    existingStill:  '41135204750107',   // dropdown Yes/No

    // computer
    willUseCompany: '41134825610779',   // dropdown
    newOrExisting:  '41134868476315',   // dropdown
    existingPCName: '41134891429147',

    // access
    standardApps:   '41135512540955',   // multi-select
    sharedDrives:   '41135376583195',   // multiline
    distGroups:     '41135508887323',   // multiline
    printers:       '41135538769307',   // multiline
    secGroups:      '41135540022427',   // multiline

    // lookups & misc
    userStandards:  '41134147290523',   // lookup
    service:        '41140632676379',   // lookup
    comments:       '41135548344219'    // multiline
  };

  // Link to termination form (Support subdomain)
  const terminationFormURL = 'https://support.upicsolutions.zendesk.com/hc/en-us/requests/new?ticket_form_id=XXXXXX';

  // Selectors for Garden inputs
  const qSubject = 'input[name="request[subject]"]';
  const qDescription = 'textarea[name="request[description]"]';

  // ---------- helpers ----------
  const $  = (s) => document.querySelector(s);
  const el = (fid) => $(`#request_custom_fields_${fid}`);
  const val = (fid) => { const n = el(fid); return n && typeof n.value === 'string' ? n.value.trim() : ''; };
  const datePretty = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };
  const dropdownLabel = (fid) => {
    const n = el(fid);
    if (!n) return '';
    if (n.tagName === 'SELECT' && !n.multiple) {
      const opt = n.options[n.selectedIndex];
      return opt ? (opt.text || '').trim() : '';
    }
    return (n.value || '').trim();
  };
  const multiSelectLabels = (fid) => {
    const n = el(fid);
    if (!n || !n.options) return '';
    return Array.from(n.options).filter(o => o.selected).map(o => (o.text || '').trim()).filter(Boolean).join(', ');
  };
  function hideGardenField(ctrl) {
    if (!ctrl) return;
    const wrap = ctrl.closest('[data-garden-id="forms.field"]');
    if (wrap) { wrap.hidden = true; return; }
    ctrl.hidden = true;
    const lbl = ctrl.getAttribute('aria-labelledby');
    if (lbl) { const l = document.getElementById(lbl); if (l) l.hidden = true; }
  }

  // ---------- headings ----------
  function insertHeading(beforeSelector, text) {
    const node = $(beforeSelector);
    if (!node) return;
    const h = document.createElement('div');
    h.className = 'custom-section-heading';
    h.textContent = text;
    node.parentNode.insertBefore(h, node);
  }
  function addHeadings() {
    insertHeading(`#request_custom_fields_${ID.firstName}`, 'NEW EMPLOYEE INFORMATION');
    insertHeading(`#request_custom_fields_${ID.willUseCompany}`, 'COMPUTER SETUP INFORMATION');
  }

  // ---------- termination notice (if existing user still employed == No) ----------
  function ensureTerminationNotice() {
    const host = el(ID.existingStill);
    if (!host || $('#termination-notice')) return;
    const msg = document.createElement('div');
    msg.id = 'termination-notice';
    msg.className = 'termination-note';
    msg.style.display = 'none';
    msg.innerHTML = `If "No", please fill out the <a href="${terminationFormURL}" target="_blank" rel="noopener noreferrer">Employee Termination Form</a> (if applicable).<br>Note: The form will open in a new window.`;
    host.parentNode.insertBefore(msg, host.nextSibling);
  }
  function updateTerminationNotice() {
    const n = el(ID.existingStill);
    const note = $('#termination-notice');
    if (!n || !note) return;
    note.style.display = ((n.value || '').toLowerCase() === 'no') ? 'block' : 'none';
  }

  // ---------- subject + formatted description ----------
  function buildTexts() {
    // Identity
    const fn  = val(ID.firstName);
    const ln  = val(ID.lastName);
    const ttl = val(ID.title);
    const dep = val(ID.dept);
    const sd  = datePretty(val(ID.startDate));
    const mgr = val(ID.reportsTo);
    const phO = val(ID.officePhone);
    const phC = val(ID.cellPhone);
    const stds= dropdownLabel(ID.userStandards);
    const svc = dropdownLabel(ID.service);

    // Email
    const needsEmail  = dropdownLabel(ID.needsEmail);
    const prefEmail   = val(ID.prefNewEmail);
    const existEmail  = val(ID.existingEmail);
    const replYN      = dropdownLabel(ID.replacingYN);
    const replWho     = val(ID.replacingWho);
    const stillEmp    = dropdownLabel(ID.existingStill);

    // Computer
    const compUse     = dropdownLabel(ID.willUseCompany);
    const newOrExist  = dropdownLabel(ID.newOrExisting);
    const pcName      = val(ID.existingPCName);

    // Access
    const apps        = multiSelectLabels(ID.standardApps);
    const drives      = val(ID.sharedDrives);
    const groups      = val(ID.distGroups);
    const printers    = val(ID.printers);
    const secGroups   = val(ID.secGroups);

    // Misc
    const notes       = val(ID.comments);

    // Subject
    const subjParts = [];
    if (fn || ln) subjParts.push(`New User: ${[fn, ln].filter(Boolean).join(' ')}`);
    if (sd)       subjParts.push(`Start ${sd}`);
    const subject = subjParts.join(' | ');

    // Helpers for description blocks
    const line = (k, v) => v ? `- ${k}: ${v}` : '';
    const block = (hdr, rows) => {
      const inner = rows.filter(Boolean).join('\n');
      return inner ? `${hdr}\n${inner}\n` : '';
    };

    const desc =
      block('NEW EMPLOYEE', [
        line('Name', [fn, ln].filter(Boolean).join(' ')),
        line('Title', ttl),
        line('Department', dep),
        line('Start Date', sd),
        line('Manager (Reports To)', mgr),
        line('Office/Direct Phone', phO),
        line('Cell Phone', phC),
        line('User Standards & Exceptions', stds),
        line('Service', svc)
      ]) +
      '---\n' +
      block('EMAIL', [
        line('Needs Email Setup', needsEmail),
        line('Preferred New Email', prefEmail),
        line('Existing Email', existEmail),
        line('Replacing Existing User', replYN),
        line("Existing User's Name", replWho),
        line('Is Existing User Still Employed', stillEmp)
      ]) +
      '---\n' +
      block('COMPUTER', [
        line('Company Computer', compUse),
        line('New or Existing Computer', newOrExist),
        line('Existing Computer Name', pcName)
      ]) +
      '---\n' +
      block('ACCESS', [
        line('Standard Applications', apps),
        line('Shared Drives', drives),
        line('Distribution Groups', groups),
        line('Printers & Scanners', printers),
        line('Security Group Access', secGroups)
      ]) +
      (notes ? `---\nNOTES\n${notes}\n` : '');

    // Apply + hide using Garden-safe wrappers
    const subjEl = $(qSubject);
    if (subjEl) { subjEl.value = subject || ''; hideGardenField(subjEl); }
    const descEl = $(qDescription);
    if (descEl) { descEl.value = desc.trim(); hideGardenField(descEl); }
  }

  // ---------- wire events ----------
  function wire() {
    [
      ID.firstName, ID.lastName, ID.title, ID.dept, ID.startDate, ID.reportsTo,
      ID.officePhone, ID.cellPhone, ID.userStandards, ID.service,
      ID.needsEmail, ID.prefNewEmail, ID.existingEmail, ID.replacingYN, ID.replacingWho, ID.existingStill,
      ID.willUseCompany, ID.newOrExisting, ID.existingPCName,
      ID.standardApps, ID.sharedDrives, ID.distGroups, ID.printers, ID.secGroups,
      ID.comments
    ].forEach(fid => {
      const n = el(fid);
      if (n) { n.addEventListener('input', buildTexts); n.addEventListener('change', buildTexts); }
    });

    const still = el(ID.existingStill);
    if (still) { still.addEventListener('input', updateTerminationNotice); still.addEventListener('change', updateTerminationNotice); }
  }

  // ---------- one-time CSS ----------
  (function injectCSS() {
    if ($('#_custom_form_css')) return;
    const style = document.createElement('style');
    style.id = '_custom_form_css';
    style.textContent = `
      .custom-section-heading {
        margin-top: 20px; margin-bottom: 10px;
        font-size: 1.1rem; font-weight: 700;
        border-bottom: 1px solid #ddd; padding-bottom: 4px;
      }
      .termination-note {
        margin: 12px 0; padding: 10px;
        background: #fff3cd; border: 1px solid #ffe58f; border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
  })();

  // ---------- first pass ----------
  addHeadings();
  ensureTerminationNotice();
  buildTexts();
  updateTerminationNotice();
  wire();

  // Keep it sticky across async re-renders
  const mo = new MutationObserver(() => {
    addHeadings();
    ensureTerminationNotice();
    buildTexts();
    updateTerminationNotice();
  });
  mo.observe(document.body, { childList: true, subtree: true });
});
