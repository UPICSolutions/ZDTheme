/*
 * jQuery v1.9.1 included
 */

$(document).ready(function () {
  // Upic Added - MW-Notification Banner
  $.get("/api/v2/help_center/" + $('html').attr('lang').toLowerCase() + "/articles.json?label_names=alert").done(function (data) {
    $.each(data.articles, function (index, item) {
      var style1 = '<div class="ns-box ns-bar ns-effect-slidetop ns-type-notice ns-show"><div class="ns-box-inner"><span class="megaphone"></span></i><p><a href="' + item.html_url + '">' + item.title + '</a>' + item.body + '</p></div><span class="ns-close"></span></div>';
      $('.alertbox').append(style1);
    });
    $('.ns-close').on('click', function () { $(".alertbox").remove(); });
  });

  // Upic Added - Change string for My Activities
  $('.nav-wrapper .dropdown-menu .my-activities').html('See my tickets');
  $('.sub-nav').find('li').filter(":last");

  //Upic Added - Change string for Search bar 
  $('#query').attr('placeholder', 'Hi, how can we help?');

  //Upic Added - Change string for Search bar signed in users
  if (HelpCenter.user.role != 'anonymous') {
    $('#query').attr('placeholder','Hi ' + HelpCenter.user.name.split(" ")[0] + ', how can we help?');
  }

  // social share popups
  $(".share a").click(function (e) {
    e.preventDefault();
    window.open(this.href, "", "height=500,width=500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
      $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function () { $commentContainerFormControls.show(); });
  if ($commentContainerTextarea.val() !== "") { $commentContainerFormControls.show(); }

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
  $("#request-status-select, #request-organization-select").on("change", function () { search(); });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function (e) { if (e.which === 13) { search(); } });

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
    if (e.keyCode === 27) {
      e.stopPropagation();
      this.setAttribute("aria-expanded", false);
      $(".header .icon-menu").attr("aria-expanded", false);
    }
  });

  if ($("#user-nav").children().length === 0) { $(".header .icon-menu").hide(); }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function () { this.form.submit(); });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function (e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });

  // ===== New User Request form logic (classic markup) =====
  var ticketForm = location.search.split('ticket_form_id=')[1];

  if (ticketForm == 40202845830427) {
    // Hide Subject & Description (classic wrappers)
    $('.form-field.string.optional.request_subject, .form-field.string.required.request_subject').hide();
    $('.form-field.request_description').hide();

    // ---------- helpers ----------
    function getVal(fid) {
      var el = document.querySelector('#request_custom_fields_' + fid);
      return el && el.value ? el.value.trim() : '';
    }

    // Dropdown/Lookup: return the display label (title), not the backend tag
    function getDDLabel(fid) {
      var el = document.querySelector('#request_custom_fields_' + fid);
      if (!el) return '';

      // A) <select> single
      if (el.tagName === 'SELECT' && !el.multiple) {
        var opt = el.options[el.selectedIndex];
        return opt ? (opt.text || '').trim() : '';
      }

      // B) radio group variant
      var radios = document.querySelectorAll('input[type="radio"][name="request[custom_fields][' + fid + ']"]');
      if (radios && radios.length) {
        var chosen = Array.prototype.slice.call(radios).find(function(r){ return r.checked; });
        if (chosen) {
          var lbl = document.querySelector('label[for="' + chosen.id + '"]');
          return (lbl && lbl.textContent ? lbl.textContent : chosen.value).trim();
        }
      }

      // C) fallback to raw value/tag
      return el.value ? el.value.trim() : '';
    }

    // Multi-select: support <select multiple> and checkbox groups
    function getMultiLabels(fid) {
      var el = document.querySelector('#request_custom_fields_' + fid);

      // A) <select multiple>
      if (el && el.tagName === 'SELECT' && el.multiple && el.options) {
        return Array.prototype.slice.call(el.options)
          .filter(function (o) { return o.selected; })
          .map(function (o) { return (o.text || '').trim(); })
          .filter(Boolean)
          .join(', ');
      }

      // B) checkbox group
      var boxes = document.querySelectorAll('input[type="checkbox"][name="request[custom_fields][' + fid + '][]"]:checked');
      if (boxes && boxes.length) {
        return Array.prototype.slice.call(boxes)
          .map(function (cb) {
            var lbl = document.querySelector('label[for="' + cb.id + '"]');
            return ((lbl && lbl.textContent) ? lbl.textContent : cb.value).trim();
          })
          .filter(Boolean)
          .join(', ');
      }

      return '';
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

    // ---------- builder ----------
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
      var standards   = getDDLabel('41134147290523'); // lookup label
      var service     = getDDLabel('41140632676379'); // lookup label

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
      var standardApps = getMultiLabels('41135512540955'); // robust
      var sharedDrives = getVal('41135376583195');
      var distGroups   = getVal('41135508887323');
      var printers     = getVal('41135538769307');
      var secGroups    = getVal('41135540022427');

      // Notes
      var comments = getVal('41135548344219');

      // Subject
      var subject = [
        (first || last) ? ('New User: ' + [first, last].filter(Boolean).join(' ')) : '',
        start ? ('Start ' + start) : ''
      ].filter(Boolean).join(' | ');

      // Description (uses labels, not tags)
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

      if (subject) $('#request_subject').val(subject);
      if (description) $('#request_description').val(description.trim());
    }

    // Rebuild on any custom field change (inputs, selects, radios, checkboxes)
    $(document).on('input change',
      [
        '[id^=request_custom_fields_]',
        'input[type="radio"][name^="request[custom_fields]"]',
        'input[type="checkbox"][name^="request[custom_fields]"]'
      ].join(','),
      buildFields
    );

    // Initial pass + keep alive across async renders
    buildFields();
    var mo = new MutationObserver(function(){ buildFields(); });
    mo.observe(document.body, { childList: true, subtree: true });

    // Gentle retries for slow loads
    var tries = 0, iv = setInterval(function(){ buildFields(); if (++tries > 10) clearInterval(iv); }, 250);
  }
});
