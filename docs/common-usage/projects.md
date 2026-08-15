# SDLC CLI Common Usage : Projects

The CLI can be used to quickly set up hardened projects according to the organization policy.

## Creating a project

```bash
sdlc projects create -- newProjectName=@your-org/the-project-name
```

Refer to [`/projects/create` in the user reference](../projects.md#_projects_create) for additional information.

## Publish a project

From the project local [playground](../concepts.md#playground) checkout, type:
```bash
sdlc projects releases publish
```

Refer to [`/projects/releases/publish` in the user reference](../projects.md#_projects_releases_publish) for additional information.

## Renaming a project

From the project local [playground](../concepts.md#playground) checkout, type:
```bash
sdlc projects rename -- newName=@your-org/the-new-name
```

Refer to [`/projects/rename` in the user reference](../projects.md#_projects_rename) for additional information.