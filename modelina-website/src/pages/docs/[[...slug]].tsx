import { getMDXComponents } from "@/components/MDX";
import GenericLayout from "@/components/layouts/GenericLayout";
import Docs from "@/components/docs/Docs";
import { readFileSync } from "fs";
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from 'next-mdx-remote/serialize'
import remarkComment from 'remark-comment';
import DocsList from "../../../config/docs.json";
import path from 'path';
const DOCS_ROOT_PATH = path.join(__dirname, '../../../../../docs');

export default function DocsPage({ source, frontMatter, slug} : any ){
  const description = 'Docs';
  const image = '/img/social/modelina-card.jpg';
  return (
    <GenericLayout
      title="Docs"
      description={description}
      image={image}
      full={true}
    >
      <Docs source={source} frontMatter={frontMatter} slug={slug}></Docs>
    </GenericLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const paramSlug = (params?.slug as string[]).join('/');
  const isCached = (DocsList.unwrapped as any)[`/docs/${paramSlug}`] !== undefined;

  console.log(paramSlug);
  let source;
  if(isCached) {
    source = (DocsList.unwrapped as any)[`/docs/${paramSlug}`].content;
  } else {
    const filePath = `${DOCS_ROOT_PATH}/${paramSlug}.md`;
    source = readFileSync(filePath);
  }
  return {
    props: {
      slug: paramSlug,
      source: source,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = []
  for (const [x, y] of Object.entries(DocsList.unwrapped)) {
    const t = x.replace('\/docs\/', '/');
    const split = t.split('/').filter((slug) => slug !== '');
    console.log(split);
    paths.push({
      params: {
        slug: split,
      },
    });
  }
  //console.log(JSON.stringify(paths, null, 4));
  return { paths, fallback: false };
}