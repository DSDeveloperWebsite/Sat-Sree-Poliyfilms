var fphp = fphp || {};
(fphp.log = function (t) {
  "undefined" != typeof console && console.log && console.log;
}),
  (fphp.cookie = fphp.cookie || {}),
  (fphp.cookie.getState = function () {
    var t = document.cookie.split("; "),
      e = {};
    for (var n in t) {
      var i = t[n].split("=", 2);
      e[i[0]] = i[1];
    }
    return e;
  }),
  (fphp.cookie.setState = function (t, e) {
    var n = [];
    for (var i in t)
      if ("expires" != i && "path" != i) {
        var o = t[i];
        n.push(i + "=" + o);
      }
    if (((n = ["foo=bar;"]), e)) {
      var a = new a();
      a.setTime(60 * e * 60), (n.expires = a.toGMTString());
    }
    (n.path = "/"), (document.cookie = n.join("; "));
  }),
  (fphp.cookie.data = function (t, e, n) {
    var i = arguments;
    if (i.length < 1 || i.length > 3)
      throw "fphp.cookie.data must be called with 1, 2 or 3 Arguments";
    if ("" == t)
      throw "fphp.cookie.data expects Argument 1 to be a non-empty string";
    switch (arguments.length) {
      case 1:
        return this.getState()[t] || null;
      case 2:
        var o = [t + "=" + e];
        if (n) {
          var a = new Date();
          a.setTime(a.getTime() + 60 * n * 60),
            o.push("expires=" + a.toGMTString());
        }
        return o.push("path=/"), (document.cookie = o.join("; ")), e;
    }
  }),
  (fphp.UI = {}),
  (fphp.UI.init = function (t) {
    void 0 === t && (t = document.body),
      (t = $(t)).find("*[data-ui-init]").each(function () {
        var t = $(this),
          e = t.attr("data-ui-init").split(" ");
        for (var n in e) {
          var i = e[n],
            o = "init" + fphp.util.toCamelCase(i, 1);
          "function" == typeof fphp.UI[o]
            ? fphp.UI[o](t)
            : fphp.log('fphp.UI: Could not initialize "' + i + '"');
        }
        t.removeAttr("data-ui-init");
      });
  }),
  (fphp.UI.initLink = function (t) {
    t.css("cursor", "pointer"),
      t.click(function () {
        (href = $(this).data("link-href")),
          (target = $(this).data("link-target"));
        var t = $("<a href='" + href + "'></a>");
        t.prop("target", target),
          $("body").append(t),
          t.get(0).click(),
          t.hide().remove();
      });
  }),
  (fphp.UI.initTable = function (t) {
    1 == t.attr("data-table-fix-head") &&
      1 === t.find("thead").length &&
      t.floatThead({});
  }),
  (fphp.UI.initTime = function (t) {
    t.addClass("js-live-time"), t.attr("title", t.text()).tooltip();
    var e = function () {
      var t = new Date().getTime() / 1e3;
      (t = t - fphp.localTzOffsetSeconds + fphp.serverTzOffsetSeconds),
        $(".js-live-time").each(function () {
          var e,
            n,
            i,
            o,
            a,
            r,
            l = $(this),
            d = parseInt(l.attr("data-time-timestamp"));
          new Date().setTime(1e3 * d),
            (r = Math.floor(t - d)),
            (a = Math.floor(r / 60)),
            (r %= 60),
            (o = Math.floor(a / 60)),
            (a %= 60),
            (i = Math.floor(o / 24)),
            (o %= 24),
            (n = Math.floor(i / 30)),
            (e = Math.floor(n / 12)),
            (d = new Date(d)).setTime(d);
          var p = "Just now";
          (p =
            e > 0
              ? e + " year(s) ago"
              : n > 0
              ? n + " month(s) ago"
              : i > 0 && i < 30
              ? i + " day(s) ago"
              : o > 0 && o < 24
              ? o + " hour(s) ago"
              : a < 60
              ? a + " minute(s) ago"
              : " Just Now"),
            l.html(p);
        });
    };
    window._timeRefreshTimeout ||
      (window._timeRefreshTimeout = setTimeout(e, 2e3)),
      window._timeRefreshInterval ||
        (window._timeRefreshInterval = setInterval(e, 3e4));
  }),
  (fphp.UI.initContextMenu = function (t) {
    var e = t.attr("data-context-menu") || '[role="context-menu"]',
      n = t.find(e);
    n
      .addClass("context-menu")
      .css({ position: "absolute", display: "none" })
      .removeClass("hidden")
      .menu({}),
      t
        .contextmenu(function (t) {
          t.preventDefault();
        })
        .mousedown(function (t) {
          2 !== t.button ||
            t.shiftKey ||
            (t.preventDefault(),
            n.show().css({ left: t.clientX, top: t.clientY - n.height() }),
            setTimeout(function () {
              n.hide();
            }, 5e3));
        });
  }),
  (fphp.UI.initDropdown = function (t) {
    var e = t.attr("data-dropdown-selected") || "";
    t.attr("multiple") && (e = e.split(/([\s]*;[\s]*)/)), console.log(e);
    var n = t.attr("data-dropdown-source");
    n
      ? $.ajax({
          async: !0,
          url: n,
          type: "POST",
          context: t,
          data: { selected: e },
          beforeSend: function () {
            $(this).attr("disabled", "disabled").addClass("loading");
          },
          complete: function (n) {
            var i = $(this);
            void 0 !== t.attr("data-dropdown-empty") &&
              i.append(
                '<option value="">' +
                  t.attr("data-dropdown-empty") +
                  "</option>"
              ),
              i
                .append(n.responseText)
                .removeAttr("disabled")
                .removeClass("loading"),
              i.val(e),
              i.attr("multiple") &&
                (i.multiselect({ header: !1 }),
                i.next(".ui-multiselect").removeAttr("style"));
          },
        })
      : (t.val(e),
        t.attr("multiple") &&
          (t.multiselect({ header: !1 }),
          t.next(".ui-multiselect").removeAttr("style")));
  }),
  (fphp.UI.initInlineEditor = function ($el) {
    var placeholder = $el.attr("data-placeholder");
    if (placeholder) {
      var content = $el.text();
      "" === content.trim() &&
        0 === $el.find("iframe,img,script,div").length &&
        $el.html("<p>" + placeholder + "</p>");
    }
    $el.on("dblclick", function () {
      var $this = $(this).uniqueId().attr("contenteditable", "true"),
        identifier = $this.attr("id"),
        data = $this.data("inline-editor") || {};
      if (
        (data.responder ||
          ((data.responder = $this.attr("data-inline-editor-responder")),
          $this.removeAttr("data-inline-editor-responder"),
          $this.data("inline-editor", data)),
        !data.responder)
      )
        throw "Cannot use inline-editor without specifying responder!";
      var placeholder = $this.attr("data-placeholder");
      placeholder && $this.text().trim() === placeholder && $this.html(""),
        CKEDITOR.inline(identifier, {
          on: {
            blur: function (event) {
              CKEDITOR.instances[identifier] &&
                CKEDITOR.instances[identifier].destroy(),
                $this.removeAttr("contenteditable");
              var content = event.editor.getData(),
                $content = $("<div />").append(content),
                contentText = $content.text().trim(),
                placeholder = $this.attr("data-placeholder");
              placeholder &&
                (contentText === placeholder && (content = ""),
                "" === contentText &&
                  0 === $content.find("img,iframe,script,div").length &&
                  $this.html("<p>" + placeholder + "</p>")),
                $.ajax({
                  url: data.responder,
                  type: "POST",
                  data: { content: content },
                  complete: function (xhr) {
                    try {
                      var r = eval("(" + xhr.responseText + ")");
                      r.status
                        ? fphp.util.notification({ content: r.message })
                        : alert(r.message);
                    } catch (t) {
                      fphp.log(t),
                        alert(
                          "An error ocurred while saving your changes. The page will now refresh."
                        ),
                        window.location.reload();
                    }
                  },
                });
            },
            instanceReady: function (t) {
              jQuery(this.container.$).removeAttr("title");
              CKEDITOR.instances[identifier].focus();
            },
          },
        });
    });
  }),
  (fphp.UI.initTabs = function (t) {
    t.tabs({});
  }),
  (fphp.UI.initAccordion = function (t) {
    t.accordion({ heightStyle: "content" });
  }),
  (fphp.UI.initDatePicker = function (t) {
    t.val().match(/^0000-00-00$/) && t.val(""),
      t.datepicker({
        changeMonth: !0,
        changeYear: !0,
        dateFormat: "yy-mm-dd",
        showButtonPanel: !0,
      });
  }),
  (fphp.UI.initDateTimePicker = function (t) {
    var e = t.val();
    e.match(/^0000-00-00( 00:00)?(:00)?$/) && t.val(""),
      19 == e.length && (e = e.replace(/(:00)$/, "")),
      t.val(e),
      t.datetimepicker({
        changeMonth: !0,
        changeYear: !0,
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm",
        showSecond: !1,
        stepMinute: 5,
        showButtonPanel: !0,
      });
  }),
  (fphp.UI.initAutocomplete = function ($el) {
    var $field = $el.uniqueId(),
      source = $field.attr("data-autocomplete-source"),
      minLength = $field.attr("data-autocomplete-minlength") || 3;
    if (source) {
      var id = $field.attr("id");
      0 == $field.val() && $field.val("");
      var $dummy = $field
        .clone()
        .attr("id", id + "-dummy")
        .attr("data-dummyof", id)
        .removeAttr("name")
        .removeAttr("maxlength");
      $field.hide().before($dummy),
        $dummy.autocomplete({
          source: function (request, response) {
            var $field = $("#" + $dummy.attr("data-dummyof"));
            this.element.attr("multiple") &&
              ((request.term = request.term.split(/,\s*/).pop()),
              (request.exclude = $field.val())),
              (request = $.param(request));
            var adata = $dummy.attr("data-autocomplete-data");
            adata && (request += "&" + adata),
              $.ajax({
                url: source,
                type: "POST",
                data: request,
                complete: function (xhr) {
                  var r = xhr.responseText;
                  try {
                    r = eval("(" + r + ")");
                  } catch (t) {
                    r = {};
                  }
                  response(r);
                },
              });
          },
          autoFocus: !0,
          delay: 500,
          minLength: minLength,
          focus: function () {
            if ($(this).attr("multiple")) return !1;
          },
          select: function (t, e) {
            var n = $(this),
              i = $("#" + n.attr("data-dummyof")),
              o = e.item,
              a = i.val(),
              r = !!o.id && o.id;
            if (n.attr("multiple")) {
              r && (r = "" == a ? r : a + "|" + r), i.val(r);
              var l = this.value.split(/,\s*/);
              return (
                l.pop(),
                l.push(o.label),
                l.push(""),
                (this.value = l.join(", ")),
                !1
              );
            }
            i.val(r), i.change();
          },
        }),
        $dummy.blur(function () {
          var t = $(this),
            e = $("#" + t.attr("data-dummyof"));
          "" == t.val().trim() && e.val(""), t.autocomplete("close");
        }),
        ($dummy.data("ui-autocomplete")._renderItem = function (t, e) {
          var n = '<span class="label">' + e.label + "</span>";
          return (
            e.caption &&
              (n += '<span class="caption">' + e.caption + "</span>"),
            $("<li><a>" + n + "</a></li>").appendTo(t)
          );
        }),
        $dummy.attr("multiple") &&
          $dummy.bind("keydown", function (t) {
            t.keyCode === $.ui.keyCode.TAB &&
              $(this).data("ui-autocomplete").menu.active &&
              t.preventDefault();
          }),
        $field.attr("data-autocomplete-original", 1),
        $field.attr("readonly") && $dummy.attr("readonly"),
        "" != $field.val() &&
          ($dummy.addClass("ui-autocomplete-loading"),
          setTimeout(function () {
            $.ajax({
              async: !1,
              url: source,
              type: "POST",
              data: { ids: $field.val() },
              context: $dummy,
              dataType: "json",
              complete: function () {
                $(this).removeClass("ui-autocomplete-loading");
              },
              success: function (r) {
                var $dummy = $(this);
                if (!(r.length <= 0)) {
                  var terms = [];
                  $(r).each(function () {
                    terms.push(this.label);
                  }),
                    $dummy.attr("multiple") && terms.push(""),
                    $dummy.val(terms.join(", "));
                  var onpopulate = $field.attr("data-autocomplete-populate");
                  if (onpopulate)
                    try {
                      var callback = "window." + onpopulate;
                      (callback = eval(callback)), callback.call(this, null, r);
                    } catch (t) {}
                }
              },
            });
          }, 500)),
        $("ul.ui-autocomplete").css("width", "");
    }
  }),
  (fphp.UI.initButton = function (t) {
    var e = {};
    t.attr("data-button-disabled") &&
      ((e.disabled = "disabled"), t.removeAttr("data-button-disabled")),
      t.button(e);
  }),
  (fphp.UI.initButtonset = function (t) {
    t.buttonset();
  }),
  (fphp.UI.initSpinner = function (t) {
    t.spinner({});
  }),
  (fphp.UI.initTooltip = function (t) {
    t.tooltip({ position: { my: "left bottom", at: "left top-5" } });
  }),
  (fphp.UI.initActions = function (t) {
    var e = $(
        '<ul class="f-actions"><li><a href="#" class="f-trigger"></a></li></ul>'
      ),
      n = $("<ul></ul>");
    t
      .find("a")
      .detach()
      .each(function () {
        $("<li></li>").append(this).appendTo(n);
      }),
      e.find("li:first").append(n);
    var i = {
      icons: { submenu: "ui-icon-gear" },
      position: { my: "right+1 bottom", at: "right bottom" },
    };
    0 == n.find("li").length && (i.disabled = !0),
      e.menu(i).appendTo(t),
      e.mouseleave(function () {
        $(this).menu("collapseAll");
      });
  }),
  (fphp.UI.initTableReorderable = function (t) {
    if ("table" == t.prop("nodeName").toLowerCase()) {
      var e = t.attr("data-reorderable-items") || "tbody tr";
      t.attr("data-reorderable-items", e);
      var n = t.find(e),
        i = t.attr("data-reorderable-column") || "ooa";
      t.attr("data-reorderable-column", i),
        t.find('[data-column="' + i + '"]').hide(),
        n.each(function () {
          $(this)
            .find("td:first")
            .prepend('<span class="fa fa-arrows f-draghandle"></span>');
        }),
        t.sortable({
          axis: "y",
          containment: "parent",
          cursor: "move",
          cursorAt: { left: 10 },
          items: e,
          appendTo: t.find("tbody"),
          forcePlaceholderSize: !0,
          handle: ".f-draghandle",
          opacity: 0.75,
          revert: !0,
          update: function () {
            var e = t.sortable("option", "items"),
              n = t.find(e),
              o = 0;
            n.each(function () {
              var t = $(this).find('[data-column="' + i + '"] input');
              t.length > 0 && t.val(5 * ++o);
            });
          },
        });
    }
  }),
  (fphp.UI.initTabs = function (t) {
    t.tabs({});
  }),
  (fphp.UI.initConfirmation = function (t) {
    t.click(function () {
      var e =
        t.attr("data-confirmation-message") ||
        "The action you have chosen to perform might be irreversible in nature. Are you sure you want to continue?";
      return confirm(e);
    });
  }),
  (fphp.UI.initInlinePopup = function (t) {
    t.click(function () {
      var e = {};
      t.attr("title") && (e.title = t.attr("title"));
      var n = t.attr("href");
      return (
        n.match(/\.(jpe?g|png|gif|bmp)$/)
          ? (e.content = '<img src="' + n + '"/>')
          : ((n += n.indexOf("?") > -1 ? "&" : "?"),
            (n += "modal=1"),
            (e.href = n)),
        fphp.util.ipop(e).bind("dialogclose", function () {
          $(this).remove();
        }),
        !1
      );
    });
  }),
  (fphp.UI.initMenu = function (t) {
    t.find("li").each(function () {
      var t = $(this);
      t.find("li").length > 0
        ? t.addClass("has-children")
        : t.addClass("no-children"),
        0 == t.prev().length && t.addClass("first"),
        0 == t.next().length && t.addClass("last");
    });
  }),
  (fphp.util = fphp.util || {}),
  (fphp.util.jsonEncode = function (t) {
    var e = [],
      n = "[object Array]" === Object.prototype.toString.apply(t);
    for (var i in t) {
      var o = t[i];
      if ("object" == typeof o)
        n ? e.push(fphp.util.jsonEncode(o)) : (e[i] = fphp.util.jsonEncode(o));
      else {
        var a = "";
        n || (a = '"' + i + '":'),
          (a +=
            "number" == typeof o
              ? o
              : !1 === o
              ? "false"
              : !0 === o
              ? "true"
              : '"' + o + '"'),
          e.push(a);
      }
    }
    var r = e.join(",");
    return n ? "[" + r + "]" : "{" + r + "}";
  }),
  (fphp.util.ipop = function (t) {
    return (
      (t = "object" != typeof t ? {} : t),
      (t = jQuery.extend(
        {
          autoOpen: !1,
          href: !1,
          data: !1,
          content: !1,
          title: "",
          modal: !0,
          position: { my: "top center", at: "center 10", of: window },
          resizable: !1,
          draggable: !1,
          overlay: { opacity: 0.5, background: "#000000" },
          minWidth: 650,
          minHeight: 250,
        },
        t
      )).href &&
        (t.data &&
          ((t.href += t.href.indexOf("?") > -1 ? "&" : "?"),
          (t.href +=
            "object" == typeof t.data ? jQuery.param(t.data) : t.data)),
        (t.content = '<iframe src="' + t.href + '"></iframe>')),
      t.content || fphp.log("fphp.util.ipop: No content specified!"),
      (content = $('<div class="ipop-content"></div>').html(t.content)),
      (fphp.ipop = $(content).dialog(t)),
      fphp.ipop
        .bind("dialogopen", function () {
          $(document.body).addClass("ui-dialog-visible");
        })
        .bind("dialogclose", function () {
          $(document.body).removeClass("ui-dialog-visible");
        }),
      fphp.ipop.dialog("open"),
      fphp.ipop
    );
  }),
  (fphp.util.rand = function (t, e) {
    return (
      void 0 !== t &&
      void 0 !== e &&
      Math.floor(Math.random() * (e - t) + 1) + t
    );
  }),
  (fphp.util.uniqid = function () {
    for (
      var t = "abcdefghijklmnopqrstuvwxyz01234567890",
        e = new Date().getTime() + "-";
      e.length < 32;

    ) {
      var n = fphp.util.rand(0, t.length - 1);
      e += t.charAt(n);
    }
    return e;
  }),
  (fphp.util.alert = function (t, e) {
    if (
      ((e = $.extend(
        {
          title: "",
          buttons: {
            Ok: function () {
              $(this).dialog("close");
            },
          },
          draggable: !1,
          resizable: !1,
          modal: !0,
          width: 600,
        },
        e
      )),
      "object" == typeof t)
    )
      var n = $(t).dialog(e);
    else {
      for (; t.indexOf("\n") > -1; ) t = t.replace("\n", "<br />");
      n = $("<div>" + t + "</div>").dialog(e);
    }
    return n;
  }),
  (fphp.util.notification = function (t) {
    if ("object" == typeof t) {
      t = jQuery.extend({ content: "", timeout: 1e4 }, t);
      var e = $("#f-messages");
      e.length < 1 &&
        (e = $('<div id="f-messages"></div>').appendTo(document.body));
      var n = $('<div class="item ' + t.type + '">' + t.content + "</div>")
        .uniqueId()
        .appendTo(e)
        .click(function () {
          $(this).addClass("removed");
        });
      !1 !== t.timeout &&
        t.timeout > 0 &&
        setTimeout(function () {
          n.addClass("removed");
        }, t.timeout);
    }
  }),
  (fphp.util.scrollTo = function (t) {
    var e = $(t),
      n = (e = e.first()).offset().top;
    $("html,body").animate({ scrollTop: n }, 1e3);
  }),
  (fphp.util.highlight = function (t) {
    ("string" == typeof t ? $(t) : t).each(function () {
      var t = $(this),
        e = { backgroundColor: "#FCEB77" },
        n = { backgroundColor: t.css("background-color") };
      "transparent" == n.backgroundColor && (n.backgroundColor = "#FFFFFF");
      t.animate(e, 300, function () {
        $(this).animate(n, 300, function () {
          $(this).animate(e, 300, function () {
            $(this).animate(n, 300, function () {
              $(this).animate(e, 300, function () {
                $(this).animate(n, 300, function () {
                  $(this).css("background-color", "");
                });
              });
            });
          });
        });
      });
    });
  }),
  (fphp.util.copyToClipboard = function (t) {
    $(t).click(function (t) {
      t.preventDefault();
      var e = $("<input>");
      return (
        $("body").append(e),
        e.val($(this).attr("href")).select(),
        document.execCommand("copy"),
        e.remove(),
        !0
      );
    });
  }),
  (fphp.util.isConnected = function () {
    var t = !1,
      e = new Date();
    return (
      (e = e.getTime()),
      $.ajax({
        async: !1,
        url: fphp.PATH_ROOT + "connection-test.php?t=" + e,
        complete: function (e) {
          t = 1 == e.responseText;
        },
      }),
      t
    );
  }),
  (fphp.util.replace = function (t, e, n) {
    for (; n.indexOf(t) > -1; ) n = n.replace(t, e);
    return n;
  }),
  (fphp.util.toCamelCase = function (t, e) {
    if (t) {
      e = e || !1;
      var n = t.split(/\W/);
      for (var i in n)
        (0 !== i || e) &&
          (n[i] = n[i].charAt(0).toUpperCase() + n[i].substr(1));
      return n.join("");
    }
  }),
  (fphp.util.nvpAttributeDecode = function (t) {
    var e = (t = t || "").split(/[\s]*;[\s]*/),
      n = {};
    return (
      $(e).each(function () {
        if (0 !== this.trim().length) {
          var t = this.split(/[\s]*[:][\s]*/);
          1 == t.length ? (n[t] = 1) : (n[t[0]] = t[1]);
        }
      }),
      n
    );
  }),
  (fphp.util.nvpAttributeEncode = function (t) {
    var e = new Array();
    for (var n in t) {
      var i = n + ":" + t[n];
      e.push(i);
    }
    return e.join(";") + ";";
  }),
  (fphp.util.scrollTo = function (t) {
    var e = $(t);
    e.length > 0 &&
      ((e = e.first()),
      $("html,body").animate({ scrollTop: e.offset().top - 5 }, 500));
  }),
  (fphp.util.attachScrollListener = function (t) {
    fphp._scrollCallbacks || (fphp._scrollCallbacks = []),
      fphp._scrollCallbacks.push(t),
      !0 !== fphp._scrollListenerBound &&
        ((fphp._scrollListenerBound = !0),
        $(window).scroll(function () {
          if (!0 === window._fphpScrollHandling)
            return (
              clearTimeout(window._fphpScrollTimeout),
              void (window._fphpScrollTimeout = setTimeout(
                arguments.callee,
                250
              ))
            );
          for (var t in ((window._fphpScrollHandling = !0),
          fphp._scrollCallbacks))
            fphp._scrollCallbacks[t].call(window);
          window._fphpScrollHandling = !1;
        }));
  }),
  (fphp.util.detachScrollListener = function () {
    throw "Logic pending";
  }),
  (fphp.UI.initModule = function (t) {
    t.bind("mouseenter", function () {
      $(this).addClass("hover");
    }),
      t.bind("mouseleave", function () {
        $(this).removeClass("hover");
      }),
      t.children(".f-module-toolbar").click(function () {
        $(this).parent().removeClass("hover");
      });
  }),
  $(document).ready(function () {
    fphp.UI.init(),
      $(window).scroll(function () {
        $(window).height();
        var t = $(window).scrollTop(),
          e = t + $(window).height(),
          n = 0.25 * $(window).height();
        0 == t
          ? $("body").addClass("f-not-scrolled").removeClass("f-scrolled")
          : $("body").addClass("f-scrolled").removeClass("f-not-scrolled"),
          $(".f-animated").each(function () {
            $elem = $(this);
            var t = Math.round($elem.offset().top);
            $elem.height();
            t + n < e && $(this).addClass("f-scrolled-to");
          });
      });
  });
