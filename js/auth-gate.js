// Porte d'accès professeurs — remplace l'ancien mot de passe encryptcontent.
// Le jeton Supabase est partagé avec le Générateur V3 (même origine github.io).
(function () {
  var API_BASE =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:8080"
      : "https://generateur-sti2d-v3-backend.onrender.com";
  var LOGIN_URL = "https://xavierfrassinelli.github.io/generateur-sti2d-v3-independant/login.html";

  function buildMessage(title, body) {
    var box = document.createElement("div");
    box.className = "prof-gate-message";
    box.style.cssText =
      "max-width:720px;margin:2rem auto;padding:2rem;border:1px solid #e2e8f0;" +
      "border-radius:12px;text-align:center;font-family:inherit;background:#fff;";
    box.innerHTML =
      '<h2 style="margin:0 0 .5rem;font-size:1.25rem;">' + title + "</h2>" +
      '<p style="margin:0;color:#475569;">' + body + "</p>";
    return box;
  }

  function verifyProf() {
    return new Promise(function (resolve) {
      var token = "";
      try {
        token = localStorage.getItem("sti2d_access_token") || "";
      } catch (e) {
        token = "";
      }
      if (!token) {
        resolve(false);
        return;
      }
      fetch(API_BASE + "/api/auth/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then(function (res) {
          if (!res.ok) {
            resolve(false);
            return null;
          }
          return res.json();
        })
        .then(function (data) {
          resolve(Boolean(data) && data.ok === true && String(data.user && data.user.role) === "prof");
        })
        .catch(function () {
          resolve(false);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gate = document.getElementById("prof-gate");
    if (!gate) return; // page non protégée

    var article =
      document.querySelector("article.md-content__inner") || document.querySelector("article");
    var anchor = article || document.querySelector(".md-content") || document.body;

    if (article) article.style.display = "none";

    var msg = buildMessage(
      "🔒 Page réservée aux professeurs",
      'Vérification de votre accès…<br><span style="font-size:.9rem;color:#64748b;">Si rien ne se passe, <a href="' + LOGIN_URL + '">connectez-vous</a> au Générateur V3.</span>'
    );
    anchor.parentNode.insertBefore(msg, anchor);

    verifyProf().then(function (isProf) {
      if (!isProf) {
        msg.innerHTML =
          '<h2 style="margin:0 0 .5rem;font-size:1.25rem;">🔒 Accès refusé</h2>' +
          '<p style="margin:0;color:#475569;">Cette page est réservée aux professeurs identifiés.<br><br>' +
          '<a href="' + LOGIN_URL + '">Se connecter au Générateur V3</a></p>';
        return;
      }
      msg.remove();
      if (article) article.style.display = "";
    });
  });
})();
