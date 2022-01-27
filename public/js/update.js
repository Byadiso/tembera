
/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', ()=> { 
  
  let urlPro = 'http://localhost:3000/api/v1/property/';
            
  // for accessing only my form to be updated 
  // for accessing only my form to create a property 
  const title = document.querySelector('#title');
  const amount = document.querySelector('#amount');
   const description = document.querySelector('#description');
    const category = document.querySelector('.category');  
  const submitButton = document.querySelector('#create_pro');
  const selectionCategory = document.querySelector('.category');
  const form = document.querySelector('#create_property_form');
  const display_error = document.querySelector('.display_error');
  

  let categoryVar 

  let categoriesItem  = JSON.parse(localStorage.getItem('categories'));


  // for storage purpose 
  let property_to_update = JSON.parse(localStorage.getItem('id_user_to_update'));
  let moneys = JSON.parse(localStorage.getItem('moneys'));
  let data = moneys.moneys;

  const { prop_id,user_id,token } = property_to_update;  

   let proData = data.find(item => item._id == prop_id);
  console.log(proData);

  
///get categories

function getCategories(){
  for ( var i= 0; i < categoriesItem.length; i++ ){    
    let { name, _id} = categoriesItem[i];
    console.log(name);
    const optionCategorie = document.createElement('option');
    optionCategorie.innerHTML= `<option class="option_tag login-field" data-id=${_id}>${name}</option>`;
    selectionCategory.appendChild(optionCategorie);   
    }    
 }

 getCategories();   


  // setting values 
  title.value = proData.title;  
  amount.value = proData.amount;
  description.value = proData.description;  
  category.value = proData.category.name
  

  //for selection event 
selectionCategory.addEventListener('change',(e)=>{
  const myCategorie = e.target.value;
   let datCategorie = categoriesItem.find(item => item.name === myCategorie);  
   categoryVar = datCategorie._id; 
   console.log(category.value)
});


  submitButton.addEventListener('click',  (e) => {
    e.preventDefault();     
    if (!title.value.trim() ) {
      display_error.textContent = '* Please fill in all fields';        
    } else{
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('amount', amount.value);
    formData.append('description', description.value);
    formData.append('category', categoryVar);
      fetch(`http://localhost:3000/api/v1/money/${prop_id}/${user_id}`, {
        method: 'PUT',
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Authorization': `Bearer ${token}`
           },
           body: formData
 
})
.then(response => {
    return  response.json()
})
.then(data => {
  
  if(data.status == true){
    hideForm(data.message);
  } 
  if(data.status == false){
    console.log(data.error)
    let failMessage = 'Make sure all field are updated'
    display_error.textContent = failMessage
  }         
})
.catch((err) =>{
    console.log(err)
     });
   };
  });

// show message and hide the form 
  function hideForm(message){
    const sub_main = document.querySelector('.login-screen');
    const main = document.querySelector('.login');
    sub_main.classList.add('hide');
    console.log(message);
    const successfulMessage = document.createElement('div');
    successfulMessage.classList.add('successful_message');
    successfulMessage.innerHTML= `<p>${message}</p>`
    main.append(successfulMessage);
  }
})


