# <span id="orgs">orgs</span>
[<- SDLC CLI Documentation](./index.md)

## Functions/endpoints

- `/orgs`:
  - [`list?`](#_orgs_list_)
- `/orgs/:orgKey/controls`:
  - [`list`](#_orgs_orgkey_controls_list): orgs controls list
- `/orgs/:orgKey/parameters`:
  - [`list?`](#_orgs_orgkey_parameters_list_)
- `/orgs/:orgKey/parameters/:parameterKey`:
  - [`detail`](#_orgs_orgkey_parameters_parameterkey_detail)
  - [`set`](#_orgs_orgkey_parameters_parameterkey_set)
- `/orgs/controls`:
  - [`list`](#_orgs_controls_list): orgs controls list
- `/orgs/create`:
  - [`:newOrgKey`](#_orgs_create_neworgkey): Organization create

## <span id="_orgs_list_">`/orgs/list?`</span>
[^ top](#orgs)

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

## <span id="_orgs_orgkey_controls_list">`/orgs/:orgKey/controls/list`</span>
[^ top](#orgs)

Lists controls for the named organization.

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
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

Lists the controls loaded into the named organization.

## <span id="_orgs_orgkey_parameters_list_">`/orgs/:orgKey/parameters/list?`</span>
[^ top](#orgs)

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

## <span id="_orgs_orgkey_parameters_parameterkey_detail">`/orgs/:orgKey/parameters/:parameterKey/detail`</span>
[^ top](#orgs)

### Parameters

_none_

## <span id="_orgs_orgkey_parameters_parameterkey_set">`/orgs/:orgKey/parameters/:parameterKey/set`</span>
[^ top](#orgs)

### Parameters

- `asBoolean`: _(opt, boolean)_\
  When set `true`, the `value` parameter value is interpretted as a boolean value. Ignoring case, the strings 'true', 'yes', and any string of digits other than '0' are treated as true; 'false', 'no', and '0' are treated as false. All other inputs will raise a 400 BAD REQUEST status. See `asInteger`, `asJSON`, and `asNumber`.
- `asInteger`: _(opt, boolean)_\
  When set `true`, the `value` parameter value is interpretted as an integer. See also `asBoolean`, `asJSON`, and `asNumber`.
- `asJSON`: _(opt, boolean)_\
  When set `true`, the `value` parameter value is interpretted as a JSON string. See also `asBoolean`, `asInteger`, asNumber`, and `asJSON`.
- `asNumber`: _(opt, boolean)_\
  When set `true`, the `value` parameter value is interpretted as a number. See also `asBoolean`, `asInteger`, and `asJSON`.
- `setNull`: _(opt, boolean)_\
  If true, then the parameter will be set to literal `null`. `value` and all other value transform settings will be ignored except `setUndefined` which takes precedence.
- `setUndefined`: _(opt, boolean)_\
  If true, then the parameter will be set to literal `undefined`. `setUndefined` take precedence over all other value setting flags;`value` and all other value transform settings will be ignored.
- `value`: _(opt, string)_\
  The value to set the parameter to. This parameter is required unless `setNull` or `setUndefined` are present and true. By default, this will be treated as a string. Use the `asBoolean`, `asInteger`, asNumber`, and `asJSON` flags to change the interpretation of the value string.

## <span id="_orgs_controls_list">`/orgs/controls/list`</span>
[^ top](#orgs)

Lists controls for the named organization.

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
- `writeFileLocally`: _(opt, boolean)_\
  If true, then will write 'output' using 'fs' rather than sending as a result in the response.

### Description

Lists the controls loaded into the named organization.

## <span id="_orgs_create_neworgkey">`/orgs/create/:newOrgKey`</span>
[^ top](#orgs)

Creates a organization new organization locally.

### Parameters

- `commonName`: _(req, string)_\
  The common name by which the organization is referred to in casual speech.
- `legalName`: _(opt, string)_\
  The organizations legal name, if any.
- `localDataRoot`: _(req, string)_\
  The local directory in which to save `./orgs/org.json` for the newly created organization.

### Description

Creates a new, empty organization. An organization may or may tied to a legal entity, a club, department, etc. Organizations have an organization structure based on roles, staff associated to roles, projects, contracts, relationships with third-party vendors, etc.

    The root data element (<code>org.json<rst>) is saved to <code>localDataRoot<rst> with sub-components saved in federated-json. It is expected (though not currently verified) that <code>localDataRoot<rst> is located in a git repository.

[<- SDLC CLI Documentation](./index.md)
