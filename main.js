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

    for (i = 0; i < length; i++) //iterate through professor names 
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
        var profName = instructor[i+1].innerText.slice(0, -1); //slice '&nbsp;'' character

        if (profName != 'O. GRAD' && profName != '') {
            professors.push(profName); //slice remaining space at end & push to professor array
            var div = instructor[i]; //cell where the button will go
            var searchName = '';
            var nameArray = professors[profCount].split(' '); //check if professor's last name is two words to include in search
            searchName = nameArray[1];
            var searchURL = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=San+Diego+State+University&queryoption=HEADER&query=' + searchName + '&facetSearch=true';
            div.profURL = '';
            profCount++;
            chrome.runtime.sendMessage({
                        url: searchURL
                    }, function(responseText) {
                        responseText = responseText.replace('http://blog.ratemyprofessors.com/wp-content/uploads/2015/01/WNOs6.5_RMP_72x72.jpg', '');
                        responseText = responseText.replace('/assets/chilis/warm-chili.png', '');
                        responseText = responseText.replace('/assets/chilis/cold-chili.png', '');
                        responseText = responseText.replace('/assets/mobileAppPromo.png', '');
                        responseText = responseText.replace('/assets/ok.png', '');
                        processFirstRequest(responseText, professors);
                    });
        }
    }
}

function checkForSubstitutions(firstName, searchName){
    if (firstName == "L" && searchName == "RIGGINS"){
        firstName = "A";
        }
    return firstName;
    }

function processFirstRequest(responseText, professors){
    var tmp = document.createElement('div'); //make a temp element so that we can search through its html
    tmp.innerHTML = responseText;
    var foundProfs = tmp.getElementsByClassName('listing PROFESSOR');

    for(i=0; i < professors.length; i++){
        var nameArray = professors[i].split(' '); //check if professor's last name is two words to include in search
        var firstName = nameArray[0].substring(0,1); //remove period from first initial
        var lastName = nameArray[1];
        firstName = checkForSubstitutions(firstName, lastName);

        for(j=0; j < foundProfs.length; j++){
            var tmp = document.createElement('div');
            tmp.innerHTML = foundProfs[j].innerHTML;
            var name = tmp.getElementsByClassName('main')[0].innerText;
            searchLastName = name.split(',')[0].toUpperCase();
            searchFirstName = name.split(',')[1].charAt(1);

            if((searchLastName == lastName) && (firstName == searchFirstName)){
                var link = tmp.getElementsByTagName('a');
                profURL = 'http://www.ratemyprofessors.com/' + link[0].toString().slice(25); //this is the URL
                chrome.runtime.sendMessage({
                    url: this.profURL
                }, function(responseText) {
                    responseText = responseText.replace('http://blog.ratemyprofessors.com/wp-content/uploads/2015/01/WNOs6.5_RMP_72x72.jpg', '');
                    responseText = responseText.replace('/assets/chilis/warm-chili.png', '');
                    responseText = responseText.replace('/assets/chilis/cold-chili.png', '');
                    responseText = responseText.replace('/assets/mobileAppPromo.png', '');
                    responseText = responseText.replace('/assets/ok.png', '');
                    addContentToWebPortal(responseText, profURL, professors);
                });
                }
            }
    }
}

function addContentToWebPortal(responseText, profURL, professors){

    var test = document.getElementsByClassName('sectionMeeting');
    console.log(test);
    var sectionRow = document.getElementById('sectionRowTitles');

    var tmp = document.createElement('div');
    tmp.innerHTML = responseText;
//    console.log(tmp.innerHTML);
    var proffName = tmp.getElementsByClassName('pfname')[0].innerText;
    var proflName = tmp.getElementsByClassName('plname')[0].innerText.substring(15).toUpperCase();
    var proffURL = tmp.getElementsByClassName()

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


    for(i=0; i <= test.length; i++){
        var instructor = test[i].getElementsByClassName('sectionFieldInstructor');
        profName = instructor[0].innerText.slice(0, -1);
        var nameArray = profName.split(' ');
        var firstName = nameArray[0].substring(0,1);
        var lastName = nameArray[1];
        firstName = checkForSubstitutions(firstName, lastName);

        if ((firstName == proffName.charAt(1)) && (lastName = proflName)){
                test[i].getElementsByClassName("sectionFieldRating column")[0].innerText = overall;
                test[i].getElementsByClassName('sectionFieldDifficulty column')[0].innerText = difficulty;
                    if (numRatings == '1') {
                        test[i].getElementsByClassName('sectionFieldLink column')[0].innerHTML = '<a href="' + profURL + '" target="_blank">' + numRatings + ' rating</a>';
                    } else {
                        test[i].getElementsByClassName('sectionFieldLink column')[0].innerHTML = '<a href="' + profURL + '" target="_blank">' + numRatings + ' ratings</a>';
                    }
                break
                }
            }
}

main();
