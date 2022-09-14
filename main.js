const form = document.getElementById("survey-form");

const formSubmitButton = document.getElementById("submitButton");

const submitForm = () => {
  const formData = new FormData(form);
  const value = formData.get("electricityBill");
  console.log(value, "value");
}

formSubmitButton.addEventListener("click", submitForm);