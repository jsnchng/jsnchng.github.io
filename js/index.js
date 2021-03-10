const program = {
  correct: 1,
  numList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  vowelList: ["ɐ", "ɒ", "ɔ", "ɘ", "ɜ", "ɞ", "ɤ" ,"ɨ", "ɯ", "ɵ", "ø", "ɶ", "œ", "ʉ", "ʌ", "y"],
  audioList: [],
  
  initialize: function() {  
    const boxes = document.querySelectorAll(".box");   
    
    for (let x = 0; x < 4; x++) {
      boxes[x].addEventListener("click", function() {
        if (this.dataset.value == program.correct) {
          document.querySelector("#dialog").classList.add("correct");
          this.classList.add("right");
        } else {
          document.querySelector("#dialog").classList.add("incorrect");
          this.classList.add("wrong");
          document.querySelector(`[data-value='${program.correct}']`).classList.add("right");
        }
      });
    }
    
    document.querySelector("#dialog button").addEventListener("click", function() {
      const dialog = document.querySelector("#dialog");
      dialog.classList.remove("correct");
      dialog.classList.remove("incorrect");
      program.generate();
    });
    
    this.generate();
  },

  generate: function() {
    var oldRight = document.querySelector(".right");
    if (oldRight) oldRight.classList.remove("right");
    var oldWrong = document.querySelector(".wrong");
    if (oldWrong) oldWrong.classList.remove("wrong");
    
    function randNum(inputLength, outputLength) {
      var index;
      for (let i = 0; i < outputLength; i++) {
        index = parseInt(Math.random()*(inputLength-i));
        var temp;
        temp = program.numList[index];
        program.numList[index] = program.numList[inputLength-i];
        program.numList[inputLength-i] = temp;
      }
      return program.numList;
    };

    list = randNum(15,4);
    document.getElementById("box0").innerText = program.vowelList[list[14]];
    document.getElementById("box1").innerText = program.vowelList[list[13]];
    document.getElementById("box2").innerText = program.vowelList[list[12]];
    document.getElementById("box3").innerText = program.vowelList[list[11]];
    
    program.correct=parseInt(Math.random()*4);
    var audio = new Audio("sound/"+this.vowelList[list[14-this.correct]]+".mp3");   
    this.audioList.push(audio);
    if(this.audioList.length > 1) {
         this.audioList[this.audioList.length-1].pause();
       }            
    this.audioList[this.audioList.length-1].play();
  }
}

program.initialize()