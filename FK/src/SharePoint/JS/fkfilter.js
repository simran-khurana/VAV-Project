var siteUrl = '/sites/MySiteCollection';
var baseFilter = "/_api/Web/Lists/getbytitle('"+FKLISTNAME+"')/items?$select=FileRef, FileLeafRef, ID,Modified,Editor/Title,FacilityName/ID, FacilityName/Title,FileFormat/Title,FileFormat/ID,DocumentType/Title,DocumentType/ID,FacilityType/Title,FacilityType/ID";
var expandExpression = "&$expand=FacilityName/ID,FileFormat/ID, DocumentType/ID, FacilityType/ID,Editor/ID";
var baseFilterExpression = "&$filter=";
var filterExpression = "";
var filtertokens = [];
var itemSearch=[];
var facilityNamesList=[];
var facilityName ="";
// var myMap = new Map();
// myMap.set("DocumentTypes", "DocumentType/ID");
// myMap.set("FileFormats", "FileFormat/ID");
// myMap.set("FacilityNames", "FacilityName/ID");
// myMap.set("FacilityTypes", "FacilityType/ID");

// var mappedArray=[{'DocumentTypes':'DocumentType/ID'},
					// {'FileFormats':'FileFormats'},
					// {'FacilityNames':'FacilityNames'},
					// {'FacilityTypes':'FacilityTypes'}];

var mappedArray = {"DocumentTypes":"DocumentType/ID","FileFormats":"FileFormat/ID","FacilityNames":"FacilityName/ID","FacilityTypes" :"FacilityType/ID"};

var selectHtml = "";


	//Set callback when SP-script loaded
	ExecuteOrDelayUntilScriptLoaded(GetSiteUrl, "sp.js")
	
	
	//SP-script loaded, do init operations
	function GetSiteUrl()
	  {
	   
	  	selectHtml += "<p id='form_output'></p>";
  	 	selectHtml += "<form id=\"filterform\" action=\"form_action.asp\">";
       selectHtml += "<div class='row'>"; 
	    var ctx = new SP.ClientContext();
	    var site = ctx.get_site();
	    ctx.load(site);
	    ctx.executeQueryAsync(function(s, a){
	    	
	    	siteUrl = site.get_url();
			
	    	var dfd = retrieveListItems("FacilityTypes");
    		dfd.done(function(){
				dfd = retrieveListItems("FacilityNames");
	    		dfd.done(function(){
						dfd = retrieveListItems("DocumentTypes");
			    		dfd.done(function(){
								dfd = retrieveListItems("FileFormats");
					    		dfd.done(function(){
					    			selectHtml += '';
									selectHtml += "</form>";
									 selectHtml += "</div>"; 
									$("#fk").append(selectHtml);
									handleSubmit();
									handleSearch();
					    		});
								dfd.fail(function(){alert("Failed retrieving FacilityTypes");});
							}
						);
						dfd.fail(function(){alert("Failed retrieving Facility Names");});
					}
				);
				dfd.fail(function(){alert("Failed retrieving FileFormats");});
			}
			);
			dfd.fail(function(){alert("Failed retrieving DocumentTypes");});
	    },
	    function(err)
	    {
	    	alert("error opening site: " + err);
	    }
	    );
	  }

	
