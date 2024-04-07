// Vuetify

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { ThemeDefinition, createVuetify } from "vuetify";
import { components } from "./components.ts";
import { directives } from "./directives.ts";

// https://m3.material.io/theme-builder#/custom
// Primary: #2D7FBF (Dark blue)
// Secondary: #7FA67B (Sea green)
// Tertiary: #F7CA48 (Light orange)

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#345ca8",
    "on-primary": "#ffffff",
    "primary-container": "#d9e2ff",
    "on-primary-container": "#001a43",
    secondary: "#006e23",
    "on-secondary": "#ffffff",
    "secondary-container": "#8ffa94",
    "on-secondary-container": "#002105",
    tertiary: "#006878",
    "on-tertiary": "#ffffff",
    "tertiary-container": "#a6eeff",
    "on-tertiary-container": "#001f25",
    error: "#ba1a1a",
    "on-error": "#ffffff",
    "error-container": "#ffdad6",
    "on-error-container": "#410002",
    // background: "#fcfcff",
    // "on-background": "#1a1c1e",
    // "surface-1": "#f2f8fc",
    // "on-surface-1": "#001f25",
    // "surface-2": "#dbebf4",
    // "on-surface-2": "#001f25",
    // "surface-3": "#b3d0e3",
    // "on-surface-3": "#001f25",
    background: "#ffffff", // White background

    "on-background": "#000000", // Black for contrast on white bg

    "surface-1": "#f9f9f9", // Very light gray (brighter than before)
    "on-surface-1": "#000000", // Black for contrast

    "surface-2": "#f2f2f2", // Lightest gray (brighter than before)
    "on-surface-2": "#000000", // Black for contrast

    "surface-3": "#e0e0e0", // Light gray (brighter than before)
    "on-surface-3": "#000000", // Black for contrast
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#afc6ff",
    "on-primary": "#002d6c",
    "primary-container": "#15448f",
    "on-primary-container": "#d9e2ff",
    secondary: "#74dd7a",
    "on-secondary": "#00390e",
    "secondary-container": "#005318",
    "on-secondary-container": "#8ffa94",
    tertiary: "#53d7f1",
    "on-tertiary": "#00363f",
    "tertiary-container": "#004e5b",
    "on-tertiary-container": "#a6eeff",
    error: "#ffb4ab",
    "on-error": "#690005",
    "error-container": "#93000a",
    "on-error-container": "#ffdad6",
    // background: "#001f25",
    // "on-background": "#ffffff",
    // "surface-1": "#1a2939",
    // "on-surface-1": "#ffffff",
    // "surface-2": "#203343",
    // "on-surface-2": "#ffffff",
    // "surface-3": "#2c4052",
    // "on-surface-3": "#ffffff",
    background: "#111111", // Black background

    "on-background": "#ffffff", // White text for contrast with black bg

    "surface-1": "#212121", // Dark gray (surface 1 - darkest)
    "on-surface-1": "#ffffff", // White text for contrast with dark gray

    "surface-2": "#333333", // Medium gray (surface 2 - between)
    "on-surface-2": "#ffffff", // White text for contrast with medium gray

    "surface-3": "#424242", // Light gray (surface 3 - lightest)
    "on-surface-3": "#ffffff",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light,
      dark,
    },
  },
});

export { vuetify };
