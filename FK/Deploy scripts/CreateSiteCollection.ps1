#Build system variables. 
if(-not ($env:AGENT_NAME))
{
    #Running outside VSTS
    cls
    $env:Office365TenantUrl="https://evrydev.sharepoint.com"
    $env:SharePointSiteCollectionName="vavdev3"
    $env:SharePointTenantAdminSite = "https://evrydev-admin.sharepoint.com"
    $env:Office365UserName = "frode@evrydev.onmicrosoft.com"
    $env:SiteCollectionStorageQuota = 10;
    $env:SiteCollectionTemplate = "STS#0";
    if([string]::IsNullOrWhiteSpace($tagPass))
    {
        [string]$tagPass = Read-Host -Prompt "Please enter your password";
    }}
else
{
    #Running inside VSTS
    [string]$tagPass = $args[0]
}


$siteURL= $env:SharePointTenantAdminSite
$cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $env:Office365UserName, $(convertto-securestring $tagPass -asplaintext -force)
Connect-SPOService -Url $siteURL -Credential $cred
$siteURL= $env:Office365TenantUrl+"/sites/"+$env:SharePointSiteCollectionName
Write-Warning $siteURL
$site = $null
$site = Get-SPOSite $siteURL -ErrorVariable err -ErrorAction SilentlyContinue 
if ($site -eq $null)
{
  Write-Host "Site does not exist, will create";

  New-SPOSite -Url $siteURL -Owner $env:Office365UserName -StorageQuota $env:SiteCollectionStorageQuota -Template $env:SiteCollectionTemplate
  Write-Host "Site collection at url: " $siteURL " created successfully"

}
if ($site -ne $null)
{
    Write-Host "Site Exists";
    Exit;
}

