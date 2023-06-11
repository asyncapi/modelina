import { DOCS_ROOT_PATH, getDocsPaths } from "@/helpers/docsUtils";
import { readFileSync } from "fs";
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { AnchorHTMLAttributes, BlockquoteHTMLAttributes, ClassAttributes, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, TableHTMLAttributes } from "react";

const components = {
    h1: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} className={`${props.className || ''} my-4 font-heading antialiased font-semibold tracking-heading text-gray-900 text-2xl`} />,
    h2: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} className={`${props.className || ''} mb-4 mt-6 font-heading antialiased font-semibold tracking-heading text-gray-900 text-2xl`} />,
    h3: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} className={`${props.className || ''} mb-4 mt-6 font-heading antialiased font-medium tracking-heading text-gray-900 text-lg`} />,
    h4: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} className={`${props.className || ''} my-4 font-heading antialiased font-medium text-md text-gray-900`} />,
    h5: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} className={`${props.className || ''} my-4 font-heading antialiased text-md font-bold`} />,
    h6: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} className={`${props.className || ''} my-4 font-heading antialiased text-sm font-bold text-gray-900 uppercase`} />,
    blockquote: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLQuoteElement> & BlockquoteHTMLAttributes<HTMLQuoteElement>) => <blockquote {...props} className={`${props.className || ''} italic font-body antialiased text-gray-700 border-l-4 border-gray-400 pl-4 pt-1 pb-1 pr-1 my-4 bg-white`} />,
    p: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLParagraphElement> & HTMLAttributes<HTMLParagraphElement>) => <p {...props} className={`${props.className || ''} my-4 text-gray-700 font-regular font-body antialiased`} />,
    strong: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement>) => <strong {...props} className={`${props.className || ''} my-4 text-gray-800 font-semibold font-body antialiased`} />,
    a: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} className={`${props.className ? props.className : 'text-gray-900 font-semibold border-b border-secondary-400 hover:border-secondary-500 transition ease-in-out duration-300'} font-body antialiased`} />,
    ul: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLUListElement> & HTMLAttributes<HTMLUListElement>) => <ul {...props} className={`${props.className || ''} my-4 ml-4 list-disc text-gray-700 font-normal font-body antialiased`} />,
    ol: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLOListElement> & OlHTMLAttributes<HTMLOListElement>) => <ol {...props} className={`${props.className || ''} my-4 ml-4 list-decimal text-gray-700 font-normal font-body antialiased`} />,
    li: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLLIElement> & LiHTMLAttributes<HTMLLIElement>) => <li {...props} className={`${props.className || ''} my-3 text-gray-700 font-regular tracking-tight font-body antialiased`} />,
    table: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLTableElement> & TableHTMLAttributes<HTMLTableElement>) => (
      <div className={`${props.className || ''} flex flex-col`}>
        <div className="my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block w-full shadow overflow-auto sm:rounded-lg border-b border-gray-200">
            <table {...props} className={`${props.className || ''} w-full`} />
          </div>
        </div>
      </div>
    ),
    };
  

export default function Docs({ source, frontMatter, filePath} : any ){
  return (
    <div>
      <MDXRemote {...source} components={components} />
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
      remarkPlugins: [],
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