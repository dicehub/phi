type PageView = { url: string; title: string; referrer: string };
type Umami = { track: (update: (payload: Record<string, unknown>) => Record<string, unknown>) => Promise<unknown> };

const script = document.querySelector<HTMLScriptElement>("#phi-analytics");
const domains = script?.dataset.domains?.split(",").map((domain) => domain.trim()) ?? [];

if (domains.includes(window.location.hostname)) {
  const cleanUrl = (value: string) => {
    if (!value) return "";
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  };

  let previousUrl = cleanUrl(document.referrer);
  let lastUrl = "";
  const pending: PageView[] = [];

  const flush = () => {
    const umami = (window as Window & { umami?: Umami }).umami;
    if (!umami) return;
    for (const pageView of pending.splice(0)) {
      void umami.track((payload) => ({ ...payload, ...pageView })).catch(() => {});
    }
  };

  const trackPage = () => {
    const url = cleanUrl(window.location.href);
    if (url === lastUrl) return;
    pending.push({ url, title: document.title, referrer: previousUrl });
    previousUrl = lastUrl = url;
    flush();
  };

  // Astro fires this after initial rendering and each completed navigation, including Back/Forward.
  document.addEventListener("astro:page-load", trackPage);
  script?.addEventListener("load", flush, { once: true });
  if (document.readyState === "complete") trackPage();
}
