/* RateMyAztec                                                                            	  */
/* -Choose your SDSU courses more efficiently with ratings from RateMyProfessors.com-    	  */
/* Sept.17.2016                                                                         	  */

function main() {

    var test = document.getElementsByClassName('sectionMeeting');
    var sectionRow = document.getElementById('sectionRowTitles');
    var length = test.length;
    var professors = [];
    var profCount = 0;

    var sectionFieldRating = document.createElement('div');
    sectionFieldRating.innerHTML = "Rating";
    sectionFieldRating.className = "sectionFieldRating column"
    sectionRow.appendChild(sectionFieldRating);

    var sectionFieldDifficulty = document.createElement('div');
    sectionFieldDifficulty.innerHTML = "Difficulty";
    sectionFieldDifficulty.className = "sectionFieldDifficulty column"
    sectionRow.appendChild(sectionFieldDifficulty);

    var sectionFieldLink = document.createElement('div');
    sectionFieldLink.innerHTML = "Link";
    sectionFieldLink.className = "sectionFieldLink column";
    sectionRow.appendChild(sectionFieldLink);

    for (i = 0; i < length; i++) //iterate through every row
    {
        var sectionFieldRating = document.createElement('div'); //create new divs to add to sectionMeeting
        sectionFieldRating.innerHTML = "N/A";
        sectionFieldRating.className = "sectionFieldRating column"
        test[i].appendChild(sectionFieldRating);

        var sectionFieldDifficulty = document.createElement('div');
        sectionFieldDifficulty.innerHTML = "N/A";
        sectionFieldDifficulty.className = "sectionFieldDifficulty column"
        test[i].appendChild(sectionFieldDifficulty);

        var sectionFieldLink = document.createElement('div');
        sectionFieldLink.innerHTML = "N/A";
        sectionFieldLink.className = "sectionFieldLink column";
        test[i].appendChild(sectionFieldLink);

        var instructor = document.getElementsByClassName('sectionFieldInstructor');
        if(instructor[i+1].innerText == undefined){
            return; }

        var profName = instructor[i+1].innerText.slice(0, -1); //slice '&nbsp;'' character
        if(profName == ''){
            console.log("here");
            }
        if ((profName.localeCompare('O. GRAD') != 0) && (profName.localeCompare('') != 0)) {
               console.log(profName);
                    professors.push(profName); //slice remaining space at end & push to professor array
                                var searchName = '';
                                var nameArray = professors[profCount].split(' '); //check if professor's last name is two words to include in search
                                searchName = nameArray[1];
                                var searchURL = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=San+Diego+State+University&queryoption=HEADER&query=' + searchName + '&facetSearch=true';
                                profCount++;
                                chrome.runtime.sendMessage({
                                            url: searchURL
                                        }, function(responseText) {
                                        responseText = responseText.replace('http://blog.ratemyprofessors.com/wp-content/uploads/2015/01/WNOs6.5_RMP_72x72.jpg', '');
                                        responseText = responseText.replace('/assets/chilis/warm-chili.png', '');
                                        responseText = responseText.replace('/assets/chilis/cold-chili.png', '');
                                        responseText = responseText.replace('/assets/mobileAppPromo.png', '');
                                        responseText = responseText.replace('/assets/ok.png', '');
                                        responseText = responseText.replace('/assets/chilis/new-hot-chili.png', '');
                                            processFirstRequest(responseText, professors);
                                        });
        }
    }
}

