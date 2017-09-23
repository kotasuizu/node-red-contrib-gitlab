/**
 * Copyright (c) 2017 Kota Suizu
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 **/

module.exports = function(RED) {
  "use strict";
  var gitlab = require('node-gitlab');

  // APIKey情報を保持するConfig
  function gitlabConfig(n) {
    RED.nodes.createNode(this, n);
    this.key = n.key;
    this.url = n.url;
    var credentials = this.credentials;
    if ((credentials) && (credentials.hasOwnProperty("key"))) {
      this.key = credentials.key;
    }
  }
  RED.nodes.registerType("gitlab-config", gitlabConfig, {
    credentials: {
      key: {
        type: "password"
      }
    }
  });

  // GitLab-Talk NodeIO処理
  function GitLabIssuesList(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
    this.projectid = n.projectid;

    var node = this;
    this.on('input', function(msg) {

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });


      client.issues.list({
        id: node.projectid
      }, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-Issues-List", GitLabIssuesList);

  function _isTypeOf(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  }
}
