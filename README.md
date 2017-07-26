[![Build Status](https://travis-ci.org/tecbeast42/vue-guard-component.svg?branch=master)](https://travis-ci.org/tecbeast42/vue-guard-component)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/vue-guard-component.svg)](https://www.npmjs.com/package/vue-guard-component)
[![npm](https://img.shields.io/npm/dt/vue-guard-component.svg)](https://www.npmjs.com/package/vue-guard-component)

# Vue-guard-component

Vue-guard-component is a vue component built with webpack. It guards access to child components inside by making an ajax call to an api route to determine if the component inside (child) should be displayed.

If you want to include the uncompiled component instead of a compiled webpack js file you can require/import the file at `vue-guard-component/src/js/vue-guard-component.js`.

To use the component, Vue-resource or Axios needs to be used and Vue.prototype.$http and Vue.http should be set.

## Installation

```
npm install --save vue-guard-component
yarn add vue-guard-component
```

## Usage

### Initialize Vue-guard-component

```
import guard from 'vue-guard-component';

Vue.component('guard', guard);
```

To change default config (path, property):
```
import { guardConfig } from 'vue-guard-component';

guardConfig.path = '/other/ajax/path';
guardConfig.property = 'slug';
```

The default values are:
```
path: '/api/v1/route/access',
property: 'id',
```

## Properties

### resource

   The resource that will be sent to the backend to check for access (could be eg. a frontend-route in vue-router)
  * type: String
  * required: true

### url

   Url for the ajax call, will override the default specified in guardConfig
  * type: String
  * required: false

### property

   If the resource needs to match to something (like a model in laravel), then this is the property that it will be matched against, e.g. id or slug.
  * type: String
  * required: false,
  * default: 'id' (from guardConfig)

### value

   The value of the property to match against.
  * required: false

## Use the Component

```
<guard resource="restricted-component">
    <other-component-that-is-restricted></other-component-that-is-restricted>
</guard>

<guard resource="show-model" property="id" value="1">
    <model-component></model-component>
</guard>

<guard resource="restricted-component" v-on:guard-accepted="accepted()" v-on:guard-denied="denied()">
    <other-component-that-is-restricted></other-component-that-is-restricted>
</guard>

<guard resource="other-type" url="/api/route/to/other/access">
    <some-other-restricted-component></some-other-restricted-component>
</guard>

<guard resource="other-type">
    <restricted-component></restricted-component>
    <non-restricted-component slot="noAccess"></non-restricted-component>
</guard>
```

The component will emit events to the parent. "guard-accepted" when the ajax call gets "true" as response and "guard-denied" when it gets "false" as a response. To listen to them you use v-on in the template (like above). If there was an error or exception thrown, then "guard-error" will be emitted.

Only the first slot will be rendered. If you want something to be rendered when no access is granted, you can add slot="noAccess" to a component (see example).

## SPA / Laravel-frontend-rights

This component was designed for use in a SPA and with the backend package [laravel-frontend-rights](https://github.com/tecbeast42/laravel-frontend-rights) in mind. It can ofcourse be used for other purposes as well.
The resource would be the frontend route in vue-router.
