//Object List of Users
function ListUsers() {

    this.url = "https://cv-mobile-api.herokuapp.com/api/users";

    //Call the ajax and get the list of users
    this.getAllUsers = function ( callback ) {

         $.ajax ({   
            url: this.url,
            dataType: "json"
        }).done( function(data) {
            
            if(typeof callback == "function" ){
                callback( data );
            }else{
                console.log("Callback parameter isn't a function");
            }

            return data;
        });
    };
    

    this.renderUsers = function ( arr ) {
  
        //Create a card for each user
        arr.forEach(function(val) {

            let card = (`
            <div class="card mx-1 my-1 card-user shadow list-group-item-action" style="width: 18rem;">
                <div class="card-body text-center">
                <div class="row mb-4">        
                    <div class="d-flex justify-content-between align-self-end mt-3 mx-auto">
                        <button type="button" class="btn-edit btn btn-info btn-sm mx-1" id="${val._id}" data-toggle="modal"
                        data-target="#ModalCenter">Edit</button>
                        <button type="button" class="btn btn-info btn-modal btn-sm mx-1" id="${val._id}" data-toggle="modal"
                            data-target="#ModalCenter">Detail</button>
                        <button type="button" class="btn btn-cobalt btn-sm mx-1">Delete</button>
                    </div>
                </div>
                    <div class="row">
                        <div class="d-flex flex-column mx-auto justify-content-center mb-3">
                            <div class="d-flex mx-auto profile-picture mb-1">
                                <img class="img-user rounded-circle" src="${val.avatar}">
                            </div>
                            <h5 class="card-title d-inline user-name text-capitalize">${val.name}</h5>
                        </div>
                    </div>   
                    <div class="row px-3">    
                        <div class="d-flex flex-column flex-nowrap text-left my-2">
                            <h6 class="card-subtitle mb-3 text-center">Contact information</h6>
                            <p class="m-0 text-capitalize"><strong>City: </strong>${val.address.city}</p>
                            <p class="m-0 text-capitalize"><strong>Country: </strong>${val.address.country}</p>
                            <p class="m-0 text-capitalize"><strong>State: </strong>${val.address.state}</p>
                            <p class="m-0 font-italic text-capitalize"><strong>Skills: </strong>${val.skills.join(', ')}</p>
                            <p class="m-0"><strong>Email: </strong><a href="mailto:${val.email}">${val.email}</a></p>
                        </div>
                    </div>    
                </div>
            </div>
            `)

        document.getElementById('card-container').innerHTML += card;

        });
        
        document.getElementById('card-container').innerHTML += "<div id='loader'><div>";
        
    }.bind(this);//Bind to ListUsers object.

    /*Change the data of the modal when click on a user card.*/
    this.renderModal = function(arr) {
        $('.btn-modal').click(function(e){
            // console.log('click done');
            // console.log('User id ' + e.target.id);
            arr.forEach( function(val){
                // console.log("val_id: ", val._id);
                // console.log("e.id: ", e.target.id);
                if(val._id == e.target.id){
                    let user = val;

                    $('#profilePicture').attr("src", "../img/default-profile-picture.jpg").attr("src", user.profilePicture);
                    
                    $('#ModalCenterTitle').empty().html(user.name);

                    $('#city').empty().html(user.address.city);

                    $('#country').empty().html(user.address.country);
                    
                    $('#street').empty().html(user.address.street);

                    $('#language').empty().html(user.languages.join(', '));

                    $('#email').empty().html(user.email);

                    $('#jobTitle').empty().html(user.jobTitle);
                    
                    $('#website').empty().html(user.website);

                    $('#company').empty().html(user.company);

                    $('#skills-modal').empty().html(user.skills.join(', '));
                    console.log("skills? ", user.skills.join(', '));
                }
            });

        })
    }

    /* Return an array that represent a page of the inital array.
    As argument you should pass it the initial array, how many
    elementes do you need per page and the page nº that you need.*/
    this.pagination = function (arr, perpage, page) {     
        return arr.slice(perpage*(page-1), perpage*page);
    }

    this.filterUsers = function ( currentPage ){

        new Promise((resolve, reject) => {
            //Passing the resolve as a callback.
            this.getAllUsers( resolve );

        }).then((allUsers) => {

            // Inputs
            let nameInput = document.querySelector("#input-name").value.toLowerCase();
            let usernameInput = document.querySelector("#validationusername").value.toLowerCase();
            let emailInput = document.querySelector("#validationemail").value.toLowerCase();
            let genderSelect = document.querySelector("#gender").value.toLowerCase();
            let cityInput = document.querySelector("#city-option").value.toLowerCase();
            let countryInput = document.querySelector("#validationCountry").value.toLowerCase();
            let stateInput = document.querySelector("#validationState").value.toLowerCase();
            let companyInput = document.querySelector("#validationcompany").value.toLowerCase();
            let jobTitleInput = document.querySelector("#validationjob").value.toLowerCase();
            let experienceSelect = document.querySelector("#experience-search").value.toLowerCase();
            //CheckBoxes
            let languages = document.querySelectorAll('#languages .form-check-input');
            let checkedLanguages = [...languages].filter(lang => lang.checked == true ).map(lang => lang.defaultValue.toLowerCase());
            let skills = document.querySelectorAll('#skills .form-check-input');
            let checkedSkills = [...skills].filter(skill => skill.checked == true).map(skill => skill.defaultValue.toLowerCase());
      

            function removeFilteredUser(user){
                if(allFilters.includes(user)){
                    let i = allFilters.indexOf(user);
                    allFilters.splice(i, 1);
                }
            }

            let allFilters = allUsers;
            //Filters
            if(nameInput !== '') {
                var filterByName = allUsers.filter(user => user.name.toLowerCase().indexOf(nameInput) == -1);
                filterByName.forEach(removeFilteredUser);
            }
            if(usernameInput !== '') {
                var filterByusername = allUsers.filter(user => user.username.toLowerCase().indexOf(usernameInput) == -1);
                filterByusername.forEach(removeFilteredUser)
            }
            if(emailInput !== '') {
                var filterByEmail = allUsers.filter(user => user.email.toLowerCase().indexOf(emailInput) == -1);
                filterByEmail.forEach(removeFilteredUser)
            }
            if(genderSelect !== '') {
                var filterByGender = allUsers.filter(user => user.gender !== genderSelect);
                filterByGender.forEach(removeFilteredUser);
            }
            if(cityInput !== '') {
                var filterByCity = allUsers.filter(user => user.location.city.toLowerCase().indexOf(cityInput) == -1);
                filterByCity.forEach(removeFilteredUser);
            }
            if(countryInput !== '') {
                var filterByCountry = allUsers.filter(user =>  user.location.country.toLowerCase() !== countryInput);
                filterByCountry.forEach(removeFilteredUser);
            }
            if(stateInput !== '') {
                var filterByState = allUsers.filter(user =>  user.location.state.toLowerCase() !== stateInput);
                filterByState.forEach(removeFilteredUser);
            }
            if(companyInput !== '') {
                var filterByCompany = allUsers.filter(user => user.company.toLowerCase().indexOf(companyInput) == -1);
                filterByCompany.forEach(removeFilteredUser);
            }
            if(jobTitleInput !== '') {
                var filterByJobTitle = allUsers.filter(user => user.jobTitle.toLowerCase().indexOf(jobTitleInput) == -1);
                filterByJobTitle.forEach(removeFilteredUser);
            }
            if(experienceSelect !== '') {
                var filterByExperience = allUsers.filter(user => user.experience.toLowerCase() !== experienceSelect);
                filterByExperience.forEach(removeFilteredUser);
            }
            if(checkedLanguages.length > 0) {
                
                var filterByLanguages = allUsers.filter(user => {

                    let langControl = [];

                    checkedLanguages.forEach( lang => {
                        langControl.push(user.languages.includes(lang));
                    })
    
                    if(langControl.includes(false)){
                        return true;
                    } else {
                        return false;
                    }
                    
                });

                filterByLanguages.forEach(removeFilteredUser);
            }
            if(checkedSkills.length > 0) {
                
                var filterBySkills = allUsers.filter(user => {

                    let skillsControl = [];

                    checkedSkills.forEach( skill => {
                        skillsControl.push(user.skills.includes(skill));
                    })
    
                    if(skillsControl.includes(false)){
                        return true;
                    } else {
                        return false;
                    }
                    
                });
                filterBySkills.forEach(removeFilteredUser);
            }


            if( allFilters.length === 0 ){
                $( "#card-container" ).empty();
                document.getElementById('card-container').innerHTML += `<h1 id="title-fail-search"> There are not any coincidence </h1>`;
            }else if( allFilters.length < 10 ) {
                $( "#card-container" ).empty();
                this.renderUsers( this.pagination(allFilters, 10, 1) );
                console.log("less than 10 users");
            }else {
                if(currentPage === 1 ){ $( "#card-container" ).empty()}; 
                this.renderUsers( this.pagination(allFilters, 10, currentPage) );
                console.log(this.pagination(allFilters, 10, currentPage));
                console.log('Current page: ' + currentPage);
            }

            this.renderModal(allUsers);
            this.editUsers(allUsers);

        });
        
    }.bind(this);//Bind ListUsers object

    this.getUserValue = function (val, callback){
        fetch(`https://cv-mobile-api.herokuapp.com/api/${val}`)
        .then(res => res.json())
        .then(data => {
            callback(data);
        });
    }

    this.createCheckBoxes = function ( arr ){
        let checkBoxArr = [];
        arr.forEach(val => {
            let checkBox =
            `<div class="form-check">
                <input class="form-check-input" type="checkbox" id="${val.label}-check" name="${val.type}"
                    value="${val._id}">
                <label class="form-check-label mr-5" for="${val.label}-check">${val.label}</label>
            </div>`;
            checkBoxArr.push(checkBox);
        })
        return checkBoxArr;
    }

    this.renderCheckBoxArr = function (container, val){
        
        new Promise ( (resolve, reject) => {
            this.getUserValue(val, resolve);
        }).then((val) => {
            let checkbox = this.createCheckBoxes( val );
            checkbox.forEach(val =>{
                $(container).append(val);
            });
        });
    }.bind(this);

    this.createFormEditUser = function(user) {

        $('#ModalCenterTitle').empty().html(user.name);
        $('#profilePicture').attr("src", user.avatar);
        $('.modal-subtitle').empty().html('Edit information');

        for (let key in user){
            // console.log(key);
            switch (key) {
                case '_id':
                case 'registeredDate':
                case 'profilePicture':
                case '__v':
                    null
                    break;
                case 'skills':
                    $('#skills-modal').empty();
                    this.renderCheckBoxArr('#skills-modal', 'skills');
                    break;
                case 'languages':
                    $('#language').empty();
                    this.renderCheckBoxArr('#language', 'langs');
                    break;
                    
                case 'address':
                    for (let val in user[key]) {
                        let addressKey = user[key];
                        $(`#${val}`).empty().html(`<input style="display: block" value="" name="${val}" placeholder="${addressKey[val]}"></input>`)
                    }
                    break;
                
                default:
                $(`#${key}`).empty().html(`<input style="display: block" value="" name="${key}" placeholder="${user[key]}"></input>`);
                    break;
            }
        }

        $('.card-body-text').has('.btn-edit-container').length > 0 ? null :
            $('.card-body-text').append( 
                `<div class="btn-edit-container">
                    <button type="submit" class="btn btn-sm btn-info" id="edit-user-btn">Search</button>
                </div>`
        ); 
    }.bind(this);

    this.editUsers = function (){
        $('.btn-edit').click(function(e){
            console.log('click done');
            console.log('User id ' + e.target.id);
            
            $.ajax(`https://cv-mobile-api.herokuapp.com/api/users/${e.target.id}`)
            .done( user => {
                console.log(user);
                this.createFormEditUser(user); 
            })
        }.bind(this));
    }.bind(this);


}

let list = new ListUsers;
list.renderCheckBoxArr('#languages-search', 'langs');
list.renderCheckBoxArr('#skills', 'skills');
let scroll = new Scrollinfinite(list.filterUsers).initScroll();

//Calling the FilterUsers functions and render users on form's submit
$( "#adv-search-form" ).on( "submit", function(e) {
    //Don't refresh the page when submit
    e.preventDefault();
    //The argument passed is the nº of the page that you want to print.
    list.filterUsers(1);
});