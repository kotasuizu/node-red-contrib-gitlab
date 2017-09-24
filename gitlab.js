/**
 * Copyright (c) 2017 Kota Suizu
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 **/



module.exports = function(RED) {
  "use strict";
  var gitlab = require('node-gitlab');

  /**
   * GitLab API Config
   **/
  function gitlabConfig(n) {
    RED.nodes.createNode(this, n);
    this.key = n.key;
    this.url = n.url;
    this.project_id = n.project_id;
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



  /**
   * GitLab API Issues List
   **/
  function GitLabListIssues(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
    this.state = n.state;
    this.labels = n.labels;
    this.milestone = n.milestone;
    this.order_by = n.order_by;
    this.sort = n.sort;

    var node = this;
    this.on('input', function(msg) {

      // Update if MSG has a value
      var project_id = node.gitlabConfig.project_id;
      if (_isTypeOf('Number', msg.payload.project_id)) {
        project_id = msg.payload.project_id;
      }
      if (_isTypeOf('String', msg.payload.state)) {
        node.state = msg.payload.state;
      }
      if (_isTypeOf('String', msg.payload.labels)) {
        node.labels = msg.payload.labels;
      }
      if (_isTypeOf('String', msg.payload.milestone)) {
        node.milestone = msg.payload.milestone;
      }
      if (_isTypeOf('String', msg.payload.order_by)) {
        node.order_by = msg.payload.order_by;
      }
      if (_isTypeOf('String', msg.payload.sort)) {
        node.sort = msg.payload.sort;
      }

      var iid;
      if (_isTypeOf('Number', msg.payload.iid)) {
        iid = msg.payload.iid;
      }

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });
      client.issues.list({
        id: project_id,
        iid: iid,
        state: node.state,
        labels: node.labels,
        milestone: node.milestone,
        order_by: node.order_by,
        sort: node.sort
      }, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          console.log(error);
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-List-Issues", GitLabListIssues);


  /**
   * GitLab API Create Issue
   **/
  function GitLabCreateIssue(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);

    var node = this;
    this.on('input', function(msg) {

      // Update if MSG has a value
      var project_id = node.gitlabConfig.project_id;
      if (_isTypeOf('Number', msg.payload.project_id)) {
        project_id = msg.payload.project_id;
      }

      var title;
      if (_isTypeOf('String', msg.payload.title)) {
        title = msg.payload.title;
      }
      var description;
      if (_isTypeOf('String', msg.payload.description)) {
        description = msg.payload.description;
      }
      var assignee_id;
      if (_isTypeOf('Number', msg.payload.assignee_id)) {
        assignee_id = msg.payload.assignee_id;
      }
      var milestone_id;
      if (_isTypeOf('Number', msg.payload.milestone_id)) {
        milestone_id = msg.payload.milestone_id;
      }
      var labels;
      if (_isTypeOf('String', msg.payload.labels)) {
        labels = msg.payload.labels;
      }

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });
      client.issues.create({
        id: project_id,
        title: title,
        description: description,
        assignee_id: assignee_id,
        milestone_id: milestone_id,
        labels: labels
      }, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          console.log(error);
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-Create-Issue", GitLabCreateIssue);



  /**
   * GitLab API Update Issue
   **/
  function GitLabUpdateIssue(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);

    var node = this;
    this.on('input', function(msg) {

      // Update Params
      var param = {};

      // Update if MSG has a value
      var project_id = node.gitlabConfig.project_id;
      if (_isTypeOf('Number', msg.payload.project_id)) {
        project_id = msg.payload.project_id;
      }
      if (_isTypeOf('Number', project_id)) {
        param.id = project_id;
      }

      var issue_id;
      if (_isTypeOf('Number', msg.payload.issue_id)) {
        issue_id = msg.payload.issue_id;
        param.issue_id = issue_id;
      }
      var title;
      if (_isTypeOf('String', msg.payload.title)) {
        title = msg.payload.title;
        param.title = title;
      }
      var description;
      if (_isTypeOf('String', msg.payload.description)) {
        description = msg.payload.description;
        param.description = description;
      }
      var assignee_id;
      if (_isTypeOf('Number', msg.payload.assignee_id)) {
        assignee_id = msg.payload.assignee_id;
        param.assignee_id = assignee_id;
      }
      var milestone_id;
      if (_isTypeOf('Number', msg.payload.milestone_id)) {
        milestone_id = msg.payload.milestone_id;
        param.milestone_id = milestone_id;
      }
      var labels;
      if (_isTypeOf('String', msg.payload.labels)) {
        labels = msg.payload.labels;
        param.labels = labels;
      }
      var state_event;
      if (_isTypeOf('String', msg.payload.state_event)) {
        state_event = msg.payload.state_event;
        param.state_event = state_event;
      }

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });
      client.issues.update(param, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          console.log(error);
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-Update-Issue", GitLabUpdateIssue);



  /**
   * GitLab API List Notes
   **/
  function GitLabListNotes(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);

    var node = this;
    this.on('input', function(msg) {

      // Update if MSG has a value
      var project_id = node.gitlabConfig.project_id;
      if (_isTypeOf('Number', msg.payload.project_id)) {
        project_id = msg.payload.project_id;
      }

      var issue_id;
      if (_isTypeOf('Number', msg.payload.issue_id)) {
        issue_id = msg.payload.issue_id;
      }

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });
      client.issues.listNotes({
        id: project_id,
        issue_id: issue_id
      }, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          console.log(error);
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-List-Notes", GitLabListNotes);


  /**
   * GitLab API Create Notes
   **/
  function GitLabCreateNote(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);

    var node = this;
    this.on('input', function(msg) {

      // Update if MSG has a value
      var project_id = node.gitlabConfig.project_id;
      if (_isTypeOf('Number', msg.payload.project_id)) {
        project_id = msg.payload.project_id;
      }

      var issue_id;
      if (_isTypeOf('Number', msg.payload.issue_id)) {
        issue_id = msg.payload.issue_id;
      }
      var body;
      if (_isTypeOf('String', msg.payload.body)) {
        body = msg.payload.body;
      }

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });
      client.issues.createNote({
        id: project_id,
        issue_id: issue_id,
        body: body
      }, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          console.log(error);
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-Create-Note", GitLabCreateNote);



  /**
   * GitLab API Create Notes
   **/
  function GitLabUpdateNote(n) {
    RED.nodes.createNode(this, n);

    this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);

    var node = this;
    this.on('input', function(msg) {

      // Update if MSG has a value
      var project_id = node.gitlabConfig.project_id;
      if (_isTypeOf('Number', msg.payload.project_id)) {
        project_id = msg.payload.project_id;
      }

      var issue_id;
      if (_isTypeOf('Number', msg.payload.issue_id)) {
        issue_id = msg.payload.issue_id;
      }
      var note_id;
      if (_isTypeOf('Number', msg.payload.note_id)) {
        note_id = msg.payload.note_id;
      }
      var body;
      if (_isTypeOf('String', msg.payload.body)) {
        body = msg.payload.body;
      }

      var client = gitlab.create({
        api: node.gitlabConfig.url,
        privateToken: node.gitlabConfig.key
      });
      client.issues.updateNote({
        id: project_id,
        issue_id: issue_id,
        note_id: note_id,
        body: body
      }, function(error, body) {
        if (!error) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          console.log(error);
          node.error("Failed to API Call. " + error);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-Update-Note", GitLabUpdateNote);



  /**
   * Object type comparison
   *    String
   *    Number
   *    Boolean
   *    Date
   *    Error
   *    Array
   *    Function
   *    RegExp
   *    Object
   **/
  function _isTypeOf(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  }
}
