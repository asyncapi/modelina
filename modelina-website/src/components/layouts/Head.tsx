import { useContext } from 'react';
import Head from 'next/head';
import AppContext from '../contexts/AppContext';

export interface HeadProps {
  title: string;
  description: string;
  image: string;
}
export default function HeadComponent({
  title,
  description = 'Open source tools to easily build and maintain your event-driven architecture. All powered by the AsyncAPI specification, the industry standard for defining asynchronous APIs.',
  image = '/img/social/website-card.jpg'
}: HeadProps) {
  const url = process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL;
  const { path } = useContext(AppContext);
  const permalink = `${url}${path}`;
  let type = 'website';
  if (path.startsWith('/docs')) {
    type = 'article';
  }
  if (!image.startsWith('http') && !image.startsWith('https')) {
    image = `${url}${image}`;
  }
  const permTitle = 'Modelina';
  title = title ? `${title} | ${permTitle}` : permTitle;

  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="description" content={description} />

      {/* Load Work Sans font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="194x194"
        href="/favicon-194x194.png"
      />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {/* Twitter Card data */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Open Graph data */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={permalink} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <title>{title}</title>
    </Head>
  );
}
