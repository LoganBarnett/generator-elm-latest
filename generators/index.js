'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend(
  { greet: function() {
    this.log(yosay('Elm-Latest generator'));
  }
  , addOptions: function() {
    this.option('name',
      { desc: 'The project name'
      , type: String
      , required: true}
    );
  }
  , writing:
    { app: function() {
      var copyFiles =
        [ 'gulpfile.js'
        , 'package.json'
      ];
      var self = this;
      copyFiles.forEach(function(file) {
        var from = self.templatePath(file);
        var to = self.destinationPath(file);
        self.fs.copyTpl(from, to);
      });

      this.directory('app', '.');
    }
  }
  , prompting: function() {
    var done = this.async();
    this.prompt(
      [ { type    : 'input'
        , name    : 'name'
        , message : 'Your project name'
        , default : this.appname // Default to current folder name
      }
    ], function (answers) {
      this.log(answers.name);
      done();
    }.bind(this));
  }
  , install: function() {
    var nodeDevDependencies =
      [ 'browser-sync'
      , 'gulp'
      , 'gulp-elm'
      , 'gulp-newer'
    ];
    this.log('Installing Node modules');
    this.npmInstall(nodeDevDependencies, { saveDev: true });

    var elmPackages =
      [ 'elm-lang/core'
      , 'evancz/elm-effects'
      , 'evancz/elm-html'
      , 'evancz/elm-http'
      , 'evancz/elm-svg'
      , 'evancz/start-app'
    ];

    this.log('Installing Elm packages');

    var self = this;
    elmPackages.forEach(function(elmPackage) {
      self.spawnCommandSync('elm-package', ['install', '--yes', elmPackage]);
    });
  }
});
