/* Portfólio Bruna Vidal
   Todo o conteúdo vem de content/site.json, editado pelo Pages CMS.
   Este arquivo só monta as páginas a partir dele. */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const has = v => v != null && String(v).trim() !== "";
  const pad = n => String(n).padStart(2, "0");
  const img = p => String(p || "").trim().replace(/^\/+/, "");
  const list = v => Array.isArray(v) ? v : [];
  const imgList = v => (Array.isArray(v) ? v : has(v) ? [v] : []).filter(has);

  /* Converte um link de vídeo (Google Drive, YouTube ou Vimeo) em endereço de player. */
  function embed(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    let m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{10,})/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
    m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
    return "";
  }
  const player = (url, title, vertical) => {
    const src = embed(url);
    return src ? `<div class="video${vertical ? " video--vertical" : ""}"><iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>` : "";
  };
  const slugify = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const arrow = '<span aria-hidden="true">→</span>';

  let C = {};
  let CASES = [];

  /* ---------- Capas ---------- */
  function fs(value, base, k) {
    const len = String(value || "").length || 1;
    return Math.min(base, k / len).toFixed(1);
  }
  function countOf(v, fallback, max) {
    const n = parseInt(String(v || "").replace(/\D/g, ""), 10);
    return Math.max(1, Math.min(max, isNaN(n) ? fallback : n));
  }
  function cover(c) {
    if (has(c.capa_imagem)) {
      return `<div class="cover cover--imagem"><img src="${esc(img(c.capa_imagem))}" alt="${esc(c.cliente + ", " + c.titulo)}" loading="lazy"></div>`;
    }
    if (c.capa_estilo === "nenhuma") return "";
    const n = has(c.destaque_numero) ? String(c.destaque_numero).trim() : "";
    const top = `<div class="cv-top"><span>${esc(c.cliente)} · ${esc(c.titulo)}</span>${has(c.capa_linha) ? `<span>${esc(c.capa_linha)}</span>` : ""}</div>`;
    const style = c.capa_estilo || "azul";

    if (style === "escuro") {
      const k = countOf(n, 5, 8);
      const label = has(c.capa_rotulo_item) ? c.capa_rotulo_item : "";
      const lanes = Array.from({ length: k }, (_, i) => `<div class="lane">${label ? `<span>${esc(label)} ${pad(i + 1)}</span>` : ""}</div>`).join("");
      return `<div class="cover cover--escuro">
        <div class="cv-lanes" aria-hidden="true" style="grid-template-columns:repeat(${k},minmax(0,1fr))">${lanes}</div>
        <div class="cv-in">${top}
          <div class="cv-num" style="--fs:${fs(n, 62, 80)}">${esc(n)}</div>
          ${has(c.destaque_legenda) ? `<div class="cv-cap">${esc(c.destaque_legenda)}</div>` : ""}
        </div></div>`;
    }

    if (style === "claro") {
      const k = countOf(n, 13, 24);
      const cols = k <= 13 ? k : Math.ceil(k / 2);
      const squadFaces = list(c.squad).map(p => p && p.foto);
      const squadNames = list(c.squad).map(p => p && p.nome);
      const extra = imgList(c.capa_rostos);
      const faces = Array.from({ length: k }, (_, i) => has(squadFaces[i]) ? squadFaces[i] : extra[i]);
      const squares = Array.from({ length: k }, (_, i) => faces[i]
        ? `<li class="has-face"${has(squadNames[i]) ? ` data-nome="${esc(squadNames[i])}"` : ""}><img src="${esc(img(faces[i]))}" alt="" loading="lazy"></li>`
        : `<li>${pad(i + 1)}</li>`).join("");
      return `<div class="cover cover--claro"><div class="cv-in">
        <div class="cv-head">
          <div class="cv-num" style="--fs:${fs(n, 24, 60)}">${esc(n)}</div>
          <div><span class="cv-meta">${esc(c.cliente)} · ${esc(c.titulo)}${has(c.capa_linha) ? " · " + esc(c.capa_linha) : ""}</span>
          ${has(c.destaque_legenda) ? `<span class="cv-cap">${esc(c.destaque_legenda)}</span>` : ""}</div>
        </div>
        <ol class="cv-squad" aria-hidden="true" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${squares}</ol>
      </div></div>`;
    }

    const tags = list(c.capa_etiquetas).filter(has);
    return `<div class="cover cover--azul"><div class="cv-in">${top}
      ${tags.length ? `<div class="cv-formats">${tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
      <div class="cv-num" style="--fs:${fs(n, 60, 132)}">${esc(n)}</div>
      ${has(c.destaque_legenda) ? `<div class="cv-cap">${esc(c.destaque_legenda)}</div>` : ""}
    </div></div>`;
  }

  /* ---------- Blocos ---------- */
  function squadList(items, compact) {
    return `<ul class="squad${compact ? " squad--compact" : ""}">${items.map(p => `<li>${has(p.foto) ? `<img src="${esc(img(p.foto))}" alt="" loading="lazy">` : ""}<span class="sq-text"><span class="sq-name">${esc(p.nome)}</span>${has(p.perfil) ? `<span class="sq-handle">${esc(p.perfil)}</span>` : ""}</span></li>`).join("")}</ul>`;
  }

  function numbers() {
    const items = list(C.indicadores).filter(n => n && n.publicar !== false && has(n.numero));
    if (!items.length) return "";
    const cls = items.length === 2 ? " nums--2" : items.length === 3 ? " nums--3" : "";
    return `<div class="nums${cls}">${items.map(n => `<div class="num">
        <p class="num-value">${esc(n.numero)}</p>
        <p class="num-label">${has(n.unidade) ? `<strong>${esc(n.unidade)}</strong>` : ""}${esc(n.legenda)}</p>
      </div>`).join("")}</div>`;
  }

  function contactBand(id, eyebrow, title, text, button) {
    const email = C.email || "";
    return `<section class="band"${id ? ` id="${id}"` : ""} aria-label="Contato">
      <div class="wrap">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h2 class="band-title">${esc(title)}</h2>
        <div class="g12">
          <p class="band-text">${esc(text)}</p>
          ${has(email) ? `<div class="contact-box">
            <a class="btn btn--accent" href="mailto:${esc(email)}">${esc(button || "Entre em contato")} ${arrow}</a>
            <div class="email-line"><span class="email-text">${esc(email)}</span><button class="copy-email" type="button">Copiar e-mail</button></div>
          </div>` : ""}
        </div>
      </div>
    </section>`;
  }

  /* Elenco: artistas em destaque + rostos do squad */
  const artistsOf = c => list(c.artistas).filter(a => a && has(a.nome));
  const squadOf = c => list(c.squad).filter(p => p && has(p.nome));
  function artistsPanel(c) {
    const a = artistsOf(c);
    if (!a.length) return "";
    return `<div class="cast-artists"><p class="mini-h">Artistas · ${pad(a.length)}</p>
      <ul class="artists">${a.map(x => `<li>${has(x.foto) ? `<img src="${esc(img(x.foto))}" alt="${esc(x.nome)}" loading="lazy">` : `<span class="ar-ph" aria-hidden="true"></span>`}
        <div class="ar-text"><span class="ar-name">${esc(x.nome)}</span>${has(x.musica) ? `<span class="ar-song">${esc(x.musica)}</span>` : ""}${has(x.original) ? `<span class="ar-orig">${esc(x.original)}</span>` : ""}</div></li>`).join("")}</ul></div>`;
  }
  function facesStrip(c) {
    const q = squadOf(c);
    if (!q.length) return "";
    return `<div class="cast-squad"><p class="mini-h">Squad · ${pad(q.length)} influenciadores</p>
      <ul class="faces">${q.map(p => `<li>${has(p.foto) ? `<img src="${esc(img(p.foto))}" alt="" loading="lazy">` : `<span class="fc-ph" aria-hidden="true"></span>`}<span class="fc-name">${esc(p.nome)}</span>${has(p.funcao) ? `<span class="fc-role">${esc(p.funcao)}</span>` : ""}</li>`).join("")}</ul></div>`;
  }

  function caseRow(c, i) {
    const layout = ["left", "right", "full"][i % 3];
    const vid = player(c.video, c.cliente + ", " + c.titulo, c.video_formato === "vertical");
    const cv = cover(c);
    const coverLink = cv ? `<a class="case-cover" href="#${c._id}" aria-label="Abrir case ${esc(c.cliente)}, ${esc(c.titulo)}">${cv}</a>` : "";
    const cast = layout !== "full" && artistsOf(c).length;
    const media = layout === "full"
      ? coverLink + (vid ? `<div class="case-video">${vid}</div>` : "")
      : `<div class="case-media">${coverLink}${cast ? "" : vid}</div>`;
    const castRow = cast ? `<div class="case-cast">${vid ? `<div class="cast-video">${vid}</div>` : ""}${artistsPanel(c)}</div>${facesStrip(c)}` : "";
    return `<article class="case case--${layout}${vid ? " has-video" : ""}${cast ? " has-cast" : ""} g12">
      ${media}
      <div class="case-body">
        <p class="eyebrow">Case ${pad(i + 1)} · ${esc(c.cliente)}</p>
        <h3 class="case-title">${esc(c.titulo)}${has(c.subtitulo) ? `<span>${esc(c.subtitulo)}</span>` : ""}</h3>
        <dl class="case-dl">${list(c.secoes).filter(s => has(s.texto)).map(s => `<div><dt>${esc(s.titulo)}</dt><dd>${esc(s.texto)}</dd></div>`).join("")}</dl>
        <a class="link-arrow" href="#${c._id}">Ver case completo ${arrow}</a>
      </div>
      ${castRow}
    </article>`;
  }

  function caseView(c, i) {
    const next = CASES[(i + 1) % CASES.length];
    const ficha = list(c.ficha).filter(f => has(f.rotulo) && has(f.valor));
    const gal = imgList(c.galeria);
    const squad = list(c.squad).filter(p => p && has(p.nome));
    const vid = player(c.video, c.cliente + ", " + c.titulo, c.video_formato === "vertical");
    return `<div class="view" data-view="${c._id}" data-title="${esc(c.cliente + ", " + c.titulo)}" hidden><div class="wrap case-page">
      <a class="back" href="#cases"><span aria-hidden="true">←</span> Todos os cases</a>
      <header class="cp-head g12">
        <div class="cp-titles"><p class="eyebrow">Case ${pad(i + 1)} · ${esc(c.cliente)}</p><h1 class="cp-title" tabindex="-1">${esc(c.titulo)}${has(c.subtitulo) ? `<span>${esc(c.subtitulo)}</span>` : ""}</h1></div>
        ${has(c.resumo) ? `<p class="cp-summary">${esc(c.resumo)}</p>` : ""}
      </header>
      ${artistsOf(c).length
        ? `<section class="cp-cast">${vid ? `<div class="cast-video">${vid}</div>` : ""}${artistsPanel(c)}</section>${facesStrip(c) ? `<section class="cp-faces">${facesStrip(c)}</section>` : ""}`
        : (vid ? `<section class="cp-video">${vid}</section>` : "")}
      ${cover(c) ? `<div class="cp-cover">${cover(c)}</div>` : ""}
      <div class="g12">
        ${ficha.length ? `<aside class="cp-ficha"><h2 class="mini-h">Ficha</h2><dl>${ficha.map(f => `<div><dt>${esc(f.rotulo)}</dt><dd>${esc(f.valor)}</dd></div>`).join("")}</dl></aside>` : ""}
        <div class="cp-sections">
          ${list(c.secoes).filter(s => has(s.texto)).map(s => `<section><h2 class="mini-h">${esc(s.titulo)}</h2><p>${esc(s.texto)}</p></section>`).join("")}
          ${has(c.destaque_numero) ? `<div class="cp-highlight"><p class="cp-hl-num">${esc(c.destaque_numero)}</p><p>${esc(c.destaque_legenda)}</p></div>` : ""}
        </div>
      </div>
      ${squad.length && !artistsOf(c).length ? `<section class="cp-squad"><h2 class="mini-h">Squad · ${pad(squad.length)} influenciadores</h2>
        ${squadList(squad)}</section>` : ""}
      ${gal.length ? `<section class="cp-gallery"><h2 class="mini-h">Registros do projeto</h2>
        <div class="gal">${gal.map((g, k) => `<img src="${esc(img(g))}" alt="${esc(c.cliente + ", " + c.titulo + ", imagem " + (k + 1))}" loading="lazy">`).join("")}</div></section>` : ""}
      ${CASES.length > 1 ? `<a class="next-case" href="#${next._id}"><span class="eyebrow">Próximo case</span><span class="nc-title">${esc(next.cliente)}, ${esc(next.titulo)}</span><span class="nc-arrow" aria-hidden="true">→</span></a>` : ""}
    </div></div>`;
  }

  function projects() {
    const all = list(C.projetos).map((p, i) => ({ p, i })).filter(x => has(x.p.titulo));
    if (!all.length) return "";
    const order = ["Público", "Privado"];
    const cats = [...new Set(all.map(x => x.p.categoria || "Outros"))].sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    const col = cat => {
      const items = all.filter(x => (x.p.categoria || "Outros") === cat);
      return `<div>
        <div class="proj-col-head"><h3>${esc(cat)}</h3><span class="sec-meta">${pad(items.length)}</span></div>
        <ul class="proj-list">${items.map(({ p, i }) => {
          const open = has(p.texto) || has(p.imagem) || has(p.video) || list(p.squad).some(q => q && has(q.nome));
          return `<li><${open ? `button class="proj-row" type="button" data-proj="${i}" aria-haspopup="dialog"` : `div class="proj-row is-static"`}>
            <span class="pr-client">${esc(p.cliente)}</span><span class="pr-title">${esc(p.titulo)}</span><span class="pr-icon" aria-hidden="true">+</span>
          </${open ? "button" : "div"}></li>`;
        }).join("")}</ul>
      </div>`;
    };
    return `<section class="section wrap" id="sec-outros" aria-labelledby="t-outros" style="padding-top:0">
      <div class="sec-head"><h2 class="sec-title" id="t-outros">Outros projetos</h2><span class="sec-meta">${pad(all.length)} projetos</span></div>
      <div class="proj-grid">${cats.map(col).join("")}</div>
    </section>`;
  }

  function brands() {
    const b = list(C.marcas).filter(m => has(m.nome));
    if (!b.length) return "";
    return `<section class="section wrap" aria-labelledby="t-marcas" style="padding-top:0">
      <div class="sec-head"><h2 class="sec-title" id="t-marcas">Marcas e instituições</h2><span class="sec-meta">${pad(b.length)}</span></div>
      <ul class="brands">${b.map(m => `<li>${has(m.logo) ? `<img src="${esc(img(m.logo))}" alt="${esc(m.nome)}" loading="lazy">` : `<span class="brand-name">${esc(m.nome)}</span>`}</li>`).join("")}</ul>
    </section>`;
  }

  /* ---------- Páginas ---------- */
  function homeView() {
    const parts = String(C.nome || "").trim().split(/\s+/);
    const first = parts.shift() || "";
    const rest = parts.join(" ");
    const nums = numbers();
    return `<div class="view" data-view="home">
      <section class="hero wrap" aria-labelledby="hero-name">
        <h1 class="hero-name" id="hero-name" tabindex="-1"><span>${esc(first)}</span>${rest ? `<span class="l2">${esc(rest)}</span>` : ""}</h1>
        <div class="g12 hero-grid">
          <p class="hero-role">${esc(C.cargo)}</p>
          <div class="hero-intro">
            ${has(C.apresentacao) ? `<p class="lead">${esc(C.apresentacao)}</p>` : ""}
            <a class="btn" href="#sobre">${esc(C.botao_trajetoria || "Conheça minha trajetória")} ${arrow}</a>
          </div>
        </div>
        ${nums ? nums.replace('class="nums', 'class="nums hero-nums') : ""}
      </section>

      ${CASES.length ? `<section class="section wrap" id="sec-cases" aria-labelledby="t-cases" style="padding-top:0">
        <div class="sec-head"><h2 class="sec-title" id="t-cases">Cases em destaque</h2><span class="sec-meta">${pad(CASES.length)} cases</span></div>
        <div class="cases">${CASES.map(caseRow).join("")}</div>
      </section>` : ""}

      ${projects()}
      ${brands()}
      ${contactBand("sec-contato", "Contato", (C.contato_home || {}).titulo, (C.contato_home || {}).texto, (C.contato_home || {}).botao)}
    </div>`;
  }

  function aboutView() {
    const s = C.sobre || {};
    const traj = list(s.trajetoria).filter(t => has(t.empresa));
    const comp = list(s.competencias).filter(has);
    const form = list(s.formacao).filter(f => f && has(f.curso));
    const grad = form.filter(f => (f.tipo || "Graduação") === "Graduação");
    const extra = form.filter(f => (f.tipo || "Graduação") !== "Graduação");
    const nums = numbers();
    return `<div class="view" data-view="sobre" data-title="Sobre" hidden>
      <section class="wrap g12 about-open" aria-labelledby="t-sobre">
        <div class="ao-text">
          <p class="eyebrow">Sobre</p>
          <h1 class="ao-title" id="t-sobre" tabindex="-1">${esc(s.titulo)}</h1>
          ${has(s.texto) ? `<p class="lead">${esc(s.texto)}</p>` : ""}
        </div>
        ${has(C.foto) ? `<div class="ao-photo"><img src="${esc(img(C.foto))}" alt="${esc(C.nome)}"></div>` : ""}
      </section>

      ${nums || has(C.frentes) ? `<section class="section wrap" aria-labelledby="t-escala" style="padding-top:0">
        <div class="sec-head"><h2 class="sec-title" id="t-escala">Escala</h2><span class="sec-meta">Indicadores</span></div>
        ${nums}
        ${has(C.frentes) ? `<p class="fronts">${esc(C.frentes)}</p>` : ""}
      </section>` : ""}

      ${traj.length ? `<section class="section wrap" aria-labelledby="t-traj" style="padding-top:0">
        <div class="sec-head"><h2 class="sec-title" id="t-traj">Trajetória</h2></div>
        <ol class="tl">${traj.map(t => `<li class="g12">
          <p class="tl-date">${esc(t.periodo)}</p>
          <div class="tl-head"><h3 class="tl-co">${esc(t.empresa)}</h3><p class="tl-role">${esc(t.cargo)}</p></div>
          <div class="tl-desc">
            ${has(t.descricao) ? `<p>${esc(t.descricao)}</p>` : ""}
            ${has(t.clientes) ? `<dl class="tl-clients"><dt>${esc(t.clientes_rotulo || "Clientes")}</dt><dd>${esc(t.clientes)}</dd></dl>` : ""}
          </div>
        </li>`).join("")}</ol>
      </section>` : ""}

      ${comp.length ? `<section class="section wrap" aria-labelledby="t-comp" style="padding-top:0">
        <div class="sec-head"><h2 class="sec-title" id="t-comp">Competências</h2><span class="sec-meta">${pad(comp.length)}</span></div>
        <ul class="skills">${comp.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </section>` : ""}

      ${form.length || has(s.idiomas) ? `<section class="section wrap" aria-labelledby="t-form" style="padding-top:0">
        <div class="sec-head"><h2 class="sec-title" id="t-form">Formação e idiomas</h2></div>
        <div class="g12 edu-grid">
          ${grad.length ? `<div class="edu-block edu-a">
            <p class="mini-h">Graduação</p>
            ${grad.map(f => `<div class="edu-item"><p class="edu-big">${esc(f.curso)}</p>
              ${has(f.instituicao) ? `<p class="edu-sub">${esc(f.instituicao)}</p>` : ""}
              ${has(f.periodo) ? `<p class="edu-meta">${esc(f.periodo)}</p>` : ""}</div>`).join("")}
          </div>` : ""}
          ${extra.length ? `<div class="edu-block edu-c">
            <p class="mini-h">Cursos complementares</p>
            <ul class="edu-list">${extra.map(f => `<li><span class="edu-course">${esc(f.curso)}</span><span class="edu-meta">${[f.instituicao, f.periodo].filter(has).map(esc).join(" · ")}</span></li>`).join("")}</ul>
          </div>` : ""}
          ${has(s.idiomas) ? `<div class="edu-block edu-b"><p class="mini-h">Idiomas</p><p class="edu-big">${esc(s.idiomas)}</p></div>` : ""}
        </div>
      </section>` : ""}

      ${contactBand("", "Contato", s.contato_titulo, s.contato_texto, s.contato_botao)}
    </div>`;
  }

  function footer() {
    const email = C.email || "";
    return `<div class="wrap foot-grid">
      <div><p class="foot-name">${esc(C.nome)}</p><p>${esc(C.cargo)}</p></div>
      ${has(email) || has(C.linkedin) ? `<div><p class="mini-h">Contato</p>
        ${has(email) ? `<p class="foot-email"><a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ""}
        ${has(C.linkedin) ? `<a class="foot-social" href="${esc(C.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn de ${esc(C.nome)}"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>` : ""}
      </div>` : ""}
      ${has(C.localizacao) ? `<div><p class="mini-h">Base</p><p>${esc(C.localizacao)}</p></div>` : ""}
      <div>
        <p class="mini-h">Navegação</p>
        <ul class="foot-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </div>
    </div>`;
  }

  function render() {
    const seen = {};
    CASES = list(C.cases).filter(c => has(c.titulo)).map(c => {
      let id = "case-" + (slugify(c.cliente + " " + c.titulo) || "x");
      if (seen[id]) id += "-" + (++seen[id]); else seen[id] = 1;
      return Object.assign({}, c, { _id: id });
    });
    $("#app").innerHTML = homeView() + aboutView() + CASES.map(caseView).join("");
    $("#footer").innerHTML = footer();
    $("#footer").hidden = false;
    $$('[data-bind="nome"]').forEach(el => el.textContent = C.nome || "");
  }

  /* ---------- Modal de projeto ---------- */
  const dlg = $("#proj-dialog");
  function openProj(i) {
    const p = list(C.projetos)[i];
    if (!p) return;
    $("#pd-eyebrow").textContent = [p.cliente, p.categoria].filter(has).join(" · ");
    $("#pd-title").textContent = p.titulo || "";
    const im = $("#pd-img");
    if (has(p.imagem)) { im.src = img(p.imagem); im.alt = [p.cliente, p.titulo].filter(has).join(", "); im.hidden = false; }
    else { im.hidden = true; im.removeAttribute("src"); }
    $("#pd-video").innerHTML = player(p.video, [p.cliente, p.titulo].filter(has).join(", "), p.video_formato === "vertical");
    const t = $("#pd-text");
    t.textContent = p.texto || "";
    t.hidden = !has(p.texto);
    const sq = list(p.squad).filter(q => q && has(q.nome));
    $("#pd-squad").innerHTML = sq.length ? `<h3 class="mini-h">Squad · ${pad(sq.length)} creators</h3>${squadList(sq, true)}` : "";
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function closeProj() {
    if (dlg.open) { $("#pd-video").innerHTML = ""; if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); }
  }
  dlg.addEventListener("click", e => { if (e.target === dlg) closeProj(); });
  $(".pd-close").addEventListener("click", closeProj);

  /* ---------- Navegação ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ALIAS = { cases: ["home", "sec-cases"], contato: ["home", "sec-contato"] };
  let first = true;
  function route() {
    closeProj();
    const h = decodeURIComponent(location.hash.slice(1)) || "home";
    let [v, target] = ALIAS[h] || [h, null];
    let view = $(`.view[data-view="${CSS.escape(v)}"]`);
    if (!view) { v = "home"; view = $('.view[data-view="home"]'); }
    if (!view) return;
    $$(".view").forEach(el => { el.hidden = el !== view; });
    if (!first && !reduce) { view.classList.remove("enter"); void view.offsetWidth; view.classList.add("enter"); }
    const navKey = v === "sobre" ? "sobre" : target === "sec-contato" ? "contato" : (v.indexOf("case-") === 0 || target === "sec-cases") ? "cases" : null;
    $$("[data-nav]").forEach(a => a.dataset.nav === navKey ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const base = [C.nome, C.cargo].filter(has).join(" · ");
    document.title = view.dataset.title ? `${view.dataset.title} · ${C.nome}` : base;
    const el = target && document.getElementById(target);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: first || reduce ? "auto" : "smooth" }));
    } else if (!first) {
      window.scrollTo(0, 0);
      const h1 = view.querySelector("h1");
      if (h1) h1.focus({ preventScroll: true });
    }
    first = false;
  }
  window.addEventListener("hashchange", route);

  document.addEventListener("click", e => {
    const row = e.target.closest("[data-proj]");
    if (row) { openProj(+row.dataset.proj); return; }
    const copy = e.target.closest(".copy-email");
    if (copy) {
      const label = "Copiar e-mail";
      const done = () => { copy.textContent = "E-mail copiado"; setTimeout(() => copy.textContent = label, 1800); };
      const fallback = () => {
        const t = copy.parentElement.querySelector(".email-text");
        if (t) { const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        copy.textContent = "Selecionado, copie o texto";
        setTimeout(() => copy.textContent = label, 2400);
      };
      try { navigator.clipboard.writeText(C.email).then(done, fallback); } catch (err) { fallback(); }
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if (a) {
      const href = a.getAttribute("href");
      if (href === location.hash || (href === "#home" && !location.hash)) { e.preventDefault(); route(); }
    }
  });

  /* ---------- Carregamento ---------- */
  fetch("content/site.json?v=" + Date.now(), { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => { C = data || {}; render(); route(); })
    .catch(() => { $("#app").innerHTML = '<p class="state">Não foi possível carregar o conteúdo. Recarregue a página.</p>'; });
})();
