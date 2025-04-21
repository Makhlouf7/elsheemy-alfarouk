document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("#content");
  const allNavButtons = document.querySelectorAll("nav .nav-item");
  let currentStylesheet = null;
  let currentScript = null;

  allNavButtons.forEach((btn) =>
    btn.addEventListener("click", function () {
      const pagePath = this.dataset.page;

      fetch(pagePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to load ${pagePath}: ${response.statusText}`
            );
          }
          return response.text();
        })
        .then((html) => {
          main.innerHTML = html;
          // Replace the previous html stylesheet with the current page stylesheet
          const stylesheetPath = pagePath.replace("index.html", "style.css");
          if (currentStylesheet) {
            currentStylesheet.remove();
          }
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = stylesheetPath;
          document.head.appendChild(link);
          currentStylesheet = link;

          // Replace the previous html script with the current page script
          const scriptPath = pagePath.replace("index.html", "script.js");
          if (currentScript) {
            currentScript.remove();
          }
          const script = document.createElement("script");
          script.src = scriptPath;
          document.body.appendChild(script);
          currentScript = script;
        })
        .catch((err) => console.error(`Error loading ${pagePath}`, err));
    })
  );
});
