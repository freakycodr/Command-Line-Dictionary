(function () {
    var api = require('./api.js');
    var Promise = require("bluebird");
    var handler = {}, self = handler;

    handler.get_definition = function (word) {
        var promise = api.get("definition",word);
        return promise.then(function (response) {
            function definition() {
                let meaning = "";
                response.forEach(function (obj) {
                    meaning += "-> "+obj.text + "\n";
                });
                return "Definitions \n" +meaning;
            }
            if(response && Array.isArray(response) && response.length === 0)
                return Promise.resolve("The word doesn't exist");
            return Promise.resolve(definition());
        }).catch(function(){
            console.error("Error while getting the definition of word");
            return Promise.reject();
        });
    };

    handler.get_synonyms = function(word) {
        var promise = api.get("synonym",word);
        return promise.then(function (response) {
            function synonyms() {
                return "Synonyms => " +(response[0] ? response[0].words.join(",") : '');
            }
            return Promise.resolve(synonyms());
        }).catch(function(){
            console.error("Error while getting the Synonym of word");
            return Promise.reject();
        });
    };

    handler.get_antonyms = function(word) {
        var promise = api.get("antonym",word);
        return promise.then(function (response) {
            function antonym() {
                return "Antonyms => " + (response[0] ? response[0].words.join(",") : '');
            }
            return Promise.resolve(antonym());
        }).catch(function(){
            console.error("Error while getting the antonym of the word");
            return Promise.reject();
        });
    };

    handler.get_examples = function(word) {
        var promise = api.get("topExample",word);
        return promise.then(function (response) {
            return Promise.resolve("Example => "+(response && response.text ? response.text : ''));
        }).catch(function(){
            console.error("Error while getting the example of the word");
            return Promise.reject();
        });
    };

    handler.get_dict = function(word) {
        var defPromise = self.get_definition(word),
            synonymPromise = self.get_synonyms(word),
            antonymPromise = self.get_antonyms(word),
            examplePromise = self.get_examples(word),
            arrOfPromises = [defPromise, synonymPromise, antonymPromise, examplePromise];

        return Promise.all(arrOfPromises).then(function(result){
            return Promise.resolve(result.join("\n"));
        }).catch(function(){
            console.error("Error while getting the dictionary of the word");
            return Promise.reject();
        });
    };

    handler.get_word_of_the_day = function() {
      var promise = api.get('wordOfTheDay'), word;
      return promise.then(function(response){
         word = response.word;
         return self.get_dict(word);
      }).then(function(result){
          word = "Word of the day => " + word + "\n";
          return Promise.resolve(word+result);
      }).catch(function(){
          console.error("Error while getting the dictionary of the word of the day");
          return Promise.reject();
      });
    };

    handler.get_play_ground = function() {
        var promise = api.get('randomWord'), word;
        return promise.then(function(response){
            word = response.word;

            var defPromise = api.get('definition',word),
                synonymPromise = api.get("synonym",word),
                antonymPromise = api.get("antonym",word),
                arrOfPromises = [defPromise, synonymPromise, antonymPromise];

            return Promise.all(arrOfPromises);
        }).then(function(result){
            var hintObject = getHintObject(result, word);
            return Promise.resolve(hintObject);
        }).catch(function(){
            console.error("Error...so can't play in the play ground...try again");
            return Promise.reject();
        });
    };


    function getHintObject(result, word) {
        var obj = {};

        function getDefinition(){
            let defArr = [];
            result[0].forEach(function(defObject){
                defArr.push(defObject.text);
            });
            return defArr;
        }

        function getSynonym() {
            return result[1][0] ?result[1][0].words : [];
        }

        function getAnonym(){
            return result[2][0] ? result[2][0].words : [];
        }

        function randomlyJumbledWord(word){
            var newWord = "", word=word.split("");

            function getRandomNum(max, min) {
                return Math.floor(Math.random() * max);
            }
            for(var i=0;i<word.length;i++){
                let index = getRandomNum(word.length,0);
                newWord += word[index];
                word.splice(index, 1);
                i--;
            }
            return newWord;
        }

        obj.definition = getDefinition();
        obj.synonyms = getSynonym();
        obj.antonyms = getAnonym();
        obj.word = word;
        obj.jumbledWord = [randomlyJumbledWord(word)];
        obj.eligibleHints = ["definition"];
        if(obj.antonyms.length)
            obj.eligibleHints.push("antonyms");
        if(obj.synonyms.length)
            obj.eligibleHints.push("synonyms");
        obj.currentPointerOfHint = Math.floor(Math.random() * obj.eligibleHints.length);
        return obj;
    }
    module.exports = handler;
})();