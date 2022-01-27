

/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', ()=>{ 
            
   const admin = document.querySelector('.admin_details'); 
     
     
   let userIdStored = JSON.parse(localStorage.getItem('user'));
   let id = userIdStored.user._id
   let token = userIdStored.token
  //  console.log(userIdStored);
  //  console.log(token);
  //  console.log(id);
  
    // for fetching user detail
     const  fetchingUser = ( () => {
      fetch( `http://localhost:3000/api/v1/user/${id}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
        )
      .then((res) => res.json())
      .then(user => renderUser(user)
         )    
   }); 
     
   function renderUser(user){
         //fro user details 
    const {name,email,_id } = user.user ;
    // console.log(name, email, _id)
   const userHeader = document.querySelector('.all_admin_header');
   userHeader.textContent = ` ${user.role == 1 ? "Admin " + name : name}`; 

  const userContainer = document.createElement('div');
   

   userContainer.innerHTML = 
     `<p id="phone"><strong>name:</strong> ${name}</p>
      <p id="address"><strong>email:</strong>${email}</p>
      <p id="owner"><strong>User ID:</strong> ${_id}</p>
      <p id="accountType"><strong>Acount Type: </strong> ${ user.role == 1 ? user.role =" Admin" : user.role =" Normal" }</p>
   `; 


admin.append(userContainer);           
    
     // implementing logOut
     const logOutBtn = document.querySelector('.log-out');
     logOutBtn.addEventListener('click', ()=>{
       console.log('plz I am out')
     localStorage.clear();
     window.location.href = '../pages/login.html';
     })
  
        }
    
  fetchingUser();
  //   ............................................................................................

  });
  
                 