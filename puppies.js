const kitten_address = "https://www.petmd.com/sites/default/files/styles/article_image/public/small-kitten-walking-towards_127900829_0.jpg?itok=ah_gTtbS";
const puppy_address = "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=640:*";

const num_puppies = 5;
const total_locations = 5 * 5;
const is_puppy_by_location = [];
let images = [];

let puppies_found = 0;
let guesses_left = 0;
let question_guesses = 0;
let review_guesses = 0;
let total_questions = 0;
let total_reviews = 0;

function HiddenImage(row, column, img_element) {
  this.row = row;
  this.column = column;
  this.is_puppy = is_puppy_by_location[row * 5 + column];
  this.image_address = this.is_puppy ? puppy_address : kitten_address;
  this.img_element = img_element;
  this.img_element.onclick = e => {
      if (guesses_left === 0) {
        document.querySelector("#more_work").style = "";
        return;
      }
        document.querySelector("#more_work").style = "display: none";
      this.img_element.src = this.image_address;
      guesses_left --;
      update_guesses();
      if (this.is_puppy) {
        puppies_found++;
        if (puppies_found == num_puppies) {
          found_all_the_puppies();
        }
      }
  }
}

function shuffle(array) {
  for (let currentIndex = 0; currentIndex < array.length; currentIndex++) {
    // Pick a random element in the live segment of the array.
    let randomIndex = Math.floor(Math.random() * (array.length - currentIndex)) + currentIndex;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function setup_arrays() {
  for (let i = 0; i < num_puppies; i++) {
    is_puppy_by_location.push(true);
  }
  for (let i = 0; i < total_locations - num_puppies; i++) {
    is_puppy_by_location.push(false);
  }
  shuffle(is_puppy_by_location);
}

function setup_images() {
  const table = document.querySelector("#puppy_table");
  for (let r = 0; r < 5; r++) {
    let tr = table.insertRow();
    let row = [];
    for (let c = 0; c < 5; c++) {
      let td = tr.insertCell("td");
      let img = document.createElement("img");
      console.log("Image ")
      img.width = 100;
      img.height = 100;
      row.push(new HiddenImage(r, c, img));
      td.append(img);
    }
    images.push(row)
  }
  document.body.appendChild(table);
}

function found_all_the_puppies() {
  document.querySelector("#congrats").style = "";
}

function update_guesses() {
  document.querySelector("#guesses_out").innerText = "You have " + guesses_left +" guesses left." 
}

function create_puppies() {
  setup_arrays();
  setup_images();
  document.querySelector("#add_questions").addEventListener("click", () => {
    // Update questions.
    total_questions += parseInt(document.querySelector("#question_count").value);
    // 25 total guesses. 8 from questions, 17 from reviews.
    let total_question_guesses = Math.min(Math.trunc(total_questions / 5), 5);
    guesses_left += total_question_guesses - question_guesses;
    question_guesses = total_question_guesses;
    document.querySelector("#questions_out").innerText = "Questions completed: " + total_questions;

    // Update reviews.
    total_reviews += parseInt(document.querySelector("#review_count").value);
    let total_review_guesses = Math.min(Math.trunc(total_reviews / 30), 20);
    guesses_left += total_review_guesses - review_guesses;
    review_guesses = total_review_guesses;
    document.querySelector("#reviews_out").innerText = "Reviews completed: " + total_reviews;

    update_guesses();
  });
}
