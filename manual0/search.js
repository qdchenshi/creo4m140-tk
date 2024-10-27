
function getXPos(item)
{
  var x = 0;
  if (item.offsetWidth) {
    while (item && item!=document.body)  {
      x   += item.offsetLeft;
      item = item.offsetParent;
    }
  }
  return x;
}

function getYPos(item)
{
  var y = 0;
  if (item.offsetWidth) {
     while (item && item!=document.body) {
       y   += item.offsetTop;
       item = item.offsetParent;
     }
  }
  return y;
}

function SearchBox(name, resultsPath, inFrame, label)
{	
  if (!name || !resultsPath) {  alert("Missing parameters to SearchBox."); }
   
  // ---------- Instance variables
  this.name                  = name;
  this.resultsPath           = resultsPath;
  this.keyTimeout            = 0;
  this.keyTimeoutLength      = 500;
  this.closeSelectionTimeout = 300;
  this.lastSearchValue       = "";
  this.lastResultsPage       = "";
  this.hideTimeout           = 0;
  this.searchIndex           = 0;
  this.searchActive          = false;
  this.insideFrame           = inFrame;
  this.searchLabel           = label;

  // ----------- DOM Elements

  this.DOMSearchField = function() {
    return document.getElementById("ApiSearchField");  }

  this.DOMSearchSelect = function() {
    return document.getElementById("ApiSearchSelect");  }

  this.DOMSearchSelectWindow = function() {
    return document.getElementById("ApiSearchSelectWindow");  }

  this.DOMPopupSearchResults = function() {
    return document.getElementById("ApiSearchResults");  }

  this.DOMPopupSearchResultsWindow = function() {  
	return document.getElementById("ApiSearchResultsWindow");  }

  this.DOMSearchClose = function() {  
	return document.getElementById("ApiSearchClose"); }

  this.DOMSearchBox = function() {  
	return document.getElementById("ApiSearchBox");  }

  // ------------ Event Handlers

  // Called when focus is added or removed from the search field.
  this.OnSearchFieldFocus = function(isActive) {
    this.Activate(isActive);
  }

  this.OnSearchSelectShow = function() {
    var searchSelectWindow = this.DOMSearchSelectWindow();
    var searchField        = this.DOMSearchSelect();

    if (this.insideFrame) {
      var left = getXPos(searchField);
      var top  = getYPos(searchField);
      left += searchField.offsetWidth + 6;
      top += searchField.offsetHeight;

      // show search selection popup
      searchSelectWindow.style.display='block';
      left -= searchSelectWindow.offsetWidth;
      searchSelectWindow.style.left =  left + 'px';
      searchSelectWindow.style.top  =  top  + 'px';
    }  else  {
      var left = getXPos(searchField);
      var top  = getYPos(searchField);
      top += searchField.offsetHeight;

      // show search selection popup
      searchSelectWindow.style.display='block';
      searchSelectWindow.style.left =  left + 'px';
      searchSelectWindow.style.top  =  top  + 'px';
    }

    // stop selection hide timer
    if (this.hideTimeout)  {
      clearTimeout(this.hideTimeout);
      this.hideTimeout=0;
    }
    return false; // to avoid "image drag" default event
  }

  this.OnSearchSelectHide = function() {
    this.hideTimeout = setTimeout(this.name +".CloseSelectionWindow()",
                                  this.closeSelectionTimeout);
  }

  // Called when the content of the search field is changed.
  this.OnSearchFieldChange = function(evt) {
    if (this.keyTimeout) { // kill running timer
    
      clearTimeout(this.keyTimeout);
      this.keyTimeout = 0;
    }

    // strip whitespaces
    var searchValue = this.DOMSearchField().value.replace(/ +/g, "");

    if (searchValue != this.lastSearchValue) { // search value has changed
    
      if (searchValue != "") { // non-empty search 
    
        // set timer for search update
        this.keyTimeout = setTimeout(this.name + '.Search()',
                                     this.keyTimeoutLength);
              this.DOMPopupSearchResultsWindow().style.display = 'block';
      } else { // empty search field
      
        this.DOMPopupSearchResultsWindow().style.display = 'block';
        this.DOMSearchClose().style.display = 'block';
        this.lastSearchValue = '';
      }
    }
  }

/*
*   Called when an search filter selection is made.
*   set item with index id as the active item
*/
  // Closes the results window.
  this.CloseResultsWindow = function() {
    this.DOMPopupSearchResultsWindow().style.display = 'none';
    this.DOMSearchClose().style.display = 'none';
    //this.Activate(false);
    this.DOMSearchField().value   = '';
  }

  this.CloseSelectionWindow = function() {
    this.DOMSearchSelectWindow().style.display = 'none';
  }

  // Performs a search.
  this.Search = function() {
    this.keyTimeout = 0;	
    // strip leading whitespace
    var searchValue = this.DOMSearchField().value.replace(/^ +/, "");

/*
*  Code to search entries from text.js
*	including wildcard search
*/	
	var results_entry = [];
    var resultsPage;
    var resultsPageWithSearch;
    var hasResultsPage;

    var realSearchString = "";
    var tempSearchString = searchValue.split("*");
    for (i = 0; i < tempSearchString.length; i++) {        
        realSearchString = realSearchString.concat(tempSearchString[i]);
        if (i != tempSearchString.length - 1)
            realSearchString = realSearchString.concat("(.*)");
    }
    var regex = new RegExp(realSearchString, "i");

   
    for (var i = 0; i < searchData.length; i++)  {      
        if (regex.test (searchData[i][0]) ) {     
            results_entry.push(i);            
        }
    }	
    resultsPage = './text.html';
		
    resultsPageWithSearch = resultsPage + '?' + (results_entry);
	hasResultsPage = true;

    window.frames.ApiSearchResults.location = resultsPageWithSearch;  	
    var domPopupSearchResultsWindow = this.DOMPopupSearchResultsWindow();
	
	if (domPopupSearchResultsWindow.style.display!='block') {
       var domSearchBox = this.DOMSearchBox();
       this.DOMSearchClose().style.display = 'inline';	   
       if (this.insideFrame) {
         var domPopupSearchResults = this.DOMPopupSearchResults();
         domPopupSearchResultsWindow.style.position = 'relative';
         domPopupSearchResultsWindow.style.display  = 'block';
         var width = document.body.clientWidth - 8; 
         domPopupSearchResultsWindow.style.width    = width + 'px';
         domPopupSearchResults.style.width          = width + 'px';
       } else {  
         var domPopupSearchResults = this.DOMPopupSearchResults();
         var left = getXPos(domSearchBox) + 150; 
         var top  = getYPos(domSearchBox) + 20;   
         domPopupSearchResultsWindow.style.display = 'block';
         left -= domPopupSearchResults.offsetWidth;
         domPopupSearchResultsWindow.style.top     = top  + 'px';
         domPopupSearchResultsWindow.style.left    = left + 'px';
       }
      } else {
          var domSearchBox = this.DOMSearchBox();
          this.DOMSearchClose().style.display = 'inline';
          var domPopupSearchResults = this.DOMPopupSearchResults();
          var left = getXPos(domSearchBox) + 150;
          var top = getYPos(domSearchBox) + 20;
          domPopupSearchResultsWindow.style.display = 'block';
          left -= domPopupSearchResults.offsetWidth;
          domPopupSearchResultsWindow.style.top = top + 'px';
          domPopupSearchResultsWindow.style.left = left + 'px';
    }
    this.lastSearchValue = searchValue;	
    this.lastResultsPage = resultsPage;
  }
  
/* 
* -------- Activation Functions
* Activates or deactivates the search panel, resetting things to 
* their default values if necessary. 
*/
  this.Activate = function(isActive) {		
    if (isActive || // open it
        this.DOMPopupSearchResultsWindow().style.display == 'block' 
       )  {		
		
      this.DOMSearchBox().className = 'ApiSearchBoxActive';

      var searchField = this.DOMSearchField();

      if (searchField.value == this.searchLabel) { // clear "Search" term upon entry      
        searchField.value = '';  
        this.searchActive = true;
      }
    } else if (!isActive) { // directly remove the panel
    
      this.DOMSearchBox().className = 'ApiSearchBoxInactive';
      this.DOMSearchField().value   = this.searchLabel;
      this.searchActive             = false;
      this.lastSearchValue          = ''
      this.lastResultsPage          = '';
    }		
  } 
}

