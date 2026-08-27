export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve normal static assets unchanged.
    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return env.ASSETS.fetch(request);
    }

    // Fetch the newsletter itself directly — no shell, no iframe, no loader.
    const indexUrl = new URL("/index.html", url);
    const response = await env.ASSETS.fetch(new Request(indexUrl, request));

    if (!response.ok) return response;

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append('<link rel="stylesheet" href="/ui-v3.css?v=6">', { html: true });
        }
      })
      .on("body", {
        element(el) {
          el.append('<script src="/enhance.js?v=6"></script>', { html: true });
        }
      })
      .transform(response);
  }
};
