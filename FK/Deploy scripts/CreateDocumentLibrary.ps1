#Build system variables. 
if(-not ($env:AGENT_NAME))
{
    #Running outside VSTS
    cls
    $env:Office365TenantUrl="https://evrydev.sharepoint.com"
    $env:SharePointSiteCollectionName="vavdev4"
    $env:SharePointTenantAdminSite = "https://evrydev-admin.sharepoint.com"
    $env:Office365UserName = "frode@evrydev.onmicrosoft.com"
    $env:SiteCollectionStorageQuota = 10;
    $env:SiteCollectionTemplate = "STS#0";
    if([string]::IsNullOrWhiteSpace($tagPass))
    {
        [string]$tagPass = Read-Host -Prompt "Please enter your password";
    }
    $env:DocLibraryName = "PSTEST2";
}
else
{
    #Running inside VSTS
    [string]$tagPass = $args[0]
}

Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.dll"
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.Runtime.dll"



function new-SPOnlineList {
    #variables that needs to be set before starting the script
    $siteURL = $($env:Office365TenantUrl+"/sites/"+$env:SharePointSiteCollectionName)
    $listDescription = "FK Dokumenter"
    $listTemplate = 101
     
    $password = $(convertto-securestring $tagPass -asplaintext -force)
    # set SharePoint Online credentials
    $SPOCredentials = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($env:Office365UserName, $password)
         
    # Creating client context object
    $context = New-Object Microsoft.SharePoint.Client.ClientContext($siteURL)
    $context.credentials = $SPOCredentials
     

  
    $web = $context.Web 
    $lists = $web.Lists
    $context.Load($web) 
    $context.Load($lists)   
    $context.ExecuteQuery()

    $list = $web.Lists | where{$_.Title -eq $env:DocLibraryName}
    if($list)
    {
        #Execute if list exists
        Write-Host "List " $listName " exists" 
    }
    else
    {
        #Execute if list does not exists
        Write-Host "List " $listName " does not exists" 
        Write-Host "Creating list " $listName  


        #create list using ListCreationInformation object (lci)
        $lci = New-Object Microsoft.SharePoint.Client.ListCreationInformation
        $lci.title = $env:DocLibraryName
        $lci.description = $listDescription
        $lci.TemplateType = $listTemplate
        $list = $context.web.lists.add($lci)
        $context.load($list)
        #send the request containing all operations to the server
        try{
            $context.executeQuery()
            write-host "info: Created $($env:DocLibraryName)" -foregroundcolor green
        }
        catch{
            write-host "info: $($_.Exception.Message)" -foregroundcolor red
        }  
    }
exit

}
new-SPOnlineList
