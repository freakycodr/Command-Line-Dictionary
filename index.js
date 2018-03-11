#!/usr/bin/env node

const program = require('commander')
var handler = require('./handler.js')
var game = require('./game')

program
    .version('0.0.1')
    .description('Command line dictionary')

program
    .command('def <word>')
    .alias('defintion')
    .description('To get the defintions')
    .action((word) => {
        handler.get_definition(word).then(function (result) {
            print(result);
        }).catch(function(err){ console.log(err); })
    });

program
    .command('syn <word>')
    .alias('synonym')
    .description('To get the synonyms')
    .action((word) => {
        handler.get_synonyms(word).then(function (result) {
            print(result);
        }).catch(function(err){ console.log(err); })
    });

program
    .command('ant <word>')
    .alias('antonym')
    .description('To get the antonyms')
    .action((word) => {
        handler.get_antonyms(word).then(function (result) {
            print(result);
        }).catch(function(err){ console.log(err); })
    });

program
    .command('ex <word>')
    .alias('example')
    .description('To get the examples')
    .action((word) => {
        handler.get_examples(word).then(function (result) {
            print(result);
        }).catch(function(err){ console.log(err); })
    });

program
    .command('dict <word>')
    .alias('dictionary')
    .description('To get the definitions,synonyms,antonyms and examples')
    .action((word) => {
        handler.get_dict(word).then(function (result) {
            print(result);
        }).catch(function(err){ console.log(err); })
    });

program
    .command('')
    .alias('wfd')
    .description('To get the definitions,synonyms,antonyms and examples for word of the day')
    .action(() => {
        handler.get_word_of_the_day().then(function (result) {
            print(result);
        }).catch(function(err){ console.log(err); })
    });

program
    .command('play')
    .alias('p')
    .description('Play the word game')
    .action(() => {
        game.playGame();
    });

program.parse(process.argv)

if(process.argv.length==2) {
    handler.get_word_of_the_day().then(function (result) {
        print(result);
    }).catch(function(err){ console.log(err); })
}

function print(result) {
    console.log(result);
}