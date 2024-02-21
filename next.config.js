const nextConfig = {
    // In strict react will render two times. To catch error early.
    // reactStrictMode: false
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
        // Important: return the modified config
        config.module.rules.push({
            test: /re2\.node$/i,
            use: 'raw-loader',
        });
        return config;
    },
};

module.exports = nextConfig;
