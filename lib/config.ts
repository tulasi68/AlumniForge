// Institution configuration - easy to change for any college
export const institutionConfig = {
  name: "AlumniForge",
  shortName: "AF",
  tagline: "Connect. Grow. Give Back.",
  primaryColor: "#4f46e5", // AlumniForge indigo
  logoText: "AlumniForge",

  // Enable / disable modules
  modules: {
    home: true,
    network: true,
    events: true,
    contribute: true,
    opportunities: true,
    profile: true,
    admin: true,
  },
};

export type InstitutionConfig = typeof institutionConfig;