import "../stories/mars.css";

const preview = {
  decorators: [
    (story) => {
      const rendered = story();
      requestAnimationFrame(() => {
        if (window.FontAwesome?.dom?.i2svg) {
          window.FontAwesome.dom.i2svg({ node: document.body });
        }
      });
      return rendered;
    },
  ],
  parameters: {
    layout: "centered",
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        order: ["MARS", "Foundations", "Atoms", "Molecules", "Organisms", "Exact HTML", "Legacy"],
      },
    },
    backgrounds: {
      default: "mars-canvas",
      values: [
        { name: "mars-canvas", value: "#f5f5f5" },
        { name: "white", value: "#ffffff" },
        { name: "dark", value: "#230741" },
      ],
    },
  },
};

export default preview;
