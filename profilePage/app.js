import {
    auth,
    db,
    doc,
    getDoc,
    onAuthStateChanged,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    updateDoc,
  } from "../firebase.Config.js";
  
let currentLoggedInUser ;
let  profileImagecopy;
let profilePicNotLoad;
const signUpBtn = document.querySelector('.signUpBtn')
const firstNameInput = document.querySelector('.firstName')
const lastNameInput = document.querySelector('.lastName')
const newPassword = document.querySelector('.newPassword')
const repeatPassword = document.querySelector('.repeatPassword')
const uploadPopUpPic = document.querySelector("#pop_image");
const profileImage = document.querySelector(".profileImage");
const loginBtn = document.querySelector(".loginBtn");
const logoutbtn = document.querySelector(".logoutbtn");

logoutbtn.addEventListener('click',()=>{
  loader.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
    window.location.href = '../index.html'
  }, 3000);

})

uploadPopUpPic.addEventListener("change", () => {
  const file = uploadPopUpPic.files[0];
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg",
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "images/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      loaderFunction()
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          loaderFunction()
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);
        loaderFunction()
        profileImage.src = downloadURL;
        profileImagecopy =downloadURL;
    
        
      });
    }
    );
  });

  async function updateData() {
    try {
      console.log(profileImagecopy)
      const washingtonRef = doc(db, "users", currentLoggedInUser);
            const response = await updateDoc(washingtonRef, {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        password :newPassword.value ,
        profilePicture : profileImagecopy || profilePicNotLoad,

        // email: 'hamzabashir1268@gmail.com'
      });
      console.log("profile update complete")


     
  
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  




const loader = document.querySelector(".loader");

function loaderFunction(){
  loader.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
  }, 2000);
}
loaderFunction();

// Update function 

signUpBtn.addEventListener('click',()=>{
  loaderFunction();

// Check if password is at least 8 characters and includes capital and lowercase letters
if (
  newPassword.value.length < 8 ||
  !/[A-Z]/.test(newPassword.value) ||
  !/[a-z]/.test(
    newPassword.value ||
      !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword.value)
  )
) {
  alert(
    "Password must be at least 8 characters and include both uppercase and lowercase letters and special charaacter."
  );
  return;
}

// Check if passwords match
if (newPassword.value !== repeatPassword.value) {
  alert("Passwords do not match. Please re-enter.");
  return;
}
console.log('yaha tak agaya')

updateData()
 setTimeout(()=>{
  window.location.href ='../dashboard/index.html'
 },5000)
 
})



// Auth user
 onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      currentLoggedInUser = uid;

      getUserData(uid);
   // ...
    } else {
      // User is signed out
      console.log("sign out");
      window.location.href = "../index.html";
    }
  });


  
  

// Get user 
async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { firstName, lastName,profilePicture} = docSnap.data();
      // console.log(profilePicture)
      firstNameInput.value = firstName
     lastNameInput.value = lastName
     loginBtn.innerHTML = firstName + ' ' +lastName
     profileImage.src = profilePicture || profileImage.src 
     profilePicNotLoad = profilePicture
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error, "==>>error in get User Data");
  }
}
