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
  //Hide and auto-fill subject line on the New User Request form//
  var ticketForm = location.search.split('ticket_form_id=')[1];

  if (ticketForm == 40202845830427) {
  $('.form-field.string.optional.request_subject').hide();// Hide subject 
  $('.form-field.string.required.request_subject').hide(); // Hide subject
  // Your custom field IDs
  const FIELD = {
    firstName: '41134679554331',
    lastName:  '41134723405595',
    startDate: '41134762486555'
  };

  // Helpers
  function getVal(fid) {
    const el = document.querySelector(`#request_custom_fields_${fid}`);
    return el && el.value ? el.value.trim() : '';
  }
  function prettyDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);            // Zendesk stores date fields as YYYY-MM-DD
    if (isNaN(d.getTime())) return iso; // fall back if browser can't parse
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  // Build and set the subject
  function buildSubject() {
    const first = getVal(FIELD.firstName);
    const last  = getVal(FIELD.lastName);
    const start = prettyDate(getVal(FIELD.startDate));

    // Adjust template to your preference
    const parts = [];
    if (first || last) parts.push(`New User: ${first} ${last}`.trim());
    if (start) parts.push(`Start ${start}`);
    const subject = parts.join(' | ');

    if (subject) $('#request_subject').val(subject);
  }

  // Update when users type or pick a date
  [`#request_custom_fields_${FIELD.firstName}`,
   `#request_custom_fields_${FIELD.lastName}`,
   `#request_custom_fields_${FIELD.startDate}`].forEach(sel => {
     $(document).on('input change', sel, buildSubject);
  });

  // Initial set
  buildSubject();

  // Optional: if your theme loads fields dynamically, observe for late renders
  // to re-run setup (safer than legacy DOMNodeInserted).
  const mo = new MutationObserver(() => buildSubject());
  mo.observe(document.body, { childList: true, subtree: true });
  }
});
