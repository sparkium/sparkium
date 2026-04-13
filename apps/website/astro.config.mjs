// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://www.sparkium.org",
  integrations: [
    starlight({
      title: "Sparkium",
      routeMiddleware: "./src/utils/routeData.ts",
      components: {
        Header: "./src/overrides/Header.astro",
        MarkdownContent: "./src/overrides/MarkdownContent.astro",
        PageTitle: "./src/overrides/PageTitle.astro",
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
          label: "Guide",
          autogenerate: { directory: "guide", attrs: { "data-chapter-group": true } },
        },
        {
          label: "Ecosystem",
          autogenerate: { directory: "ecosystem" },
        },
      ],
    }),
  ],
});
