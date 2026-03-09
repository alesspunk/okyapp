/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  stories: ["../stories/**/*.stories.js"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  staticDirs: [
    "../images",
    { from: "../public", to: "/public" },
  ],
};
