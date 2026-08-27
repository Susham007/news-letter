export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index2.html") {
      const shell = new URL("/shell.html", url);
      return env.ASSETS.fetch(new Request(shell, request));
    }
    return env.ASSETS.fetch(request);
  }
};
