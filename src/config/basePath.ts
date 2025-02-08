export default function basePath() {
    if (process.env.NODE_ENV === 'development') {
        return ''
    }

    // GITHUB Deployment setting
    // TODO: Check if github supports environment variables
    return '/yet-another-tv-website'
}