function handleFilters()
{
	
           $(".doccontainer").attr('style','display:none');
			$(".sortable").find("tbody tr").remove(); 
			filtertokens = [];    
			var filterBoxes=$(".filterbox");
			
			for(var i=0;i<filterBoxes.length;i++){
				var box=filterBoxes[i];
				var boxName=$(box).attr('name');
				var items = [];
				var classesApplied=$(box).attr('class');				
				if(classesApplied!='FacilityNames filterbox'){
					var boxInputs=$(box).find('.filters');
					for(j=0;j<boxInputs.length;j++){
						if(boxInputs[j].checked){
							var itemValue=$(boxInputs[j]).attr('id');
							items.push(
							{
								item: itemValue
							});	
						}
					}
			}	
else
{
	
	if(facilityName !=""){
	 var facNameSearch = jQuery.grep(facilityNamesList, function( fname) {
			  return ( fname.ft==facilityName );
			});
	itemValue = facNameSearch[0].id
	items.push(
							{
								item: itemValue
							});	
	
	
}	
			}
	filtertokens.push(
				{
					filterid: boxName,
					items: items
				});
				}
				var queryFilter=AssembleFilter2(filtertokens);
			if(queryFilter!=''){
				$(".overlay").show();
			$('.loader').attr('style','display:inline !important');
					var facilityFilterExpression = siteUrl + baseFilter + expandExpression + queryFilter;
					
					console.log("facility filter "+ facilityFilterExpression);
			getFacilityNames(facilityFilterExpression, displayFacilities);
          	   
			if(facilityName!= "")
			{
				$(".docfilter").attr("checked","true");
				docFilter();
			}
			}
			else
			{
				document.getElementById("facilitites").innerHTML = "";
			}
				
}
    
	function handleSubmit()
	{		
		$(".filters").change(function() {
			handleFilters();
		}); 
		
	}
	function handleSearch(){
		 $("#textbox").keypress(function() {
			$("#textbox").autocomplete({
			source: itemSearch,
			select : function (event, ui) {
			
			}
			});
		});
		$("#textbox").focusin(function() { 
		$(".button").show();
        $("#textbox").attr('style','width:90px').val('');
        $("#facilitites").html('');
        $(".doccontainer").attr('style','display:none');
		$(".sortable").find("tbody tr").remove(); 
  
  });
		$("#textbox").focusout(function() { 
		facilityName = $("#textbox").val();
		if(facilityName == "")
		{
			handleFilters();
		}
		});
		$("#searchClick").click(function(){
			 facilityName= $("#textbox").val();
			
			$("#facilitites").html('');
		   var searchedName = jQuery.grep(facilityNamesList, function( fname) {
			  return ( fname.ft==facilityName );
			});
			if(searchedName.length>0)
			{
			
			
			document.getElementById("facilitites").innerHTML += "<div class ='facility'><input id='"+searchedName[0].id+"' class='docfilter' checked='true' onchange='docFilter()' type='checkbox' /><span class ='facdisp'>" + searchedName[0].ft+"</span></div>";
	        docFilter();
			$(".button").hide();
			$("#textbox").attr('style','width:180px');
		
			}
	});
	}
	// filter applied for displaying documents 
function docFilter()
	{
		
		$(".doccontainer").attr('style','display:none');
		$(".sortable").find("tbody tr").remove(); 
		var filterBoxes=$(".docfilter");
			
        	var items = [];
			for (index =  0 ; index<filtertokens.length;index++)
			{
			if(filtertokens[index].filterid == "FacilityNames")
			{
				filtertokens.splice(index, 1);
		    }
		    }
				for(j=0;j<filterBoxes.length;j++){
				if(filterBoxes[j].checked){
							var itemValue=$(filterBoxes[j]).attr('id');
							items.push(
							{
						      item: itemValue
							});	
						}
					}
					
					filtertokens.push(
				{
					filterid: "FacilityNames",
					items: items
				});	 
				if(items.length!=0)
				{
					$(".overlay").show();
			$('.loader').attr('style','display:inline !important');
					var docFilterExpression = siteUrl + baseFilter + expandExpression + AssembleFilter2(filtertokens);
console.log("doc filter "+docFilterExpression);
			performSearch(docFilterExpression, displayDocuments);
			$(".doccontainer").attr('style','display:block');
			 
				}
				else
				{
					$(".doccontainer").attr('style','display:none');
		            $(".sortable").find("tbody tr").remove(); 
				}
				
	}
function AssembleFilter2(filterTokens)
{
	var filtersAnd = [];
	var filtersOr = [];
    var facTypeCount = 0;
	for (var token  in filterTokens) {
		
		var filterKey=mappedArray[filterTokens[token].filterid];
		
  		//var filterKey = myMap.get(filterTokens[token].filterid);
		
		if (filterTokens[token].items.length > 0)
  		{
			if(filterKey == "FacilityType/ID")
			{
				facTypeCount +=1;
				if(facTypeCount>1)
				{
					filtersAnd=[];
				}
				else
				{
					filtersOr = [];
				}
			}
			else
			{
				filtersOr = [];
			}
			
			for(var item in filterTokens[token].items) {
				filtersOr.push(filterKey + " eq '" + filterTokens[token].items[item].item + "'");
  			}
  			filtersAnd.push(filtersOr);
  		}
	}
	
	//Iterate all filters and build full filter expression
	filterExpression = '';
	
	if (filtersAnd.length > 0)
	{	
filterExpression = baseFilterExpression;
		filterExpression += "(";
	
		for (i = 0;i < filtersAnd.length;i++)
		{
			if (i > 0)
				filterExpression += " and ";
			    filterExpression += "(";
			for (j = 0;j < filtersAnd[i].length;j++)
			{
				if (j > 0)
				filterExpression += " or ";
				filterExpression += "(" + filtersAnd[i][j] + ")";	
			}
			filterExpression += ")";
			
		}	
		filterExpression += ")";
		filterExpression += "&$top=5000";
		return filterExpression;
	}
   return filterExpression;
}


