# <span id="projects">projects</span>
[<- SDLC CLI Documentation](./index.md)

## Functions/endpoints

- `/projects`:
  - [`archive`](#_projects_archive): Project archive (implied)
  - [`audit`](#_projects_audit): Project audit (implied)
  - [`audit-fix`](#_projects_audit_fix): Project audit fix (implied)
  - [`close`](#_projects_close): Close project (implied)
  - [`create`](#_projects_create): Project create
  - [`destroy`](#_projects_destroy): Work destroy (implied)
  - [`detail`](#_projects_detail): Project detail (implied)
  - [`document`](#_projects_document): Project document (implied)
  - [`rename`](#_projects_rename): Project rename (implied)
  - [`setup`](#_projects_setup): Project setup (implied)
  - [`update`](#_projects_update): Project update (implied)
- `/projects/:projectName`:
  - [`audit`](#_projects_projectname_audit): Project audit (named)
  - [`audit-fix`](#_projects_projectname_audit_fix): Project audit fix (named)
- `/projects/badges/coverage`:
  - [`add`](#_projects_badges_coverage_add): Add test coverage badge
- `/projects/badges/github-workflow`:
  - [`add`](#_projects_badges_github_workflow_add): Add github workflow badges
- `/projects/releases`:
  - [`publish`](#_projects_releases_publish): projects release prepare (implied)
- `/projects/workflows/github/node-jest-cicd`:
  - [`add`](#_projects_workflows_github_node_jest_cicd_add): Add GitHub workflow Node unit test
  - [`remove`](#_projects_workflows_github_node_jest_cicd_remove): Remove GitHub workflow Node unit test
  - [`show`](#_projects_workflows_github_node_jest_cicd_show): Show GitHub workflow Node unit test
- `/projects/workflows/local/node-build`:
  - [`add`](#_projects_workflows_local_node_build_add): Setup node project

## <span id="_projects_archive">`/projects/archive`</span>
[^ top](#projects)

Archives the implied project.

### Parameters

- `keepLocal`: _(opt, boolean)_\
  If true, then will not remove the local project repo.
- `projectPath`: _(opt, string)_\
  Path to local project to work with. Can be used to specify projects in non-default locations. Otherwise, the process will look ask the `PlaygroundMonitor`.

### Description

Archives the repository associated with the implied project on GitHub and deletes the local project. Use `keepLocal` to retain the local project.

## <span id="_projects_audit">`/projects/audit`</span>
[^ top](#projects)

Auidts the implied project.

### Parameters

_none_

### Description

Audits the implied project for security vulnerabilities as well as outdated, missing, or extraneous package dependencies. See also '/projects/audit-fix' to automatically address many issues.

## <span id="_projects_audit_fix">`/projects/audit-fix`</span>
[^ top](#projects)

Fixes implied project audit issues.

### Parameters

- `dryRun`: _(opt, boolean)_\
  When set to true, no changes are actually changed, but a report of what would be done is generated.
- `removePackages`: _(opt, boolean)_
- `updateMinimums`: _(opt, boolean)_\
  By default production package semver range specificatinos are left in place. Setting `updateMinimums` true will make the current 'wanted' package the new minimum. Note, pre-production package minimums are always updated.

### Description

Fixes many implied project  security vulnerabilities as well as outdated, missing, and extraneous package dependencies issues. See also '/projects/audit' to get an audit report. The following actions are taken:
- `npm audit fix` is run to address any automaticaly fixable vulnerabilities
- missing packages are installed
- when `removePackages` is set true, extra packages are reomved (see parameter documentation)
- outdated packages are updated; pre-release package 'minimums' are updated while production pacagkes are updated but the semver range spec is kept as is unless `updateMinimums` is set to true (see parameter documentation).

## <span id="_projects_close">`/projects/close`</span>
[^ top](#projects)

Closes the implied project.

### Parameters

_none_

### Description

Closes the local the implied project after checking that everything has been saved remotely.

## <span id="_projects_create">`/projects/create`</span>
[^ top](#projects)

### Parameters

- `description`: _(req, string)_\
  If provided, will be used to set the newly created package description.
- `githubOwner`: _(opt, string)_\
  The GitHub owner name to use when creating the GitHub repository. If none is provided, then the 'org' part, if any, from the (NPM) 'newProjectName' will be used. If there is no org part, then an error is raised.
- `license`: _(opt, string)_\
  Sets the license string for the newly created package. If not provided, then defaults to org setting 'ORG_DEFAULT_LICENSE' if set and 'UNLICENSED' otherwise.
- `newProjectName`: _(req, string)_\
  The (NPM) name of the project.
- `noCleanup`: _(opt, boolean)_\
  By default, on error, the process will attempt to cleanup any artifacts created and restore everything to the state prior to invocation. If `noCleanup` is specified this behavior is suppressed.
- `noDeleteLabels`: _(opt, boolean)_\
  If true, then only missing labels will be added and any existing labels will be kept in place. Existing labels with the same name will be updated unless `noUpdateLabels` is set.
- `noFork`: _(opt, boolean)_\
  Suppresses default behavior of proactively creating workspace fork for public repos.
- `noUpdateLabels`: _(opt, boolean)_\
  If true, then existing labels with the same name as the canonical label set will be left unchanged. Thtey will still be deleted, however, unless `noUpdateLabels` is set.
- `orgKey`: _(opt, string)_
- `public`: _(opt, boolean)_\
  By default, project repositories are created private. If `public` is set to true, then the repository will be made public.
- `retainLeadingAt`: _(opt, boolean)_\
  By default the leading '@' is dropped from the project name when creating the local playground diroctery. E.g, '@liquid-labs/some-project' would be saved in '~/liquid-labs/some-project' by default. Setting 'retainLeadingAt' to true would save the new project in '@liquid-labs/some-project'.
- `skipLabels`: _(opt, boolean)_\
  If true, then the entire label normalization process will be skipped.
- `skipMilestones`: _(opt, boolean)_\
  If true, the milestone setup process is skipped.
- `version`: _(opt, string)_\
  The version string to use for the newly initialized package `version` field. Defaults to '1.0.0-alpha.0'.

### Description

Attempts to create the named project repository on GitHub and locally.

## <span id="_projects_destroy">`/projects/destroy`</span>
[^ top](#projects)

### Parameters

- `noCopy`: _(opt, boolean)_\
  Skips the default backup copy made to tmp.
- `confirmed`: _(opt, boolean)_\
  In order to better prevent accidental destruction, the `confirmed` option must be specified or the process exits.
- `projectPath`: _(opt, string)_\
  Path to local project to work with. Can be used to specify projects in non-default locations. Otherwise, the process will look ask the `PlaygroundMonitor`.

### Description

Attempts to delete the implied project repository on GitHub and delete the local copy as well. In order to better avoid accidental deletion, the `confirmed` parameter must be set to `true`. By default, a copy of the project is made in the system's tmp directory unless `noCopy` is specified. 

## <span id="_projects_detail">`/projects/detail`</span>
[^ top](#projects)

Details the implied project.

### Parameters

_none_

### Description

Provides detailed information about the implied project.

## <span id="_projects_document">`/projects/document`</span>
[^ top](#projects)

Generates developer documents for the implied project.

### Parameters

_none_

### Description

Locally generates developer documentation for the implied project.

## <span id="_projects_rename">`/projects/rename`</span>
[^ top](#projects)

Renames the implied local and GitHub projects names and updates git configuration.

### Parameters

- `newName`: _(opt, string)_\
  The new full package name.
- `noRenameDir`: _(opt, boolean)_\
  Leaves the local project directory in place rather than trying to rename it to the new name.
- `noRenameGitHubProject`: _(opt, boolean)_\
  Leaves the GitHub project in place rather than trying to rename it to the new name.
- `projectPath`: _(opt, string)_\
  Path to local project to work with. Can be used to specify projects in non-default locations. Otherwise, the process will look ask the `PlaygroundMonitor`.

### Description

Renames the implied local and GitHub projects names and updates git configuration. It is safe to make repeated calls and in the case of partial success, the process can be re-run is safe to repeat. By default, the process will do four things:

1. Rename the local project directory.
2. Rename the GitHub project.
3. Update the local repository origin remote URLs.
4. Update the <code>package.json<rst> name, URLs, and <code>main<rst> (where applicable).

There may be additional steps needed to complete the renaming process.

## <span id="_projects_setup">`/projects/setup`</span>
[^ top](#projects)

Sets up the implied project.

### Parameters

- `noDeleteLabels`: _(opt, boolean)_\
  If true, then only missing labels will be added and any existing labels will be kept in place. Existing labels with the same name will be updated unless `noUpdateLabels` is set.
- `noUpdateLabels`: _(opt, boolean)_\
  If true, then existing labels with the same name as the canonical label set will be left unchanged. Thtey will still be deleted, however, unless `noUpdateLabels` is set.
- `noUpdateMainBranch`: _(opt, boolean)_\
  If true, the main branch will not be renamed even if it not standard 'main'.
- `noUpdateOriginRemote`: _(opt, boolean)_\
  If true, the origin remote will not be renamed even if not standard 'origin'.
- `projectPath`: _(opt, string)_\
  Path to local project to work with. Can be used to specify projects in non-default locations. Otherwise, the process will look ask the `PlaygroundMonitor`.
- `skipLabels`: _(opt, boolean)_\
  If true, then the entire label normalization process will be skipped.
- `skipMilestones`: _(opt, boolean)_\
  If true, the milestone setup process is skipped.
- `unpbulished`: _(opt, boolean)_\
  Set to true for new or otherwise unpblushed packages. By default, the process will query npm to get the latest version of the package for use with milestones setup. If set false, then this query is skipped and the local package data is used.

### Description

Sets up the implied project with common configurations. This will:
- set the origin remote name to 'origin',
- set the local main and remote default branch names to 'main',
- set up standard issue labels, and
- setup standard project milestones

## <span id="_projects_update">`/projects/update`</span>
[^ top](#projects)

Updates the implied project.

### Parameters

- `dryRun`: _(opt, boolean)_\
  Reports what would be done if target was updated, but makes no actual changes.

### Description

Updates the implied project.

## <span id="_projects_projectname_audit">`/projects/:projectName/audit`</span>
[^ top](#projects)

Auidts the named project.

### Parameters

_none_

### Description

Audits the named project for security vulnerabilities as well as outdated, missing, or extraneous package dependencies. See also '/projects/audit-fix' to automatically address many issues.

## <span id="_projects_projectname_audit_fix">`/projects/:projectName/audit-fix`</span>
[^ top](#projects)

Fixes named project audit issues.

### Parameters

- `dryRun`: _(opt, boolean)_\
  When set to true, no changes are actually changed, but a report of what would be done is generated.
- `removePackages`: _(opt, boolean)_
- `updateMinimums`: _(opt, boolean)_\
  By default production package semver range specificatinos are left in place. Setting `updateMinimums` true will make the current 'wanted' package the new minimum. Note, pre-production package minimums are always updated.

### Description

Fixes many named project  security vulnerabilities as well as outdated, missing, and extraneous package dependencies issues. See also '/projects/audit' to get an audit report. The following actions are taken:
- `npm audit fix` is run to address any automaticaly fixable vulnerabilities
- missing packages are installed
- when `removePackages` is set true, extra packages are reomved (see parameter documentation)
- outdated packages are updated; pre-release package 'minimums' are updated while production pacagkes are updated but the semver range spec is kept as is unless `updateMinimums` is set to true (see parameter documentation).

## <span id="_projects_badges_coverage_add">`/projects/badges/coverage/add`</span>
[^ top](#projects)

Adds a test coverage badge to the target package `README.md`.

### Parameters

- `priority`: _(opt, string, /^\d+/)_\
  Designates the priority (order) of the badge on the `README.md` page.

### Description

Generates a test coverage badge based on the `qa/coverage/clover.xml` coverage report. It will attempt to insert the badge image at the top of the package `README.md` just under the title line. The title line is determined by the first line beginning with a single '#'. If there is no `README.md` file, the function will attempt to generate based on the `package.json` settings.

## <span id="_projects_badges_github_workflow_add">`/projects/badges/github-workflow/add`</span>
[^ top](#projects)

Adds github workflow status badges to the target package README.md.

### Parameters

- `requireWorkflows`: _(opt, boolean)_\
  If a any workflow `workflowID` not found, then an exception is raised.
- `workflowMatchers`: _(opt, multi-value, string)_\
  A set of string of the form '&lt;match string&gt;/&lt;priority&gt;'. 'Match string' is used to match against workflow file names. Matched names will generate badges ordered by 'priority'. Unmatched names are ignored by default. Defaults to ['unit-tests/1' ]. If `requireWorkflows` is true, then this will instead result in an error if no matching workflow found.

### Description

Generates a GitHub workflow status badge. It will attempt to insert the badge at the top of the package `README.md` just under the title line. The title line is determined by the first line beginning with a single '#'. If there is no `README.md` file, the function will attempt to generate based on the `package.json` settings.

## <span id="_projects_releases_publish">`/projects/releases/publish`</span>
[^ top](#projects)

Prepares and (usually) publish the project.

### Parameters

- `dirtyOK`: _(opt, boolean)_\
  Skips the branch clean check, allowing for the presence of uncommitted changes/files
- `increment`: _(opt, string, /^(?:major|minor|patch|premajor|preminor|prepatch|prerelease|pretype|alpha|beta|rc|gold)$/)_\
  Indicates how to increment the version for this release.
- `name`: _(opt, string)_\
  Optional "name" for the release. This will be used in the generated changelog.
- `noBrowser`: _(opt, boolean)_\
  If true, supresses launching of browser to show changelog page.
- `noPublish`: _(opt, boolean)_\
  If true, skips the publish step. One and only one of `noPublish` and `publish` must be set.
- `noRelease`: _(opt, boolean)_\
  If true, skips creating the release. Will still publish unless 'noPublish' is also set.
- `otp`: _(opt, string)_\
  One time password to be used when publishing the project.
- `projectPath`: _(opt, string)_\
  Path to local project to work with. Can be used to specify projects in non-default locations. Otherwise, the process will look ask the `PlaygroundMonitor`.
- `publish`: _(opt, string, /^(?:main-branch|release-branch)$/)_\
  May be set to 'release-branch' or 'main-branch'. One and only one of `publish` and `noPublish` must be set unless one of the settings `projects.<project FQN>.releases.
- `releaseOnly`: _(opt, boolean)_\
  If true, then will create a release based on the current version. This can be used to create a release for versions previously published with 'noRelease' set to true, or in other instances where the release is missing.
- `summary`: _(opt, string)_\
  Optional short description of the release. This will be used in the changelog if provided.

### Description

Prepares and typically publishes a project. Preparation involves bumping the version, checking and saving the QA results on a release branch. Because the work typically moves on, it is most common to publish at the same time

## <span id="_projects_workflows_github_node_jest_cicd_add">`/projects/workflows/github/node-jest-cicd/add`</span>
[^ top](#projects)

Adds a GitHub CI/CD workflow for unit testing node projects.

### Parameters

- `nodeVersions`: _(opt, string)_
- `noPullRequest`: _(opt, boolean)_
- `noPush`: _(opt, boolean)_
- `osList`: _(opt, string)_

### Description



## <span id="_projects_workflows_github_node_jest_cicd_remove">`/projects/workflows/github/node-jest-cicd/remove`</span>
[^ top](#projects)

Removes the GitHub CI/CD workflow for unit testing node projects.

### Parameters

_none_

### Description



## <span id="_projects_workflows_github_node_jest_cicd_show">`/projects/workflows/github/node-jest-cicd/show`</span>
[^ top](#projects)

Shows the GitHub CI/CD workflow for unit testing node projects.

### Parameters

_none_

### Description



## <span id="_projects_workflows_local_node_build_add">`/projects/workflows/local/node-build/add`</span>
[^ top](#projects)

### Parameters

- `devInstall`: _(opt, boolean)_\
  If true, will install local development versions of the build dependencies (sdlc-resource libraries) if present.
- `distPath`: _(opt, string)_\
  Defines the package root relative distribution directory. Defaults to settings value 'dist'.
- `docBuildPath`: _(opt, string)_\
  Package root relative path to the built docs.
- `docSrcPath`: _(opt, string)_\
  src relative path to the documentation source.
- `isExecutable`: _(opt, boolean)_\
  Applies the default build logic except that a single entry file under the source directory is treated as the source for an executable rather than a library. This setting is ignored if 'withExecutables' or 'withLibs' is specified.
- `noBuild`: _(opt, boolean)_\
  If true, then no build rules are generated. This can be useful for integration test only repos, for example.
- `noDoc`: _(opt, boolean)_\
  Excludes 'doc' target from the generated makefiles.
- `noInstall`: _(opt, boolean)_\
  Does not install build, test, lint, etc. resources which may be needed by the scripts. Can be useful when you have set up the depencies on a specific version and don't want to override that.
- `noLint`: _(opt, boolean)_\
  Excludes 'lint' and 'lint-fix' targets from the generated makefiles.
- `noTest`: _(opt, boolean)_\
  Excludes 'test' targets from the generated makefiles.
- `qaPath`: _(opt, string)_\
  Defines the package root relative qa directory. Defaults to settings value 'qa'.
- `srcPath`: _(opt, string)_\
  Defines the package root relative source directory. Defaults to setting value or 'src'.
- `testStagingPath`: _(opt, string)_\
  Defines the package root relative test staging directory. Defaults to settings value 'test-staging'.
- `withExecutables`: _(opt, multi-value, string)_\
  Each use of the parameter specifies an executable entry path and compiled executable output file relative to the effective src and dist directories respectively. E.g., with default src and dist values, 'exec-index.mjs:subdir/exec.js' would mean compilation would start with '~/src/exec-index.mjs' and produce an output executable at '~/dist/subdir/exec.js'.
  
      When 'withExecutables' is specified, the default auto-guess behavior is suppressed and all build inputs and artifacts must be fully defined.
- `withLibs`: _(opt, multi-value, string)_\
  Each use of the parameter specifies a libray entry path and compiled library output file relative to the effective src and dist directories respectively. E.g., with default src and dist values, 'special-index.mjs:subdir/special-lib.js' would mean compilation would start with '~/src/special-index.mjs' and produce an output library at '~/dist/subdir/special-lib.js'.
  
      When 'withLibs' is specified, the default auto-guess behavior is suppressed and all build inputs and artifacts must be fully defined.

### Description

By default, this method will analyze the current project and produce an appropriate 'Makefile' with build, test, and lint options and also install necessary 'devDependencies'. The analysis is as follows:

  1. If there is an 'index.js' (or '.mjs', '.cjs') file in the source directory (generally 'src'), then we assume the package to define a single library whose output will be determined by the 'main' field in 'package.json'.
  2. If there is no index file in the source directory, but there are 'lib' and 'bin', 'cli', 'exec', or 'executable' subdirectories containing index files, then we assume a single library under 'lib' and a single executable in the 'bin'/'cli'/'exec'/'executable'. Any one of these directories will be recognized and an error will be thrown if there are multiple directories executable directories. The library output is determined by the 'main' field in 'package.json' and the executable is named by appending '-exec' to the library base name. E.g., given a main entry of 'dist/foo.js', the executable would be 'dist/foo-exec.js'.
  3. Otherwise, the fully automated setup fails and library and executables must be defined using the 'withLibs' and 'withExecutables' parameters.

[<- SDLC CLI Documentation](./index.md)
