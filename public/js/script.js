     
          
document.addEventListener('DOMContentLoaded', () => {     
          
          const ordersMsg = document.getElementById('header-text');  
          const mainDiv = document.getElementById('myMoneys'); 
          const searchBar = document.getElementById('searchBar'); 
          const WalletDisplay = document.querySelector('#saving');
          const savingsDisplay = document.querySelector('#savings');
          const incomesDisplay = document.querySelector('#incomes');
          const expensesDisplay = document.querySelector('#expenses');
          let moneys = [] ;   
        
        

          
         
          //function to fetch all dat from backend

          const listAll = () => {
           return  fetch('http://localhost:3000/api/v1/moneys')
            .then((resp) =>resp.json())
            .then((data) =>  {
            renderProperty(data);
            localStorage.setItem('moneys', JSON.stringify(data));
          });
            
          }

          // function to render my property
          function  renderProperty(dataPro) {       
             
              //for storage of total amount
              let totalWalletAmount = [];
              let totalSavings= [];
              let totalExpenses = [];
              let totalIncomes =[]

               ordersMsg.className = 'err';
              ordersMsg.innerHTML = dataPro.message;
                moneys= dataPro.moneys;   
                let money_block = document.createElement('Div');
                money_block.setAttribute('id','money_block');
                          
              for ( var i= 0; i < moneys.length; i++ ){            
                let  divprop= document.createElement("DIV"); 
                let { _id,amount,title,category} = moneys[i];    
                
                          
                divprop.innerHTML =`
                <div class="money_details" data-id="${_id}">                                        
                  <div class="item_money>
                      <p id="title"> ${title}<span class="amount"> ${amount + " "}PLN</span></p>   
                  </div>                                            
                </div>`
                


         
              //adding negative sign to amount for expenses
              if(category.name.toLowerCase() =="expenses"){ 
                amount = -amount                  
                totalWalletAmount.push(amount)
                //money for expenses
                 totalExpenses.push(amount);             

              }else if(category.name.toLowerCase() =="income"){
                totalWalletAmount.push(amount)
                //money for income                
                totalIncomes.push(amount) 
              }else {
                totalWalletAmount.push(amount) 
                //money for savings
                 totalSavings.push(amount);
              }
                         
                        
                   
                  // add a class function for a right border
                  addClassBorderToMyWallet( "income", "savings",category, divprop )
                    // to append my whole create section   
                    money_block.append(divprop); 
                        
                        }  
                    mainDiv.append(money_block)        

        //check if it is  from a category and do calculations

        // for showing total on the UI
        WalletDisplay.innerHTML = getTotal(totalWalletAmount) 
        savingsDisplay.innerHTML = getTotal(totalSavings) 
        incomesDisplay.innerHTML = getTotal(totalIncomes) 

        // in ordrer to get a positive number I will mulitpy by -1 for expenses
        expensesDisplay.innerHTML = getTotal(totalExpenses)* -1
                        
//-------------------------------------------------------------------------------------------------

         const money_details = document.querySelectorAll('.money_details');
         money_details.forEach(blockMoney => {
                  blockMoney.addEventListener('click', (e)=>{
                    // Storage()
                    let moneyBlockId = e.target.parentElement.dataset.id;
                    let saveIdToLocalStorage = localStorage.setItem('single_id', JSON.stringify(moneyBlockId))                  
                      location.href='../pages/money.html';
                                    
                   })  
                });
              }            
                
                        

                               
              // implementing logOut
                const logOutBtn = document.querySelector('.log-out');
                  logOutBtn.addEventListener('click', ()=>{
                    console.log('plz I am out')
                  localStorage.clear();
                  window.location.href = '../pages/login.html';
              })

              // category page run
              const category_details = document.querySelectorAll('.category_details');
              category_details.forEach(blockMoney => {
                  blockMoney.addEventListener('click', (e)=>{
                    // Storage()
                    let categoryBlockId = e.target.dataset.category;    
                                  
                    let saveCategoryToLocalStorage = localStorage.setItem('category-details', JSON.stringify(categoryBlockId))                  
                      location.href='../pages/category.html';
                                    
                   })  
                });
            
               listAll();

            //function to calculate total
            function getTotal(array){  
              if(array.length === 0){
                let initial_amount = 0
                 return  initial_amount
              }  

              return  array.reduce((previousValue, currentValue) => previousValue + currentValue)             
            }

            
            //add class function and i am not putting expense cos I am not interested in that
            function addClassBorderToMyWallet( income, savings,category, render ){
                if(category.name.toLowerCase() ==income){
                  render.classList.add("income")
                } else if(category.name.toLowerCase() == savings){
                  render.classList.add("savings")
                }         
                else {
                  render.classList.add("expenses")
                }
            };


            //list by user 
          const userId= JSON.parse(localStorage.getItem('user')).user._id;          
          const listByMe = () => {
            return  fetch(`http://localhost:3000/api/v1/moneys/${userId}`)
             .then((resp) =>resp.json())
             .then((data) =>  {             
             localStorage.setItem('moneysByUser', JSON.stringify(data));
           });             
             }
           listByMe();      
          })
          
          
          
          
          
          
          
          
          
              
     

 