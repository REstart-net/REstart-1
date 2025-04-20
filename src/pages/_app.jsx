import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Handle redirecting and error pages
  React.useEffect(() => {
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        // Route change was cancelled, no need to handle this
        return;
      }
      
      // If we find a 404 error, we'll redirect to our custom 404 page
      console.error('Route change error:', err);
      
      // Don't redirect if we're already on an error page
      if (!url.includes('/404')) {
        router.push('/404');
      }
    };

    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>REstart - NSAT Preparation</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp; 