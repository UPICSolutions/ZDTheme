/*
 * jQuery v1.9.1 included
 */

$(document).ready(function () {
  // Upic Added - Scroll to top
  // browser window scroll (in pixels) after which the "back to top" link is shown
  // var offset = 300,
  // browser window scroll (in pixels) after which the "back to top" link opacity is reduced
  // offset_opacity = 1200,
  // duration of the top scrolling animation (in ms)
  // scroll_top_duration = 700,
  // grab the "back to top" link
  // $back_to_top = $('.cd-top');

  //hide or show the "back to top" link
  //$(window).scroll(function(){
  //( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
  //if( $(this).scrollTop() > offset_opacity ) { 
  //$back_to_top.addClass('cd-fade-out');
  //}
  //});

  //smooth scroll to top
  //$back_to_top.on('click', function(event){
  //event.preventDefault();
  //$('body,html').animate({
  //scrollTop: 0 ,
  //}, scroll_top_duration
  //);
  //});
  // Upic Added - MW-Notification Banner
  $.get("/api/v2/help_center/" + $('html').attr('lang').toLowerCase() + "/articles.json?label_names=alert").done(function (data) {

    $.each(data.articles, function (index, item) {

      var style1 = '<div class="ns-box ns-bar ns-effect-slidetop ns-type-notice ns-show"><div class="ns-box-inner"><span class="megaphone"></span></i><p><a href="' + item.html_url + '">' + item.title + '</a>' + item.body + '</p></div><span class="ns-close"></span></div>'

      $('.alertbox').append(style1);
    });
    $('.ns-close').on('click', function () {
      $(".alertbox").remove();
    });

  });
  // Upic Added - Change string for My Activities
  $('.nav-wrapper .dropdown-menu .my-activities').html('See my tickets');
  $('.sub-nav').find('li').filter(":last");

  //Upic Added - Change string for Search bar 
  $('#query').attr('placeholder', 'Hi, how can we help?');

  //Upic Added - Change string for Search bar signed in users
  if (HelpCenter.user.role != 'anonymous') {
    $('#query')
      .attr('placeholder',
        'Hi ' + HelpCenter.user.name.split(" ")[0] + ', how can we help?');
  }

  // social share popups
  $(".share a").click(function (e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
    $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function () {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Expand Request comment form when Add to conversation is clicked
  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function () {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
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

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function () {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function (e) {
    if (e.which === 13) {
      search();
    }
  });

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

  $(".header .icon-menu").on("click", function (e) {
    e.stopPropagation();
    toggleNavigation(this);
  });

  $(".header .icon-menu").on("keyup", function (e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      toggleNavigation(this);
    }
  });

  $("#user-nav").on("keyup", function (e) {
    if (e.keyCode === 27) { // Escape key
      e.stopPropagation();
      this.setAttribute("aria-expanded", false);
      $(".header .icon-menu").attr("aria-expanded", false);
    }
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function () {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function (e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
}); 
document.addEventListener('DOMContentLoaded', function () {
  // Scope to this specific form
  if (typeof ticketForm === 'undefined' || ticketForm != 40202845830427) return;

  // Your custom field IDs
  const FIELD = {
    firstName: '41134679554331',
    lastName:  '41134723405595',
    startDate: '41134762486555',
    computerUse: '41134825610779',     // "Will this employee use a company computer?"
    termFlag:   '41135204750107'       // the Yes/No field for showing the termination message
  };

  // Link to your Termination form
  const terminationFormURL = 'https://yourcompany.zendesk.com/hc/en-us/requests/new?ticket_form_id=XXXXXX';

  // Stable selectors for Subject and Description in Garden-based forms
  const qSubject = 'input[name="request[subject]"]';
  const qDescription = 'textarea[name="request[description]"]';

  // Helpers
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const getVal = (fid) => {
    const el = $(`#request_custom_fields_${fid}`);
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  };
  const prettyDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  // Build Subject + Description from fields
  function buildTexts() {
    const first = getVal(FIELD.firstName);
    const last  = getVal(FIELD.lastName);
    const start = prettyDate(getVal(FIELD.startDate));

    const subjectParts = [];
    if (first || last) subjectParts.push(`New User: ${first} ${last}`.trim());
    if (start) subjectParts.push(`Start ${start}`);
    const subject = subjectParts.join(' | ');

    let description = `Request for new user ${[first, last].filter(Boolean).join(' ') || '(name pending)'}.`;
    if (start) description += ` Start date: ${start}.`;
    description += ' Please provision accounts, access, and equipment per standards.';

    // Set and hide Subject
    const subjEl = $(qSubject);
    if (subjEl) {
      subjEl.value = subject;
      const subjField = subjEl.closest('[data-garden-id="forms.field"]') || subjEl.parentElement;
      if (subjField) subjField.style.display = 'none';
    }

    // Set and hide Description
    const descEl = $(qDescription);
    if (descEl) {
      descEl.value = description;
      const descField = descEl.closest('[data-garden-id="forms.field"]') || descEl.parentElement;
      if (descField) descField.style.display = 'none';
    }
  }

  // Insert section headings above specific fields
  function insertHeading(beforeSelector, text) {
    const el = $(beforeSelector);
    if (!el) return;
    const heading = document.createElement('div');
    heading.className = 'custom-section-heading';
    heading.textContent = text;
    el.parentNode.insertBefore(heading, el);
  }

  // Conditional termination message if termFlag == "No"
  function ensureTerminationNotice() {
    const host = $(`#request_custom_fields_${FIELD.termFlag}`);
    if (!host || $('#termination-notice')) return;

    const msg = document.createElement('div');
    msg.id = 'termination-notice';
    msg.style.display = 'none';
    msg.className = 'termination-note';
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

  // Two small UX helpers: headings and compact two-column option (opt-in)
  function addHeadings() {
    insertHeading(`#request_custom_fields_${FIELD.firstName}`, 'NEW EMPLOYEE INFORMATION');
    insertHeading(`#request_custom_fields_${FIELD.computerUse}`, 'COMPUTER SETUP INFORMATION');
  }

  // Robustness: re-run logic as fields render or change
  function wireEvents() {
    // Rebuild subject/description when key fields change
    [FIELD.firstName, FIELD.lastName, FIELD.startDate].forEach(fid => {
      const sel = `#request_custom_fields_${fid}`;
      $(document).addEventListener?.('change', buildTexts);
      const el = $(sel);
      if (el) {
        el.addEventListener('input', buildTexts);
        el.addEventListener('change', buildTexts);
      }
    });

    // Termination message visibility
    const termEl = $(`#request_custom_fields_${FIELD.termFlag}`);
    if (termEl) {
      termEl.addEventListener('change', updateTerminationNotice);
      termEl.addEventListener('input', updateTerminationNotice);
    }
  }

  // One-time CSS for headings and notice
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

  // First run
  addHeadings();
  ensureTerminationNotice();
  buildTexts();
  updateTerminationNotice();
  wireEvents();

  // In case the form renders late or re-renders, observe and reapply
  const mo = new MutationObserver(() => {
    addHeadings();
    ensureTerminationNotice();
    buildTexts();
    updateTerminationNotice();
  });
  mo.observe(document.body, { childList: true, subtree: true });
});


