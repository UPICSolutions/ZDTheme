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

  //Hide and auto-fill subject and description line on the New User Request form//
  var ticketForm = location.search.split('ticket_form_id=')[1];

  if (ticketForm == 40202845830427) {
    $('.form-field.string.optional.request_subject').hide();// Hide subject 
    $('.form-field.string.required.request_subject').hide(); // Hide subject
    $('.form-field.string.optional.request_subject, .form-field.string.required.request_subject').hide();
    $('.form-field.request_description').hide(); // Hide description

    // --- helpers ---
    function getVal(fid) {
      var el = document.querySelector('#request_custom_fields_' + fid);
      return el && el.value ? el.value.trim() : '';
    }
    function getDDLabel(fid) { // read human-friendly option text
      var el = document.querySelector('#request_custom_fields_' + fid);
      if (!el) return '';
      if (el.tagName === 'SELECT' && !el.multiple) {
        var opt = el.options[el.selectedIndex];
        return opt ? (opt.text || '').trim() : '';
      }
      return el.value ? el.value.trim() : '';
    }
    function getMultiLabels(fid) {
      var el = document.querySelector('#request_custom_fields_' + fid);
      if (!el || !el.options) return '';
      var labels = Array.prototype.slice.call(el.options)
        .filter(function (o) { return o.selected; })
        .map(function (o) { return (o.text || '').trim(); })
        .filter(Boolean);
      return labels.join(', ');
    }
    function prettyDate(iso) {
      if (!iso) return '';
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    }
    function line(label, value) { return value ? ('- ' + label + ': ' + value) : ''; }
    function block(title, lines) {
      var inner = lines.filter(Boolean).join('\n');
      return inner ? (title + '\n' + inner + '\n') : '';
    }

    // --- build fields (all IDs you provided) ---
    function buildFields() {
      // Identity & Org
      var first = getVal('41134679554331');
      var last  = getVal('41134723405595');
      var title = getVal('41134724350107');
      var dept  = getVal('41134726133275');
      var start = prettyDate(getVal('41134762486555'));
      var reportsTo = getVal('41134776240411');
      var officePhone = getVal('41134772943259');
      var cellPhone   = getVal('41134746346907');
      var standards   = getDDLabel('41134147290523'); // lookup
      var service     = getDDLabel('41140632676379'); // lookup

      // Email
      var needsEmail   = getDDLabel('41134919788827');
      var prefNewEmail = getVal('41134940312091');
      var existingEmail= getVal('41134950735899');
      var replacingYN  = getDDLabel('41134970741659');
      var replacingWho = getVal('41135043430427');
      var existingStill= getDDLabel('41135204750107');

      // Computer
      var willUseCompany = getDDLabel('41134825610779');
      var newOrExisting  = getDDLabel('41134868476315');
      var existingPCName = getVal('41134891429147');

      // Access
      var standardApps = getMultiLabels('41135512540955');
      var sharedDrives = getVal('41135376583195');
      var distGroups   = getVal('41135508887323');
      var printers     = getVal('41135538769307');
      var secGroups    = getVal('41135540022427');

      // Misc
      var comments = getVal('41135548344219');

      // Subject
      var subjectParts = [];
      if (first || last) subjectParts.push(('New User: ' + (first + ' ' + last)).trim());
      if (start) subjectParts.push('Start ' + start);
      var subject = subjectParts.join(' | ');

      // Description (structured)
      var description =
        block('NEW EMPLOYEE', [
          line('Name', [first, last].filter(Boolean).join(' ')),
          line('Title', title),
          line('Department', dept),
          line('Start Date', start),
          line('Manager (Reports To)', reportsTo),
          line('Office/Direct Phone', officePhone),
          line('Cell Phone', cellPhone),
          line('User Standards & Exceptions', standards),
          line('Service', service)
        ]) +
        '---\n' +
        block('EMAIL', [
          line('Needs Email Setup', needsEmail),
          line('Preferred New Email', prefNewEmail),
          line('Existing Email', existingEmail),
          line('Replacing Existing User', replacingYN),
          line("Existing User's Name", replacingWho),
          line('Is Existing User Still Employed', existingStill)
        ]) +
        '---\n' +
        block('COMPUTER', [
          line('Company Computer', willUseCompany),
          line('New or Existing Computer', newOrExisting),
          line('Existing Computer Name', existingPCName)
        ]) +
        '---\n' +
        block('ACCESS', [
          line('Standard Applications', standardApps),
          line('Shared Drives', sharedDrives),
          line('Distribution Groups', distGroups),
          line('Printers & Scanners', printers),
          line('Security Group Access', secGroups)
        ]) +
        (comments ? ('---\nNOTES\n' + comments + '\n') : '');

      // Apply
      if (subject) $('#request_subject').val(subject);
      if (description) $('#request_description').val(description.trim());
    }

    // Wire events: any custom field change rebuilds
    $(document).on('input change', '[id^=request_custom_fields_]', buildFields);

    // Initial call
    buildFields();

    // Keep fresh if the form re-renders dynamically
    var mo = new MutationObserver(function(){ buildFields(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
});