//retrieve list items (lookup items) that will be used for filtering main list
function retrieveListItems(filterOperator) {
    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(filterOperator);
    var camlQuery = SP.CamlQuery.createAllItemsQuery();
    var collListItem = oList.getItems(camlQuery);
        
    clientContext.load(collListItem);
	var dfd = $.Deferred();

    clientContext.executeQueryAsync(Function.createDelegate(this, function(){onQuerySucceeded(dfd, collListItem, filterOperator )}), Function.createDelegate(this, onQueryFailed));   

	return dfd.promise();
}

function onQuerySucceeded(dfd, collListItem, filterOperator ) {
	
 	var listItemEnumerator = collListItem.getEnumerator();
	        

		if(filterOperator=="FacilityTypes"){
					 var vannDiv ="<div class='labelHead' ><label>Vann</label><br/><br/><div name='"+filterOperator+"'  class='VANN filterbox'>";
					 vannDiv += "<img class= 'image'  src='/sites/vavdev/SiteAssets/Images/VANN.PNG'  /></br>";
	var AvlopDiv = "<div class='labelHead' ><label>AvlØp</label><br/><br/><div name='"+filterOperator+"'  class='AVLØP filterbox'>";
	AvlopDiv += "<img class= 'image' src='/sites/vavdev/SiteAssets/Images/AVLOP.PNG'  /></br>";
	

    while (listItemEnumerator.moveNext()) {
    	var oListItem = listItemEnumerator.current;
		
		var basetype=oListItem.get_item('BaseType');
		var value=oListItem.get_item('Title');
		if(basetype=="VANN"){
	
			vannDiv+="<input value='"+value+"' class='filters' type='checkbox' id='"+oListItem.get_id()+"'/><label>"+oListItem.get_item('Title')+"</label><br/>";

		}
		else if(basetype=="AVLØP"){

			AvlopDiv+="<input value='"+value+"' class='filters' type='checkbox' id='"+oListItem.get_id()+"'/><label>"+oListItem.get_item('Title')+"</label><br/>";
		}
    }
	vannDiv+="</div></div>";
	AvlopDiv+="</div></div>";
	
	selectHtml+=vannDiv+AvlopDiv;
		}
		else{
			var heading = '',imgSrc='';
			
			if(filterOperator=="FacilityNames"){
	heading = "Anlegg";
	imgSrc = "/sites/vavdev/SiteAssets/Images/Anlegg.PNG";		
}
else if(filterOperator=="DocumentTypes"){
	heading = "Dokumenttype";
	imgSrc = "/sites/vavdev/SiteAssets/Images/DokumentType.PNG";
}

else if(filterOperator=="FileFormats"){
	heading = "Format";
	imgSrc = "/sites/vavdev/SiteAssets/Images/Format.PNG";
}
selectHtml+="<div class='labelHead'><label>"+heading+"</label><br/><br/><div name='"+filterOperator+"' class='"+filterOperator+" filterbox'>";
selectHtml += "<img class= 'image'  src='"+imgSrc+"'  /></br>";

if(filterOperator!="FacilityNames"){
	      while (listItemEnumerator.moveNext()) {
    	var oListItem = listItemEnumerator.current;
		selectHtml+="<input value='"+value+"' class='filters' type='checkbox' id='"+oListItem.get_id()+"'/><label>"+oListItem.get_item('Title')+"</label><br/>";
       
    }
}
else if(filterOperator=="FacilityNames"){
	
	 while (listItemEnumerator.moveNext()) {
	 var oListItem = listItemEnumerator.current;	
	 itemSearch.push(oListItem.get_item('Title'));	
	 facilityNamesList.push(
					{
					ft: oListItem.get_item('Title'),
					id: oListItem.get_id()
					});	
   

	 }
	selectHtml +="<br/><input id='textbox' class='filters' type = 'text'><input class='button' id='searchClick' type = 'button' value = 'Søk'>"
	
}
	 selectHtml += "</div></div>"; 
		}
		dfd.resolve();
}
function onQueryFailed(sender, args) {
 alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
$(function(){
  $('#keywords').tablesorter(); 
 });