import { plpPage, renderCatalogPage } from "./catalogPages.shared";

export default {
  title: "Pages/PLP Page",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HTML page para **PLP Page**, construida con componentes existentes del sistema como `Page Header`, `Plateu`, `Brand Item`, `Lists` y `Navigation`.",
      },
    },
  },
};

export const Default = {
  name: "Default",
  render: () => renderCatalogPage(plpPage),
};
