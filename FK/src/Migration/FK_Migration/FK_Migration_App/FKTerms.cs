using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace FK_Migration
{
    internal class FKTerms
    {
        private string siteUrl;
        private string userName;
        private string password;
        private System.Net.ICredentials credentials = null;

        private Dictionary<string, string> fileFormatLookup = new Dictionary<string, string>();
        private Dictionary<string, string> DocumentTypes = new Dictionary<string, string>();
        private Dictionary<string, string> FacilityTypes = new Dictionary<string, string>();
        private Dictionary<string, string> FacilityNames = new Dictionary<string, string>();

        public FKTerms(string SiteUrl, string UserName, string Password)
        {
            this.siteUrl = SiteUrl;
            this.userName = UserName;
            this.password = Password;

            //store credentials
            //Create secure string
            SecureString sec_pass = new SecureString();
            Array.ForEach(password.ToArray(), sec_pass.AppendChar);
            sec_pass.MakeReadOnly();
            this.credentials = new SharePointOnlineCredentials(userName, sec_pass);

            
            
            //FillFileFormat();
            RetrieveDocumentTypesFromDestinationList();
            RetrieveFacilityTypesFromDestination();
            RetrieveFacilityNamesFromDestination();
            RetrieveFileFormatFromDestinationList();

        }

        public string GetFileFormat(string name)
        {
            return fileFormatLookup[name];
        }

        public string GetDocumentTypeIDFromName(string name)
        {
            return DocumentTypes[name];
        }

        public string GetFacilityTypeIDFromName(string name)
        {
            return FacilityTypes[name];
        }

        public string GetFacilityNameIDFromName(string name, bool InsertIfNotFound)
        {
            if (!FacilityNames.ContainsKey(name))
            {
                if (InsertIfNotFound)
                    AddFacilityName(name);
                else
                    throw new Exception("Fant ikke fasilitet " + name);
            }
            
            return FacilityNames[name];
        }


        private void RetrieveDocumentTypesFromDestinationList()
        {
            DocumentTypes.Clear();

            SecureString sec_pass = new SecureString();
            Array.ForEach(password.ToArray(), sec_pass.AppendChar);
            sec_pass.MakeReadOnly();

            ClientContext ctx = new ClientContext(siteUrl);
            ctx.Credentials = new SharePointOnlineCredentials(userName, sec_pass);
            List oList = ctx.Web.Lists.GetByTitle(Constants.DOCUMENTTYPES_LISTNAME);

            CamlQuery camlQuery = new CamlQuery();
            camlQuery.ViewXml = "<View><Query></Query><RowLimit>100</RowLimit></View>";

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            ctx.Load(collListItem,
                items => items.Include(
                    item => item.Id,
                    item => item.DisplayName));
            ctx.ExecuteQuery();

            foreach (ListItem item in collListItem)
            {
                DocumentTypes.Add(item.DisplayName, item.Id.ToString());
            }

        }

        private void RetrieveFacilityTypesFromDestination()
        {
            ClientContext ctx = new ClientContext(siteUrl);
            ctx.Credentials = this.credentials;
            List oList = ctx.Web.Lists.GetByTitle(Constants.FACILITYTYPE_LISTNAME);

            CamlQuery camlQuery = new CamlQuery();
            camlQuery.ViewXml = "<View><Query></Query><RowLimit>100</RowLimit></View>";

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            ctx.Load(collListItem, 
                items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item[Constants.FACILITYTYPELIST_BASETYPECOLUMNNAME]));
            ctx.ExecuteQuery();

            foreach (ListItem item in collListItem)
            {
                FacilityTypes.Add(item.DisplayName, item.Id.ToString());
            }
        }

        private void RetrieveFileFormatFromDestinationList()
        {
            fileFormatLookup.Clear();

            ClientContext ctx = new ClientContext(siteUrl);
            ctx.Credentials = this.credentials;
            List oList = ctx.Web.Lists.GetByTitle(Constants.FILEFORMAT_LISTNAME);

            CamlQuery camlQuery = new CamlQuery();
            camlQuery.ViewXml = "<View><Query></Query></View>";

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            ctx.Load(collListItem,
                items => items.Include(
                    item => item.Id,
                    item => item.DisplayName
                    ));
            ctx.ExecuteQuery();

            foreach (ListItem item in collListItem)
            {
                fileFormatLookup.Add(item.DisplayName, item.Id.ToString());
            }
        }

        private void RetrieveFacilityNamesFromDestination()
        {
            FacilityNames.Clear();
            
            ClientContext ctx = new ClientContext(siteUrl);
            ctx.Credentials = this.credentials;
            List oList = ctx.Web.Lists.GetByTitle(Constants.FACILITYNAME_LISTNAME);

            CamlQuery camlQuery = new CamlQuery();
            camlQuery.ViewXml = "<View><Query></Query></View>";

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            ctx.Load(collListItem,
                items => items.Include(
                    item => item.Id,
                    item => item.DisplayName
                    ));
            ctx.ExecuteQuery();

            foreach (ListItem item in collListItem)
            {
                FacilityNames.Add(item.DisplayName, item.Id.ToString());
            }
        }

        private string AddFacilityName(string facilityName)
        {
            ClientContext ctx = new ClientContext(siteUrl);
            ctx.Credentials = this.credentials;

            List oList = ctx.Web.Lists.GetByTitle(Constants.FACILITYNAME_LISTNAME);
            
            ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
            ListItem oListItem;
            oListItem = oList.AddItem(itemCreateInfo);
            oListItem["Title"] = facilityName;
            oListItem.Update();
            ctx.ExecuteQuery();

            FacilityNames.Add(facilityName, oListItem.Id.ToString());
            return oListItem.Id.ToString();
        }

    }





}
/*
#FacilityName terms
$TermSet = $Group.TermSets.GetByName("FileFormat")
$Context.Load($TermSet)
$Context.ExecuteQuery()
$TermsFileFormat = $termSet.GetAllTerms()
$Context.Load($TermsFileFormat)
$Context.ExecuteQuery()
*/