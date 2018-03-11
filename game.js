(function () {
    var handler = require('./handler.js');
    const { prompt } = require('inquirer');
    var playGround = {}, self = playGround;

    playGround.playGame = function () {
        handler.get_play_ground().then(function (result) {
            playGround.hints = result;
            self.askQuestion();
            get_input();
        });
    };

    playGround.verifyAnswer = function (inputText) {

        let options = {
            "1": "Enter again : ",
            "2": self.askQuestion,
            "3": self.quit
        };
        console.log(inputText)
        if (parseInt(inputText)) {
            if (options[inputText] && typeof options[inputText] === 'function')
                options[inputText]();
            else
                console.log("Enter the word: ");
                get_input();
        }
        else if (inputText === self.hints.word || self.hints.synonyms.indexOf(inputText) !== -1) {
            console.log("Correct,Whooo...Hooo... Thanks for Playing");
            process.exit();
        }
        else {
            console.log("Wrong");
            console.log("Choose any option : \n1: try again \n2: hint \n3: quit ");
            get_input();
        }
    };

    playGround.askQuestion = function () {
        var clue = self.hints.eligibleHints[self.hints.currentPointerOfHint];

        var randomNum = Math.floor(Math.random() * self.hints[clue].length);
        if (clue === 'definition') {
            console.log("Enter word whose definition is: " + self.hints.definition[randomNum]);
        }
        if (clue === 'synonyms') {
            console.log("Enter word whose synonym is: " + self.hints.synonyms[randomNum]);
        }
        if (clue === 'antonyms') {
            console.log("Enter word whose antonyms is: " + self.hints.antonyms[randomNum]);
        }
        if (clue === 'jumbledWord') {
            console.log("The jumbled word is: " + self.hints.jumbledWord[randomNum]);
        }
        if(self.hints.eligibleHints.indexOf("jumbledWord") === -1)
            self.hints.eligibleHints.push("jumbledWord"); 

        self.hints.currentPointerOfHint++;
        if(self.hints.currentPointerOfHint === self.hints.eligibleHints.length)
            self.hints.currentPointerOfHint = 0;
    };

    playGround.quit = function () {
        console.log("The answer is: " + self.hints.word);
        console.log("Definition: "+self.hints.definition.join("\n"));
        console.log("Synonyms: "+self.hints.synonyms.join(","));
        console.log("Antonyms: "+self.hints.antonyms.join(","));
        process.exit();
    };

    get_input = function() {
        const ques = [{
            type : "input",
            name : "word",
            message : "Enter the input"
          },]
        prompt(ques).then(ans =>{
            self.verifyAnswer(ans['word'])
        }).catch(err => console.log(err) )
    }

    module.exports = playGround;
})();