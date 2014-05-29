'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var AngularGabeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      this.installDependencies();
      var that = this,
        githubRepo = 'https://github.com/garbles/' + that.packageName;

      that.spawnCommand('hub', ['init']).on('exit', function () {
        that.spawnCommand('hub', ['add', '.']).on('exit', function () {
          that.spawnCommand('hub', ['commit', '-m Initialize']).on('exit', function () {
            that.spawnCommand('hub', ['create', that.packageName]).on('exit', function () {
              that.spawnCommand('git', ['push', 'origin', 'head']).on('exit', function () {
                that.spawnCommand('bower', ['register', that.packageName, githubRepo]);
              });
            });
          });
        });
      });
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay('Sup, bruh? Welcome to Gabe\'s amazing AngularJS package generator!'));

    var prompts = [{
      name: 'packageName',
      message: 'What is the name of your package?',
    }, {
      name: 'packageDescription',
      message: 'What is the description of your package?'
    }, {
      name: 'packageKeywords',
      message: 'What are some keywords (separate by commas)?'
    }];

    this.prompt(prompts, function (props) {
      this.packageName = 'angular-' + props.packageName;
      this.namespacedPackageName = 'gs.' + props.packageName;
      this.packageDescription = props.packageDescription;

      var keywords = props.packageKeywords.split(/\s*\,\s*/).concat('angular');
      this.packageKeywords = '["' + keywords.join('\",\"') + '"]';

      done();
    }.bind(this));
  },

  app: function () {
    var mainSrc = 'src/' + this.packageName + '.js',
      testSrc = 'test/' + this.packageName + '_spec.js';

    this.mkdir('src');
    this.mkdir('test');

    this.template('_source.js', mainSrc);
    this.template('_test.js', testSrc);
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_README.md', 'README.md');
  },

  projectfiles: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('jshintrc', '.jshintrc');
    this.copy('karma.conf.js', 'karma.conf.js');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  }
});

module.exports = AngularGabeGenerator;
