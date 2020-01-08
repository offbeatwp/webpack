const SiteConfig            = require('../../../resources/config.js');
const Webpack               = require('webpack');
const path                  = require('path');
const CleanWebpackPlugin    = require('clean-webpack-plugin')
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");
const StylelintBarePlugin   = require('stylelint-bare-webpack-plugin');
const BrowserSyncPlugin     = require('browser-sync-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TerserPlugin          = require('terser-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

let alias = {
    'jquery': path.join(__dirname, '../../jquery/dist/jquery.js'), // Necessary otherwise bootstrap will use own jquery
    'masonry': 'masonry-layout',
    'isotope': 'isotope-layout',
};

let externals = {
    jquery: 'jQuery'
};

if (typeof SiteConfig.alias === 'object') {
    alias = Object.assign(alias, SiteConfig.alias);
}

if (typeof SiteConfig.externals === 'object') {
    externals = Object.assign(externals, SiteConfig.externals);
}

module.exports = {
    entry: SiteConfig.entry,
    output: {
        path: path.resolve(__dirname, '../../../assets'),
        filename: devMode ? '[name].js' : '[name].[contenthash].js',
        sourceMapFilename: "[file].map",
    },
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: true,
            })
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    },
                    {
                        loader: "eslint-loader",
                        options: {
                            configFile: path.resolve(__dirname, '.eslintrc'),
                            ignorePath: path.resolve(__dirname, '.eslintignore'),
                            fix: true
                        }
                    }
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: { 
                            sourceMap: devMode ? true : false,
                            importLoaders: 2,
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            config: {
                                path: path.resolve(__dirname, 'postcss.config.js')
                            },
                            sourceMap: devMode ? true : false,
                        }
                    }, {
                        loader: "sass-loader",
                        options: { 
                            sourceMap: devMode ? true : false,
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            context: './resources',
                            outputPath: 'img',
                        }  
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                include: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'img/modules/',
                        }  
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "fonts/[name].[ext]?[hash]"
                        }  
                    }
                ]
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }]
            }
        ]
    },
    resolve: {
        alias: alias,
    },
    externals: externals,
    plugins: [
        new Webpack.ProvidePlugin({
            $:                  'jquery',
            jQuery:             'jquery',
            'window.jQuery':    'jquery',
            Popper:             ['popper.js', 'default'],
            Tether:             'tether',
            'window.Tether':    'tether'
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),
        new CleanWebpackPlugin(
        ),
        new StylelintBarePlugin({
            configFile: path.resolve(__dirname, '.stylelintrc'),
            fix: true
        }),
        new BrowserSyncPlugin({
          proxy: SiteConfig.proxyUrl
        }),
        new Webpack.LoaderOptionsPlugin({
            // debug: true
        }),
        new WebpackAssetsManifest({
        })
    ]
};
