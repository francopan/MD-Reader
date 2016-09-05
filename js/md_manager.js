/*
	This function reads a markdown file and writes it into an HTML
	@param url - String - Url of the markdown file
	@param location - String - id of where the html is going to be placed

	1) Creates an ajax request
	2) Parse the file (using showdown)
	3) Insert into an article tag
	4) Creates table of contents
*/
function open_md(url,location){

	//Makes an AJAX request
	let oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "text";

	oReq.onload = function(oEvent) {

		 //When the request is loaded, makes the conversion from .md to html
		 let converter = new showdown.Converter();
		 converter.setOption('tables', 'true');
		 converter.setOption('simplifiedAutoLink','true');
		 html			= converter.makeHtml(oReq.response);

		 //Applies into the article tag
		 document.getElementById(location).innerHTML = html;

		 //Creates Table of contents
		 create_toc();

		return oReq.response;

	};

	oReq.send();

}

/*
This function creates a table of contents.

1) Select all of the headers.
2) Indentify header by a number (Ex.: 1.0.1, 2.1, 3.2, ...)
2) Creates regex that can match the number of each header
3) Creates an 'li' element for each header
4) Append the 'li' element into the list
*/
function create_toc(){

		let content_list = document.getElementById('content_list'); //current 'ol' element
		let headers = document.getElementById('paper').querySelectorAll("h1, h2, h3, h4, h5, h6"); //get all headers
		let counter = [0, 0, 0, 0]; //Counter of headers (h1,h2,h3,h4)
		let regex = { h1 : new RegExp("^[0-9][0-9]*$"), //Ex.: 1
									h2 : new RegExp("^[0-9][0-9]*.1$"), //Ex.: 2.1
									h3 : new RegExp("^[0-9][0-9]*.[0-9][0-9]*.1$"), //Ex.: 4.2.1
									h4 : new RegExp("^[0-9][0-9]*.[0-9][0-9]*.[0-9][0-9]*.1$") //Ex.: 1.3.2.1
								};

		for (var index in headers) {

			if(headers[index].tagName === undefined)	continue;
				let li = document.createElement("li");
				let hN = 0;

				switch(headers[index].tagName){
					case 'H1':{
						hN = 1;
						content_list = document.getElementById('content_list'); //set content list
						break;
					}
					case 'H2':{
						hN = 2; //H2
						//if the first element of the list is an H1, creates a list of H2
						if(regex.h1.test(content_list.firstChild.innerHTML.split(")")[0])){
							content_list = content_list.appendChild(document.createElement("ol"));
						}else{
							//If the first element of list is a H3, exit list and goes back 1 node
							if(regex.h3.test(content_list.firstChild.innerHTML.split(")")[0])){
									content_list = content_list.parentNode;
							}
							//If the first element of list is a H4, exit list and goes back 2 nodes
							if(regex.h4.test(content_list.firstChild.innerHTML.split(")")[0])){
									content_list = content_list.parentNode.parentNode;
							}
						}
						break;
					}

					case 'H3':{
						hN = 3; //H3
						//Check if is a new list (and creates it)
						if(regex.h2.test(content_list.getElementsByTagName('li')[0].innerHTML.split(")")[0])){
							content_list = content_list.appendChild(document.createElement("ol"));
						}else{
							//If is end of list, exit list and goes back one node
							if(regex.h4.test(content_list.firstChild.innerHTML.split(")")[0])){
									content_list = content_list.parentNode;
							}
						}
						break;
					}
					case 'H4':{
						hN = 4; //H4
						//Check if is a new list (and creates it)
						if(regex.h3.test(content_list.getElementsByTagName('li')[0].innerHTML.split(")")[0])){
							content_list = content_list.appendChild(document.createElement("ol"));
						}
					break;
					}
				}

				//increments counter, add to title, appendChild
				counter[--hN]++;
				for(i=3;i>hN;i--) counter[i] = 0;
				for(i = 0; i<=hN ;i++) li.innerHTML += counter[i] + '.';
				li.innerHTML = li.innerHTML.replaceAt(li.innerHTML.length -1,") ");
				li.innerHTML += "<button href='#' onclick='scrollTo(0," + headers[index].offsetTop + ")'>" + headers[index].innerHTML + "</button>";
				content_list.appendChild(li);
		}
}
