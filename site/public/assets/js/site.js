/* MS Plant Service — site behaviour. No dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-nav]");

  /* ---- Header: solid background after scrolling past the hero top ---- */
  function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("menu-open")) setMenu(false);
  });

  /* ---- Highlight current section in nav ---- */
  var links = Array.prototype.slice.call(nav.querySelectorAll("ul a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });

    /* ---- Reveal on scroll ---- */
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); rev.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      rev.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Project filters ---- */
  var filterBar = document.querySelector("[data-filters]");
  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-gallery] .tile"));
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("[data-filter]").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      tiles.forEach(function (t) {
        var show = f === "all" || t.getAttribute("data-cat") === f;
        t.classList.toggle("is-hidden", !show);
        if (show) t.classList.add("is-in");
      });
    });
  }

  /* ---- Lightbox (gallery + certificates) ---- */
  var lb = document.querySelector("[data-lightbox]");
  var lbImg = lb.querySelector("[data-lb-img]");
  var lbCap = lb.querySelector("[data-lb-cap]");
  var group = [];
  var idx = 0;

  function show(i) {
    idx = (i + group.length) % group.length;
    var el = group[idx];
    lbImg.src = el.getAttribute("data-full");
    lbImg.alt = el.getAttribute("data-caption") || "";
    lbCap.textContent = el.getAttribute("data-caption") || "";
    var multi = group.length > 1;
    lb.querySelector("[data-lb-prev]").hidden = !multi;
    lb.querySelector("[data-lb-next]").hidden = !multi;
  }
  function open(el) {
    var inGallery = el.closest("[data-gallery]");
    group = inGallery
      ? tiles.filter(function (t) { return !t.classList.contains("is-hidden"); })
      : Array.prototype.slice.call(document.querySelectorAll(".cert-thumb"));
    show(group.indexOf(el));
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  }
  function close() { if (lb.open) lb.close(); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-full]");
    if (t) { e.preventDefault(); open(t); }
  });
  lb.querySelector("[data-lb-close]").addEventListener("click", close);
  lb.querySelector("[data-lb-prev]").addEventListener("click", function () { show(idx - 1); });
  lb.querySelector("[data-lb-next]").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---- Quote form ----
     If data-endpoint is set (e.g. Formspree, a WordPress REST route or a
     serverless function), the form POSTs there. Otherwise it opens the
     visitor's mail app with a pre-filled, structured enquiry. */
  var form = document.querySelector("[data-quote-form]");
  if (form) {
    var status = form.querySelector("[data-form-status]");
    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var ok = f.value.trim() !== "" && (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.closest(".field").classList.toggle("is-invalid", !ok);
        if (!ok && valid) { f.focus(); valid = false; }
      });
      if (!valid) { setStatus("Please fill in the highlighted fields.", "error"); return; }

      var data = new FormData(form);
      var services = data.getAll("services").join(", ") || "Not specified";
      var endpoint = form.getAttribute("data-endpoint");

      if (endpoint) {
        setStatus("Sending…");
        fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            form.reset();
            setStatus("Thank you. We will get back to you shortly.", "ok");
          })
          .catch(function () {
            setStatus("Sending failed. Please email info@msplantservice.nl or call +31 6 285 01 868.", "error");
          });
        return;
      }

      var lines = [
        "Name: " + data.get("name"),
        "Company: " + (data.get("company") || "-"),
        "Email: " + data.get("email"),
        "Phone: " + (data.get("phone") || "-"),
        "Services: " + services,
        "Location: " + (data.get("location") || "-"),
        "Target start: " + (data.get("start") || "-"),
        "",
        data.get("message")
      ];
      var subject = "Project enquiry" + (data.get("company") ? " – " + data.get("company") : "");
      window.location.href = "mailto:" + form.getAttribute("data-mailto") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      setStatus("Your email app should open with the enquiry ready to send.", "ok");
    });
    form.addEventListener("input", function (e) {
      var f = e.target.closest(".field");
      if (f) f.classList.remove("is-invalid");
    });
  }

  /* ---- Gentle parallax on the statement band (skipped for reduced motion) ---- */
  var px = document.querySelector("[data-parallax]");
  if (px && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    var move = function () {
      var r = px.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        px.style.transform = "translate3d(0," + (p * -8).toFixed(2) + "%,0)";
      }
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(move); }
    }, { passive: true });
    move();
  }

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
