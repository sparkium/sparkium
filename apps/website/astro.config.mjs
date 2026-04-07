// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://www.sparkium.org",
  integrations: [
    starlight({
      title: "Sparkium",
      components: {
        Header: "./src/overrides/Header.astro",
      },
      customCss: ["./src/style.css"],
      logo: { src: "./src/assets/logo.svg", alt: "Sparkium Logo" },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/sparkium" },
        { icon: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/sparkium" },
      ],
      sidebar: [
        {
          label: "Start here",
          autogenerate: { directory: "start-here" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Ecosystem",
          autogenerate: { directory: "ecosystem" },
        },
      ],
    }),
  ],
});
