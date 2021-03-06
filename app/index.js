'use strict';
var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  yosay = require('yosay');

var AngularGabeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      this.installDependencies();
      this.shell.exec('git init');

      var commands = [],

        add = 'git add .',
        commit = 'git commit -m "Initialize"',
        push = 'git push origin head',
        bower = 'bower register ' + this.packageName + ' https://github.com/garbles/' + this.packageName,

      installBowerPackages = function (dependency) {
        this.shell.exec('bower install '+ dependency +' --save');
      }.bind(this);

      this.bowerDependencies.forEach(installBowerPackages);

      if (this.githubRepo) {
        commands = commands.concat([add, commit, push]);

        if (this.bowerRepo) {
          commands.push(bower);
        }

        this.spawnCommand('hub', ['create', this.packageName, '-d', this.packageDescription]).on('exit', function () {
          this.shell.exec(commands.join(' && '));
        }.bind(this));
      }
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
    }, {
      name: 'bowerDependencies',
      message: 'What bower packages would you like to depend on? (seperate by commas)?'
    }, {
      type: 'confirm',
      name: 'githubRepo',
      message: 'Should we automatically create a new github repo?',
      default: true
    }, {
      when: function (response) {
        return response.githubRepo;
      },
      type: 'confirm',
      name: 'bowerRepo',
      message: 'Should we automatically create a bower repo?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.packageName = 'angular-gs-' + props.packageName;
      this.namespacedPackageName = 'gs.' + props.packageName;
      this.packageDescription = props.packageDescription;
      this.bowerDependencies = props.bowerDependencies.split(/\s*\,\s*/);

      var keywords = props.packageKeywords.split(/\s*\,\s*/).concat('angular');
      this.packageKeywords = '["' + keywords.join('\",\"') + '"]';

      this.githubRepo = props.githubRepo;
      this.bowerRepo = props.bowerRepo;

      this.currentYear = (new Date()).getFullYear();

      done();
    }.bind(this));
  },

  app: function () {
    var mainSrc = 'src/' + this.packageName + '.js',
      testSrc = 'test/' + this.packageName + '.spec.js';

    this.mkdir('src');
    this.mkdir('test');

    this.template('_source.js', mainSrc);
    this.template('_test.js', testSrc);
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_README.md', 'README.md');
    this.template('_LICENSE', 'LICENSE');
    this.template('_travis.yml', '.travis.yml');
  },

  projectfiles: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('jshintrc', '.jshintrc');
    this.copy('karma.conf.js', 'karma.conf.js');
    this.copy('Gulpfile.js', 'Gulpfile.js');
  }
});

module.exports = AngularGabeGenerator;
