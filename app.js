// ===============================
// Rewind Pub & Grub — Frontend Config (REAL DETAILS)
// ===============================
const CONFIG = {
  phoneNumberDisplay: "071 499 1706",
  phoneNumberTel: "+27714991706",
  whatsappNumber: "27714991706",

  addressText: "41 Messina St, Saaiplaas, Virginia, 9430",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=41+Messina+St,+Saaiplaas,+Virginia,+9430",

  locationText: "Virginia, Free State",
  hoursText: "Mon–Thu 10:00–22:00 • Fri–Sun 10:00–00:00",

  bookingEndpoint: "/api/bookings"
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  $("#year").textContent = new Date().getFullYear();
}

function wireLinks() {
  const callHref = `tel:${CONFIG.phoneNumberTel}`;

  const whatsHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Hi Rewind Pub & Grub! I’d like to book a table / ask about availability."
  )}`;

  // Hero
  $("#callBtn").href = callHref;
  $("#directionsBtn").href = CONFIG.googleMapsUrl;

  // Contact section
  const dir2 = $("#directionsBtn2");
  if (dir2) dir2.href = CONFIG.googleMapsUrl;

  // Footer
  const callFooter = $("#callBtnFooter");
  const whatsFooter = $("#whatsBtnFooter");
  if (callFooter) callFooter.href = callHref;
  if (whatsFooter) whatsFooter.href = whatsHref;

  // Shared buttons
  $("#callBtn2").href = callHref;
  $("#whatsBtn").href = whatsHref;

  // Sticky bar
  $("#stickyCall").href = callHref;
  $("#stickyWhats").href = whatsHref;
  $("#stickyDir").href = CONFIG.googleMapsUrl;

  // Hero mini info
  $("#locationText").textContent = CONFIG.locationText;
  $("#hoursText").textContent = CONFIG.hoursText;
}

function mobileNav() {
  const toggle = $("[data-nav-toggle]");
  const menu = $("[data-mobile-nav]");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("isOpen");
    menu.setAttribute("aria-hidden", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("a", menu).forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("isOpen");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function bookingModal() {
  const modal = $("[data-modal]");
  const openers = $$("[data-open-booking]");
  const closers = $$("[data-close-modal]");

  const open = () => {
    modal.classList.add("isOpen");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("#bookingForm input[name='date']").focus(), 50);
  };

  const close = () => {
    modal.classList.remove("isOpen");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    $("#formStatus").textContent = "";
  };

  openers.forEach(btn => btn.addEventListener("click", open));
  closers.forEach(btn => btn.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("isOpen")) close();
  });

  $("#bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = $("#formStatus");
    status.textContent = "Sending booking request…";

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.source = "website";
    payload.createdAt = new Date().toISOString();

    try {
      const res = await fetch(CONFIG.bookingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Booking API error");

      status.textContent = "✅ Booking request sent! We’ll confirm shortly.";
      form.reset();
      setTimeout(() => close(), 1200);

    } catch (err) {
      const msg =
        `Hi Rewind Pub & Grub! I'd like to book a table.\n` +
        `Date: ${payload.date}\nTime: ${payload.time}\nParty: ${payload.partySize}\n` +
        `Seating: ${payload.seating}\nName: ${payload.name}\nPhone: ${payload.phone}\nNotes: ${payload.notes || "-"}`;

      const fallbackWhats = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

      status.innerHTML =
        `⚠️ Booking system is not connected yet.<br>` +
        `Send the request via WhatsApp: ` +
        `<a href="${fallbackWhats}" target="_blank" rel="noopener"><strong>Send on WhatsApp</strong></a>`;
    }
  });
}

setYear();
wireLinks();
mobileNav();
bookingModal();
