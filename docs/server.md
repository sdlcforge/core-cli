# <span id="server">server</span>
[<- SDLC CLI Documentation](./index.md)

## Functions/endpoints

- `/server`:
  - [`api`](#_server_api): server API
  - [`next-commands`](#_server_next_commands): Next commands
  - [`reload`](#_server_reload): Server reload
  - [`stop?`](#_server_stop_): Server stop
  - [`version`](#_server_version): Server version
- `/server/errors`:
  - [`list?`](#_server_errors_list_): List errors
- `/server/errors/:errorKey`:
  - [`detail`](#_server_errors_errorkey_detail): Detail errors
- `/server/plugins`:
  - [`add`](#_server_plugins_add): add server plugins
  - [`list`](#_server_plugins_list): sever endpoint plugins list
- `/server/plugins/:serverPluginName`:
  - [`details`](#_server_plugins_serverpluginname_details): sever endpoint plugins details
  - [`remove`](#_server_plugins_serverpluginname_remove): remove sever endpoint plugins
- `/server/plugins/bundles`:
  - [`add`](#_server_plugins_bundles_add): Bundles add
  - [`list-available`](#_server_plugins_bundles_list_available): Bundles list available
- `/server/plugins/bundles/:pluginBundle`:
  - [`detail`](#_server_plugins_bundles_pluginbundle_detail): Bundles detail
- `/server/plugins/integrations`:
  - [`add`](#_server_plugins_integrations_add): add integrations plugins
  - [`list`](#_server_plugins_integrations_list): intgrations plugins list
- `/server/plugins/integrations/:integrationPluginName`:
  - [`details`](#_server_plugins_integrations_integrationpluginname_details): integrations plugins details
  - [`remove`](#_server_plugins_integrations_integrationpluginname_remove): remove sever endpoint plugins
- `/server/plugins/registries`:
  - [`add`](#_server_plugins_registries_add): Registries add
  - [`list`](#_server_plugins_registries_list): Registries list
  - [`remove`](#_server_plugins_registries_remove): Registries remove

## <span id="_server_api">`/server/api`</span>
[^ top](#server)

Creates a representation of the current API.

### Parameters

_none_

### Description

Creates a representation of the current API based on the core endpoints and currently loaded plugins. The resulting data structure is an array of "handler" entries. Each entry contains the `npmName` of the source package, the `path` (as array of path components), the `routeablePath` actually used to match paths for service, the endpoint HTTP `method`, and `parameters` data.

## <span id="_server_next_commands">`/server/next-commands`</span>
[^ top](#server)

Given a partial or incomplete command string, lists possible "next commands" to complete or follow the given partial.

### Parameters

- `command`: _(opt, string)_\
  The (URL) path so far and optional '--' plus options.

### Description

Given a partial or incomplete command string, lists possible "next commands" to complete or follow the given partial. The provided command string may be blank. This is used primarily to support the built-in shell tab-completion support, allowing the server to generate possible completions dynamically as plugins are loaded and removed.

## <span id="_server_reload">`/server/reload`</span>
[^ top](#server)

Reloads the server settings and plugins from disk.

### Parameters

_none_

### Description

Reloads the server settings and plugins from disk. This is necessary when changes are made to the state/data files outside of the server (e.g., through manual file edits). Generally, changes made through server endpoints should be re-loaded themselves.

## <span id="_server_stop_">`/server/stop?`</span>
[^ top](#server)

Stops or shuts down the server.

### Parameters

_none_

## <span id="_server_version">`/server/version`</span>
[^ top](#server)

Provides version information for the server aand its components.

### Parameters

_none_

## <span id="_server_errors_list_">`/server/errors/list?`</span>
[^ top](#server)

Lists known errors.

### Parameters

- `fields`: _(opt, multi-value, string, option aware)_\
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

The system will retain information on recent errors for a time. This endpoint lists the current known errors. Older error references may not be present.

## <span id="_server_errors_errorkey_detail">`/server/errors/:errorKey/detail`</span>
[^ top](#server)

Provides detailed information on the refenced error.

### Parameters

_none_

### Description

Error reports are stored (temporarily) by the server and this endpoint retrieves details regarding a particular error.

## <span id="_server_plugins_add">`/server/plugins/add`</span>
[^ top](#server)

Installs one or more server plugins.

### Parameters

- `npmNames`: _(opt, multi-value, string, option aware)_\
  The plugins to install, by their NPM package name. Include multiple times to install multiple plugins.

### Description

Installs one or more server plugins.

## <span id="_server_plugins_list">`/server/plugins/list`</span>
[^ top](#server)

Lists the installed sever endpoint plugins.

### Parameters

- `available`: _(opt, boolean)_\
  Lists available plugins from registries rather than installed plugins.
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
- `update`: _(opt, boolean)_\
  Forces an update even if registry data is already cached.
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

Lists the installed sever endpoint plugins.

## <span id="_server_plugins_serverpluginname_details">`/server/plugins/:serverPluginName/details`</span>
[^ top](#server)

Provides details on the named plugin.

### Parameters

_none_

### Description

Provides details on the named plugin.

## <span id="_server_plugins_serverpluginname_remove">`/server/plugins/:serverPluginName/remove`</span>
[^ top](#server)

Removes the named plugin.

### Parameters

_none_

### Description

Removes the named plugin.

## <span id="_server_plugins_bundles_add">`/server/plugins/bundles/add`</span>
[^ top](#server)

Adds a bundle of plugins to the server.

### Parameters

- `bundles`: _(opt, multi-value, string)_\
  The name of the bundle to install.

### Description

Adds a bundle of plugins to the server. Bundles are predefined sets of plugins which cover a set of related functions and together create a cohesive application or set of features.

## <span id="_server_plugins_bundles_list_available">`/server/plugins/bundles/list-available`</span>
[^ top](#server)

List available bundles.

### Parameters

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
- `update`: _(opt, boolean)_\
  If true, will update registry data even if cached.
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

List bundles defined by the registered registries.

## <span id="_server_plugins_bundles_pluginbundle_detail">`/server/plugins/bundles/:pluginBundle/detail`</span>
[^ top](#server)

Provides detail information on a bundle of plugins.

### Parameters

_none_

### Description

Provides detail information on a bundle of plugins, including listing all the constituent plugins in the bundle.

## <span id="_server_plugins_integrations_add">`/server/plugins/integrations/add`</span>
[^ top](#server)

Installs one or more integrations plugins.

### Parameters

- `npmNames`: _(opt, multi-value, string, option aware)_\
  The plugins to install, by their NPM package name. Include multiple times to install multiple plugins.

### Description

Installs one or more integrations plugins.

## <span id="_server_plugins_integrations_list">`/server/plugins/integrations/list`</span>
[^ top](#server)

Lists the installed intgrations plugins.

### Parameters

- `available`: _(opt, boolean)_\
  Lists available plugins from registries rather than installed plugins.
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
- `update`: _(opt, boolean)_\
  Forces an update even if registry data is already cached.
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

Lists the installed intgrations plugins.

## <span id="_server_plugins_integrations_integrationpluginname_details">`/server/plugins/integrations/:integrationPluginName/details`</span>
[^ top](#server)

Provides details on the named plugin.

### Parameters

_none_

### Description

Provides details on the named plugin.

## <span id="_server_plugins_integrations_integrationpluginname_remove">`/server/plugins/integrations/:integrationPluginName/remove`</span>
[^ top](#server)

Removes the named plugin.

### Parameters

_none_

### Description

Removes the named plugin.

## <span id="_server_plugins_registries_add">`/server/plugins/registries/add`</span>
[^ top](#server)

Adds a reistry to the list of plugin registries.

### Parameters

- `urls`: _(req, multi-value, string)_\
  The URL of a registry to add. May specify multiple times to add multiple registries.

### Description

Adds a reistry to the list of plugin registries.

## <span id="_server_plugins_registries_list">`/server/plugins/registries/list`</span>
[^ top](#server)

Lists the configured registries.

### Parameters

- `fields`: _(opt, multi-value, string, option aware)_\
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

Lists the configured registries.

## <span id="_server_plugins_registries_remove">`/server/plugins/registries/remove`</span>
[^ top](#server)

Removes a reistry from the list of plugin registries.

### Parameters

- `registryURLs`: _(req, multi-value, string, option aware)_\
  The URL of a registry to add. May specify multiple times to add multiple registries.

### Description

Removes a reistry from the list of plugin registries.

[<- SDLC CLI Documentation](./index.md)
