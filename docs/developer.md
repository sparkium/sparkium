# Developers

## Continuous Deployment

### Set up new NPM package publication

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
