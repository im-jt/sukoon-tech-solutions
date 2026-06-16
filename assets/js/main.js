/* =========================================================================
   Sukoon Technology Solutions — site scripts
   ========================================================================= */

/* ----- CONFIG -------------------------------------------------------------
   Substack: the blog section auto-loads your latest posts from this RSS feed.
   If your publication lives on a different URL, change SUBSTACK_FEED below.
   (A Substack publication's feed is usually <name>.substack.com/feed)
-------------------------------------------------------------------------- */
const SUBSTACK_PROFILE = "https://substack.com/@imjatintyagi";
const SUBSTACK_FEED = "https://imjatintyagi.substack.com/feed";
const MAX_POSTS = 6;

/* ----- Footer year ----- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ----- Mobile nav toggle ----- */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ----- Reveal-on-scroll ----- */
(function () {
  const items = document.querySelectorAll(".section, .hero-inner > *");
  items.forEach((el) => el.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
})();

/* ----- Contact form -> mailto ----- */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`New enquiry from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:sukoontechsolutions@gmail.com?subject=${subject}&body=${body}`;
  });
})();

/* ----- Blog: load latest Substack posts ----- */
(function () {
  const grid = document.getElementById("blog-grid");
  const loading = document.getElementById("blog-loading");
  if (!grid) return;

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
  };

  const firstImage = (html) => {
    const m = /<img[^>]+src=["']([^"']+)["']/i.exec(html || "");
    return m ? m[1] : "";
  };

  const render = (posts) => {
    if (!posts.length) return showFallback();
    grid.innerHTML = posts
      .slice(0, MAX_POSTS)
      .map((p) => {
        const excerpt = stripHtml(p.description).slice(0, 150);
        const thumb = p.thumbnail
          ? `<div class="post-thumb" style="background-image:url('${p.thumbnail}')"></div>`
          : `<div class="post-thumb"><span class="post-thumb-fallback"><img src="assets/img/logo.svg" alt=""></span></div>`;
        return `
          <article class="card post">
            ${thumb}
            <div class="post-body">
              <div class="post-date">${p.date ? fmtDate(p.date) : "Substack"}</div>
              <h3 class="post-title"><a href="${p.link}" target="_blank" rel="noopener">${p.title}</a></h3>
              <p class="post-excerpt">${excerpt}${excerpt.length >= 150 ? "…" : ""}</p>
              <a class="post-read" href="${p.link}" target="_blank" rel="noopener">Read on Substack</a>
            </div>
          </article>`;
      })
      .join("");
  };

  // Sample previews shown if the live feed can't be reached.
  const showFallback = () => {
    grid.innerHTML = `
      <div class="blog-error">
        Couldn't load live posts right now —
        <a href="${SUBSTACK_PROFILE}" target="_blank" rel="noopener">read the latest on Substack →</a>
      </div>`;
  };

  // Try rss2json first (returns JSON + CORS), then allorigins XML as fallback.
  const tryRss2Json = async () => {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("rss2json failed");
    const data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error("rss2json empty");
    return data.items.map((it) => ({
      title: it.title,
      link: it.link,
      date: it.pubDate,
      description: it.description || it.content,
      thumbnail: it.thumbnail || it.enclosure?.link || firstImage(it.content || it.description),
    }));
  };

  const tryAllOrigins = async () => {
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(SUBSTACK_FEED)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("allorigins failed");
    const xml = new DOMParser().parseFromString(await res.text(), "text/xml");
    const items = [...xml.querySelectorAll("item")];
    if (!items.length) throw new Error("no items");
    return items.map((item) => {
      const get = (t) => item.querySelector(t)?.textContent || "";
      const content = get("encoded") || get("description");
      return {
        title: get("title"),
        link: get("link"),
        date: get("pubDate"),
        description: content,
        thumbnail: firstImage(content),
      };
    });
  };

  (async () => {
    try {
      const posts = await tryRss2Json();
      render(posts);
    } catch (_) {
      try {
        const posts = await tryAllOrigins();
        render(posts);
      } catch (_e) {
        if (loading) loading.remove();
        showFallback();
      }
    }
  })();
})();
