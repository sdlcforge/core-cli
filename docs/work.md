# <span id="work">work</span>
[<- SDLC CLI Documentation](./index.md)

## Functions/endpoints

- `/work`:
  - [`build`](#_work_build): Work build (implied)
  - [`clean`](#_work_clean): Work clean (implied)
  - [`close`](#_work_close): Work close (implied)
  - [`pause`](#_work_pause): Pause work
  - [`qa`](#_work_qa): Work qa (implied)
  - [`save`](#_work_save): Work save.
  - [`start`](#_work_start): Work start
  - [`status`](#_work_status): Work status
  - [`submit`](#_work_submit): Work submit.
- `/work/:workKey`:
  - [`resume`](#_work_workkey_resume)
- `/work/issues`:
  - [`add`](#_work_issues_add): Work issues add
  - [`list`](#_work_issues_list): Work issues list
  - [`remove`](#_work_issues_remove): Work issues remove
- `/work/projects`:
  - [`add`](#_work_projects_add): Work projects add
  - [`list`](#_work_projects_list): Work projects list
  - [`remove`](#_work_projects_remove): Work projects remove

## <span id="_work_build">`/work/build`</span>
[^ top](#work)

Builds work involved projects.

### Parameters

- `all`: _(opt, boolean)_\
  Saves all projects associated with the unit of work. This option overrides `projects`.
- `all`: _(opt, boolean)_\
  Saves all projects associated with the unit of work. This option overrides `projects`.
- `projects`: _(opt, multi-value, string)_\
  List of projects to build. This option is ignored if `all` is specified.
- `projects`: _(opt, multi-value, string)_\
  List of projects to build. This option is ignored if `all` is specified.

### Description

Builds one or more projects associated with the implied unit of work.

## <span id="_work_clean">`/work/clean`</span>
[^ top](#work)

Cleans work branches and records.

### Parameters

- `noCloseWork`: _(opt, boolean)_\
  Keeps the work entry in the active work DB.
- `noDeleteBranches`: _(opt, boolean)_\
  Leaves work branches in place.
- `noFetch`: _(opt, boolean)_\
  Supresses default behavior of fetching remote changes before comparing local and remote branches.
- `noUpdateLocal`: _(opt, boolean)_\
  Supresses update of local tracking branches.

### Description

Cleans up the work branches and records associated the implied unit of work. By default, the local copy of remote main branches will be updated in order to provide up-to-date information on the status in order to determine whether the work artifacts can be cleaned (removed). This can be supressed with the `noFetch` option.

## <span id="_work_close">`/work/close`</span>
[^ top](#work)

Closes work branches and records.

### Parameters

- `noUnassign`: _(opt, boolean)_\
  Supresses the default behavior of unassigning the current user from any open issues associated with the unit of work.

### Description

Closes an open unit of work, removing the branches and the local work records associated with the implied unit of work and, by default, unassigns the current user from the associated issues. The 'noUnassign' parameter can be set 'true' to keep the assignment.

## <span id="_work_pause">`/work/pause`</span>
[^ top](#work)

Pauses the undefined unit of work.

### Parameters

_none_

### Description

Pauses the undefined unit of work, switching each involved project back to the main branch and re-installing the package. This is an all or nothing process and it will fail with no changes unless all the projects are currently on the work branch and clean or on the main branch (in any state).

## <span id="_work_qa">`/work/qa`</span>
[^ top](#work)

QAs work involved projects.

### Parameters

- `all`: _(opt, boolean)_\
  Saves all projects associated with the unit of work. This option overrides `projects`.
- `all`: _(opt, boolean)_\
  Saves all projects associated with the unit of work. This option overrides `projects`.
- `projects`: _(opt, multi-value, string)_\
  List of projects to qa. This option is ignored if `all` is specified.
- `projects`: _(opt, multi-value, string)_\
  List of projects to qa. This option is ignored if `all` is specified.

### Description

QAs one or more projects associated with the implied unit of work.

## <span id="_work_save">`/work/save`</span>
[^ top](#work)

Commts and pushes work branch changes.

### Parameters

- `all`: _(opt, boolean)_\
  Saves all projects associated with the unit of work. This option overrides `projects`.
- `backupOnly`: _(opt, boolean)_\
  
- `description`: _(opt, string)_\
  Optional long form description of the changes, expanding on the `summary`.
- `files`: _(opt, multi-value, string, option aware)_\
  Rather than saving everything, save only the indicated files. Files are specified in the form '[org/project:]rel/path/to/file'. When the project designation is omitted, the current project is assumed.
- `noBackup`: _(opt, boolean)_\
  Skips the push, i.e., just commits.
- `projects`: _(opt, multi-value, string)_\
  List of projects to save. This option is ignored if `all` is specified.
- `summary`: _(opt, string)_\
  Short, concise description of the changes.

### Description

Saves the changes associated with the current unit of work by committing and pushing local changes. By default, commits and pushes local changes. `noBackup` causes the process to commit, but not push. `backupOnly` causes the process to push without committing. If committing `summary` is required.

## <span id="_work_start">`/work/start`</span>
[^ top](#work)

Creates a new unit of work.

### Parameters

- `issueBug`: _(opt, boolean)_\
  Labels the created issue as a 'bug' rather than the default 'enhancement'. Only valid when 'createIssues' is set.
- `issueDeliverables`: _(opt, string)_\
  A list of newline or a double semi-colon (';;') seperated deliverables items. Only valid when 'createIssue' is set.
- `issueNotes`: _(opt, string)_\
  Notes to include in the issue body. Only valid when 'createIssue' is set.
- `issueOverview`: _(opt, string)_\
  The overview text to use when creating an issue. Only valid if 'createIssue' is set.
- `issueTitle`: _(opt, string)_\
  Creates an issue with the given title. Requires 'issueOverview' and 'issueDeliverables' also be set.
- `noOpenIssue`: _(opt, boolean)_\
  If true, supresses the default behavior of opening the newly created issue when 'issueTitle' and friends are set.
- `projects`: _(opt, multi-value, string, option aware)_\
  The project(s) to include in the new unit of work. If none are specified, then will guess the current implied project based on the client working directory.
- `submit`: _(opt, boolean)_\
  If true, immediately saves and submits the current work. Only compatible when the work is associated with a single project. This is useful for small changes already made. If the QA does not pass for any reason, it will halt the process after saving but before submission.
- `noDevLink`: _(opt, boolean)_\
  When true, supresses the default behavior of linking the local development packages.
- `assignee`: _(opt, string)_\
  The assignee (github login ID) to add to the issues. See `noAutoAssign`.
- `comment`: _(opt, string)_\
  The comment to use when claiming an issue. Defaults to: 'Work for this issue has begun on branch &lt;work branch name&gt;.'
- `noAutoAssign`: _(opt, boolean)_\
  Suppresses the default behavior of assigning the issue based on the current user's GitHub authentication.
- `issues`: _(req, multi-value, string)_\
  References to the issues associated to the work. May be an integer number when assoicated with the first project specified or have the form &lt;org&gt/&lt;project name&gt;-&lt;issue number&gt;.

### Description

Creates a new unit of work involving the designated projects. By default, the local development copy of any project which is a dependency of another is linked the dependent project unless `noLink` is specified.

## <span id="_work_status">`/work/status`</span>
[^ top](#work)

Reports on the status of a unit of work.

### Parameters

- `allPulls`: _(opt, boolean)_\
  Will include all related pull requests in the report, rather than just merged or open PRs.
- `noFetch`: _(opt, boolean)_\
  Supresses default behavior of fetching remote changes before comparing local and remote branches.
- `updateLocal`: _(opt, boolean)_\
  Will update local main and working branches with changes from the respective remote branch counterparts prior to analysis.

### Description

Checks the status of a unit of work branches, issues, and pull requests. By default, the local copy of remote main branches will be updated in order to provide up-to-date information on the status. This can be supressed with the `noFetch` option.

  The resulting report contains two main sections, 'issues' and 'projects'. The issues section indicates the number, state (open or closed), and URL for each issue.

  The projects section breaks down pull requests, branch status, and merge status for each project. By default, only open or merged pull requests are included, although a count of all related PRs is included as well. To get details for all pull requests, use the `allPulls` option.

  See also 'work detail' for basic static information.

## <span id="_work_submit">`/work/submit`</span>
[^ top](#work)

Submits changes for review and merging.

### Parameters

- `all`: _(opt, boolean)_\
  Saves all projects associated with the unit of work. This option overrides `projects`.
- `answers`: _(opt, string)_\
  A JSON representation of the attestation query results, if any. If not provided, then, where there are controls to be implemented, the process will request the appropriate answers and then bail out, expectin the request to be re-submitted with the answers provided.
- `assignees`: _(opt, multi-value, string)_\
  The pull-request will be assigned to the indicated assignee(s) rather than to the submitter
- `closes`: _(opt, multi-value, string)_\
  When specified, the effective close target is noted to close the issues. The specified issues must already be associated with the unit of work. Refer to the method description and `closeTarget` for information on the effective close target. Issues are specified in the form of &gt;org&lt;/&lt;project&gt;/&lt;issue number&gt;.
  
    The primary project in the unit of work or, where specified, the first project listed explicitly will be noted to close the specified issues.
- `closeTarget`: _(opt, string)_\
  The project which closes the issues associated with the submission. See method description and the`closes` parameter for more on the associated issues.
- `dirtyOK`: _(opt, boolean)_\
  When set, will continue even if the local repository is not clean.
- `noBrowse`: _(opt, boolean)_\
  Supresses default behavior of opening a browser to the newly created pull request.
- `noClosed`: _(opt, boolean)_\
  When set, then no issues are closed in a situation where they would otherwise be closed.
- `noPush`: _(opt, boolean)_\
  Supresses the default behavior of pushing local changes to the working remote. If the local and remote branch are not in sync and `noPush` is true, then an error will be thrown.
- `noQA`: _(opt, boolean)_\
  supresses the default QA tests.
- `projects`: _(opt, multi-value, string)_\
  List of projects to submit. This option is ignored if `all` is specified.
- `projects`: _(opt, multi-value, string)_\
  Limits the project(s) whose changes are submitted to the specified projects. Projects are specified by a standard '&lt;org&gt;/&lt;project&gt;' ID.
- `qualifications`: _(opt, multi-value, string)_\
  Limits the qualifications required to review the changes to the listed qualifications. Qualifications must be a subset of the project qualifications.
- `reviewers`: _(opt, multi-value, string)_\
  Specifies a 

### Description

Submits the changes associated with the current unit of work by creating a pull request for the changes in each project associated with the unit of work. By default, any un-pushed local changes are push to the proper remote. Each PR will reference the associated issues and linked to the primary project's PR for closing when it is merged.

Pushing chanes to the remote can be suppressed with `noPush`.

If you have portions that are complete, you can use the `project` parameter. Only the specified projects will be included in the submission. In that case, the first project specified will be considered the close target unless `closeTarget` is specified, though by default no issues are closed in a partial submit unless `closes` is specified.

By default, the system assigns the pull request to the submitter. This may be overriden with the `assignees` parameter. Where the system is configured to support it, reviewers are assigned programatically by referencing the reviewer 'qualifications'; alternatively, revewiers may be specified by `reviewers` parameter.

When no `projects`, no `closes` and `noClose` are __not__ specified, then the default is to designate the primary project as the `closeTarget` and note all issues as being closed when the close target pull request is merged. If the scope of the submission is limited by project or issue, then `noClose` is the default. In that situation, you can list specific issues closed via the `closes` parameter.

The close target is:
1. the project specified by `closeTarget`,
2. the first project listed explicitly by `projects`, or
3. the first project in the unit of work list of projects which is still active.

## <span id="_work_workkey_resume">`/work/:workKey/resume`</span>
[^ top](#work)

### Parameters

_none_

## <span id="_work_issues_add">`/work/issues/add`</span>
[^ top](#work)

Add issues to the current unit of work.

### Parameters

- `assignee`: _(opt, string)_\
  The assignee (github login ID) to add to the issues. See `noAutoAssign`.
- `comment`: _(opt, string)_\
  The comment to use when claiming an issue. Defaults to: 'Work for this issue has begun on branch &lt;work branch name&gt;.'
- `noAutoAssign`: _(opt, boolean)_\
  Suppresses the default behavior of assigning the issue based on the current user's GitHub authentication.
- `issues`: _(req, multi-value, string, option aware)_\
  References to the issues associated to the work. May be an integer number when assoicated with the first project specified or have the form &lt;org&gt/&lt;project name&gt;-&lt;issue number&gt;.

### Description

Adds one or more issues to the current unit of work.

## <span id="_work_issues_list">`/work/issues/list`</span>
[^ top](#work)

List the current work issues.

### Parameters

- `browseEach`: _(opt, boolean)_\
  Will attempt to open a browser window for each issues in the list.
- `fields`: _(opt, multi-value, string)_\
  An array or comma-separated list of field names.
- `format`: _(opt, string, option aware)_\
  Note, the REST-y way to specify format is via the accept header. However, to conform to user expectations, this parameter will override the accept header. Format may be one of csv, docx, json, markdown, md, pdf, terminal, tsv, or txt and defaults to 'json'.
- `nesting`: _(opt, string, /[0-9][1-9]*/)_\
  Used for text document formats, effectively increases the header levels by the indicated amount. Must be a counting integer (0+). A value of '0' means no change, while a value of '1' would turn titles into first-level section headers, first level section headers into second level headers, etc. This is useful for embedding documents in a larger work. The underlying handler must support this and implementor should delete the option if it is not supported.
- `noHeaders`: _(opt, boolean)_\
  Excludes headers row from flat table outputs if 'false'.
- `output`: _(opt, string)_\
  Specifies the local file path where the output it to be saved. Otherwise, prints to stdout. If used as a flag, then the report will select its own name.
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

Lists the issues associated with the current unit of work.

## <span id="_work_issues_remove">`/work/issues/remove`</span>
[^ top](#work)

Remove issues from the current unit of work.

### Parameters

- `comment`: _(opt, string)_\
  Comment to add to the issues as they are removed. A default comment will be generated if none is provided. Pass an empty string to suppress leaving a comment.
- `noUnassign`: _(opt, boolean)_\
  Setting `noUnassign` to true maintains the issue assignments rather than the default behavior of unassigning the issue.
- `noUnlabel`: _(opt, boolean)_\
  Setting `noUnlabel` to true keeps the 'claim label' on the issue rather than the default behavior of removing it.
- `issues`: _(req, multi-value, string, option aware)_\
  References to the issues associated to the work. May be an integer number when assoicated with the first project specified or have the form &lt;org&gt/&lt;project name&gt;-&lt;issue number&gt;.

### Description

Removes issues from the current unit of work.

## <span id="_work_projects_add">`/work/projects/add`</span>
[^ top](#work)

Add projects to the named unit of work.

### Parameters

- `projects`: _(opt, multi-value, string, option aware)_\
  The project to add to the unit of work. May be specify multiple projects.
- `noDevLink`: _(opt, boolean)_\
  When true, supresses the default behavior of linking the local development packages.

### Description

Adds one or more projects to the named of work. By default, the local development copy of any project which is a dependency of another is linked the dependent project unless `noLink` is specified.

## <span id="_work_projects_list">`/work/projects/list`</span>
[^ top](#work)

List the projects associated with the named unit of work.

### Parameters

- `browseEach`: _(opt, boolean)_\
  Will attempt to open a browser window for each issues in the list.
- `fields`: _(opt, multi-value, string)_\
  An array or comma-separated list of field names.
- `format`: _(opt, string, option aware)_\
  Note, the REST-y way to specify format is via the accept header. However, to conform to user expectations, this parameter will override the accept header. Format may be one of csv, docx, json, markdown, md, pdf, terminal, tsv, or txt and defaults to 'json'.
- `nesting`: _(opt, string, /[0-9][1-9]*/)_\
  Used for text document formats, effectively increases the header levels by the indicated amount. Must be a counting integer (0+). A value of '0' means no change, while a value of '1' would turn titles into first-level section headers, first level section headers into second level headers, etc. This is useful for embedding documents in a larger work. The underlying handler must support this and implementor should delete the option if it is not supported.
- `noHeaders`: _(opt, boolean)_\
  Excludes headers row from flat table outputs if 'false'.
- `output`: _(opt, string)_\
  Specifies the local file path where the output it to be saved. Otherwise, prints to stdout. If used as a flag, then the report will select its own name.
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

List the projects associated with the named unit of work.

## <span id="_work_projects_remove">`/work/projects/remove`</span>
[^ top](#work)

Remove projects from the named unit of work.

### Parameters

- `allowUnclean`: _(opt, boolean)_\
  Will attempt to switch from the working branch to the main branch even if the working branch is not clean.
- `forgetChanges`: _(opt, boolean)_\
  Will forget/drop any changes on the work branch.
- `projects`: _(opt, multi-value, string, option aware)_

### Description

Removes projects from the named unit of work. If the work branch is the current working branch for the repo, then it must be clean (unless `allowUnclean` is specified). If the work branch is present, it must have no un-merged changes (unless `forgetChanges` is specified). If the current repo branch is anything other than the work branch, then it is left in place.

[<- SDLC CLI Documentation](./index.md)
