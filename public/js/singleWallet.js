/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', () => {    
    const mainSingleDiv = document.getElementById('singleMoney')
    let moneyIdFrom = JSON.parse(localStorage.getItem('single_id'));
    // let moneysItems = JSON.parse(localStorage.getItem('moneys')) ;    
    console.log(moneyIdFrom)

     //fetch single wallet

    const singleWallet = () => {
        return  fetch(`http://localhost:3000/api/v1/money/${moneyIdFrom}`)
         .then((resp) =>resp.json())
         .then((data) =>{        
         renderWalet(data)
         localStorage.setItem('single_wallet', JSON.stringify(data));
       });             
         }    

// ..................................render money ................................................

    const renderWalet = (data) => {  
        if(data.status == 400 ){
            let {message, status} = data
            console.log('something went wrong' + message)            
            renderError(message , status);

           
        }  else {
            console.log(data)
            let { description,amount,title,category,createdAt, _id } = data; 
            // time display in readable format
            var timestamp= timeDifference(new Date(), new Date(createdAt));
            
               const moneyContainer = document.createElement('DIV');     
                             
                moneyContainer.innerHTML =`
                       <div class="money_container">    
                          <h5><span>Title:</span>${title}</h5>               
                          <h5><span>Description:</span>${description}</h5>                   
                          <h5><span>Category:</span>${category.name}</h5>
                          <h5><span>Amount:</span>${amount} PLN</h5>
                          <h5>Added ${timestamp}</h5>
                          <div class=" btns_category" data-toAdd="${_id}">
                               <buton class="btn_edit">Edit</buton>
                               <buton class="btn_delete">Delete</buton>
                               <span class="message_display"></span>
                          </div>
                          
                    </div>
                        `                     
                 
               //appending the main container
               mainSingleDiv.appendChild(moneyContainer);   
        }

     
    }
   
    //  fetchingSingle();

    singleWallet()          
         
   // access user and token
    const user= JSON.parse(localStorage.getItem('user'));
    const userId = user.user._id;
    const token = user.token; 
         

    // ----------------------------------------------------------------------------------

    //fetching related
    const fetchingRelated = () => {
        fetch(`http://localhost:3000/api/v1/moneys/related/${moneyIdFrom}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((dataRelate) => renderRelated(dataRelate))
    }

    function renderRelated(dataRelate) {       
        let moneys = dataRelate        
        const container_related = document.createElement('DIV')
        container_related.classList.add('money_container');
        let header_related = document.createElement('h1');
        header_related.classList.add('header_related');
        header_related.textContent = 'Related money';

        // create a header for related money
        container_related.append(header_related);
        for (var i = 0; i < moneys.length; i++) {
            const { _id, amount,title } = moneys[i]
            let money_related = document.createElement('div');
            money_related.classList.add('related_moneys');
            money_related.innerHTML = renderUIPart(_id, title, amount)
            container_related.append(money_related);
            mainSingleDiv.appendChild(container_related);            
        }
    }
    fetchingRelated();

// this is a  function to other part of the pages  
function renderUIPart(id,title,amount){
    return `
    <div class="money_details" data-id="${id}">                                        
        <div class="item_money>
            <p id="title"> ${title}<span class="amount"> ${amount + " "}PLN</span></p>   
        </div>                                            
    </div>               
  `
}

function renderError(errorMessage, status){
    console.log(errorMessage)
    let errorDiv = document.createElement('DIV')
    errorDiv.innerHTML =`
                                      
        <div class="item-error" data-status='${status}'>
            <p class="title"> ${errorMessage}</p>   
        </div>                                            
                   
  `
   //appending the main container
   mainSingleDiv.appendChild(errorDiv);   
}

document.getElementById('singleMoney').addEventListener('click',(event)=> {
    if (event.target.className === 'btn_edit') { 
       let propId = event.target.parentElement.dataset.toadd;        
                
              let data_user = {
                prop_id: propId,
                user_id: userId,
                token : token
              }
              localStorage.setItem('id_user_to_update', JSON.stringify(data_user));   
              let stored = localStorage.getItem('single_id'); 
              stored ? location.href='../pages/update.html' : console.log('no stored id to update');       
      } else if(event.target.className === 'btn_delete'){
        let moneyIdToDelete = event.target.parentElement.dataset.toadd;     
        fetch(`http://localhost:3000/api/v1/money/${moneyIdToDelete}/${userId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.json();
            }).then(data=>{
                  if(data.status== true){
                    //remoe this product from lcoalstorage
                //    let remainedMoney = pro.filter((item)=>item._id != moneyIdToDelete);
                   localStorage.setItem('moneys', JSON.stringify(data));
                    // show a successful message to the user by creating a div 
                    const message_display = document.querySelector('.message_display');                    
                    message_display.innerHTML = `${data.deletedmoney.title} was deleted successfuly`
                   
                  } else {
                    console.log(data.error);
                  }                  
            })
            .catch(err => console.log(err));
            };   
    });


    function timeDifference(current, previous) {
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var elapsed = current - previous;            
        if (elapsed < msPerMinute) {
            if(elapsed/1000 <30) return "Just now";            
            return Math.round(elapsed/1000) + ' seconds ago';   
        }            
        else if (elapsed < msPerHour) {
             return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }
        else if (elapsed < msPerDay ) {
             return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }
    
        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';   
        }            
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';   
        }            
        else {
            return Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }
    


})
