const name = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

const submitButton = document.getElementById("submitButton");

var nameIsValid = false;
var emailIsValid = false;
var subjectIsValid = false;
var messageIsValid = false;

name.addEventListener("blur", valName);
email.addEventListener("blur", valEmail);
subject.addEventListener("blur", valSubject);
message.addEventListener("blur", valMessage);

function valName() {
  if (name.value) {
    name.classList.remove("is-invalid");
    submitButton.disabled = false;
    nameIsValid = true;
  } else {
    name.classList.add("is-invalid");
    submitButton.disabled = true;
    nameIsValid = false;
  }
}

function valEmail() {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (!re.test(email.value)) {
    email.classList.add("is-invalid");
    submitButton.disabled = true;
    emailIsValid = false;
  } else {
    email.classList.remove("is-invalid");
    submitButton.disabled = false;
    emailIsValid = true;
  }
}

function valSubject() {
  if (subject.value) {
    subject.classList.remove("is-invalid");
    submitButton.disabled = false;
    subjectIsValid = true;
  } else {
    subject.classList.add("is-invalid");
    submitButton.disabled = true;
    subjectIsValid = false;
  }
}

function valMessage() {
  if (message.value) {
    message.classList.remove("is-invalid");
    submitButton.disabled = false;
    messageIsValid = true;
  } else {
    message.classList.add("is-invalid");
    submitButton.disabled = true;
    messageIsValid = false;
  }
}

function formValidation() {
  if (nameIsValid && emailIsValid && subjectIsValid && messageIsValid) {
    alert("Validations successful!");
    return true;
  } else {
    returnToPreviousPage();
    return false;
  }
}
