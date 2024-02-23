## icCube Dashboards Plugin (React/Material-UI/Typescript)

A working example of an icCube Dashboards plugin creating custom widgets using React/Material-UI/Typescript.

This plugin is creating the following widgets:

**KPI card**

An Material-UI box displaying a KPI value.

**Google Map**

A Google Map widget with markers.

**Open Layer**

An Open Layer widget.

**TransfRendererCustom**

A **transformation** that defines a react based cell renderer to be used in the Table - and PivoTable widgets.

### Overview

The plugin is a webpack federated module that is loaded at runtime by icCube Dashboards server. Please take care of the
setup of the `ModuleFederationPlugin` in the [webpack.common.js](./webpack.common.js) file.

### Getting Started

Clone that Git repository that is proposing a common Javascript/Typescript project using Webpack.

Use `npm` to install the dependencies:

    npm install

The `package.json` file is containing common scripts:

    start   : start a Webpack dev. server listening @4001 
    build   : build the plugin into the /dist directory
    zip     : zip the /dist directory to deploy into an icCube server
    clean   : delete /dist /kit directories.

A JetBrains IntelliJ project is available for a quick start.

### MyPluginReact Renaming

This example is creating a plugin named `MyPluginReact`. Before starting hacking the code we advise searching and
replacing the string `MyPluginReact` by the actual name you'd like to give to your plugin.

Keep that name simple (i.e., ASCII letter without any space, separator, etc...) as it will be used as a folder name
(once deployed into an icCube server), Webpack module name, localization id, etc... That name must be unique across all
the plugins loaded into an icCube server.

### Project skeleton

This is the folder structure of a reporting plugin. Using this structure, you can combine parts of the other example plugins.

```
ic3-demo-plugin-react
 |- bin                 : scripts for building
 |- dist                : build result
 |- node_modules        : npm packages
 |- public              : 
 `- src                 : code sources
   |- @types            : TS types
   |- images            : images from widgets / logos for themes
   |- theme             : theme definition files
   |- transformations   : transformation definition files
   `- widget            : widget definition files
```

### Develop

This example starts and shares the module `MyPluginReact` @ `localhost:4001` (see `webpack.dev.js` file).

Refer to this [page](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/Develop.md)
that is explaining how to develop the plugin.

### Build/Deploy

Refer to this [page](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/Deploy.md)
that is explaining how to deploy the plugin.

### Documentation

See this [page](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/Overview.md)
for a detailed documentation of the dev. kit.

_
