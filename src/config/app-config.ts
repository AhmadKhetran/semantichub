import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Semantic Hub",
  version: packageJson.version,
  copyright: `© ${currentYear}, Semantic Hub.`,
  meta: {
    title: "Semantic Hub - Curiosity-Driven Analytics",
    description:
      "Meet the leading Agentic Analytics platform that empowers everyone to ask the right questions and get insights they can trust.",
  },
};
