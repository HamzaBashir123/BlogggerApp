import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  signOut,
  setDoc,
  addDoc,
  collection,
  getDocs,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "../firebase.Config.js";

const loginBtn = document.querySelector(".logoutBtn");
const userNAme = document.querySelector(".loginBtn");

const blogTitle = document.querySelector(".blogTitle");
const blogDescription = document.querySelector(".blogDescription");
const signUpBtn = document.querySelector(".signUpBtn");
const loader = document.querySelector(".loader");

function loaderFunction(){
  loader.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
  }, 2000);
}

signUpBtn.disabled = true;

blogTitle.addEventListener("keydown", () => {
  if (blogTitle.value.length !== "") {
    signUpBtn.disabled = false;
  }
});
let currentLoggedInUser;

let postIdGlobal;

//                     Authentication code

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    currentLoggedInUser = uid;
    console.log(uid);
    getUserData(uid);
    // ...
  } else {
    // User is signed out
    console.log("sign out");
    window.location.href = "../index.html";
  }
});

//                     Get User Data

async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { firstName, lastName } = docSnap.data();
      leftCreateData(firstName, lastName);
      //   placeholderNameSet(firstName, lastName);

      // leftCreateData(username, firebaseSurname, profilePicture);
      // placeholderNameSet(username, firebaseSurname, profilePicture);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error, "==>>error in get User Data");
  }
}

function leftCreateData(firstName, lastName) {
  firstName =
    firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
  lastName =
    lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
  userNAme.innerHTML = firstName + " " + lastName;
}

async function getAuthorData(authorUid) {
  // console.log(authorUid, "==>>authorUid")

  const docRef = doc(db, "users", authorUid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
}

//   Logout functionality

const logoutHandler = () => {
  console.log("logout chal gaya");
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Logout successfully");
      loaderFunction();
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};
loginBtn.addEventListener("click", logoutHandler);

// Post Handler

async function postHandler() {
  const result = lengthWithoutSpaces(blogTitle.value);
  const resultdes = lengthWithoutSpaces(blogDescription.value);
  if (result < 5) {
    alert("title length minimum 5 letter");
    return;
  }
  if (result > 50) {
    alert("title length Maximum 50 letter");
    return;
  }
  if (resultdes < 100) {
    alert("Description length minimum 100 letter");
    return;
  }
  if (resultdes > 3000) {
    alert("Description length Maximum 3000 letter");
    return;
  }

  try {
    const response = await addDoc(collection(db, "blogs"), {
      blogContent: blogDescription.value,
      authorId: currentLoggedInUser,
      time: serverTimestamp(),
      blogTitle: blogTitle.value,
    });
    signUpBtn.disabled = true;

    
    

    loaderFunction();
    // console.log(response.id)
    getPosts();
    blogDescription.value = "";
    blogTitle.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

signUpBtn.addEventListener("click", postHandler);

const postDiv = document.querySelector(".postDiv");
getPosts();
// loader.style.display = 'block'
// Get Post Data
async function getPosts() {
  postDiv.innerHTML = "";
  const postsCollectionRef = collection(db, "blogs");
  const sortedQuery = query(postsCollectionRef, orderBy("time", "desc"));

  const querySnapshot = await getDocs(sortedQuery);
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    let postId = doc.id;
    const { authorId, blogContent, blogTitle, time } = doc.data();

    let { firstName, lastName, profilePicture } = await getAuthorData(authorId);
    loaderFunction();
    firstName =
      firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
    lastName =
      lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();

    // console.log(authorDetails)
    let setTime = new Date(time.seconds * 1000);
    // console.log(setTime.toString().split('GMT')[0]);
    let dateTime = setTime.toString().split("GMT")[0];

    var div1 = document.createElement("div");
    div1.setAttribute("class", "appendDiv");

    div1.innerHTML = `     <div class="d-flex">
      <img  class="blogPicture" src=" ${
        profilePicture || "../assets/images.jpeg"
      }" alt="" style="height: 60px; width: 60px;">
      <div class="titleNameTime ms-2">
          <h6 class="p-0 m-0 mt-3">${blogTitle}</h6>
          <span>${firstName + " " + lastName} </span><span>${dateTime}
          </span>

      </div>
  </div>
  <div class="contentDiv ">
      <p class="mb-3">${blogContent}
  </p>
  <span class="deletePost" onclick="deletePostHandler('${postId}')">Delete</span>
  <span class="editPost" onclick="editPostHandler('${postId}')">Edit</span>
 

  </div>
  `;

    postDiv.appendChild(div1);
  });
}

//   Delete Post

async function deletePostHandler(postId) {
  const docRef = doc(db, "blogs", postId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data().authorId);
    let id = docSnap.data().authorId;

    console.log(currentLoggedInUser);

    if (currentLoggedInUser === id) {
      try {
        await deleteDoc(doc(db, "blogs", postId));
        loaderFunction();
        getPosts();
        
      } catch (error) {
        alert(error);
      }
    } else{
      alert("Sorry you are not deleted this post");
    }
  } else {
  console.lof("No such document")
  }
}

window.deletePostHandler = deletePostHandler;

//   Edit Button

const popUPCapturefullScreen = document.querySelector(".popUPCapturefullScreen");
const popUpButton = document.querySelector(".popUpButton");
const popUpCross = document.querySelector(".popUpCross");
const textArea = document.querySelector(".textArea");
const editInput = document.querySelector(".editInput");
popUpCross.addEventListener("click", () => {
  popUPCapturefullScreen.style.display = "none";
});

async function editPostHandler(postId) {

  const docRef = doc(db, "blogs", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    const { blogContent, blogTitle, authorId } = docSnap.data();
    if(currentLoggedInUser === authorId){
      popUPCapturefullScreen.style.display = "block";
      textArea.innerHTML = blogContent;
      editInput.value = blogTitle;
      postIdGlobal = postId;
    }else{
      alert('Sorry you are not edit this post')
    }
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

window.editPostHandler = editPostHandler;

async function updateData() {
  
  console.log(postIdGlobal);
  console.log(editInput.value);
  console.log(postIdGlobal);
  try {
    const washingtonRef = doc(db, "blogs", postIdGlobal);
    const response = await updateDoc(washingtonRef, {
      blogContent: textArea.value,
      blogTitle: editInput.value,
    });

    //   await updateDoc(washingtonRef, {
    //       postContent: "kuch bhi"
    //   });

    //   console.log(response.id)
    getPosts();
    loaderFunction();
    popUPCapturefullScreen.style.display = "none";
 
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
popUpButton.addEventListener("click", updateData);

function lengthWithoutSpaces(str) {
  // Remove spaces from the string using regular expression
  const stringWithoutSpaces = str.replace(/\s/g, "");

  // Calculate the length of the string without spaces
  const length = stringWithoutSpaces.length;

  return length;
}
