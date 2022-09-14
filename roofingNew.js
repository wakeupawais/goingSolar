const apiKey = "f2524627-fede-4b7d-b786-dbb0b5838785";
const locationUrl = "https://valor.inspectionquiz.com/valor-ty";

const disqualifyPageOwnHome = document.getElementById("disqualifyPageOwnHome");
const disqualifyPageDescribeHome = document.getElementById("disqualifyPageDescribeHome");
const questionLength = document.querySelectorAll(".question").length;
const nextButton = document.getElementById("next-button");
const previousButton = document.getElementById("previous-button");
const submitButton = document.getElementById("submit-button");
const navigationBar = document.querySelector(".next-previous-bar");

const showHideQuestion = (hide, show) => {
  hide.classList.remove("showQuestion");
  hide.classList.add("hideQuestion");
  show.classList.remove("hideQuestion");
  show.classList.add("showQuestion");
}

const hideNavigationBar = () => {
  navigationBar.classList.remove("showQuestion");
  navigationBar.classList.add("hideQuestion");
}

const disqualifyUser = (currentQuestion) => {
  currentQuestion.classList.remove("showQuestion");
  currentQuestion.classList.add("hideQuestion");
  if (currentQuestion.id === "question-1") {
    disqualifyPageOwnHome.classList.remove("hideQuestion");
    disqualifyPageOwnHome.classList.add("showQuestion");
  }
  if (currentQuestion.id === "question-2") {
    disqualifyPageDescribeHome.classList.remove("hideQuestion");
    disqualifyPageDescribeHome.classList.add("showQuestion");
  }
  hideNavigationBar();
  // hideNextButton()
  // hidePreviousButton()
}

const throttleFunction = (func, limit) => {
  let flag = true;
  return () => {
    if (flag) {
      func();
      flag = false;
      setTimeout(() => {
        flag = true;
      }, limit);
    }
  }
}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const validateQuestion = (currentQuestion) => {
  let count = 0;
  const form = document.querySelector("form");
  const formData = new FormData(form);
  let fieldName;
  try {
    fieldName = currentQuestion.querySelector("input").name;
  } catch (e) {
    fieldName = currentQuestion.querySelector("select").name;
  }
  // const fieldName = currentQuestion.querySelector("input").name;
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
          fieldError.innerHTML = "* Please Enter Correct Email";

        } else {
          fieldError.innerHTML = "";
        }
        break;
    }
  } else {
    fieldError.innerHTML = `* Required`;
    count++;
  }
  if (count <= 0) {
    fieldError.innerHTML = "";
  }

  return count > 0 ? false : true;
}

const changeQuestion = (e) => {
  const currentQuestion = document.querySelector(".showQuestion");
  if (currentQuestion) {
    const nextQuestion = currentQuestion.nextElementSibling;
    if (validateQuestion(currentQuestion)) {
      if (nextQuestion.classList.contains("question")) {
        const nextQuestionNumber = parseInt(nextQuestion.id.split("-")[1]);
        if (nextQuestionNumber > 1) {
          showPreviousButton();
        }
        if (nextQuestionNumber === questionLength) {
          hideNextButton();
          showSubmitButton();
        }
        showHideQuestion(currentQuestion, nextQuestion);
      }
    }
  } else {
    const heroCard = document.querySelector(".hero-card");
    heroCard.classList.add("hideQuestion");
    document.querySelectorAll(".question").forEach((ques, index) => {
      if (index === 0) {
        ques.classList.remove("hideQuestion");
        ques.classList.add("showQuestion")
      } else {
        ques.classList.remove("showQuestion");
        ques.classList.add("hideQuestion")
      }
    })
  }
}

const previousQuestion = (e) => {
  const currentQuestion = document.querySelector(".showQuestion");
  const previousQuestion = currentQuestion.previousElementSibling;
  if (previousQuestion?.classList.contains("question")) {
    const previousQuestionNumber = parseInt(previousQuestion.id.split("-")[1]);
    if (previousQuestionNumber === 1) {
      hidePreviousButton();
    }
    hideSubmitButton();
    showNextButton();
    // else if(previousQuestionNumber > 1) {
    //   showPreviousButton();
    // }
    showHideQuestion(currentQuestion, previousQuestion);
  }
}

