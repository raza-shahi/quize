document.addEventListener("DOMContentLoaded", function () {
  let quizeData = null;
  const questionContainer = document.getElementById("question-container");
  const quizeContainer = document.getElementById("quize-container");

  // Save the original structure so it can be restored on replay
  const originalQuestionTemplate = questionContainer.innerHTML;

  fetch("quize-data.json")
    .then((response) => response.json())
    .then((data) => {
      quizeData = data;
      initSection();
    })
    .catch((err) => console.error("Error loading quize data", err));

  function initSection() {
    let sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      section.addEventListener("click", () => {
        let currentSection = section.getAttribute("data-section");
        startQuize(currentSection);
        quizeContainer.style.display = "none";
        questionContainer.style.display = "block";
      });
    });
  }

  function startQuize(index) {
    // Restore original HTML elements before starting the quiz
    questionContainer.innerHTML = originalQuestionTemplate;

    let currentQuestions = quizeData.sections[index].questions;
    let currentQestionIndex = 0;
    let score = 0;
    let answerSelected = false;

    const questionElement = document.getElementById("qes");
    const optionsElement = document.getElementById("option");
    const scoreElement = document.getElementById("score");
    const nextBtn = document.getElementById("next-btn");

    showQuestion();
    updateScore();

    function showQuestion() {
      answerSelected = false;
      const question = currentQuestions[currentQestionIndex];
      questionElement.textContent = question.question;
      optionsElement.innerHTML = "";

      question.options.forEach((option) => {
        const optionElement = document.createElement("div");
        optionElement.textContent = option;
        optionElement.addEventListener("click", function () {
          if (!answerSelected) {
            answerSelected = true;
            optionElement.style.backgroundColor = "grey";
            checkAnswer(option, question.correct_answer);
          }
        });
        optionsElement.appendChild(optionElement);
      });
    }

    function checkAnswer(userAnswer, currectAnswer) {
      const feedBackElement = document.createElement("p");
      feedBackElement.setAttribute("class", "feedback");
      if (userAnswer === currectAnswer) {
        score++;
        feedBackElement.textContent = "Correct";
        feedBackElement.style.color = "green";
      } else {
        feedBackElement.textContent = `Wrong: Correct answer: ${currectAnswer}`;
        feedBackElement.style.color = "red";
      }
      optionsElement.appendChild(feedBackElement);
      updateScore();
    }

    function updateScore() {
      scoreElement.textContent = `Score: ${score}`;
    }

    nextBtn.addEventListener("click", () => {
      if (!answerSelected) {
        alert("Please select an answer first!");
        return;
      }
      if (currentQestionIndex < currentQuestions.length - 1) {
        currentQestionIndex++;
        showQuestion();
      } else {
        endQuize();
      }
    });

    function endQuize() {
      questionContainer.innerHTML = `
    <div class="quiz-result">
      <h1>Quiz completed</h1>
      <p class="final-score">Your final score: <span>${score}/${currentQuestions.length}</span></p>
      <button id="home-btn">Go to Home</button>
    </div>
  `;

      document.getElementById("home-btn").addEventListener("click", () => {
        quizeContainer.style.display = "grid";
        questionContainer.style.display = "none";
      });
    }
  }
});