/*
*	The class that handles everything on the search results page
*    
*/
function SearchResults(name) {
    this.lastMatchCount = 0;
    this.lastKey = 0;
    this.repeatOn = false;
	
    // Toggles the visibility of the passed element ID.
    this.FindChildElement = function(id) {
      var parentElement = document.getElementById(id);
      var element = parentElement.firstChild;

      while (element && element!=parentElement) {
        if (element.nodeName == 'DIV' && element.className == 'SRChildren') {
          return element;
        }

        if (element.nodeName == 'DIV' && element.hasChildNodes()) {  
           element = element.firstChild;  
        } else if (element.nextSibling) {  
           element = element.nextSibling;  
        } else {
          do  {
            element = element.parentNode;
          }
          while (element && element!=parentElement && !element.nextSibling);

          if (element && element!=parentElement) {  
            element = element.nextSibling;  
          }
        }
      }
    }

    this.Toggle = function(id) {
      var element = this.FindChildElement(id);
      if (element) {
        if (element.style.display == 'block') {
          element.style.display = 'none';
        } else {
          element.style.display = 'block';
        }
      }
    }

/* 
* Searches for the passed string.  If there is no parameter,
* it takes it from the URL query.
*
* Always returns true, since other documents may try to call it
* and that may or may not be possible.
*/	
    this.Search = function(search) {	
      if (!search) { // get search word from URL      
        search = window.location.search;
        search = search.substring(1);  
        search = unescape(search);
      }

      search = search.replace(/^ +/, ""); // strip leading spaces
      search = search.replace(/ +$/, ""); // strip trailing spaces
      search = search.toLowerCase();

      var resultRows = document.getElementsByTagName("div");
      var matches = 0;

      var i = 0;
      while (i < resultRows.length) {
        var row = resultRows.item(i);
        if (row.className == "SRResult") {
          var rowMatchName = row.id.toLowerCase();
          rowMatchName = rowMatchName.replace(/^sr\d*_/, ''); 

          if (search.length<=rowMatchName.length && 
             rowMatchName.substr(0, search.length)==search) {
            row.style.display = 'block';
            matches++;
          } else {
            row.style.display = 'none';
          }
        }
        i++;
      }
      this.lastMatchCount = matches;
      return true;
    }
	    // return the first item with index, index or higher that is visible
    this.NavNext = function(index) {
      var focusItem;
      while (1) {
        var focusName = 'Item'+index;
        focusItem = document.getElementById(focusName);
        if (focusItem && focusItem.parentNode.parentNode.style.display=='block') {
          break;
        } else if (!focusItem) { // last element        
          break;
        }
        focusItem=null;
        index++;
      }
      return focusItem;
    }

    this.NavPrev = function(index) {
      var focusItem;
      while (1) {
        var focusName = 'Item'+index;
        focusItem = document.getElementById(focusName);
        if (focusItem && focusItem.parentNode.parentNode.style.display=='block') {
          break;
        } else if (!focusItem) { // last element
          break;
        }
        focusItem=null;
        index--;
      }
      return focusItem;
    }

    this.ProcessKeys = function(e) {
      if (e.type == "keydown") {
        this.repeatOn = false;
        this.lastKey = e.keyCode;
      } else if (e.type == "keypress") {
        if (!this.repeatOn) {
          if (this.lastKey) this.repeatOn = true;
          return false; // ignore first keypress after keydown
        }
      } else if (e.type == "keyup") {
        this.lastKey = 0;
        this.repeatOn = false;
      }
      return this.lastKey!=0;
    }

    this.Nav = function(evt,itemIndex)  {
      var e  = (evt) ? evt : window.event; // for IE
      if (e.keyCode==13) 
		return true;
      if (!this.ProcessKeys(e)) 
		return false;

      if (this.lastKey==38) {// Up
        var newIndex = itemIndex-1;
        var focusItem = this.NavPrev(newIndex);
        if (focusItem) {
          var child = this.FindChildElement(focusItem.parentNode.parentNode.id);
          if (child && child.style.display == 'block') {// children visible
            var n=0;
            var tmpElem;
            while (1) { // search for last child
              tmpElem = document.getElementById('Item'+newIndex+'_c'+n);
              if (tmpElem) {
                focusItem = tmpElem;
              } else {// found it!
                break;
              }
              n++;
            }
          }
        }
        if (focusItem) {
          focusItem.focus();
        } else {// return focus to search field
           parent.document.getElementById("ApiSearchField").focus();
        }
      }
      else if (this.lastKey==40) {// Down
        var newIndex = itemIndex+1;
        var focusItem;
        var item = document.getElementById('Item'+itemIndex);
        var elem = this.FindChildElement(item.parentNode.parentNode.id);
		
        if (elem && elem.style.display == 'block') {// children visible
          focusItem = document.getElementById('Item'+itemIndex+'_c0');
        }
        if (!focusItem) focusItem = this.NavNext(newIndex);
        if (focusItem)  focusItem.focus();
      } else if (this.lastKey==39) // Right
      {
        var item = document.getElementById('Item'+itemIndex);
        var elem = this.FindChildElement(item.parentNode.parentNode.id);
        if (elem) elem.style.display = 'block';
      } else if (this.lastKey==37) // Left
      {
        var item = document.getElementById('Item'+itemIndex);
        var elem = this.FindChildElement(item.parentNode.parentNode.id);
        if (elem) elem.style.display = 'none';
      } else if (this.lastKey==27) // Escape
      {
        parent.searchBox.CloseResultsWindow();
        parent.document.getElementById("ApiSearchField").focus();
      } else if (this.lastKey==13) // Enter
      {
        return true;
      }
      return false;
    }

    this.NavChild = function(evt,itemIndex,childIndex) {
	
      var e  = (evt) ? evt : window.event; // for IE
      if (e.keyCode==13) return true;
      if (!this.ProcessKeys(e)) return false;

      if (this.lastKey==38) // Up
      {
        if (childIndex>0) {
          var newIndex = childIndex-1;
          document.getElementById('Item'+itemIndex+'_c'+newIndex).focus();
        } else {// already at first child, jump to parent
          document.getElementById('Item'+itemIndex).focus();
        }
      } else if (this.lastKey==40) {// Down
	  
        var newIndex = childIndex+1;
        var elem = document.getElementById('Item'+itemIndex+'_c'+newIndex);
        if (!elem) // last child, jump to parent next parent
        {
          elem = this.NavNext(itemIndex+1);
        }
        if (elem)
        {
          elem.focus();
        } 
      } else if (this.lastKey==27) {// Escape
        parent.searchBox.CloseResultsWindow();
        parent.document.getElementById("ApiSearchField").focus();
      } else if (this.lastKey==13) {// Enter      
        return true;
      }
      return false;
    }
}

