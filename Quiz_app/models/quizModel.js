class Question {
    constructor(question, right, wrong1, wrong2, wrong3) {
      this.question = question;
      this.right = right;
      this.wrong1 = wrong1;
      this.wrong2 = wrong2;
      this.wrong3 = wrong3;
    }
  }
  
  const quiz = [
    new Question("What is 1/4 of 100?", "25", "24", "23"),
    new Question("What color is blood?", "Red", "White", "Green", "White"),
    new Question("What color is grass?", "Green", "White", "Red", "Orange"),
    new Question("How many legs does a spider have?", "8", "6", "4", "Infinite"),
    new Question("Who is the king of the Netherlands?", "Willem-Alexander", "Willem-Alexzelf", "Willem-Alexniemand", "Willhelm-Defoe"),
    new Question("What is 2-2?", "0", "2", "4", "-1"),
    new Question("What was Vincent van Gogh?", "Artist", "Baker", "Jobless", "CEO of Success"),
    new Question("Which is the largest planet?", "Earth", "Mars", "Jupiter", "Sun"),
    new Question("What element is the most abundant on earth's crust?", "Carbon", "Iron", "Silicon", "Hydrogen"),
    new Question("Who is the fastest man alive?", "Usain Bolt", "Barry Allen", "Reverse-Flash", "Superman"),
    new Question("Which continent is the largest in size?", "Asia", "Australia", "Africa", "North America"),
    new Question("What is the end product of photosynthesis?", "Oxygen", "Carbon dioxide", "Water", "Chlorophyll"),
    new Question("Which eye color is the rarest?", "Green", "Blue", "Brown", "Grey"),
    new Question("What is the name of the most popular 90s rock band?", "LP", "Metallica", "Pendulum", "Crush"),
    new Question("The richest person on the planet is:", "Elon Mush", "Jeff Bezos", "Jack Ma", "Mukesh Ambani"),
    new Question("What is the capital of France?", "Paris", "Madrid", "Rome", "London"),
    new Question("Who wrote the novel 'Pride and Prejudice'?", "Jane Austen", "William Shakespeare", "Charles Dickens", "George Orwell"),
    new Question("What is the chemical symbol for gold?", "Au", "Ag", "Fe", "Cu"),
    new Question("Which planet is known as the 'Red Planet'?", "Mars", "Venus", "Jupiter", "Mercury"),
    new Question("What is the tallest mountain in the world?", "Mount Everest", "K2", "Kangchenjunga", "Makalu"),
    new Question("Who painted the Mona Lisa?", "Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Michelangelo"),
    new Question("Which animal is known as the 'King of the Jungle'?", "Lion", "Tiger", "Leopard", "Elephant"),
    new Question("What is the largest ocean on Earth?", "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"),
    new Question("Which country is famous for the Great Wall?", "China", "India", "Mexico", "Egypt"),
    new Question("Who invented the telephone?", "Alexander Graham Bell", "Thomas Edison", "Albert Einstein", "Nikola Tesla"),
    new Question("What is the chemical formula for water?", "H2O", "CO2", "O2", "NaCl"),
    new Question("Which city is known as the 'Eternal City'?", "Rome", "Athens", "Cairo", "Paris"),
    new Question("What is the largest mammal on Earth?", "Blue whale", "Elephant", "Giraffe", "Hippopotamus"),
    new Question("Who painted the Sistine Chapel ceiling?", "Michelangelo", "Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh"),
    new Question("What is the currency of Japan?", "Yen", "Dollar", "Euro", "Pound Sterling"),
  ];
  
  module.exports = quiz;
  