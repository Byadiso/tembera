

/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', ()=> { 
              
    // for accessing only my form to create a property 
    const namecategory = document.querySelector('#name');    
    const submitButton = document.querySelector('#submitBtn_category');
    const form = document.querySelector('#create_category_form');
    const display_error = document.querySelector('.display_error_category');   
    const success_message = document.querySelector('.success_message');
    const categories_container = document.querySelector('.all_categories');

    
 // --------------------------------------------------------------------------------------
      const user= JSON.parse(localStorage.getItem('user'));
      const id = user.user._id;
      const token = user.token; 


 // ------------------------FETCH MY CATEGORIES--------------------------------------------------------------


//  const categories= JSON.parse(localStorage.getItem('categories'));
//  console.log(categories)


    // fetching of categories 
    function getAllCategories(){
      return  fetch(`http://localhost:3000/api/v1/categories`, {
        method: 'GET',
        headers:{
          'Content-Type':'application/json'
               }

  })
.then(response =>response.json())
.then(categories =>{ 
 let storedCategories = localStorage.setItem('categories', JSON.stringify(categories));
 renderAllCategories(categories);

})
.catch(err =>console.log(err));
    }
    
    getAllCategories();


    // ..............................render all catgories............................

function renderAllCategories (cat){
  const categoriesHeader =document.querySelector('.all_category_header');
   categoriesHeader.textContent = cat.length;

  for (var i = 0; i <cat.length ; i++){
    const {name, _id} = cat[i]

    const category = document.createElement('div');
    category.classList.add('category_item');    
    category.innerHTML= `<di data-id=${_id} class="category_item">
      <h3>${name}</h3>
      <button class="btn-delete">delete</button>
    </di>
    
    
   
    `;

    categories_container.append(category);

    // accessingmy dele btns

    // // accesing button for delete and update
    const delBtns =document.querySelectorAll('.btn-delete') ;
    delBtns.forEach(btn => {
      btn.addEventListener('click',(e)=>{
        let category_id = e.target.parentElement.dataset.id;

         //checking if we have a money linked to this category and alert something the user
        let moneys =   JSON.parse(localStorage.getItem('moneys'));
        
     if(moneys != undefined){
      
      // let thatMoney = moneys.find(item => item.moneys)
    
        // we will not delete category linked to an item  
      success_message.innerHTML = `<h3 class="error">First delete your moneys linked to this category</h3>`   
      console.log('First remove those record connectd with this category' + moneys);

     } else {
     // still thinking how to make it better
                           
     return fetch( `http://localhost:3000/api//v1/category/${category_id}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
     }
    }).then((res)=>res.json()).then(data => {              
      if(data.status== true){
        // show a successful message to the user by creating a div 
        success_message.innerHTML = `<h3 class="success">Your category has been successfully deleted </h3>`
         // location.reload();    
        console.log("category with Id" + category_id + "has been deleted" )
      } else {
          console.log(data.error);
          success_message.innerHTML = `<h3 class="error">${data.error}</h3>`
         }      
          });   
         }
      })        
    });    
  } 
}





 // ------------------------------CREATE CATEGORY--------------------------------------------------------

submitButton.addEventListener('click',  (e) => {
    e.preventDefault();     
    if (!namecategory.value.trim()) {
      display_error.textContent = '* Please fill the name of category';        
    } else{
      
      let name = namecategory.value
       return fetch(`http://localhost:3000/api/v1/category/create/${id}`, {
        method: 'POST',
        headers: { 
          Accept: 'application/json',         
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
           },
        body: JSON.stringify({ name }) 
})
.then(response => {
    return  response.json()
})
.then(data => {
  // console.log(data)
  if(data.status == true){
    console.log(data.message);
     let storedData = localStorage.setItem('categorycreated', JSON.stringify(data));  
     success_message.innerHTML = `<h3>Your category has been successfully created</h3>`
    //  location.reload();
    
  } 
  if(data.status == false){
    console.log(data.error)
  }         
})
.catch((err) =>{
  console.log(err)
});
    }
      
      }) 
      
      
      //fetch category and display all single category
      
    
});


  
  
  