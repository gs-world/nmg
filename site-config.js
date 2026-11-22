/**
 * NMG Project Page Configuration
 * ------------------------------------------------------------
 * Toggle `anonymous: true` for double-blind review and `anonymous: false`
 * for arXiv / public release.
 */
window.NMG_SITE_CONFIG = {
  anonymous: true,

  title: "Neural Motion Generator",
  subtitle: "Learning Ordered Constraint Satisfaction without Demonstrations",

  // Optional short label shown beside the topbar mark (leave "" to omit)
  brandSubtitle: "Neural Motion Generator",

  // Used when anonymous === true
  showAnonymousAuthors: false,
  anonymousAuthors: [
    { name: "Anonymous Authors", affiliation: "" }
  ],

  // Used when anonymous === false (fill in before arXiv / public release)
  publicAuthors: [
    { name: "First Author", url: "", affilIds: [1] },
    { name: "Second Author", url: "", affilIds: [1] }
  ],
  affiliations: [
    { id: 1, name: "Institution" }
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

  bibtexPublic: `@article{nmg2026,
  title   = {Neural Motion Generator: Learning Ordered Constraint Satisfaction without Demonstrations},
  author  = {First Author and Second Author},
  journal = {arXiv preprint},
  year    = {2026}
}`
};
