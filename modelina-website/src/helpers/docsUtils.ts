import { readdirSync, statSync } from "fs";
import path from "path";

export const DOCS_ROOT_PATH = path.join(process.cwd(), '../docs');

export const getDocsPaths = (rootPath : string) => {
  const result : string[] = [];
  if(!rootPath) return result;
  
  // Check if rootPath is a file
  if(!statSync(rootPath).isDirectory()) return [rootPath];
  // If rootPath is a directory
  const paths = readdirSync(rootPath);

  // Recursively get all paths
  paths.forEach((e) => {
    const subPaths = getDocsPaths(path.join(rootPath, e));
    result.push(...subPaths);
  });

  return result.filter((e) => e.endsWith('.md'));
};

