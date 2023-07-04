var window_height, window_width;
//var ismenuopen = false;
//var is_mobile_phone = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;
var cookie_name = "githubKey";


$( document ).ready(function() {
	if(readCookie(cookie_name)) {
		$(".reset_button").css("display", "block");
		$(".key_input").css("display", "none");
		$(".checkboxdiv").css("display", "none");
	}
	else {
		$(".reset_button").css("display", "none");
		$(".key_input").css("display", "block");
		$(".checkboxdiv").css("display", "block");
	}
	
	
	beReadyPage();
	setTimeout(function() { beReadyPage();}, 100);
	setTimeout(function() { beReadyPage();}, 1000);
});


$(document).keydown(function(e){
	//e.preventDefault();
	
	//alert(e.keyCode);
	
	if(e.keyCode == 13)
		changeJsonCurrentTime();
});




$(window).scroll(function(event){
	
	
	
	
});


function beReadyPage () {
	window_height = parseInt($( window ).height());
	window_width = parseInt($( window ).width());
}




$( window ).resize(function() {
	beReadyPage();
	setTimeout(function() { beReadyPage();}, 100);
	return;
});

function resetKey() {
	deleteCookie(cookie_name);
		$(".reset_button").css("display", "none");
		$(".key_input").css("display", "block");
		$(".checkboxdiv").css("display", "block");
}


function changeJsonCurrentTime() {
	var datetimedatajson = {
"year": "2023",
"month": "7",
"day": "4",
"hours": "11",
"minutes": "47",
"second": "10"
};
	var currentDate = new Date();
	
	datetimedatajson.second = currentDate.getSeconds();
	datetimedatajson.minutes = currentDate.getMinutes();
	datetimedatajson.hours = currentDate.getHours();
	datetimedatajson.day = currentDate.getDate();
	datetimedatajson.month = currentDate.getMonth() + 1;
	datetimedatajson.year = currentDate.getFullYear();
	var gitkey = [];
  	if(readCookie(cookie_name))
	  	gitkey = readCookie(cookie_name);
	else
		gitkey = $("#key_input_submit").val();
	
	console.log(gitkey);
	if($('#remembercheckbox').prop('checked')) {
		$(".reset_button").css("display", "block");
		$(".key_input").css("display", "none");
		$(".checkboxdiv").css("display", "none");
		setCookie(cookie_name, gitkey, 50);
	}
	uploadJSON(datetimedatajson, gitkey);
}


function uploadJSON(json_object) {

  var token = readCookie(cookie_name);
  const repoOwner = 'kayasrtl';
  const repoName = 'openmycomputer';
  const filePath = './files/data.json';

  // Convert the updated data to JSON
  const updatedJsonData = JSON.stringify(json_object, null, 2);

  // Fetch the current file details, including SHA
  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch file details');
      }
    })
    .then((fileData) => {
      const currentSHA = fileData.sha;

      // Remove backslashes before quotes
      const contentWithoutBackslashes = updatedJsonData.replace(/\\/g, '').replace(/^"(.*)"$/, '$1');

      // Encode the JSON data to base64
      const encoder = new TextEncoder();
      const data = encoder.encode(contentWithoutBackslashes);
      const contentBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));

      // Make an HTTP request to update the file
      return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update JSON file',
          content: contentBase64,
          sha: currentSHA
        })
      });
    })
    .then((response) => {
      if (response.ok) {
        console.log('JSON file updated successfully');
		  return 0;
      } else {
        throw new Error('Failed to update JSON file');
		  return -1;
      }
    })
    .catch((error) => {
      console.error('Error updating JSON file:', error.message);
    });
}


function deleteCookie(cookieName) {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function readCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