const validateForm = (formData) => {
  for (let [key, value] of formData.entries()) {
    if (!(value && value.trim())) {
      flag = false;
      alert(`Please Fill the whole survey from start!`);
      return false;
    }
  }
  return true;
}

const submitForm = () => {
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const currentQuestion = document.querySelector(".showQuestion");
  if (validateQuestion(currentQuestion) && validateForm(formData)) {
    const data = {
      "firstName": formData.get("firstname"),
      "lastName": formData.get("lastname"),
      "name": `${formData.get("firstname")} ${formData.get("lastname")}`,
      "phone": formData.get("phonenumber"),
      "address1": formData.get("address"),
      "customField": {
        do_you_own_your_home: formData.get("ownHome"),
        what_best_describes_your_home: formData.get("bestDescribeYou"),
        when_do_you_want_to_start_your_project: formData.get("whenWantToStartProject"),
        how_do_you_wish_to_pay: formData.get("howDoYouWishToPay")
      },
      "tags": "roofing leads",
    }

    const url = `https://rest.gohighlevel.com/v1/contacts`;
    const header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Authorization", `Bearer ${apiKey}`);
    const requestSetting = {
      method: "POST",
      body: JSON.stringify(data),
      headers: header,
    }
    fetch(url, requestSetting)
      .then(res => res.json())
      .then(json => {
        if (!json.contact) {
          alert("Problem while saving");
        } else {
          location.href = locationUrl;
        }
      });

  }
}

const closeModal = () => {
  const modalList = document.querySelector(".modal-list");
  modalList.style.display = "none";
}

const openLink = (e) => {
  const modelList = document.querySelector(".modal-list");
  modelList.style.display = "flex";
  const id = e.target.id.split("-")[1];
  const anchorLink = document.getElementById(id);
  document.querySelectorAll(".modal").forEach(modal => {
    if (modal.id !== id) {
      modal.classList.remove("show");
      modal.classList.add("hide");
    } else {
      modal.classList.add("show");
      modal.classList.remove("hide")
    }
  })
  console.log(e.target.id.split("-")[1]);
}

const showPreviousButton = () => {
  previousButton.style.visibility = "visible";
}

const hidePreviousButton = () => {
  previousButton.style.visibility = "hidden";
}

const hideNextButton = () => {
  nextButton.style.display = "none";
}

const showNextButton = () => {
  nextButton.style.display = "block";
}

const hideSubmitButton = () => {
  submitButton.style.display = "none";
}

const showSubmitButton = () => {
  submitButton.style.display = "block";
}

// $(document).ready(function () {
//   var autocomplete;
//   autocomplete = new google.maps.places.Autocomplete((document.getElementById("address")), {
//     types: ['geocode'],
//     componentRestrictions: {
//       country: "USA"
//     }
//   });

//   google.maps.event.addListener(autocomplete, 'place_changed', function () {
//     var near_place = autocomplete.getPlace();
//   });
// });

const allRadioInput = document.querySelectorAll("input[type=radio]");

allRadioInput.forEach(item => item.addEventListener("change", changeQuestion));

// const allNextButtons = document.querySelectorAll(".next");
// allNextButtons.forEach(item => item.addEventListener("click", changeQuestion));

// const submitButton = document.getElementById("submit-button");
const submitThrotlle = throttleFunction(submitForm, 3000);
submitButton.addEventListener("click", submitThrotlle);

// const closeButton = document.querySelectorAll(".close");
// closeButton.forEach(btn => btn.addEventListener("click", closeModal));

// const anchorButtonList = document.querySelectorAll(".anchor-link");
// anchorButtonList.forEach(anchor => {
//   anchor.addEventListener("click", openLink)
// })


nextButton.addEventListener("click", changeQuestion);


previousButton.addEventListener("click", previousQuestion);

