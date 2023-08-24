import {
  
  doc,
  db,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs ,
} from "../firebase.Config.js";

const postDiv = document.querySelector(".postDiv");


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Get the authorId from the query parameters
const authorId = urlParams.get("authorId");

if (authorId) {
  // Now you have the authorId from the URL, and you can use it as needed
  // console.log("Author ID:", authorId);
  getUserData(authorId);
  getPosts(authorId)
  
  // Perform actions with the authorId here
} else {
  console.error("Author ID not found in the URL.");
  // Handle the case where authorId is not found in the URL
}



const emailShow = document.querySelector(".emailShow");
const profileName = document.querySelector(".profileName");
const profileImage = document.querySelector(".profileImage");
const headingProfileName = document.querySelector(".headingProfileName");
const loader = document.querySelector(".loader");



async function getUserData(authorId) {
 
  try {
  
      let { firstName, lastName,email, profilePicture } = await getAuthorData(authorId);
      firstName =
        firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
      lastName =
        lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
       
        
      profileName.innerHTML = firstName + " " + lastName;
      emailShow.innerHTML = email;
      profileImage.src = profilePicture || profileImage.src;
      headingProfileName.innerHTML = "All From " + firstName + " " + lastName;
    
  } catch (error) {
    console.log(error, "==>>error in get User Data");
  }
}


async function getPosts(authorMatch) {
    postDiv.innerHTML = "";
    const postsCollectionRef = collection(db, "blogs");
    const sortedQuery = query(postsCollectionRef, orderBy("time", "desc"));
  
    const querySnapshot = await getDocs(sortedQuery);
    setTimeout(()=>{
      loader.style.display= 'none'
    },2000)
    querySnapshot.forEach(async (doc) => {
      
     if (doc.data().authorId == authorMatch){
      const { authorId, blogContent, blogTitle, time } = doc.data();
      // console.log(doc.id ,"=====> post Id " )
    
  
      let { firstName, lastName,profilePicture } = await getAuthorData(authorId);
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
      <img  class="blogPicture" src="${profilePicture || '../assets/images.jpeg'}" alt="" style="height: 60px; width: 60px;">
      <div class="titleNameTime ms-2">
          <h6 class="p-0 m-0 mt-3">${blogTitle}</h6>
          <span>${firstName +" "+ lastName} </span><span>${dateTime}
          </span>

      </div>
  </div>
  <div class="contentDiv ">
      <p class="mb-3">${blogContent}
  </p>
  
 

  </div>
  `;
  
      postDiv.appendChild(div1);
      
  
    }
    
    });
  }
  async function getAuthorData(authorUid) {
    // console.log(authorUid, "==>>authorUid")
  
    const docRef = doc(db, "users", authorUid);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
    }
  }
  