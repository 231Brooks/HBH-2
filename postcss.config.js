module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {
      features: { "nesting-rules": false },
    },
  },
  // Add processing options with timeout
  processOptions: {
    // Set a 30-second timeout for processing
    timeout: 30000,
  },
}
