
var xmlDoc;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
	    myFunction(this);
    }
};
/* performSearch("https://evrydev.sharepoint.com/sites/vavdev/_api/Web/Lists/getbytitle('MigrateDoclibrary')/items?$select=FileRef, FileLeafRef, ID,FacilityName/ID,FacilityName/Title,FileFormat/ID,DocumentType/ID&$expand=FacilityName/ID,FileFormat/ID, DocumentType/ID&$filter=((FacilityName/ID eq '1') and (FileFormat/ID eq '1') and (DocumentType/ID eq '1') )", displayDocuments);
getFacilityNames("https://evrydev.sharepoint.com/sites/vavdev/_api/Web/Lists/getbytitle('MigrateDoclibrary')/items?$select=FileRef, FileLeafRef, ID,FacilityName/ID,FacilityName/Title,FileFormat/ID,DocumentType/ID&$expand=FacilityName/ID,FileFormat/ID, DocumentType/ID&$filter=((FacilityName/ID eq '1') and (FileFormat/ID eq '1') and (DocumentType/ID eq '1') )", displayFacilities);
 */
function performSearch(fullSearchUrl, successCallback)
{
	var myxhr = $.ajax({
	   url:        fullSearchUrl,
	   type:       "GET",
	   dataType:   "xml",
	   beforeSend: function(xhr){
	       var readystatehook = xhr.onreadystatechange;
	
	       xhr.onreadystatechange = function(){
	           readystatehook.apply(this, []);
	       };
	   },
	   success:    function(data){
	       var items = myFunction(data);
			successCallback(items);
	   },
	   error:      function(xhr, textStatus, error){
	       alert(xhr.responseText, textStatus, error);
	   }
	});
}

function getFacilityNames(fullSearchUrl, successCallback)
{
	var myxhr = $.ajax({
	   url:        fullSearchUrl,
	   type:       "GET",
	   dataType:   "xml",
	   beforeSend: function(xhr){
	       var readystatehook = xhr.onreadystatechange;
	
	       xhr.onreadystatechange = function(){
	           readystatehook.apply(this, []);
	       };
	   },
	   success:    function(data){
			var items = myFunction(data);
			var groupedItems = groupBy(items ,'FacilityNameID', 'FacilityName');
			successCallback(groupedItems);
	   },
	   error:      function(xhr, textStatus, error){
	       alert(xhr.responseText, textStatus, error);
	       return null;
	   }
	});
}

function groupBy(items, propertyId, propertyValue)
{
	var found = [];
    var result = [];
    $.each(items, function(index, item) {
       if ($.inArray(item[propertyId], found)==-1) {
       {
        	found.push(item[propertyId]);
			result.push(
			{
				propertyName: item[propertyId],
				propertyValue: item[propertyValue]
			});
		}
			
       }
    });
    return result;
}


var linkString = "<a id=\"CallOutExample\" onclick=\"OpenItemFilePreviewCallOut(this, 'My Title','https://evrydev.sharepoint.com/sites/vavdev/_layouts/15/WopiFrame2.aspx?sourcedoc=/sites/vavdev/MigrateDoclibrary/1028template.docx', 66, '/sites/vavdev/MigrateDoclibrary/1028template.docx', '{98E4CF0C-AF45-4258-9CA7-E8FAA3585D2A}')\" title=\"CallOut With File Preview\" h ref=\"#\">Call Out with File Preview</a>";
var replaceLinkString = "<a id=\"CallOutExample\" onclick=\"OpenItemFilePreviewCallOut(this, '_FileLeafRef_','https://evrydev.sharepoint.com/sites/vavdev/_layouts/15/WopiFrame2.aspx?sourcedoc=_FileRef_', {FileId}, '_FileRef_', '{ListGuid}')\" title=\"_FileLeafRef_\" h ref=\"#\">_FileLeafRef_</a>";

var sotableResults="";

function getChildByTagName(node, tagName)
{
	var count = node.childNodes.length;
	for(var i = 0;i < count;i++)
	{
		var child = node.childNodes[i];
		if (child.nodeName == tagName)
			return child;
	}
	return null;
}

function getChildByTagNameAndAttrValue(node, tagName, attrName, attrValue)
{
	for (const el of node.getElementsByTagName(tagName))
	{
		var attr = el.getAttribute(attrName);
		if (attr != null)
		{
			if (attr == attrValue)
				return el;
		}
	}
	return null;
}

