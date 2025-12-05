module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Jeśli używasz Reanimated, plugin musi być OSTATNI
    plugins: ["react-native-reanimated/plugin"],
  };
};
