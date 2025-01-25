import { readFileSync } from 'fs';
import type { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';

import Docs from '@/components/docs/Docs';
import GenericLayout from '@/components/layouts/GenericLayout';

import DocsList from '../../../config/docs.json';

const DOCS_ROOT_PATH = path.join(__dirname, '../../../../../docs');

export default function DocsPage({ source, slug }: any) {
  const description = 'Docs';
  const image = '/img/social/modelina-card.jpg';

  return (
    <GenericLayout title='Docs' description={description} image={image} full={true}>
      <Docs source={source} slug={slug}></Docs>
    </GenericLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let paramSlug = '';

  if (params?.slug !== undefined) {
    const slugs = params?.slug as string[];

    paramSlug = `${slugs.join('/')}`;
  }

  const cachedEntry = (DocsList.unwrapped as any)[paramSlug];
  const isCached = cachedEntry !== undefined;
  let source;

  if (isCached) {
    source = cachedEntry.content;
  } else {
    const filePath = `${DOCS_ROOT_PATH}/${paramSlug}.md`;

    source = String(readFileSync(filePath));
  }

  return {
    props: {
      slug: paramSlug,
      source
    }
  };
};

/**
 * Get all docs paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  for (const slug of Object.keys(DocsList.unwrapped)) {
    const split = slug.split('/');
    const param = {
      params: {
        slug: split
      }
    };

    paths.push(param);
  }

  return { paths, fallback: false };
};