function processFirstRequest(responseText, professors){
    var tmp = document.createElement('div'); //make a temp element so that we can search through its html
    tmp.innerHTML = responseText;
    var foundProfs = tmp.getElementsByClassName('listing PROFESSOR');
    for(i=0; i < professors.length; i++){
        var nameArray = professors[i].split(' '); //check if professor's last name is two words to include in search
        var firstName = nameArray[0].substring(0,1); //remove period from first initial
        var lastName = nameArray[1].toUpperCase();
        firstName = checkForSubsFirstName(firstName, lastName);

        for(j=0; j < foundProfs.length; j++){
            var tmp = document.createElement('div');
            tmp.innerHTML = foundProfs[j].innerHTML;
            var name = tmp.getElementsByClassName('main')[0].innerText;
            searchLastName = name.split(',')[0].toUpperCase();
            searchFirstName = name.split(',')[1].charAt(1);

            if((lastName.localeCompare(searchLastName) == 0) && (firstName == searchFirstName)){
                var link = tmp.getElementsByTagName('a');
                profURL = 'http://www.ratemyprofessors.com/' + link[0].toString().slice(25); //this is the URL
                chrome.runtime.sendMessage({
                    url: this.profURL
                }, function(responseText) {
                    responseText = responseText.replace('/assets/ok.png', '');
                    responseText = responseText.replace('http://blog.ratemyprofessors.com/wp-content/uploads/2015/01/WNOs6.5_RMP_72x72.jpg', '');
                    responseText = responseText.replace('/assets/chilis/warm-chili.png', '');
                    responseText = responseText.replace('/assets/chilis/cold-chili.png', '');
                    responseText = responseText.replace('/assets/mobileAppPromo.png', '');
                    responseText = responseText.replace('/assets/chilis/new-hot-chili.png', '');
                    addContentToWebPortal(responseText);
                });
                return;
                }
            }
    }
}

function addContentToWebPortal(responseText){

    var sectionMeeting = document.getElementsByClassName('sectionMeeting');
    var sectionRow = document.getElementById('sectionRowTitles');
    var tmp = document.createElement('div');
    tmp.innerHTML = responseText;

    var proffName = tmp.getElementsByClassName('pfname')[0].innerText.replace(/\s/g, '');
    var proflName = tmp.getElementsByClassName('plname')[0].innerText.substring(15).toUpperCase().replace(/\s/g, '');
    var profURL = tmp.getElementsByTagName('link')[1].getAttribute("href");
    var ratingInfo = tmp.getElementsByClassName('left-breakdown')[0];
    var numRatings = tmp.getElementsByClassName('table-toggle rating-count active')[0].innerText;
    numRatings = numRatings.slice(9).split(' ')[0] //check to see if "ratings" is singular or plural
    tmp.innerHTML = ratingInfo.innerHTML;

    //get the raw rating data
    var ratings = tmp.getElementsByClassName('grade');
    var scale = " / 5.0";
    var overall = ratings[0].innerHTML.trim().concat(scale);
    var wouldTakeAgain = ratings[1].innerHTML.trim().concat(scale);
    var difficulty = ratings[2].innerHTML.trim().concat(scale);
    tmp.remove();

    for(i=0; i <= sectionMeeting.length; i++){
        if((typeof sectionMeeting[i]) === undefined){
            return; }

        var instructor = sectionMeeting[i].getElementsByClassName('sectionFieldInstructor');
        profName = instructor[0].innerText.slice(0, -1);
        if((profName.localeCompare('O. GRAD') == 0) || (profName.localeCompare('') == 0)){
             }
        else{

        var nameArray = profName.split(' ');
        var firstName = nameArray[0].substring(0,1);
        var lastName = nameArray[1].toUpperCase();
        firstName = checkForSubsFirstName(firstName, lastName);
        if ((lastName.localeCompare(proflName) == 0) && (firstName.localeCompare(proffName.charAt(0)) == 0)){
                sectionMeeting[i].getElementsByClassName("sectionFieldRating column")[0].innerText = overall;
                sectionMeeting[i].getElementsByClassName('sectionFieldDifficulty column')[0].innerText = difficulty;
                if (numRatings == '1') {
                    sectionMeeting[i].getElementsByClassName('sectionFieldLink column')[0].innerHTML = '<a href="' + profURL + '" target="_blank">' + numRatings + ' rating</a>';
                    } else {
                    sectionMeeting[i].getElementsByClassName('sectionFieldLink column')[0].innerHTML = '<a href="' + profURL + '" target="_blank">' + numRatings + ' ratings</a>';
                    }
        }
    }
    }
    return;
}

function checkForSubsFirstName(firstName, searchName){
    if (firstName == "L" && searchName == "RIGGINS"){
        firstName = "A";
        }
    else if (firstName == "W" && searchName == "ROOT"){
        firstName = "B";
        }
    else if (firstName == "W" && searchName == "Yeager"){
        firstName = "B";
        }
    return firstName;
    }



main();
