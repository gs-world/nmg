/**
 * NMG Project Page Configuration
 * ------------------------------------------------------------
 * Toggle `anonymous: true` for double-blind review and `anonymous: false`
 * for arXiv / public release.
 */
window.NMG_SITE_CONFIG = {
  anonymous: false,

  title: "Neural Motion Generator",
  subtitle: "Learning Ordered Constraint Satisfaction without Demonstrations",

  // Optional short label shown beside the topbar mark (leave "" to omit)
  brandSubtitle: "Neural Motion Generator",

  // Used when anonymous === true
  showAnonymousAuthors: false,
  anonymousAuthors: [
    { name: "Anonymous Authors", affiliation: "" }
  ],

  // Used when anonymous === false
  publicAuthors: [
    { name: "Chen Yang", url: "", affilIds: [1, 2] },
    { name: "Yueci Deng", url: "", affilIds: [1, 2] }
  ],
  affiliations: [
    { id: 1, name: "The Chinese University of Hong Kong, Shenzhen" },
    { id: 2, name: "Dexforce" }
  ],

  // Header action buttons (add Paper arXiv / Code URLs once published)
  links: {
    anonymous: [
      { label: "Rollouts (16)", icon: "play", url: "#rollouts" },
      { label: "Method", icon: "layers", url: "#method" },
      { label: "NMG-Bench Results", icon: "bench", url: "#results" },
      { label: "BibTeX", icon: "cite", url: "#bibtex" }
    ],
    public: [
      { label: "Rollouts (16)", icon: "play", url: "#rollouts" },
      { label: "Method", icon: "layers", url: "#method" },
      { label: "NMG-Bench Results", icon: "bench", url: "#results" },
      { label: "BibTeX", icon: "cite", url: "#bibtex" }
    ]
  },

  bibtexAnonymous: `@article{nmg2026,
  title   = {Neural Motion Generator: Learning Ordered Constraint Satisfaction without Demonstrations},
  author  = {Anonymous Authors},
  journal = {Preprint},
  year    = {2026}
}`,

  bibtexPublic: `@article{yang2026nmg,
  title   = {Neural Motion Generator: Learning Ordered Constraint Satisfaction without Demonstrations},
  author  = {Chen Yang and Yueci Deng},
  journal = {arXiv preprint},
  year    = {2026}
}`
};
