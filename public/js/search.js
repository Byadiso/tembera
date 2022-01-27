      
document.addEventListener('DOMContentLoaded', () => {         
  
    const searchBar = document.getElementById('searchBar'); 
    const submit_serch_btn = document.querySelector('.btnSearch');
    const search_container = document.querySelector('.search_container');
    let searchedContent = document.querySelector('#searched_content');
    const main_properties = document.querySelector('.main_properties');  
    const filters = document.querySelector('.filterCheck');
    const loader = document.querySelector('#loader');

    // let moneyBlock = document.querySelector('#money_block');
    const mainDiv = document.getElementById('myMoneys'); 


    let categoryAny = "";
    let CategoriesStoredArray=[]

// fetching of categories 
function fetchCategories(){
        return  fetch(`http://localhost:3000/api/v1/categories`, {
                method: 'GET',
                headers:{
                'Content-Type':'application/json'
                        }
        })
        .then(response =>response.json())
        .then(categories =>{                 
            renderCategory(categories);

        })
        .catch(err =>console.log(err));
        };

    fetchCategories();


function renderCategory(CategoriesStored){

    //hide the laoder 
    hideDisplay(loader);    

   CategoriesStored.forEach(category => {
    const listOfCategories = document.createElement('div');
    listOfCategories.classList.add('check_item');
    listOfCategories.innerHTML = `                 
            <input type="checkbox" name="${category.name}" id="all_property" value="${category.name}">
            <label for="all"><strong>${category.name}</strong></label>                
   `;
   CategoriesStoredArray.push(category);
    filters.appendChild(listOfCategories);
    });         
}


// let handle change on checking event 

filters.addEventListener('change',(e)=>{
 let filter = e.target.value;
 let parent = e.target;
  
// fetch only if checked
if(parent.checked){
   
    let filtredCatId = CategoriesStoredArray.find(cat => cat.name === filter);
    // filter ? categoryAny = filtredCatId._id : categoryAny = "" ; 
    categoryAny = filtredCatId._id;      
    // find the id of the category  and fetch by category
    return fetch(`http://localhost:3000/api/v1/moneys/by/${categoryAny}`, {
        method: "GET"
    })
        .then(response =>  response.json())
        .then(data => renderByCategory(data))
        .catch(err => console.log(err)); 
}else {
    let moneyBlock = document.querySelector('#money_block');   
    showDisplay(moneyBlock);  //normal fetching   
    }        
})

//render by category
function renderByCategory(data){ 

    //hide the laoder
    hideDisplay(loader);  

    let moneyBlock = document.querySelector('#money_block');    
    //hide previous list default one     
    hideDisplay(moneyBlock);
    let containerMoney = document.querySelector('#myMoneys');   
    for ( var i= 0; i < data.data.length; i++ ){ 
        console.log('yes') 
        let { _id,amount,title} = data.data[i];              
        let  divprop = document.createElement("DIV");    
                          
        divprop.innerHTML = `
        <div class="money_details" data-id="${_id}">                                        
          <div class="item_money>
              <p id="title"> ${title}<span class="amount"> ${amount + " "}PLN</span></p>   
          </div>                                            
        </div>`;
        //               
        containerMoney.append(divprop)
    }
}


// hide the display function
function hideDisplay(display){
    display.style.display = 'none';
}
// show display function
function showDisplay(display){
    display.style.display = 'block';
}


   ///handle search business 
    let input_search
    const input = document.getElementById('input_search');
    input.addEventListener('keyup',(e)=>{
     input_search = e.target.value;
        console.log(input_search)
    } )


    //for fetching data 

    const list = params => {
        // const query = queryString.stringify(params);
        const  query = new URLSearchParams(params)
                for (const oneQuerry of query) {
                     console.log(oneQuerry);
            }
        console.log("and I have reached to list function")
        console.log("query", query);
        return fetch(`http://localhost:3000/api/v1/moneys/search?${query}`, {
            method: "GET"
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    };


// for search data 
    const searchData = () => {        
        let search = input_search;
        // console.log(search, category);
        if (search) {
            list({ search: input_search || undefined, category: categoryAny  }).then(
                response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {                      
                       renderSearch(response);
                    }
                }
            );
        }
    };
    


function renderSearch(searchedData){
    let Searched_title = document.querySelector('.search_title');
    searchedContent.classList.add('border_bottom');

    // i want to hide all other content let add a class hide to it 
    main_properties.classList.add('hide');
if(searchedData.length === 0 ){
    searchedContent.innerHTML= '';
    Searched_title.innerHTML = `No item found`;    
    } else {       
        Searched_title.textContent =   `Found ${searchedData.length} Item`;       
        searchedContent.innerHTML= '';     
      
        for (var i = 0 ; i< searchedData.length ; i++){
            let searched =document.createElement('div');
            searched.classList.add('searched_content_item');
            searched.innerHTML = `      
                <p>Title: ${searchedData[i].title}</p>
                <p>Descriotion: ${searchedData[i].description}</p>
                <p>Amount: ${searchedData[i].amount} PLN</p>
          `;            
        searchedContent.append(searched);
          }      
        }      
      }

submit_serch_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    console.log('I am serach something');
    searchData();            
});
    })