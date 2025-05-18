/** @type {import('zudoku').ZudokuConfig} */
const config = {
  topNavigation: [
    { id: "docs", label: "Documentation" },
    { id: "api", label: "API Reference" },
  ],
  sidebar: {
    docs: [
      {
        type: "category",
        label: "Overview",
        items: ["docs/introduction", "docs/example"],
      },
    ],
  },
  redirects: [{ from: "/", to: "/docs/introduction" }],
  apis: {
    type: "file",
    input: [
      "./apis/openapi-v1.yaml",
      "./apis/openapi-v2.yaml",
    ],
    navigationId: "api",
  },
  docs: {
    files: "/pages/**/*.{md,mdx}",
  },
  page: {
    logo: {
      src: {
        light: "/quack_box_banner.png",
        dark: "/quack_box_banner.png"
      },
      alt: "Company Logo",
      width: "182px", // optional width
    }
  },
  theme: {
    light: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      popover: "0 0% 100%",
      popoverForeground: "222.2 84% 4.9%",
      primary: "221.2 83.2% 53.3%",
      primaryForeground: "210 40% 98%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      accent: "210 40% 96.1%",
      accentForeground: "222.2 47.4% 11.2%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",
      border: "214.3 31.8% 91.4%",
      input: "214.3 31.8% 91.4%",
      ring: "221.2 83.2% 53.3%",
      radius: "0.3rem"
    },
    dark: {
      background: "222.2 84% 4.9%",
      foreground: "210 40% 98%",
      card: "222.2 84% 4.9%",
      cardForeground: "210 40% 98%",
      popover: "222.2 84% 4.9%",
      popoverForeground: "210 40% 98%",
      primary: "217.2 91.2% 59.8%",
      primaryForeground: "222.2 47.4% 11.2%",
      secondary: "217.2 32.6% 17.5%",
      secondaryForeground: "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      mutedForeground: "215 20.2% 65.1%",
      accent: "217.2 32.6% 17.5%",
      accentForeground: "210 40% 98%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "210 40% 98%",
      border: "217.2 32.6% 17.5%",
      input: "217.2 32.6% 17.5%",
      ring: "224.3 76.3% 48%",
      radius: "0.3rem"
    }
  }
};

export default config;
