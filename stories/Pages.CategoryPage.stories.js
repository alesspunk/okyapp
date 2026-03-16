import { categoryPage, renderCatalogPage } from "./catalogPages.shared";

export default {
  title: "Pages/Category Page",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HTML page para **Category Page**, construida con componentes existentes del sistema como `Page Header`, `Plateu`, `Input/Search`, `HomeCard` y `Navigation`.",
      },
    },
  },
};

export const Default = {
  name: "Default",
  render: () => renderCatalogPage(categoryPage),
};
