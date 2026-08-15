# SDLC CLI Concepts

#### change control
a collection of processes intended to manage software change according to certain policies. The CLI implements automated change control according to [org](#org) and [project](#project) defined policies.

#### credential
some secret file or key used to prove the identity of a user.

#### main branch
a designated, permanent branch (usually called 'main') within a [repository](#repository) where 'final' changes are merged. I.e., at any given time the 'main' branch has the most "up-to-date" version of the code. All work and release branches originate from the main branch.

#### org
short for "organization", the org is where cross-project policies and settings are managed.

#### playground
a directory containing the 'imported' (or cloned) project repositories; e.g., the "stuff you're working on". By default, projects are imported according to their NPM name with any leading '@' removed. So, project '@acme/foo' would be found in `~/playground/acme/foo` and project `bar` in `~/playground/bar`. The default location for the playground is `${HOME}/playground`.

#### project
a collection of artifacts intended to implement or support functionality. This may be a library intended to be used by other projects or an end-user application. Projects are associated with one and only one code [repository](#repository). The term 'project' and 'repository' can often be used interchangeably, though they refer to different aspects of the same set of artifacts.

#### pull request
a request to merge changes from a [work branch](#work-branch) to the [main branch](#main-branch).

#### release
a specific tagged snapshot of a [project](#project) which has been released for consumption.

#### repository
a collection of artifacts under version control. Repositories are associated with one and only one [project](#project) and the terms can often be used interchangeably, though they refer to different aspects of the same set of artifacts.

#### unit of work
a defined set of changes isolated on a [repository](#repository) [work branch](#work-branch). The unit of work consists of those changes made since the fork of the work branch up until the branch is merged back to the [main branch](#main-branch) via a [pull request](#pull-request).

#### work
in this context, "work" refers to changing [project](#project) code

#### work branch
a non-permanent [repository](#repository) branch created to define and contain a [unit of work](#unit-of-work).