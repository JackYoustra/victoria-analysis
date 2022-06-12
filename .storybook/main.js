module.exports = {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/preset-create-react-app"],
  "framework": "@storybook/react",
  core: {
    builder: "webpack5"
  },
  webpackFinal(config, { configType }) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          stream: require.resolve('stream-browserify'),
        },
      },
    };
  },
};