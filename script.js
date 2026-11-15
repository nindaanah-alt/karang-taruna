(function () {
  "use strict";

  // Countdown — 20 Desember 2026, 08:00 WIB
  var target = new Date("2026-12-20T08:00:00+07:00").getTime();
  var els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };
  var countdownEl = document.getElementById("countdown");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      countdownEl.innerHTML =
        '<p class="countdown__done" style="grid-column:1/-1">Hari bahagia telah tiba!</p>';
      clearInterval(timer);
      return;
    }
    els.days.textContent = Math.floor(diff / 86400000);
    els.hours.textContent = pad(Math.floor((diff / 3600000) % 24));
    els.minutes.textContent = pad(Math.floor((diff / 60000) % 60));
    els.seconds.textContent = pad(Math.floor((diff / 1000) % 60));
  }

  var timer = setInterval(tick, 1000);
  tick();

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // RSVP
  var form = document.getElementById("rsvp-form");
  var errorEl = document.getElementById("rsvp-error");
  var thanks = document.getElementById("rsvp-thanks");
  var thanksText = document.getElementById("rsvp-thanks-text");
  var wishes = document.getElementById("wishes");
  var againBtn = document.getElementById("rsvp-again");

  function addWish(name, status, message) {
    var li = document.createElement("li");
    var strong = document.createElement("strong");
    strong.textContent = name;
    var small = document.createElement("small");
    small.textContent = status;
    li.appendChild(strong);
    li.appendChild(small);
    if (message) {
      var p = document.createElement("p");
      p.textContent = message;
      li.appendChild(p);
    }
    wishes.prepend(li);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var attend = data.get("attend");
    var guests = data.get("guests");
    var message = String(data.get("message") || "").trim();

    if (name.length < 2) {
      errorEl.textContent = "Mohon isi nama Anda.";
      form.elements.name.focus();
      return;
    }
    if (!attend) {
      errorEl.textContent = "Mohon pilih konfirmasi kehadiran.";
      return;
    }
    errorEl.textContent = "";

    var hadir = attend === "hadir";
    var status = hadir ? "Hadir · " + guests + " orang" : "Berhalangan hadir";

    thanksText.textContent = hadir
      ? "Terima kasih, " + name + ". Kami menantikan kehadiran Anda (" + guests + " orang)."
      : "Terima kasih, " + name + ". Doa restu Anda sangat berarti bagi kami.";

    addWish(name, status, message);
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  });

  againBtn.addEventListener("click", function () {
    form.reset();
    thanks.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
