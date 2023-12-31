import { Node20TypeScriptProject } from "dkershner6-projen-typescript";
import { TextFile } from "projen";
import { JobPermission } from "projen/lib/github/workflows-model";
import { Nvmrc } from "projen-nvm";

const PACKAGE_NAME = "tsv-parse";

const project = new Node20TypeScriptProject({
    majorVersion: 1,

    defaultReleaseBranch: "main",
    name: PACKAGE_NAME,
    keywords: ["tsv", "parser", "json"],
    description: "A simple TSV parser for Node.js",
    homepage: `https://github.com/dkershner6/${PACKAGE_NAME}#readme`,
    bugsUrl: `https://github.com/dkershner6/${PACKAGE_NAME}/issues`,
    authorName: "Derek Kershner",
    authorUrl: "https://dkershner.com",
    repository: `git+https://github.com/dkershner6/${PACKAGE_NAME}.git`,
    projenrcTs: true,

    devDeps: ["dkershner6-projen-typescript", "projen-nvm"],

    release: true,
    releaseToNpm: true,
    github: true,

    docgen: false,
});

new Nvmrc(project);

new TextFile(project, ".github/CODEOWNERS", { lines: ["* @dkershner6"] });

const releaseWorkflow = project.github?.tryFindWorkflow("release");
if (releaseWorkflow) {
    releaseWorkflow.addJobs({
        "publish-demo-site": {
            needs: ["release_npm"],
            runsOn: ["ubuntu-latest"],
            permissions: {
                contents: JobPermission.WRITE,
            },
            steps: [
                {
                    name: "Checkout",
                    uses: "actions/checkout@v3",
                },
                {
                    name: "Setup Node",
                    uses: "actions/setup-node@v3",
                    with: {
                        "node-version": "20.10.0",
                    },
                },
                {
                    name: "Install and Build",
                    run: "cd demo-site && npx npm-check-updates -u tsv-parse && npm i && npm run build",
                },
                {
                    name: "Deploy",
                    uses: "JamesIves/github-pages-deploy-action@4.1.1",
                    with: {
                        branch: "gh-pages",
                        folder: "demo-site/build",
                    },
                },
            ],
        },
    });
}

project.synth();
