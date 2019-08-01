module.exports = ({ file, options, env }) => (
    {
        plugins: {
            'autoprefixer': {},
            'postcss-focus': {},
            'cssnano': env === 'production' ? {} : false
        }
    }
)