function myFunction(xml) {
	var count = xml.childNodes[0].childNodes.length;
	var items = [];
	for(var i = 0;i < count;i++)
	{
		var entryNode = xml.childNodes[0].childNodes[i];
		if (entryNode.nodeName == "entry")
		{
			var contentNode = getChildByTagName(entryNode, "content");
			var FacilityNamePropertiesNode = getChildByTagNameAndAttrValue(entryNode, "link", "title", "FacilityName").getElementsByTagName("properties")[0];
			var FileFormatPropertiesNode = getChildByTagNameAndAttrValue(entryNode, "link", "title", "FileFormat").getElementsByTagName("properties")[0];
			var DocumentTypePropertiesNode = getChildByTagNameAndAttrValue(entryNode, "link", "title", "DocumentType").getElementsByTagName("properties")[0];
			var FacilityTypePropertiesNode = getChildByTagNameAndAttrValue(entryNode, "link", "title", "FacilityType").getElementsByTagName("properties")[0];
			var ModifiedByPropertiesNode = getChildByTagNameAndAttrValue(entryNode, "link", "title", "Editor").getElementsByTagName("properties")[0];
			items.push(
			{
				FileRef: contentNode.getElementsByTagName("properties")[0].getElementsByTagName("FileRef")[0].innerHTML,
				FileLeafRef: contentNode.getElementsByTagName("properties")[0].getElementsByTagName("FileLeafRef")[0].innerHTML,
				Id: contentNode.getElementsByTagName("properties")[0].getElementsByTagName("Id")[0].innerHTML,
				ModifiedDate: contentNode.getElementsByTagName("properties")[0].getElementsByTagName("Modified")[0].innerHTML,
				
				FacilityNameID: FacilityNamePropertiesNode.getElementsByTagName("ID")[0].innerHTML,
				FacilityName: FacilityNamePropertiesNode.getElementsByTagName("Title")[0].innerHTML,
				FileFormat:FileFormatPropertiesNode.getElementsByTagName("Title")[0].innerHTML,
				FileFormatID:FileFormatPropertiesNode.getElementsByTagName("ID")[0].innerHTML,
				DocumentType:DocumentTypePropertiesNode.getElementsByTagName("Title")[0].innerHTML,
				DocumentTypeID :DocumentTypePropertiesNode.getElementsByTagName("ID")[0].innerHTML,
				FacilityType:FacilityTypePropertiesNode.getElementsByTagName("Title")[0].innerHTML,
				FacilityTypeID:FacilityTypePropertiesNode.getElementsByTagName("ID")[0].innerHTML,
				ModifiedBy:ModifiedByPropertiesNode.getElementsByTagName("Title")[0].innerHTML,
			});
		}
	}

	return items;
}

function displayDocuments(items)
{
	document.getElementById("stations").innerHTML = "";

	for (var i = 0;i<items.length;i++)
	{
		document.getElementById("stations").innerHTML += replaceLinkString
		.replace(/_FileRef_/g,     items[i].FileRef)
		.replace("{FileId}", items[i].Id)
		.replace(/_FileLeafRef_/g, items[i].FileLeafRef)
		.replace("{ListGuid}", FKLISTGUID);
		
		
		var docLink=replaceLinkString
		.replace(/_FileRef_/g,     items[i].FileRef)
		.replace("{FileId}", items[i].Id)
		.replace(/_FileLeafRef_/g, items[i].FileLeafRef)
		.replace("{ListGuid}", FKLISTGUID);
		//console.log(dt);
		document.getElementById("stations").innerHTML += "<br/>";
		var modifiedDate=new Date(items[i].ModifiedDate);
		var mdt=modifiedDate.format("dd.MM.yyyy"); 
		var rowHTML="<tr><td class='ms-cellstyle ms-vb-title' data-value='"+items[i].FileLeafRef+"'>"+docLink+"</td>"+
					"<td class='ms-cellstyle ms-vb2' data-value='"+mdt+"'>"+mdt+"</td>"+
					"<td class='ms-cellstyle ms-vb-user' data-value='"+items[i].ModifiedBy+"'>"+items[i].ModifiedBy+"</td>"+
					"<td data-value='"+items[i].FacilityType+"'>"+items[i].FacilityType+"</td>"+
					"<td data-value='"+items[i].DocumentType+"'>"+items[i].DocumentType+"</td>"+
					"<td data-value='"+items[i].FileFormat+"'>"+items[i].FileFormat+"</td>"+ 
		"<td data-value='"+items[i].FacilityName+"'>"+items[i].FacilityName+"</td></tr>";
		$(".sortable tbody").append(rowHTML);
		
		
		
	}
}

function displayFacilities(items)
{
	document.getElementById("facilitites").innerHTML = "";

	for (var i = 0;i<items.length;i++)
	{
		document.getElementById("facilitites").innerHTML += "<input id='"+items[i]["propertyName"]+"' class='docfilter' onchange='docFilter()' type='checkbox' />" + items[i]["propertyValue"];
		document.getElementById("facilitites").innerHTML += "<br/>";
	}
}




