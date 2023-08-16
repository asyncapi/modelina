import { getMDXComponents } from "@/components/MDX";
import { DOCS_ROOT_PATH, getDocsPaths } from "@/helpers/docsUtils";
import { readFileSync } from "fs";
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkComment from 'remark-comment'
  

export default function Docs({ source, frontMatter, filePath} : any ){
  return (
    <div>
      <MDXRemote {...source} components={getMDXComponents()} />
    </div>
  );
}



export const getStaticProps:GetStaticProps = async ({ params }) => {
  const filePath = `${DOCS_ROOT_PATH}/${(params?.slug as string[]).join('/')}.md`;
  const source = readFileSync(filePath)

  const { content, data } = matter(source)

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [
        remarkComment,
      ],
      rehypePlugins: [],
    },
    scope: data,
  })

  return {
    props: {
      filePath: params,
      source: mdxSource,
      frontMatter: data,
    },
  }
}



export const getStaticPaths: GetStaticPaths = async () => {
  const filePaths = getDocsPaths(DOCS_ROOT_PATH);
  const paths = filePaths.map((path) => ({
    params: {
      slug: path.replace(DOCS_ROOT_PATH, "").replace(/\.mdx?$/, "").split("/").slice(1),
    },
  }));

  return { paths, fallback: false };
}