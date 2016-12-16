using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace FK_Migration
{
    public partial class Form1 : System.Windows.Forms.Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void label5_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            //var termsLookup = new FKTerms(edtDestination.Text, edtUsername.Text, edtPassword.Text);

            //COnnect to Destination SP
            string password = edtPassword.Text;
            SecureString sec_pass = new SecureString();
            Array.ForEach(password.ToArray(), sec_pass.AppendChar);
            sec_pass.MakeReadOnly();
            ClientContext ctx = new ClientContext(edtDestination.Text);
            ctx.Credentials = new SharePointOnlineCredentials(edtUsername.Text, sec_pass);
            //Load lookup list data
            var terms = new FKTerms(edtDestination.Text, edtUsername.Text, edtPassword.Text);

            SourceFiles files = new SourceFiles(edtSource.Text, edtDestination.Text, edtUsername.Text, edtPassword.Text);
            foreach (StationInfo station in listSource.CheckedItems)
            {
                foreach (DocumentInfo document in files.GetDocuments(station))
                {
                    try
                    {
                        if (!chkSimulateUpload.Checked)
                        {
                            Folder folder = ctx.Web.GetFolderByServerRelativeUrl(edtDocumentLibrary.Text);
                            FileCreationInformation fci = new FileCreationInformation();
                            fci.Content = System.IO.File.ReadAllBytes(document.FileFullPath);
                            fci.Url = document.FileName;
                            fci.Overwrite = true;
                            File fileToUpload = folder.Files.Add(fci);

                            ListItem item = fileToUpload.ListItemAllFields;

                            item[Constants.DOCUMENTTYPE_COLUMNNAME] = document.DestinationDocumentTypeID; // SourceDestinationMapping.Instance.GetDestinationDocumentType(document.DestinationDocumentTypeName);
                            item[Constants.FACILITYTYPE_COLUMNNAME] = document.DestinationFacilityTypeID;
                            item[Constants.FACILITYNAME_COLUMNNAME] = terms.GetFacilityNameIDFromName(station.StationName, true);
                            item[Constants.FILEFORMAT_COLUMNNAME] = document.DestinationFileFormatID;
                            item.Update(); 

                            ctx.Load(fileToUpload);
                            // Now invoke the server, just one time
                            ctx.ExecuteQuery();
                        }
                        Logger.GetInstance.AddRow("Lastet opp fil " + document.FileFullPath, Logger.LogType.Normal);
                    }
                    catch(Exception xe)
                    {
                        Logger.GetInstance.AddRow("Opplasting av fil: " + document.FileFullPath + " feilet. ", Logger.LogType.Error);
                    }
                    finally
                    {
                            
                    }
                }

            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Logger.GetInstance.TextBox = textBox3;




            //Get destination (imported) files

        }

        private void ListImportedFiles()
        {
            var termsLookup = new FKTerms(edtDestination.Text, edtUsername.Text, edtPassword.Text);

            string password = edtPassword.Text;
            SecureString sec_pass = new SecureString();
            Array.ForEach(password.ToArray(), sec_pass.AppendChar);
            sec_pass.MakeReadOnly();

            ClientContext ctx = new ClientContext(edtDestination.Text);
            ctx.Credentials = new SharePointOnlineCredentials(edtUsername.Text, sec_pass);
            ExceptionHandlingScope scope = new ExceptionHandlingScope(ctx);
            using (scope.StartScope())
            {
                using (scope.StartTry())
                {
                    // Try to reference the target folder
                    Folder folder = ctx.Web.GetFolderByServerRelativeUrl("/");
                }
                using (scope.StartCatch())
                {
                    
                }
                using (scope.StartFinally())
                {
                    // Add the ListItem, whether the list has just been created
                    // or was already existing
                    Folder folder = ctx.Web.GetFolderByServerRelativeUrl(edtDocumentLibrary.Text);
                    FileCreationInformation fci = new FileCreationInformation();
                    fci.Content = System.IO.File.ReadAllBytes(edtSource.Text);
                    fci.Url = "SampleFile.txt";
                    fci.Overwrite = true;
                    File fileToUpload = folder.Files.Add(fci);

                    ListItem item = fileToUpload.ListItemAllFields;

                    item["FileFormat"] = termsLookup.GetFileFormat("Bilde");
                    item.Update();

                    ctx.Load(fileToUpload);

                }
            }
            // Now invoke the server, just one time
            ctx.ExecuteQuery();
        }

        private void btnUpdateImported_Click(object sender, EventArgs e)
        {
            //Get source files
            try
            {
                //Load folder list structure
                var sourceFiles = new SourceFiles(edtSource.Text, edtDestination.Text, edtUsername.Text, edtPassword.Text);
                listSource.Items.Clear();
                foreach (StationInfo station in sourceFiles.AllStations)
                {
                    listSource.Items.Add(station, false);
                }
            }
            catch (Exception ex)
            {
                Logger.GetInstance.AddRow(ex.Message, Logger.LogType.Error);
            }
        }


    }


    public static class RichTextBoxExtensions
    {
        public static void AppendText(this RichTextBox box, string text, Color color)
        {
            box.SelectionStart = box.TextLength;
            box.SelectionLength = 0;

            box.SelectionColor = color;
            box.AppendText(text);
            box.SelectionColor = box.ForeColor;
        }
        public static void AppendRow(this RichTextBox box, string text, Color color)
        {
            box.SelectionStart = box.TextLength;
            box.SelectionLength = 0;

            box.SelectionColor = color;
            box.AppendText(text + "\r\n");
            box.SelectionColor = box.ForeColor;
        }

    }

}
