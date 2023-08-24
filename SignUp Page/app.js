import { auth,db ,setDoc ,doc, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '../firebase.Config.js'

const firstName = document.querySelector(".firstName");
const lastName = document.querySelector(".lastName");
const signupEmail = document.querySelector(".signupEmail");
const signupPwdFirst = document.querySelector(".signupPwdFirst");
const signupPwdSecond = document.querySelector(".signupPwdSecond");
const signUpBtn = document.querySelector(".signUpBtn");

function SignUpHandler() {

  // Check if first name is at least 3 characters
  if (firstName.length < 3) {
    alert("First name must be at least 3 characters.");
    return;
  }

  // Check if last name is at least 1 character
  if (lastName.length < 1) {
    alert("Last name must be at least 1 character.");
    return;
  }

  // Check if first name and last name do not exceed 20 characters
  if (firstName.length > 20 || lastName.length > 20) {
    alert("First name and last name should not exceed 20 characters.");
    return;
  }

  // Check if email includes "@"
  if (!signupEmail.value.includes("@")) {
    alert("Email must include @.");
    return;
  }

  // Check if password is at least 8 characters and includes capital and lowercase letters
  if (
    signupPwdFirst.value.length < 8 ||
    !/[A-Z]/.test(signupPwdFirst.value) ||
    !/[a-z]/.test(
      signupPwdFirst.value ||
        !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(signupPwdFirst.value)
    )
  ) {
    alert(
      "Password must be at least 8 characters and include both uppercase and lowercase letters and special charaacter."
    );
    return;
  }

  // Check if passwords match
  if (signupPwdFirst.value !== signupPwdSecond.value) {
    alert("Passwords do not match. Please re-enter.");
    return;
  }
  console.log('yaha tak agaya')

  createUserWithEmailAndPassword(auth, signupEmail.value, signupPwdFirst.value)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user) {
        console.log(user, "User signup successfully");
        console.log(user.uid);
        addUserHandler(user.uid);
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
}

async function addUserHandler(uid) {
  try {
    console.log(uid, "mila gaya");
    await setDoc(doc(db, "users", uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      email: signupEmail.value,
    });
    alert("SignUp Successfully");
    firstName.value = "";
    lastName.value = "";
    signupEmail.value = "";
    signupPwdFirst.value = "";
    signupPwdSecond.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  window.location.href = "../login/index.html";
}

signUpBtn.addEventListener("click", SignUpHandler);
