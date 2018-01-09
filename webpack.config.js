var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                query: {
                    retainLines: true,
                    babelrc: false,
                    passPerPreset: true,
                    presets: [
                        [
                            'env',
                            {
                                'modules': false
                            }
                        ],
                        'stage-0',
                        'react'
                    ],
                    plugins: [
                        'transform-class-properties'
                    ]
                }
            }
        ]
    },
    externals: {
        react: 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    }
};
