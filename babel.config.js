module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    ["@babel/preset-env", { modules: false }],
  ],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};

// module.exports = {
//   presets: ["@vue/cli-plugin-babel/preset"],
//   plugins: [
//     [
//       "import",
//       {
//         libraryName: "best-library",
//         libraryDirectory: "es",
//       },
//       "best-library",
//     ],
//   ],
// };