/*
*	This sets actions to results page 
*    for all the searched entries.
*/
function setKeyActions(elem,action) 
{
  elem.setAttribute('onkeydown',action);
  elem.setAttribute('onkeypress',action);
  elem.setAttribute('onkeyup',action);
}

/*
*	This creates results page 
*    with all the searched entries.
*/
function createResults(results_entry) 
{
   var results = document.getElementById("SRResults");     
   
   for (var j = 0; j < results_entry.length; j++) {    
    var e = results_entry[j];
	var apiNameId = searchData[e][0];
	var id = apiNameId;	
	 	
	var srResult = document.createElement('div');
	srResult.setAttribute('id','SR_'+id);
	srResult.setAttribute('class','srResult');
	srResult.setAttribute('className','SRResult');
	
	var srEntry = document.createElement('div');
    srEntry.setAttribute('class','srEntry');
	srEntry.setAttribute('className','SREntry');
	
	var apiName = searchData[e][1][0];
	var apiLink = searchData[e][1][1][0];
	var deprecEntry = searchData[e][1][1][2];	
	
	var srLink = document.createElement('a');  
	srLink.setAttribute('id','Item'+j);
	setKeyActions(srLink,'return searchResults.Nav(event,'+j+')');
	
	if(deprecEntry != "deprecated") {
		srLink.setAttribute('class','srLink');		
	} else {
		srLink.setAttribute('class','srLinkDep');		
	}	
	srLink.setAttribute('className','SRSymbol');
	
	srLink.innerHTML = apiName;
	srEntry.appendChild(srLink);
	srLink.setAttribute('href',apiLink);	
	srLink.setAttribute('target','main');

    srResult.appendChild(srEntry);	
	results.appendChild(srResult);		
  }
}
