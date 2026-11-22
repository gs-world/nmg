(() => {
  "use strict";

  const ICONS = {
    paper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    bench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    cite: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`
  };

  const ROW_GROUPS = [
    { key: "franka-atomic", label: "01 · Franka FR3 (7-DoF) — Zero-Shot Atomic Reaching" },
    { key: "piper-atomic", label: "02 · PiPER V100 (6-DoF) — Zero-Shot Atomic Reaching (+4.4 pp vs. cuRobo)" },
    { key: "extrapolation", label: "03 · Unseen Horizon Extrapolation (Trained K = 1–8 → Tested K = 10, 12)" },
    { key: "closed-loop", label: "04 · Live Closed-Loop Perturbation Recovery & 4-Modality Switching" }
  ];

  // Default 16-tile rollout catalog (updated with exact measured telemetry from manifest.json)
  const DEFAULT_ROLLOUTS = [
    // Row 1: Franka FR3 (7-DoF) Atomic Reaching
    {
      id: "franka_place",
      category: "franka-atomic",
      robot: "Franka FR3",
      title: "Franka · Place",
      tag: "K=6",
      tagTone: "",
      metric: "6/6 strict · Atomic",
      description: "Zero-shot closed-loop rollout on NMG-Bench Atomic Place (Pre-grasp → Grasp → Lift → Approach → Release → Retract). Static cubes indicate task frames without gripper actuation or contact."
    },
    {
      id: "franka_pour",
      category: "franka-atomic",
      robot: "Franka FR3",
      title: "Franka · Pour",
      tag: "K=5",
      tagTone: "",
      metric: "45° tilt · Atomic",
      description: "Zero-shot Atomic Pour sequence on Franka FR3 (7-DoF), executing pre-grasp, grasp, lift, a strict 45° pouring wrist tilt, and return."
    },
    {
      id: "franka_transport",
      category: "franka-atomic",
      robot: "Franka FR3",
      title: "Franka · Transport",
      tag: "K=4",
      tagTone: "",
      metric: "99.7% task avg",
      description: "Zero-shot Atomic Transport on Franka FR3 (99.7% success across 384 test sequences, surpassing cuRobo's 99.5%): pre-grasp, grasp, lift, and displaced target arrival."
    },
    {
      id: "franka_axis_align",
      category: "franka-atomic",
      robot: "Franka FR3",
      title: "Franka · AxisAlign",
      tag: "K=4",
      tagTone: "",
      metric: "90° align · Atomic",
      description: "Zero-shot Atomic AxisAlign on Franka FR3: ordered TCP reaching through grasp, lift, and a 90° tool-axis reorientation (+Z → +Y)."
    },

    // Row 2: PiPER V100 (6-DoF) Atomic Reaching (+4.4 pp over cuRobo)
    {
      id: "piper_place",
      category: "piper-atomic",
      robot: "PiPER V100",
      title: "PiPER · Place",
      tag: "K=6",
      tagTone: "is-sage",
      metric: "99.2% vs 94.8% cuRobo",
      description: "6-DoF PiPER V100 executing all six ordered SE(3) targets of Atomic Place. NMG reaches 99.2% success across 384 sequences vs. cuRobo's 94.8%."
    },
    {
      id: "piper_pour",
      category: "piper-atomic",
      robot: "PiPER V100",
      title: "PiPER · Pour",
      tag: "K=5",
      tagTone: "is-sage",
      metric: "45° tilt · 6-DoF",
      description: "6-DoF PiPER V100 executing Atomic Pour (pre-grasp, grasp, lift, 45° wrist tilt, and return) with a single zero-shot feedback policy."
    },
    {
      id: "piper_transport",
      category: "piper-atomic",
      robot: "PiPER V100",
      title: "PiPER · Transport",
      tag: "K=4",
      tagTone: "is-sage",
      metric: "94.8% vs 82.3% cuRobo",
      description: "6-DoF PiPER V100 executing Atomic Transport. NMG outperforms cuRobo by +12.5 percentage points (94.8% vs. 82.3%) on this task."
    },
    {
      id: "piper_axis_align",
      category: "piper-atomic",
      robot: "PiPER V100",
      title: "PiPER · AxisAlign",
      tag: "K=4",
      tagTone: "is-sage",
      metric: "71.1% vs 55.2% cuRobo",
      description: "6-DoF PiPER V100 sweeping across the workspace and rotating 90° (+Z → +Y). NMG outperforms cuRobo by +15.9 percentage points (71.1% vs. 55.2%)."
    },

    // Row 3: Unseen Long-Horizon Extrapolation (trained on K=1..8 -> tested on K=10, 12)
    {
      id: "franka_k12_mixed",
      category: "extrapolation",
      robot: "Franka FR3",
      title: "Franka · Mixed",
      tag: "K=12 OOD",
      tagTone: "is-ochre",
      metric: "Trained K≤8 → K=12",
      description: "Zero-shot count generalization beyond training horizon (trained on K=1..8): Franka FR3 chains 12 ordered heterogeneous constraints (FullPose, Position, Orientation, Joint) in one continuous rollout."
    },
    {
      id: "piper_k12_mixed",
      category: "extrapolation",
      robot: "PiPER V100",
      title: "PiPER · Mixed",
      tag: "K=12 OOD",
      tagTone: "is-ochre",
      metric: "97.3% on K=9–12",
      description: "Zero-shot count generalization on 6-DoF PiPER V100: chaining 12 mixed-modality constraints smoothly in one rollout. PiPER retains 97.3% Free-space success on unseen horizons K=9–12."
    },
    {
      id: "franka_k10_fullpose",
      category: "extrapolation",
      robot: "Franka FR3",
      title: "Franka · FullPose",
      tag: "K=10 OOD",
      tagTone: "is-ochre",
      metric: "10 SE(3) targets",
      description: "Unseen horizon K=10 strict SE(3) FullPose chaining on Franka FR3, satisfying ≤10 mm position and ≤0.1 rad orientation tolerances at every waypoint."
    },
    {
      id: "piper_k10_fullpose",
      category: "extrapolation",
      robot: "PiPER V100",
      title: "PiPER · FullPose",
      tag: "K=10 OOD",
      tagTone: "is-ochre",
      metric: "10 SE(3) targets",
      description: "Unseen horizon K=10 strict SE(3) FullPose chaining on 6-DoF PiPER V100 with zero task-specific tuning."
    },

    // Row 4: Closed-Loop Perturbation Recovery & 4-Modality Switching
    {
      id: "franka_perturb",
      category: "closed-loop",
      robot: "Franka FR3",
      title: "Franka · Perturb Recovery",
      tag: "Closed-Loop",
      tagTone: "is-crimson",
      metric: "0.14 rad impulse → snap back",
      description: "Live closed-loop state feedback on Franka FR3: after arriving at the SE(3) target, two sudden 0.14 rad multi-joint perturbations (crimson ring) knock the arm off target; the policy immediately drives it back within strict tolerance."
    },
    {
      id: "piper_perturb",
      category: "closed-loop",
      robot: "PiPER V100",
      title: "PiPER · Perturb Recovery",
      tag: "Closed-Loop",
      tagTone: "is-crimson",
      metric: "0.14 rad impulse → snap back",
      description: "Live closed-loop recovery on 6-DoF PiPER V100: two injected 0.14 rad multi-joint disturbances are rejected automatically without replanning."
    },
    {
      id: "franka_k8_hetero",
      category: "closed-loop",
      robot: "Franka FR3",
      title: "Franka · 4-Modality Chain",
      tag: "J→P→O→SE3",
      tagTone: "",
      metric: "100% Joint & Orient",
      description: "Single Franka FR3 policy switching seamlessly across all four constraint modalities (Joint → Position → Orientation → FullPose × 2) via semantic observation masks."
    },
    {
      id: "piper_k8_hetero",
      category: "closed-loop",
      robot: "PiPER V100",
      title: "PiPER · 4-Modality Chain",
      tag: "J→P→O→SE3",
      tagTone: "is-sage",
      metric: "100% Joint & Orient",
      description: "Single 6-DoF PiPER V100 policy cycling through Joint, Position, Orientation, and FullPose constraints in a single ordered rollout."
    }
  ];

  function applyConfig() {
    const cfg = window.NMG_SITE_CONFIG;
    if (!cfg) return;

    const brandSub = document.getElementById("brand-subtitle");
    if (brandSub) {
      if (cfg.brandSubtitle) {
        brandSub.textContent = cfg.brandSubtitle;
        brandSub.style.display = "";
      } else {
        brandSub.style.display = "none";
      }
    }

    const titleEl = document.getElementById("paper-title");
    const subEl = document.getElementById("paper-subtitle");
    if (titleEl) titleEl.textContent = cfg.title;
    if (subEl) subEl.textContent = cfg.subtitle;

    const authorsEl = document.getElementById("authors-block");
    if (authorsEl) {
      if (cfg.anonymous) {
        if (cfg.showAnonymousAuthors && cfg.anonymousAuthors?.length) {
          const a = cfg.anonymousAuthors[0];
          authorsEl.innerHTML = `<div><span class="author-item">${a.name}</span></div>` +
            (a.affiliation ? `<div class="affiliations-line">${a.affiliation}</div>` : "");
          authorsEl.style.display = "";
        } else {
          authorsEl.innerHTML = "";
          authorsEl.style.display = "none";
        }
      } else {
        const authorHtml = cfg.publicAuthors
          .map((a) => {
            const sup = a.affilIds ? `<sup>${a.affilIds.join(",")}</sup>` : "";
            return a.url && a.url !== "#"
              ? `<a class="author-item" href="${a.url}" target="_blank" rel="noopener">${a.name}${sup}</a>`
              : `<span class="author-item">${a.name}${sup}</span>`;
          })
          .join("");
        const affilHtml = cfg.affiliations
          .map((f) => `<span><sup>${f.id}</sup>${f.name}</span>`)
          .join(" &nbsp;&middot;&nbsp; ");
        authorsEl.innerHTML = `<div>${authorHtml}</div><div class="affiliations-line">${affilHtml}</div>`;
        authorsEl.style.display = "";
      }
    }

    const actionBar = document.getElementById("action-bar");
    if (actionBar) {
      const linkList = (cfg.anonymous ? cfg.links.anonymous : cfg.links.public) || [];
      if (!linkList.length) {
        actionBar.style.display = "none";
      } else {
        actionBar.style.display = "";
        actionBar.innerHTML = linkList
          .map((item, idx) => {
            const disabled = !item.url;
            const primary = idx === 0 ? " btn-primary" : "";
            const cls = `btn${primary}${disabled ? " is-disabled" : ""}`;
            const attrs = disabled
              ? `href="javascript:void(0)" aria-disabled="true" title="${item.note || ""}"`
              : item.url.startsWith("#")
              ? `href="${item.url}"`
              : `href="${item.url}" target="_blank" rel="noopener"`;
            return `<a class="${cls}" ${attrs}>${ICONS[item.icon] || ""}<span>${item.label}</span></a>`;
          })
          .join("");
      }
    }

    const bibEl = document.getElementById("bibtex-code");
    if (bibEl) {
      bibEl.textContent = cfg.anonymous ? cfg.bibtexAnonymous : cfg.bibtexPublic;
    }
  }

  let allRollouts = DEFAULT_ROLLOUTS.map((r) => ({ ...r }));
  let currentFilter = "all";
  let isPaused = false;
  let playbackRate = 1.0;

  function renderWall() {
    const wall = document.getElementById("video-wall");
    if (!wall) return;
    const htmlParts = [];
    ROW_GROUPS.forEach((group) => {
      const items = allRollouts.filter((r) => r.category === group.key);
      htmlParts.push(`<div class="wall-row-heading" data-group="${group.key}">${group.label}</div>`);
      items.forEach((item) => {
        const mp4 = `./assets/videos/${item.id}.mp4`;
        const poster = `./assets/videos/${item.id}.jpg`;
        htmlParts.push(`
          <div class="video-tile" data-id="${item.id}" data-category="${item.category}" role="button" tabindex="0" aria-label="Expand ${item.title}">
            <video autoplay muted loop playsinline preload="metadata" poster="${poster}">
              <source src="${mp4}" type="video/mp4" />
            </video>
            <div class="tile-label">
              <span class="tile-title">${item.title}</span>
              <span class="tile-k ${item.tagTone || ""}">${item.tag}</span>
            </div>
            <div class="tile-footer">
              <span class="tile-metric">${item.metric}</span>
              <span class="tile-zoom">Inspect</span>
            </div>
          </div>
        `);
      });
    });
    wall.innerHTML = htmlParts.join("");

    wall.querySelectorAll(".video-tile").forEach((tile) => {
      const open = () => {
        const item = allRollouts.find((r) => r.id === tile.dataset.id);
        if (item) openVideoLightbox(item);
      };
      tile.addEventListener("click", open);
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    applyWallFilter(currentFilter);
    applyPlaybackSettings();
  }

  function applyWallFilter(filter) {
    currentFilter = filter;
    const wall = document.getElementById("video-wall");
    if (!wall) return;
    wall.classList.toggle("is-filtered", filter !== "all");
    wall.querySelectorAll(".video-tile").forEach((tile) => {
      const match = filter === "all" || tile.dataset.category === filter;
      tile.classList.toggle("is-hidden", !match);
    });
    wall.querySelectorAll(".wall-row-heading").forEach((hdr) => {
      const match = filter === "all" || hdr.dataset.group === filter;
      hdr.classList.toggle("is-hidden", !match);
    });
    document.querySelectorAll(".filter-pills .pill").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });
  }

  function applyPlaybackSettings() {
    const videos = document.querySelectorAll("#video-wall video");
    videos.forEach((v) => {
      v.playbackRate = playbackRate;
      if (isPaused) {
        v.pause();
      } else {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    });
    const pauseBtn = document.getElementById("btn-toggle-play");
    if (pauseBtn) {
      pauseBtn.textContent = isPaused ? "▶ Play All" : "❚❚ Pause All";
      pauseBtn.classList.toggle("active", isPaused);
    }
    document.querySelectorAll("[data-speed]").forEach((btn) => {
      btn.classList.toggle("active", parseFloat(btn.dataset.speed) === playbackRate);
    });
  }

  // Lightbox Modal (supports both HD videos and zoomable paper figures)
  const lightbox = document.getElementById("lightbox");
  const lbTitle = document.getElementById("lightbox-title");
  const lbMedia = document.getElementById("lightbox-media");
  const lbDesc = document.getElementById("lightbox-desc");
  const lbMeta = document.getElementById("lightbox-meta");

  function openVideoLightbox(item) {
    if (!lightbox) return;
    lbTitle.textContent = `${item.title} (${item.tag})`;
    lbMedia.innerHTML = `
      <video autoplay muted loop playsinline controls>
        <source src="./assets/videos/${item.id}.mp4" type="video/mp4" />
      </video>
    `;
    const vid = lbMedia.querySelector("video");
    if (vid) vid.playbackRate = playbackRate;
    lbDesc.textContent = item.description;
    lbMeta.textContent = item.metric;
    lbMeta.style.display = "inline-block";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function openImageLightbox(src, title, caption) {
    if (!lightbox) return;
    lbTitle.textContent = title;
    lbMedia.innerHTML = `<img src="${src}" alt="${title}" style="background:#fff;padding:12px;" />`;
    lbDesc.textContent = caption || "";
    lbMeta.style.display = "none";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lbMedia.innerHTML = "";
    document.body.style.overflow = "";
  }

  function initInteractions() {
    document.querySelectorAll(".filter-pills .pill").forEach((btn) => {
      btn.addEventListener("click", () => applyWallFilter(btn.dataset.filter));
    });

    const togglePlay = document.getElementById("btn-toggle-play");
    if (togglePlay) {
      togglePlay.addEventListener("click", () => {
        isPaused = !isPaused;
        applyPlaybackSettings();
      });
    }

    document.querySelectorAll("[data-speed]").forEach((btn) => {
      btn.addEventListener("click", () => {
        playbackRate = parseFloat(btn.dataset.speed);
        applyPlaybackSettings();
      });
    });

    // Quantitative Result Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === `tab-${target}`));
      });
    });

    // Zoomable figures
    document.querySelectorAll("[data-zoom-src]").forEach((el) => {
      el.addEventListener("click", () => {
        openImageLightbox(el.dataset.zoomSrc, el.dataset.zoomTitle || "Figure", el.dataset.zoomCaption || "");
      });
    });

    // Lightbox close
    const closeBtn = document.getElementById("lightbox-close");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    // BibTeX Copy
    const copyBtn = document.getElementById("btn-copy-bib");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const text = document.getElementById("bibtex-code")?.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = "Copied";
          copyBtn.classList.add("copied");
          setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 1800);
        } catch {
          copyBtn.textContent = "Select & Copy";
        }
      });
    }
  }

  async function hydrateManifest() {
    try {
      const res = await fetch("./assets/videos/manifest.json", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === "object") {
        allRollouts = allRollouts.map((item) => {
          const m = data[item.id];
          return m && m.metric ? { ...item, metric: m.metric } : item;
        });
        renderWall();
      }
    } catch {
      // Static file:// preview without HTTP server falls back to defaults gracefully
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    renderWall();
    initInteractions();
    hydrateManifest();
  });
})();
