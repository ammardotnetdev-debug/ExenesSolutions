/**
 * Contact form submission via EmailJS (no PHP backend).
 * Uses existing form structure and validation; shows success/error messages.
 */
(function () {
  "use strict";

  var EMAILJS_USER_ID = "Ewhi9KJmVWh--5l_j";
  var EMAILJS_SERVICE_ID = "service_zyxh7nq";
  var EMAILJS_TEMPLATE_ID = "template_25jw614";
  // Optional: set to your private email to receive BCC copies, or leave empty
  var BCC_EMAIL = "";

  var form = document.getElementById("contact-form");
  if (!form) return;

  function showLoading(show) {
    var el = form.querySelector(".loading");
    if (el) el.classList.toggle("d-block", !!show);
  }

  function showError(message) {
    var err = form.querySelector(".error-message");
    var sent = form.querySelector(".sent-message");
    if (err) {
      err.textContent = message || "There was an error sending your message. Please try again.";
      err.classList.add("d-block");
    }
    if (sent) sent.classList.remove("d-block");
  }

  function showSuccess() {
    var sent = form.querySelector(".sent-message");
    var err = form.querySelector(".error-message");
    if (sent) sent.classList.add("d-block");
    if (err) err.classList.remove("d-block");
  }

  function hideMessages() {
    var err = form.querySelector(".error-message");
    var sent = form.querySelector(".sent-message");
    if (err) err.classList.remove("d-block");
    if (sent) sent.classList.remove("d-block");
  }

  function buildMessageHtml(name, email, subject, message) {
    var esc = function (s) {
      if (s == null) return "";
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };
    return (
      "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">" +
      "<h2 style=\"color: #333;\">New message from Exenes Solutions contact form</h2>" +
      "<table style=\"width: 100%; border-collapse: collapse;\">" +
      "<tr><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\"><strong>Name</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\">" + esc(name) + "</td></tr>" +
      "<tr><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\"><strong>Email</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\">" + esc(email) + "</td></tr>" +
      "<tr><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\"><strong>Subject</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\">" + esc(subject) + "</td></tr>" +
      "</table>" +
      "<p style=\"margin-top: 16px;\"><strong>Message</strong></p>" +
      "<p style=\"white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 4px;\">" + esc(message) + "</p>" +
      "<p style=\"margin-top: 24px; font-size: 12px; color: #666;\">Sent via Exenes Solutions website contact form.</p>" +
      "</div>"
    );
  }

  function handleSubmit(event) {
    if (event.target.id !== "contact-form") return;
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var name = (form.querySelector('[name="name"]') || {}).value || "";
    var email = (form.querySelector('[name="email"]') || {}).value || "";
    var subject = (form.querySelector('[name="subject"]') || {}).value || "";
    var message = (form.querySelector('[name="message"]') || {}).value || "";

    hideMessages();
    showLoading(true);

    // Template variable names must match EmailJS template placeholders
    var templateParams = {
      user_name: name,
      user_email: email,
      subject: subject,
      message: message,
      message_html: buildMessageHtml(name, email, subject, message)
    };
    if (BCC_EMAIL) {
      templateParams.bcc_email = BCC_EMAIL;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, { publicKey: EMAILJS_USER_ID })
      .then(function () {
        showLoading(false);
        showSuccess();
        form.reset();
      })
      .catch(function (err) {
        showLoading(false);
        showError(err.text || err.message || "Failed to send message. Please try again.");
      });
  }

  if (typeof emailjs === "undefined") {
    console.error("EmailJS SDK not loaded.");
    return;
  }

  emailjs.init(EMAILJS_USER_ID);
  form.addEventListener("submit", handleSubmit, true);
})();
