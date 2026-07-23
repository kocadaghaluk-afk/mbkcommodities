/**
 * Content for the standalone /chairmans-message page.
 *
 * This is the site's single, official Chairman-voice content — approved
 * and signed, no approval gate. Previously lived in content/home.ts as a
 * homepage section, then briefly as a homepage section again in a
 * different position; both were superseded by this dedicated page. See
 * content/placeholders.ts ("chairman-message") for the governance record.
 */
export const chairmansMessage = {
  eyebrow: "Chairman's Message",
  heading: "A long-term perspective",
  paragraphs: [
    "MBK Holding Commodities was established with a simple conviction: that trade, conducted responsibly, builds enduring value for the nations and communities it connects. We measure our work not in single transactions, but in the strength of the relationships that outlast them.",
    "From our base in Qatar, we operate as a long-term partner across international markets — patient in our commitments, disciplined in our judgement, and mindful that the movement of essential commodities carries responsibility as much as opportunity. Our ambitions are aligned with the wider goals of Qatar National Vision 2030, and with a belief that lasting institutions are built quietly, over decades.",
    "This message offers an introduction to the principles that guide how we think and conduct business. It is not a record of what we sell, but an account of the principles that guide us, and of the perspective we intend to carry forward for many years to come.",
  ],
  signature: {
    name: "Sheikh Mansoor Bin Khalifa Al Thani",
    title: "Chairman",
    company: "MBK Holding Commodities",
  },
  imagePath: "/images/leadership/chairman.jpg",
  imageAlt: "Portrait of the Chairman.",
} as const;
