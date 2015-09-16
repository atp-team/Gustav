# Welcome Gustav
Gustav is an opensource internet banking of Česká spořitelna. As far as we know it is the first open internet banking ever. We decided to release it since we strongly believe in innovativeness of you - the best developer in the entire universe. You can simply use it as prepared or fork it and bring whole new light into the world of digital banking. Go ahead and share your vision of how the banking will look like!

You can try vanilla Gustav at [https://mygustav.cz/](https://mygustav.cz/).

## Prerequisites
*Skip this step if you have already installed grunt, bower and karma.*

Install [npm](https://www.npmjs.com/) using your favourite package manager. 
Try [Chocolatey](https://chocolatey.org/) (Win) or [Homebrew](http://brew.sh/) (Mac).

Then install all command line tools:
```
npm install -g grunt-cli
npm install -g bower
npm install -g karma
```

*Note: You might need to use `sudo` on Mac.*

## Installation
Clone the repository and then:
```
npm install
bower install
grunt debug
```
Open [http://localhost:9000](http://localhost:9000) and see Gustav in action!

## Development
* `grunt debug` - Starts local development server at [http://localhost:9000](http://localhost:9000) with live reload.
* `grunt test` - Runs all tests
* `grunt release` - Prepares complete release to `dist` directory

## Unit tests
Tests are located in directory `test/spec`. Use either grunt task or [Karma](http://karma-runner.github.io/) to run all tests.

Running tests manually via `karma start test/karma.conf.js` makes karma run in background and run tests on every core change.

## Project structure

```
app/core/			      # Basic framework (Menu, languages, …)
	 /gustav/					#	Basic Gustav stuff – icons, filters etc.
	 /plugins/					#	Each application tab is one plugin with its own Menu items, routing etc. 
```

## Disclaimer
Gustav was not primarilly intended for educational purposes. We used Gustav to prototype ideas, play with API and learn AngularJS.
You might find some parts little bit clumsy, over engineered, old-fashioned or simply buggy.

We will try to refine Gustav over time. But. You can help! Just send us pull request :)

