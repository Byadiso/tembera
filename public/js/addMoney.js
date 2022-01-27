
/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', ()=> { 

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

    // ...................................................................................


    // fetching of categories 
    function fetchCategories(){
      return  fetch(`http://localhost:3000/api/v1/categories`, {
               method: 'GET',
               headers:{
                 'Content-Type':'application/json'
                      } 
         })
       .then(response =>response.json())
       .then(categories => localStorage.setItem('categories', JSON.stringify(categories))
     
       )
       .catch(err =>console.log(err));
     };

     //for quantity change event 

       function getCategories(){
      fetchCategories();
     for ( var i= 0; i < categoriesItem.length; i++ ){        
        let { name, _id} = categoriesItem[i];   
        const optionCategorie = document.createElement('option');
        optionCategorie.innerHTML= `<option class="option_tag login-field" data-id=${_id}>${name}</option>`;
        selectionCategory.appendChild(optionCategorie);
       
        }        
     }

     getCategories();     

    
//for selection event 
selectionCategory.addEventListener('change',(e)=>{
  const myCategorie = e.target.value;
  let datCategorie = categoriesItem.find(item => item.name === myCategorie);  
  categoryVar = datCategorie._id;
  console.log(datCategorie._id);
});

  // --------------------------------------------------------------------------------------
   const user= JSON.parse(localStorage.getItem('user'));
   const id = user.user._id;
   const token = user.token;
    

  submitButton.addEventListener('click',  (e) => {
    e.preventDefault();     
    if (!title.value.trim() ) {
      display_error.textContent = '* Please fill in all fields';        
    } 
    
    else {

    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    formData.append('title', title.value);
     formData.append('amount', amount.value);
     formData.append('description', description.value);
    formData.append('category', categoryVar);



    fetch(`http://localhost:3000/api/v1/money/create/${id}`, {
        method: 'POST',
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
     let storedData = localStorage.setItem('property', JSON.stringify(data))  
     window.location.href = '../pages/myBugdet.html'
  } 
  
  if(data.status == false) console.log(data.error);        
})
.catch(err => console.log(err));
}      
      })          
});



  
  
  