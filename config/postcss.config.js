module.exports = ({ file, options, env }) => (
    {
        plugins: {
            // 'precss': {},
            'autoprefixer': {},
            'cssnano': env === 'production' ? {} : false
        }
    }
)