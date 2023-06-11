import { DOCS_ROOT_PATH, getDocsPaths } from "@/helpers/docsUtils";
import { readFileSync } from "fs";
import { GetStaticProps } from "next";
import matter from "gray-matter";
import { Doc, params } from "@/types";

export default function Docs({ docs } : { docs: Doc[] }) {
  return (
    <div>
      <h1>Docs</h1>
      <ul>
        {docs.map((doc) => (
          <li key={doc.slug}>
            <a href={`/docs/${doc.slug}`}>{doc.slug.split('/')[doc.slug.split('/').length - 1]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<{docs: Doc[]}, params> = async ({ params }) => {
  if(!params?.page) return { notFound: true };

  const docs: Doc[] = getDocsPaths(DOCS_ROOT_PATH).slice((parseInt(params?.page) - 1) * 10, parseInt(params?.page) * 10)
    .map((path) => {
    const source = readFileSync(path, "utf8");
    const { content, data } = matter(source);

    return {
      content,
      data,
      slug: path.replace(DOCS_ROOT_PATH, "").replace(/\.mdx?$/, ""),
    }
  }) as Doc[];

  return {
    props: {
      docs,
    },
  };
}

export async function getStaticPaths() {
  const filePaths = getDocsPaths(DOCS_ROOT_PATH);
  const paths = Array(Math.ceil(filePaths.length / 10)).fill(0).map((e, i) => ({
    params: { page: (i + 1).toString() }
  }));
  
  return {
    paths,
    fallback: false,
  };
}