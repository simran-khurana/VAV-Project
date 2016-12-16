#Specify tenant admin and site URL
$User = "frode@evrydev.onmicrosoft.com"
$SiteURL = "https://evrydev.sharepoint.com/sites/vavdev/"
$File = "TemplateDoc.docx"
$DocLibName = "ItemsCount30000"
$startNumDocs = 884
$numberDocsToCreate = 30000
$PlainPassword =  ""

if ($PlainPassword)
{
    $Password = $PlainPassword | ConvertTo-SecureString -AsPlainText -Force
}


if ([string]::IsNullOrWhiteSpace($Password) )
{
    $Password = Read-Host -Prompt "Please enter your password" -AsSecureString
}


#Add references to SharePoint client assemblies and authenticate to Office 365 site � required for CSOM
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.dll"
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.Runtime.dll"
#Add-PSSnapin Microsoft.Sharepoint.Powershell



#Bind to site collection
$Context = New-Object Microsoft.SharePoint.Client.ClientContext($SiteURL)
$Creds = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($User,$Password)
$Context.Credentials = $Creds

#Document types
$list = $Context.Web.Lists.GetByTitle("DocumentTypes")
$qry = [Microsoft.SharePoint.Client.CamlQuery]::CreateAllItemsQuery()
$DocumentTypes = $list.GetItems($qry)
$Context.Load($DocumentTypes)
$Context.ExecuteQuery()

#Fileformats
$list = $Context.Web.Lists.GetByTitle("FileFormats")
$qry = [Microsoft.SharePoint.Client.CamlQuery]::CreateAllItemsQuery()
$FileFormats = $list.GetItems($qry)
$Context.Load($FileFormats)
$Context.ExecuteQuery()

#FacilityTypes
$list = $Context.Web.Lists.GetByTitle("FacilityTypes")
$qry = [Microsoft.SharePoint.Client.CamlQuery]::CreateAllItemsQuery()
$FacilityTypes = $list.GetItems($qry)
$Context.Load($FacilityTypes)
$Context.ExecuteQuery()

#FacilityNames
$list = $Context.Web.Lists.GetByTitle("FacilityNames")
$qry = [Microsoft.SharePoint.Client.CamlQuery]::CreateAllItemsQuery()
$FacilityNames = $list.GetItems($qry)
$Context.Load($FacilityNames)
$Context.ExecuteQuery()

#-------------doclib------------
#Retrieve list
$List = $Context.Web.Lists.GetByTitle($DocLibName)
$Context.Load($List)
$Context.ExecuteQuery()

#Upload file




for($i=$startNumDocs; $i -le $numberDocsToCreate; $i++) 
{

    $Context = New-Object Microsoft.SharePoint.Client.ClientContext($SiteURL)
    $Creds = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($User,$Password)
    $Context.Credentials = $Creds
    
    $List = $Context.Web.Lists.GetByTitle($DocLibName)
    $Context.Load($List)
    $Context.ExecuteQuery()

    $FileStream = New-Object IO.FileStream($File,[System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
    $FileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
    $FileCreationInfo.Overwrite = $true
    $FileCreationInfo.ContentStream = $FileStream
    $FileCreationInfo.URL = "$i" + "template.docx"
    $Upload = $List.RootFolder.Files.Add($FileCreationInfo)

    $listItem = $Upload.ListItemAllFields

    $listItem["DocumentType"] = $DocumentTypes[(Get-Random -Minimum 0 -Maximum ($DocumentTypes.Count))]["ID"];
    $listItem["FileFormat"] = $FileFormats[(Get-Random -Minimum 0 -Maximum ($FileFormats.Count))]["ID"];
    $listItem["FacilityType"] = $FacilityTypes[(Get-Random -Minimum 0 -Maximum ($FacilityTypes.Count))]["ID"];
    $listItem["FacilityName"] = $FacilityNames[(Get-Random -Minimum 0 -Maximum ($FacilityNames.Count))]["ID"];


    $listItem.Update()
    $Context.ExecuteQuery()
    Write-Host "Created file # " $i
}  

