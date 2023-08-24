import {

    db,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
  } from "../firebase.Config.js";


  const postDiv = document.querySelector('.postDiv')
  const loader = document.querySelector(".loader");
  const headingSignup = document.querySelector(".headingSignup");
  
  //                     Authentication code
  
 

  function getGreeting() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    let greeting;

    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Night";
    }

    return greeting;
}

const greeting = getGreeting();
headingSignup.innerHTML =   getGreeting() + ' Readers!'


async function getPosts() {
    postDiv.innerHTML = "";
    const postsCollectionRef = collection(db, "blogs");
    const sortedQuery = query(postsCollectionRef, orderBy("time", "desc"));
  
    const querySnapshot = await getDocs(sortedQuery);
    setTimeout(()=>{
      loader.style.display= 'none'
    },2000)
    querySnapshot.forEach(async (doc) => {
      let postId = doc.id;
      const { authorId, blogContent, blogTitle, time } = doc.data();
      // console.log(doc.id ,"=====> post Id " )
      let { firstName, lastName , profilePicture } = await getAuthorData(authorId);
      firstName =
        firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
      lastName =
        lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
  
    
      let setTime = new Date(time.seconds * 1000);
    
      let dateTime = setTime.toString().split("GMT")[0];
  
      var div1 = document.createElement("div");
      div1.setAttribute("class", "appendDiv");
      div1.innerHTML = `     <div class="d-flex">
      <img  class="blogPicture" src="${profilePicture || './assets/images.jpeg'} " alt="" style="height: 60px; width: 60px;">
      <div class="titleNameTime ms-2">
          <h6 class="p-0 m-0 mt-3">${blogTitle}</h6>
          <span>${firstName +" "+ lastName} </span><span>${dateTime}
          </span>

      </div>
  </div>
  <div class="contentDiv ">
      <p class="mb-3">${blogContent}
  </p>
  <span  onclick="singleUser('${authorId}')">see all from this user</span>
 

  </div>
  `;
  
      postDiv.appendChild(div1);
      
  
      
    
    });
  }

  getPosts()


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
  


function singleUser(authorId){
  loader.style.display= 'block'
  setTimeout(()=>{
    loader.style.display= 'none'
    window.location.href = `./singleUser/index.html?authorId=${authorId}`
  },2000)

}
window.singleUser =singleUser;
