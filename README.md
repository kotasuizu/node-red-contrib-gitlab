# node-red-contrib-gitlab

Node-RED node using GitLab APIs.
This is a wrapper around [node-gitlab](https://www.npmjs.com/package/node-gitlab). Check it out for more info.

## How to Install

To install Node, please refer to the following site.

https://nodered.org/docs/getting-started/adding-nodes  
(Japanese) https://nodered.jp/docs/getting-started/adding-nodes  

## Available functions(APIs)

The following functions(APIs) can be used:  

### Project Issues
* List issues : Get a list of project issues.
* Create issue : Creates a new project issue.
* Update issue : Updates an existing project issue. This function is also used to mark an issue as closed.
* List notes of an issue : Gets a list of all notes for a single issue.
* Create note of an issue : Creates a new note to a single project issue.
* Update note of an issue : Modify existing note of an issue.

### Repository Files
* Get File : Get file from repository. Allows you to receive information about file in repository like name, size, content. Note that file content is Base64 encoded.

## Copyright and license

Copyright (c) 2017 Kota Suizu  
Released under the MIT license  
http://opensource.org/licenses/mit-license.php
