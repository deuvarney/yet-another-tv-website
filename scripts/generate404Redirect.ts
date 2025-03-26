import fs from 'fs';
import path from 'path';

const generate404Page = (webBasePath: string) => {
    const html404 = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
        // Redirect to the homepage and let the client router handle loading the page
        // Store the path segments in session storage
        sessionStorage.setItem('redirect', window.location.pathname + window.location.search);
        // Redirect to the root
        window.location.href = '${webBasePath}/';
    </script>
</head>

<body>
    Redirecting...
</body>

</html>`;

    fs.writeFileSync(
        path.resolve(__dirname, '../dist/404.html'),
        html404
    );

    console.log('✅ 404.html has been generated');
}

const updateRedirectInIndexHtml = (webBasePath: string) => {
    // A script that replaces the text [[BasePathPlaceHolder]] with the actual base path in ../dist/index.html
    const indexHtml = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    const modifiedIndexHtml = indexHtml.replaceAll("{{BasePathPlaceHolder}}", webBasePath || '');
    fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), modifiedIndexHtml);

    console.log('✅ index.html has been modified to handle 404 redirect logic');
}

export function postBuildSteps(env: Record<string, string>) { 
    console.log('###postBuildSteps', env);
    const webBasePath = env.VITE_WEB_BASEPATH || '';
    generate404Page(webBasePath);
    updateRedirectInIndexHtml(webBasePath);
}
