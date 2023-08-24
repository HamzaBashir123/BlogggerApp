import { auth, signInWithEmailAndPassword} from '../firebase.Config.js'

const signupEmail =document.querySelector('.signupEmail')
const signupPwdFirst =document.querySelector('.signupPwdFirst')
const signUpBtn =document.querySelector('.signUpBtn')


function loginHandler(){

       console.log(signupEmail.value)
       console.log(signupPwdFirst.value)
       signInWithEmailAndPassword(auth, signupEmail.value, signupPwdFirst.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if(user) {
                window.location.href = '../dashboard/index.html'
            }
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode)
            console.log(errorMessage)
            
        });

   
}

signUpBtn.addEventListener('click',loginHandler)

signupPwdFirst.addEventListener("keydown", (a) => {
        if (a.key === "Enter") {
          console.log("je");
          loginHandler();
        }
      });
      