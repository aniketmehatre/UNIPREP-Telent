module.exports = {
  plugins: [
    require("autoprefixer")(), // Adds vendor prefixes for better browser support
    require("cssnano")({
      // Use the built-in default preset; tweak options here
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
          // You can enable/disable more transforms if desired:
          // normalizeWhitespace: true,
          // mergeLonghand: true,
        },
      ],
    }),
    require("@fullhuman/postcss-purgecss")({
      content: ["./src/**/*.html", "./src/**/*.ts", "./src/**/*.scss"],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [
          /^ng-/, // Keep Angular dynamic classes
          /^p-/, // Keep PrimeNG classes
          /^btn/, // Keep Bootstrap button classes
          /^alert/, // Keep Bootstrap alerts
          /^modal/, // Keep Bootstrap modal classes
          /^pi-/, // Keep PrimeNG icons
          /^p-toast/, // Keep PrimeNG toast notifications
          /^p-dialog/, // Keep PrimeNG dialogs
          /^p-dropdown/, // Keep PrimeNG dropdowns
          /^p-tooltip/, // Keep PrimeNG tooltips
          /^p-overlay/, // Keep PrimeNG overlays
          /^p-table/, // Keep PrimeNG table styling
          /^p-progress/, // Keep PrimeNG progress bars
        ],
      },
    }),
  ],
};
