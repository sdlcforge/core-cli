# <span id="help">help</span>
[<- SDLC CLI Documentation](./index.md)

## Functions/endpoints

  - [`help`](#_help)

## <span id="_help">`/help`</span>
[^ top](#help)

### Parameters

- `summaryOnly`: _(opt, boolean)_\
  Displays the endpoint name, path, and summary only. Use this option for prose output and the `fields` parameter to achive a similar effect for data output.
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

[<- SDLC CLI Documentation](./index.md)
