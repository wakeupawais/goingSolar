const form = document.getElementById("survey-form");

const formSubmitButton = document.getElementById("submitButton");

const questionList = document.querySelector(".question-list");

const progressBar = document.querySelector(".progress-bar__progress");

const questionLength = 10;

const thankyouPage = document.querySelector(".thankyouPage");

const API_KEY = ""

const extractId = id => parseInt(id.split("-")[1]);

const submitForm = (currentQuestionNumber) => {
  // const currentQuestion = document.querySelector(".showQuestin");
  // if (validateQuestion(currentQuestion)) {
  const form = document.getElementById("survey-form");
  const formData = new FormData(form);
  const data = {
    "firstName": formData.get("firstname"),
    "lastName": formData.get("lastname"),
    "name": `${formData.get("firstname")} ${formData.get("lastname")}`,
    "email": formData.get("email"),
    "phone": formData.get("phonenumber"),
    "address1": formData.get("address"),
    "postalCode": formData.get("zipcode"),
    
    "customField": {
      what_is_your_average_electric_bill: formData.get("averageElectricBill"),
      do_you_own_your_home: formData.get("ownHome"),
      what_type_of_home_do_you_have: formData.get("typeOfHome"),
      is_your_roof_shaded_by_trees: formData.get("roofyShadedByTress"),
      how_much_sun_does_your_house_get_on_a_daily_basis: formData.get("roofArea"),
      is_your_credit_score_above_or_below_640: formData.get("creditScore"),
    },
  }

  const firstname = formData.get("firstname");
  const url = `https://rest.gohighlevel.com/v1/contacts`;
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", `Bearer ${API_KEY}`);
  const requestSetting = {
    method: "POST",
    body: JSON.stringify(data),
    headers: header,
  }
  console.log(data, "data from survey");
    fetch(url, requestSetting)
      .then(res => res.json())
      .then(json => {
        if (!json.contact) {
          alert("Problem while saving");
        } else {
          onSuccessFormSubmit(firstname, currentQuestionNumber)
        }
      });
  
}

const onSuccessFormSubmit = (firstname, currentQuestionNumber) => {
  // const firstname = formData.get("firstname");
  thankyouPage.style.display = "flex";
  questionList.style.display = "none";
  const thankyouHeading = document.querySelector(".thankyou-heading");
  thankyouHeading.innerText = `Thanks ${firstname}, Here's What Happens Next... `
  moveProgressBar(currentQuestionNumber + 1);
}

const isLastQuestion = (question) => {
  const totalQuestions = document.querySelectorAll(".question").length;
  if(`question-${totalQuestions}` === question.id) {
    return true;
  }
  return false;
}

const showHideQuestion = (hide, show) => {
  const formData = new FormData(form);
  hide.classList.remove("showQuestion");
  hide.classList.add("hideQuestion");
  show.classList.remove("hideQuestion");
  show.classList.add("showQuestion");

  if(show.id === "question-8") {
    const congratesText = document.getElementById("congrates-text");
    const firstname = formData.get("firstname") 
    congratesText.innerText = `Congrats ${firstname}! You qualify! Answer a few more questions to see if you qualify for the Cash Bonus.`
  }

}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const disqualifyUser = (currentQuestion) => {
  currentQuestion.classList.remove("showQuestion");
  currentQuestion.classList.add("hideQuestion");
  if (currentQuestion.id === "question-1") {
    
  }
  if (currentQuestion.id === "question-2") {
    
  }
  // hideNavigationBar();
  // hideNextButton()
  // hidePreviousButton()
}

const validateQuestion = (currentQuestion) => {
  let count = 0;
  // const form = document.querySelector("survey-form");
  const formData = new FormData(form);
  const nameList = [];
  currentQuestion.querySelectorAll("input").forEach((item) => {
    nameList.push(item.name)
  })
  const inputNameList = new Set(nameList);
  console.log(inputNameList, "Input Name List");

  // let fieldName;
  // try {
  //   fieldName = currentQuestion.querySelector("input").name;
  // } catch (e) {
  //   fieldName = currentQuestion.querySelector("select").name;
  // }
  // const fieldName = currentQuestion.querySelector("input").name;
  inputNameList.forEach((fieldName) => {
    // count = 0;
    const fieldList = document.getElementsByName(fieldName);
    const fieldType = fieldList.length > 1 ? "radio" : "text";
    const fieldValue = formData.get(fieldName);
    const fieldError = document.getElementById(`${fieldName}-error`);
    if (fieldValue && fieldValue.trim()) {
      switch (fieldName) {
        case "ownHome":
          if (fieldValue == "No, I Rent") {
            disqualifyUser(currentQuestion);
            count++;
          }
          break;
  
        case "email":
          if (!validateEmail(fieldValue)) {
            count++;
            if(fieldType === "text") {
              fieldList[0].classList.add("error-input");
            }
            fieldError.innerHTML = "* Please Enter Correct Email";
  
          } else {
            fieldError.innerHTML = "";
            if (fieldType === "text") {
              fieldList[0].classList.remove("error-input");
            }
          }
          break;
        default:
          fieldError.innerHTML = "";
          if (fieldType === "text") {
            fieldList[0].classList.remove("error-input");
          }
      }
    } else {
      fieldError.innerHTML = `* Required`;
      if (fieldType === "text") {
        fieldList[0].classList.add("error-input");
      }
      count++;
    }
    if (count <= 0) {
      fieldError.innerHTML = "";
      if (fieldType === "text") {
        fieldList[0].classList.remove("error-input");
      }
    }

  })

  return count > 0 ? false : true;
}

const changeQuestion = (e) => {
  console.log("In change question");
  const currentQuestion = document.querySelector(".showQuestion");
  if (currentQuestion) {
    const nextQuestion = currentQuestion.nextElementSibling;
    if (validateQuestion(currentQuestion)) {
      if (nextQuestion && nextQuestion.classList.contains("question")) {
        const nextQuestionNumber = parseInt(nextQuestion.id.split("-")[1]);
        moveProgressBar(nextQuestionNumber);  
        showHideQuestion(currentQuestion, nextQuestion);
      }
      if (isLastQuestion(currentQuestion)) {
        const currentQuestionNumber = extractId(currentQuestion.id)
        submitForm(currentQuestionNumber);
        // const formData = new FormData(form);
        // const firstname = formData.get("firstname");
        // thankyouPage.style.display = "flex";
        // questionList.style.display = "none";
        // const thankyouHeading = document.querySelector(".thankyou-heading");
        // thankyouHeading.innerText = `Thanks ${firstname}, Here's What Happens Next... `
        // moveProgressBar(currentQuestionNumber + 1);
      } 
    }
  }
}

const questionFiveValidation = () => {

}

const moveProgressBar = (currentId = 0) => {
  progressBar.style.width = `${(100 / questionLength) * (currentId <= 0 ? 1 : currentId)}%`;
}

const nextButtonsList = document.querySelectorAll(".next-button");
const allRadioInput = document.querySelectorAll("input[type=radio]");
nextButtonsList.forEach(item => item.addEventListener("click", changeQuestion));
allRadioInput.forEach(item => item.addEventListener("change", changeQuestion));
moveProgressBar();
// formSubmitButton.addEventListener("click", submitForm);