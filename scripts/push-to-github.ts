import { getUncachableGitHubClient } from '../server/github';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = 'seapark';
const BRANCH = 'main';
const COMMIT_MESSAGE = 'Update seapark.id marine conservation platform';

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.replit',
  'replit.nix',
  '.config',
  '.cache',
  '.upm',
  '.local',
  'dist',
  '.env',
  '.env.local',
  'package-lock.json',
  'scripts/push-to-github.ts',
  'attached_assets',
  'snippets',
  'generated-icon.png',
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => 
    filePath.includes(pattern) || filePath.startsWith(pattern)
  );
}

function getAllFiles(dirPath: string, basePath: string = ''): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    
    if (shouldIgnore(relativePath)) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, relativePath));
    } else if (stat.isFile()) {
      try {
        const content = fs.readFileSync(fullPath);
        const isText = !content.includes(0x00);
        
        if (isText) {
          files.push({
            path: relativePath,
            content: content.toString('base64'),
          });
        } else {
          files.push({
            path: relativePath,
            content: content.toString('base64'),
          });
        }
      } catch (err) {
        console.warn(`Skipping file ${relativePath}: ${err}`);
      }
    }
  }
  
  return files;
}

async function pushToGitHub() {
  console.log('Connecting to GitHub...');
  const octokit = await getUncachableGitHubClient();
  
  console.log('Getting authenticated user...');
  const { data: user } = await octokit.users.getAuthenticated();
  const owner = user.login;
  console.log(`Authenticated as: ${owner}`);
  
  console.log(`Checking if repo ${REPO_NAME} exists...`);
  let repoExists = false;
  try {
    await octokit.repos.get({ owner, repo: REPO_NAME });
    repoExists = true;
    console.log('Repository exists!');
  } catch (err: any) {
    if (err.status === 404) {
      console.log('Repository not found, creating...');
      await octokit.repos.createForAuthenticatedUser({
        name: REPO_NAME,
        description: 'seapark.id - Marine Conservation Tourism Platform for Indonesia',
        private: false,
        auto_init: true,
      });
      console.log('Repository created!');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      throw err;
    }
  }
  
  console.log('Getting current branch reference...');
  let baseSha: string = '';
  let baseTreeSha: string = '';
  let isEmptyRepo = false;
  
  try {
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: REPO_NAME,
      ref: `heads/${BRANCH}`,
    });
    baseSha = ref.object.sha;
    
    const { data: commit } = await octokit.git.getCommit({
      owner,
      repo: REPO_NAME,
      commit_sha: baseSha,
    });
    baseTreeSha = commit.tree.sha;
    console.log(`Base commit SHA: ${baseSha}`);
  } catch (err: any) {
    if (err.status === 404 || err.status === 409) {
      console.log('Repository is empty, initializing with README...');
      isEmptyRepo = true;
      
      try {
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo: REPO_NAME,
          path: 'README.md',
          message: 'Initial commit',
          content: Buffer.from('# seapark.id\n\nMarine Conservation Tourism Platform for Indonesia\n').toString('base64'),
          branch: BRANCH,
        });
        console.log('README created, repository initialized!');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: ref } = await octokit.git.getRef({
          owner,
          repo: REPO_NAME,
          ref: `heads/${BRANCH}`,
        });
        baseSha = ref.object.sha;
        
        const { data: commit } = await octokit.git.getCommit({
          owner,
          repo: REPO_NAME,
          commit_sha: baseSha,
        });
        baseTreeSha = commit.tree.sha;
        console.log(`Repository initialized, base SHA: ${baseSha}`);
      } catch (initErr) {
        console.error('Failed to initialize repository:', initErr);
        throw initErr;
      }
    } else {
      throw err;
    }
  }
  
  console.log('Collecting files...');
  const files = getAllFiles('.');
  console.log(`Found ${files.length} files to upload`);
  
  console.log('Creating blobs...');
  const treeItems: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i % 10 === 0) {
      console.log(`Processing file ${i + 1}/${files.length}: ${file.path}`);
    }
    
    try {
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo: REPO_NAME,
        content: file.content,
        encoding: 'base64',
      });
      
      treeItems.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
    } catch (err) {
      console.warn(`Failed to create blob for ${file.path}: ${err}`);
    }
  }
  
  console.log('Creating tree...');
  const { data: tree } = await octokit.git.createTree({
    owner,
    repo: REPO_NAME,
    tree: treeItems,
    base_tree: baseTreeSha || undefined,
  });
  
  console.log('Creating commit...');
  const commitParams: any = {
    owner,
    repo: REPO_NAME,
    message: COMMIT_MESSAGE,
    tree: tree.sha,
  };
  
  if (baseSha) {
    commitParams.parents = [baseSha];
  }
  
  const { data: commit } = await octokit.git.createCommit(commitParams);
  
  console.log('Updating branch reference...');
  try {
    await octokit.git.updateRef({
      owner,
      repo: REPO_NAME,
      ref: `heads/${BRANCH}`,
      sha: commit.sha,
      force: true,
    });
  } catch (err: any) {
    if (err.status === 422) {
      await octokit.git.createRef({
        owner,
        repo: REPO_NAME,
        ref: `refs/heads/${BRANCH}`,
        sha: commit.sha,
      });
    } else {
      throw err;
    }
  }
  
  console.log('');
  console.log('========================================');
  console.log('SUCCESS! Code pushed to GitHub!');
  console.log(`Repository: https://github.com/${owner}/${REPO_NAME}`);
  console.log(`Branch: ${BRANCH}`);
  console.log(`Commit: ${commit.sha}`);
  console.log('========================================');
}

pushToGitHub().catch(err => {
  console.error('Error pushing to GitHub:', err);
  process.exit(1);
});
