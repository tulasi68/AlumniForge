// Institution configuration - easy to change for any college
export const institutionConfig = {
  name: "AlumniForge",
  shortName: "AF",
  tagline: "Connect. Grow. Give Back.",
  primaryColor: "#2563eb", // blue-600
  logoText: "AlumniForge",

  // Enable / disable modules
  modules: {
    home: true,
    network: true,
    events: true,
    opportunities: true,
    profile: true,
    admin: true,
  },
};

export type InstitutionConfig = typeof institutionConfig;