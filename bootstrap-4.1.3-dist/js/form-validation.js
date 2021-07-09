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

function valName() {
  if (name.value) {
    name.classList.remove("is-invalid");
    return true;
  } 
  else {
    name.classList.add("is-invalid");
    return false;
  }
}

function valEmail() {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (!re.test(email.value)) {
    email.classList.add("is-invalid");
    return false;
  } 
  else {
    email.classList.remove("is-invalid");
    return true;
  }
}

function valSubject() {
  if (subject.value) {
    subject.classList.remove("is-invalid");
    return true;
  } 
  else {
    subject.classList.add("is-invalid");
    return false;
  }
}

function valMessage() {
  if (message.value) {
    message.classList.remove("is-invalid");
    return true;
  } 
  else {
    message.classList.add("is-invalid");
    return false;
  }
}

function checkForm() {
  var f = document.forms["contactForm"].elements;

  for (var i = 0; i < f.length; i++) {
    if (f[i].value.length == 0) {
      return false;
    } 
  }

  if (!(valName()) || !(valEmail()) || !(valSubject()) || !(valMessage())) {
    return false;
  }

  return true;
}

function toggleSubmit() {
  console.log('button toggle');
  // if form is valid
  if(checkForm()) {
    // enable button
    document.getElementById('submitButton').disabled = false;
  }
  // if form is not valid
  else {
    // disable button
    document.getElementById('submitButton').disabled = true;
  } 
}