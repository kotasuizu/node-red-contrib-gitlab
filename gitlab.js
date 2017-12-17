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


// === Issues =================================================================
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
      var project_id = Number(node.gitlabConfig.project_id);
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
          var myErr = {
            "inputMessage" : msg,
            "error" : error
          };
          console.log(myErr);
          node.error("Failed to API Call. " + error, myErr);
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
      var project_id = Number(node.gitlabConfig.project_id);
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
          var myErr = {
            "inputMessage" : msg,
            "error" : error
          };
          console.log(myErr);
          node.error("Failed to API Call. " + error, myErr);
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
      var project_id = Number(node.gitlabConfig.project_id);
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
          var myErr = {
            "inputMessage" : msg,
            "error" : error
          };
          console.log(myErr);
          node.error("Failed to API Call. " + error, myErr);
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
      var project_id = Number(node.gitlabConfig.project_id);
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
          var myErr = {
            "inputMessage" : msg,
            "error" : error
          };
          console.log(myErr);
          node.error("Failed to API Call. " + error, myErr);
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
      var project_id = Number(node.gitlabConfig.project_id);
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
          var myErr = {
            "inputMessage" : msg,
            "error" : error
          };
          console.log(myErr);
          node.error("Failed to API Call. " + error, myErr);
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
      var project_id = Number(node.gitlabConfig.project_id);
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
          var myErr = {
            "inputMessage" : msg,
            "error" : error
          };
          console.log(myErr);
          node.error("Failed to API Call. " + error, myErr);
        }
      });

    });
  }
  RED.nodes.registerType("GitLab-Update-Note", GitLabUpdateNote);



// === RepositoryFiles ========================================================
/**
 * GitLab Get RepositoryFile
 **/
function GitLabGetRepositoryFile(n) {
  RED.nodes.createNode(this, n);

  this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
  this.ref = n.ref;

  var node = this;
  this.on('input', function(msg) {

    // Update if MSG has a value
    var project_id = Number(node.gitlabConfig.project_id);
    if (_isTypeOf('Number', msg.payload.project_id)) {
      project_id = msg.payload.project_id;
    }
    var ref = node.ref;
    if (_isTypeOf('String', msg.payload.ref)) {
      ref = msg.payload.ref;
    }

    var file_path;
    if (_isTypeOf('String', msg.payload.file_path)) {
      file_path = msg.payload.file_path;
    }

    var client = gitlab.create({
      api: node.gitlabConfig.url,
      privateToken: node.gitlabConfig.key
    });
    client.repositoryFiles.get({
      id: project_id,
      ref: ref,
      file_path: file_path
    }, function(error, body) {
      if (!error) {
        msg.payload = body;
        node.send(msg);
        node.log(RED._('Succeeded to API Call.'));
      } else {
        var myErr = {
          "inputMessage" : msg,
          "error" : error
        };
        console.log(myErr);
        node.error("Failed to API Call. " + error, myErr);
      }
    });

  });
}
RED.nodes.registerType("GitLab-Get-RepositoryFile", GitLabGetRepositoryFile);



/**
 * GitLab Create RepositoryFile
 **/
function GitLabCreateRepositoryFile(n) {
  RED.nodes.createNode(this, n);

  this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
  this.branch_name = n.branch_name;
  this.encoding = n.encoding;

  var node = this;
  this.on('input', function(msg) {


    var param = {};

    // Update if MSG has a value
    var project_id = Number(node.gitlabConfig.project_id);
    if (_isTypeOf('Number', msg.payload.project_id)) {
      project_id = msg.payload.project_id;
    }
    if (_isTypeOf('Number', project_id)) {
      param.id = project_id;
    }
    var branch_name = node.branch_name;
    if (_isTypeOf('String', msg.payload.branch_name)) {
      branch_name = msg.payload.branch_name;
    }
    if (_isTypeOf('String', branch_name)) {
      param.branch_name = branch_name;
    }
    var encoding = node.encoding;
    if (_isTypeOf('String', msg.payload.encoding)) {
      encoding = msg.payload.encoding;
    }
    if (_isTypeOf('String', encoding)) {
      if (encoding === "base64") {
        param.encoding = encoding;
      }
    }

    var file_path;
    if (_isTypeOf('String', msg.payload.file_path)) {
      file_path = msg.payload.file_path;
      param.file_path = file_path;
    }
    var content;
    if (_isTypeOf('String', msg.payload.content)) {
      content = msg.payload.content;
      param.content = content;
    }
    var commit_message;
    if (_isTypeOf('String', msg.payload.commit_message)) {
      commit_message = msg.payload.commit_message;
      param.commit_message = commit_message;
    }

    var client = gitlab.create({
      api: node.gitlabConfig.url,
      privateToken: node.gitlabConfig.key
    });
    client.repositoryFiles.create(param, function(error, body) {
      if (!error) {
        msg.payload = body;
        node.send(msg);
        node.log(RED._('Succeeded to API Call.'));
      } else {
        var myErr = {
          "inputMessage" : msg,
          "error" : error
        };
        console.log(myErr);
        node.error("Failed to API Call. " + error, myErr);
      }
    });

  });
}
RED.nodes.registerType("GitLab-Create-RepositoryFile", GitLabCreateRepositoryFile);



