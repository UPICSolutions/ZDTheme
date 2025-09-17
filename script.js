/*
 * jQuery v1.9.1 included
 */

$(document).ready(function () {
  // ===== Sitewide: alert banner (label: alert) =====
  $.get("/api/v2/help_center/" + $('html').attr('lang').toLowerCase() + "/articles.json?label_names=alert")
    .done(function (data) {
      $.each(data.articles, function (_, item) {
        var banner = '<div class="ns-box ns-bar ns-effect-slidetop ns-type-notice ns-show"><div class="ns-box-inner"><span class="megaphone"></span><p><a href="' + item.html_url + '">' + item.title + '</a>' + item.body + '</p></div><span class="ns-close"></span></div>';
        $('.alertbox').append(banner);
      });
      $('.ns-close').on('click', function () { $(".alertbox").remove(); });
    });

  // ===== Sitewide: nav text + search placeholder =====
  $('.nav-wrapper .dropdown-menu .my-activities').html('See my tickets');
  $('#query').attr('placeholder', 'Hi, how can we help?');
  if (window.HelpCenter && HelpCenter.user && HelpCenter.user.role !== 'anonymous') {
    $('#query').attr('placeholder', 'Hi ' + HelpCenter.user.name.split(" ")[0] + ', how can we help?');
  }

  // ===== Sitewide: request page interactions (kept) =====
  var $commentTextarea = $(".comment-container textarea"),
      $commentControls = $(".comment-form-controls, .comment-ccs");
  $commentTextarea.one("focus", function () { $commentControls.show(); });
  if ($commentTextarea.val() !== "") { $commentControls.show(); }

  var $showAdd = $(".request-container .comment-container .comment-show-container"),
      $commentFields = $(".request-container .comment-container .comment-fields"),
      $submitComment = $(".request-container .comment-container .request-submit-comment");
  $showAdd.on("click", function () {
    $showAdd.hide(); $commentFields.show(); $submitComment.show(); $commentTextarea.focus();
  });

  var $markSolved = $(".request-container .mark-as-solved:not([data-disabled])"),
      $solvedChk  = $(".request-container .comment-container input[type=checkbox]"),
      $submitBtn  = $(".request-container .comment-container input[type=submit]");
  $markSolved.on("click", function () {
    $solvedChk.attr("checked", true);
    $submitBtn.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  var $requestCommentTextarea = $(".request-container .comment-container textarea");
  $requestCommentTextarea.on("input", function () {
    if ($requestCommentTextarea.val() !== "") {
      $markSolved.text($markSolved.data("solve-and-submit-translation"));
      $submitBtn.prop("disabled", false);
    } else {
      $markSolved.text($markSolved.data("solve-translation"));
      $submitBtn.prop("disabled", true);
    }
  });
  if ($requestCommentTextarea.val() === "") { $submitBtn.prop("disabled", true); }

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
  $(".collapsible-nav, .collapsible-sidebar").on("click", function (e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
});

/* ===========================================================
 * New-hire form logic for ticket form 40202845830427 (legacy DOM)
 * ===========================================================
 */
$(function () {
  if (typeof ticketForm === 'undefined' || ticketForm != 40202845830427) return;

  // ---- IDs from your list ----
  const ID = {
    // Identity & org
    firstName: '41134679554331',
    lastName:  '41134723405595',
    title:     '41134724350107',
    dept:      '41134726133275',
    startDate: '41134762486555',
    reportsTo: '41134776240411',
    officePhone: '41134772943259',
    cellPhone:   '41134746346907',
    // Email
    needsEmail:     '41134919788827',   // dropdown
    prefNewEmail:   '41134940312091',
    existingEmail:  '41134950735899',
    replacingYN:    '41134970741659',   // dropdown
    replacingWho:   '41135043430427',
    existingStill:  '41135204750107',   // dropdown (Yes/No)
    // Computer
    willUseCompany: '41134825610779',   // dropdown
    newOrExisting:  '41134868476315',   // dropdown
    existingPCName: '41134891429147',
    // Access
    standardApps:   '41135512540955',   // multi-select
    sharedDrives:   '41135376583195',   // multiline
    distGroups:     '41135508887323',   // multiline
    printers:       '41135538769307',   // multiline
    secGroups:      '41135540022427',   // multiline
    // Lookups & misc
    userStandards:  '41134147290523',   // lookup
    service:        '41140632676379',   // lookup
    comments:       '41135548344219'    // multiline
  };

  const terminationFormURL = 'https://support.upicsolutions.zendesk.com/hc/en-us/requests/new?ticket_form_id=XXXXXX';

  // ---- helpers (legacy DOM) ----
  const $f = (fid) => $(`#request_custom_fields_${fid}`);
  const txt = (fid) => ($f(fid).val() || '').trim();
  const datePretty = (iso) => {
    if (!iso) return '';
    const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'2-digit'});
  };
  const ddLabel = (fid) => { // selected option text for dropdowns/lookups
    const el = $f(fid)[0]; if (!el) return '';
    if (el.tagName === 'SELECT' && !el.multiple) {
      const opt = el.options[el.selectedIndex]; return opt ? (opt.text || '').trim() : '';
    }
    return txt(fid); // fallback to value/tag
  };
  const multiLabels = (fid) => {
    const el = $f(fid)[0]; if (!el || !el.options) return '';
    return Array.from(el.options).filter(o => o.selected).map(o => (o.text || '').trim()).filter(Boolean).join(', ');
  };

  // ---- headings ----
  function insertHeading(beforeSelector, text) {
    const $el = $(beforeSelector);
    if (!$el.length) return;
    $('<div class="custom-section-heading"></div>').text(text).insertBefore($el);
  }
  function addHeadings() {
    insertHeading(`#request_custom_fields_${ID.firstName}`, 'NEW EMPLOYEE INFORMATION');
    insertHeading(`#request_custom_fields_${ID.willUseCompany}`, 'COMPUTER SETUP INFORMATION');
  }

  // ---- termination notice (when "Is the existing user still employed?" == No) ----
  function ensureTerminationNotice() {
    const $host = $f(ID.existingStill);
    if (!$host.length || $('#termination-notice').length) return;
    $('<div id="termination-notice" class="termination-note" style="display:none;"></div>')
      .html(`If "No", please fill out the <a href="${terminationFormURL}" target="_blank" rel="noopener noreferrer">Employee Termination Form</a> (if applicable).<br>Note: The form will open in a new window.`)
      .insertAfter($host);
  }
  function updateTerminationNotice() {
    const v = (txt(ID.existingStill) || '').toLowerCase();
    $('#termination-notice').toggle(v === 'no');
  }

  // ---- subject + formatted description ----
  function buildSubject() {
    const fn = txt(ID.firstName), ln = txt(ID.lastName);
    const sd = datePretty(txt(ID.startDate));
    const parts = [];
    if (fn || ln) parts.push(`New User: ${[fn, ln].filter(Boolean).join(' ')}`);
    if (sd) parts.push(`Start ${sd}`);
    return parts.join(' | ');
  }

  function buildDescription() {
    // Identity
    const fn=txt(ID.firstName), ln=txt(ID.lastName), ttl=txt(ID.title), dep=txt(ID.dept),
          sd=datePretty(txt(ID.startDate)), mgr=txt(ID.reportsTo),
          phO=txt(ID.officePhone), phC=txt(ID.cellPhone),
          stds=ddLabel(ID.userStandards), svc=ddLabel(ID.service);
    // Email
    const needsEmail=ddLabel(ID.needsEmail), prefEmail=txt(ID.prefNewEmail), existEmail=txt(ID.existingEmail),
          replYN=ddLabel(ID.replacingYN), replWho=txt(ID.replacingWho), stillEmp=ddLabel(ID.existingStill);
    // Computer
    const compUse=ddLabel(ID.willUseCompany), newOrExist=ddLabel(ID.newOrExisting), pcName=txt(ID.existingPCName);
    // Access
    const apps=multiLabels(ID.standardApps), drives=txt(ID.sharedDrives), groups=txt(ID.distGroups),
          printers=txt(ID.printers), secGroups=txt(ID.secGroups);
    // Notes
    const notes=txt(ID.comments);

    const line = (k,v)=> v ? `- ${k}: ${v}` : '';
    const block=(hdr,rows)=>{ const inner=rows.filter(Boolean).join('\n'); return inner?`${hdr}\n${inner}\n`:''; };

    return (
      block('NEW EMPLOYEE', [
        line('Name', [fn,ln].filter(Boolean).join(' ')),
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
      (notes ? `---\nNOTES\n${notes}\n` : '')
    ).trim();
  }

  function applyAndHide() {
    // Fill values
    $('#request_subject').val(buildSubject());
    $('#request_description').val(buildDescription());

    // Hide (legacy wrappers)
    $('.form-field.string.optional.request_subject, .form-field.string.required.request_subject').hide();
    $('.form-field.request_description').hide();
    // Extra safety (some themes use these wrappers)
    $('.request_subject, .request_description').hide();
  }
  // --- PATCH: hide Subject + Description on legacy Guide form ---
function hideLegacySubjectDescription() {
  // 1) Target the actual controls
  var $subj = $('#request_subject');
  var $desc = $('#request_description');

  // 2) Hide their standard wrappers (classic Guide = .form-field.*)
  if ($subj.length) {
    $subj.closest('.form-field').hide(); // covers .form-field.string.*.request_subject
  }
  if ($desc.length) {
    $desc.closest('.form-field').hide(); // covers .form-field.request_description
  }

  // 3) Extra belt & suspenders (some themes add alt wrappers)
  $('.form-field.string.optional.request_subject, .form-field.string.required.request_subject, .form-field.request_description, .request_subject, .request_description').hide();
}

// Run once when your form logic runs
hideLegacySubjectDescription();

// Keep it hidden on any async re-render
const __hideObserver = new MutationObserver(hideLegacySubjectDescription);
__hideObserver.observe(document.body, { childList: true, subtree: true });

// Gentle retries for slow loads
let __tries = 0;
const __iv = setInterval(function() {
  hideLegacySubjectDescription();
  if (++__tries > 10) clearInterval(__iv);
}, 250);


  // ---- CSS for headings/notice ----
  (function injectCSS(){
    if ($('#_custom_form_css').length) return;
    $('<style id="_custom_form_css">.custom-section-heading{margin-top:20px;margin-bottom:10px;font-size:1.1rem;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:4px}.termination-note{margin:12px 0;padding:10px;background:#fff3cd;border:1px solid #ffe58f;border-radius:4px}</style>').appendTo(document.head);
  })();

  // ---- First run ----
  addHeadings();
  ensureTerminationNotice();
  applyAndHide();
  updateTerminationNotice();

  // Rebuild on input changes
  $([
    ID.firstName, ID.lastName, ID.title, ID.dept, ID.startDate, ID.reportsTo,
    ID.officePhone, ID.cellPhone, ID.userStandards, ID.service,
    ID.needsEmail, ID.prefNewEmail, ID.existingEmail, ID.replacingYN, ID.replacingWho, ID.existingStill,
    ID.willUseCompany, ID.newOrExisting, ID.existingPCName,
    ID.standardApps, ID.sharedDrives, ID.distGroups, ID.printers, ID.secGroups,
    ID.comments
  ].map(fid => `#request_custom_fields_${fid}`).join(','))
    .on('input change', function(){ applyAndHide(); updateTerminationNotice(); });

  // Keep it sticky if DOM re-renders
  const mo = new MutationObserver(function(){ addHeadings(); ensureTerminationNotice(); applyAndHide(); updateTerminationNotice(); });
  mo.observe(document.body, { childList: true, subtree: true });

  // Mild retry in slow renders
  let tries = 0; const iv = setInterval(function(){ applyAndHide(); if (++tries > 10) clearInterval(iv); }, 300);
});
