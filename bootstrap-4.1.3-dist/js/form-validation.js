const name = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const form = document.getElementById("contactForm");

name.addEventListener("blur", valName);
email.addEventListener("blur", valEmail);
subject.addEventListener("blur", valSubject);
message.addEventListener("blur", valMessage);

var nameIsValid = false;
var emailIsValid = false;
var subjectIsValid = false;
var messageIsValid = false;

function valName() {
  if (name.value) {
    name.classList.remove("is-invalid");
    nameIsValid = true;
  } else {
    name.classList.add("is-invalid");
    nameIsValid = false;
  }
}

function valEmail() {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (!re.test(email.value)) {
    email.classList.add("is-invalid");
    emailIsValid = false;
  } else {
    email.classList.remove("is-invalid");
    emailIsValid = true;
  }
}

function valSubject() {
  if (subject.value) {
    subject.classList.remove("is-invalid");
    subjectIsValid = true;
  } else {
    subject.classList.add("is-invalid");
    subjectIsValid = false;
  }
}

function valMessage() {
  if (message.value) {
    message.classList.remove("is-invalid");
    messageIsValid = true;
  } else {
    message.classList.add("is-invalid");
    messageIsValid = false;
  }
}

function checkForm() {
  var f = document.forms["contactForm"].elements;
  var canSubmit = true;

  for (var i = 0; i < f.length; i++) {
    if (f[i].value.length == 0) {
      canSubmit = false;
    } 
  }

  if (!(nameIsValid) || !(emailIsValid) || !(subjectIsValid) || !(messageIsValid)) {
    canSubmit = false;
  }
  document.getElementById('submitButton').disabled = !canSubmit;
}