/**
 * GitLab Update RepositoryFile
 **/
function GitLabUpdateRepositoryFile(n) {
  RED.nodes.createNode(this, n);

  this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
  this.branch_name = n.branch_name;
  this.encoding = n.encoding;

  var node = this;
  this.on('input', function(msg) {


    var param = {};

    // Update if MSG has a value
    var project_id = Number(node.gitlabConfig.project_id);
    if (_isTypeOf('Number', msg.payload.project_id)) {
      project_id = msg.payload.project_id;
    }
    if (_isTypeOf('Number', project_id)) {
      param.id = project_id;
    }
    var branch_name = node.branch_name;
    if (_isTypeOf('String', msg.payload.branch_name)) {
      branch_name = msg.payload.branch_name;
    }
    if (_isTypeOf('String', branch_name)) {
      param.branch_name = branch_name;
    }
    var encoding = node.encoding;
    if (_isTypeOf('String', msg.payload.encoding)) {
      encoding = msg.payload.encoding;
    }
    if (_isTypeOf('String', encoding)) {
      if (encoding === "base64") {
        param.encoding = encoding;
      }
    }

    var file_path;
    if (_isTypeOf('String', msg.payload.file_path)) {
      file_path = msg.payload.file_path;
      param.file_path = file_path;
    }
    var content;
    if (_isTypeOf('String', msg.payload.content)) {
      content = msg.payload.content;
      param.content = content;
    }
    var commit_message;
    if (_isTypeOf('String', msg.payload.commit_message)) {
      commit_message = msg.payload.commit_message;
      param.commit_message = commit_message;
    }

    var client = gitlab.create({
      api: node.gitlabConfig.url,
      privateToken: node.gitlabConfig.key
    });
    client.repositoryFiles.update(param, function(error, body) {
      if (!error) {
        msg.payload = body;
        node.send(msg);
        node.log(RED._('Succeeded to API Call.'));
      } else {
        var myErr = {
          "inputMessage" : msg,
          "error" : error
        };
        console.log(myErr);
        node.error("Failed to API Call. " + error, myErr);
      }
    });

  });
}
RED.nodes.registerType("GitLab-Update-RepositoryFile", GitLabUpdateRepositoryFile);



/**
 * GitLab Remove RepositoryFile
 **/
function GitLabRemoveRepositoryFile(n) {
  RED.nodes.createNode(this, n);

  this.gitlabConfig = RED.nodes.getNode(n.gitlabconfig);
  this.branch_name = n.branch_name;

  var node = this;
  this.on('input', function(msg) {


    var param = {};

    // Update if MSG has a value
    var project_id = Number(node.gitlabConfig.project_id);
    if (_isTypeOf('Number', msg.payload.project_id)) {
      project_id = msg.payload.project_id;
    }
    if (_isTypeOf('Number', project_id)) {
      param.id = project_id;
    }
    var branch_name = node.branch_name;
    if (_isTypeOf('String', msg.payload.branch_name)) {
      branch_name = msg.payload.branch_name;
    }
    if (_isTypeOf('String', branch_name)) {
      param.branch_name = branch_name;
    }

    var file_path;
    if (_isTypeOf('String', msg.payload.file_path)) {
      file_path = msg.payload.file_path;
      param.file_path = file_path;
    }
    var commit_message;
    if (_isTypeOf('String', msg.payload.commit_message)) {
      commit_message = msg.payload.commit_message;
      param.commit_message = commit_message;
    }

    var client = gitlab.create({
      api: node.gitlabConfig.url,
      privateToken: node.gitlabConfig.key
    });
    client.repositoryFiles.remove(param, function(error, body) {
      if (!error) {
        msg.payload = body;
        node.send(msg);
        node.log(RED._('Succeeded to API Call.'));
      } else {
        var myErr = {
          "inputMessage" : msg,
          "error" : error
        };
        console.log(myErr);
        node.error("Failed to API Call. " + error, myErr);
      }
    });

  });
}
RED.nodes.registerType("GitLab-Remove-RepositoryFile", GitLabRemoveRepositoryFile);


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
