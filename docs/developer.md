# Developers

Getting started with Sparkium development is easy!

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) or another OCI runtime up and running
2. Get [Visual Studio Code](https://code.visualstudio.com) with [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) ready
3. Open the project in the Dev Container and run `pnpm install`
4. Start the development server with `pnpm dev`
5. Make some changes
6. Run tests with `pnpm test`
7. Check the project with `pnpm check`
8. Read about further steps in here

## Continuous Deployment

### Set up a new NPM package publication

To set up trusted publishing for a new NPM package, follow these steps once:

1. Log in to npm with `npm login`
1. Change to the root of the package you want to publish, e.g. `cd libs/types`
1. Run `npm publish --access public` to publish the package to npm
1. Open the packages settings on npmjs.com
1. Select "Github Actions" as a trusted publisher
1. Set the following values:
   - Organization or user: `sparkium`
   - Repository: `sparkium`
   - Workflow filename: `publish.yaml`
