using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace FK_Migration
{
    internal class SourceFiles
    {
        private string basePath;
        private List<StationInfo> Stations;
        private FKTerms Terms;

        internal SourceFiles(string BasePath, string url, string username, string password)
        {
            Terms = new FKTerms(url, username, password);
            this.basePath = BasePath;
            Stations = new List<StationInfo>();
            IterateDirectories();
        }

        public List<StationInfo> AllStations
        {
            get
            {
                return new List<StationInfo>(Stations);
            }
        }

        public List<DocumentInfo> GetDocuments(StationInfo station)
        {
            return IterateDocumentsBaseFolder(station);
        }

        private List<DocumentInfo> IterateDocumentsBaseFolder(StationInfo station)
        {
            List<DocumentInfo> result = new List<DocumentInfo>();
            DirectoryInfo dir = new DirectoryInfo(station.SourceFolder);
            foreach (DirectoryInfo docCatDir in dir.GetDirectories())
            {
                if (SourceDestinationMapping.Instance.ContainsSourceDocumentType(docCatDir.Name))
                {
                    IterateDocumentsContents(result, docCatDir, station, SourceDestinationMapping.Instance.GetDestinationDocumentType(docCatDir.Name), "");
                }
                else
                    Logger.GetInstance.AddRow("Mappen " + docCatDir.FullName + " er ikke en kjent mappe for dokumenttype", Logger.LogType.Warning);
            }
            if (dir.GetFiles().Count() > 0)
                Logger.GetInstance.AddRow("Fant " + dir.GetFiles().Count().ToString() + " filer utenom kategori-katalogene. Mappe: " + dir.FullName, Logger.LogType.Warning);
            return result;
        }

        private void IterateDocumentsContents(List<DocumentInfo> result, DirectoryInfo dir, StationInfo station, string DestinationDocType, string FileNamePrefix)
        {
            //Add files
            foreach (FileInfo file in dir.GetFiles())
            {
                var docInfo = new DocumentInfo();
                docInfo.FileName = FileNamePrefix + file.Name;
                docInfo.FileFullPath = file.FullName;
                docInfo.DestinationDocumentTypeName = DestinationDocType;
                docInfo.DestinationDocumentTypeID = Terms.GetDocumentTypeIDFromName(DestinationDocType);
                docInfo.DestinationFacilityTypeName = station.DestinationCategoryName;
                docInfo.DestinationFacilityTypeID = Terms.GetFacilityTypeIDFromName(station.DestinationCategoryName);
                docInfo.DestinationFileExtension = Path.GetExtension(file.FullName);
                docInfo.DestinationFileFormatName = SourceDestinationMapping.Instance.GetDestinationFileFormatFromExtension(docInfo.DestinationFileExtension);
                docInfo.DestinationFileFormatID = Terms.GetFileFormat(docInfo.DestinationFileFormatName);
                result.Add(docInfo);
            }
            //recursively iterate subdirs
            foreach (DirectoryInfo subDir in dir.GetDirectories())
            {
                IterateDocumentsContents(result, subDir, station, DestinationDocType, FileNamePrefix + subDir.Name + "-");
            }
        }

        //Find base facilityType catalouges (VANN & Avløp)
        private void IterateDirectories()
        {
            DirectoryInfo dir = new DirectoryInfo(basePath);
            var subDirs = dir.GetDirectories();
            //Check expected cataloges
            if (subDirs.SingleOrDefault(p => p.Name.ToLower() == Constants.VANNSOURCEFOLDERNAME.ToLower()) == null)
                throw new Exception(Constants.VANNSOURCEFOLDERNAME + " not found");
            else
            {
                DirectoryInfo vannDir = subDirs.Single((p => p.Name.ToLower() == Constants.VANNSOURCEFOLDERNAME.ToLower()));
                IterateCategories(vannDir, Constants.VANN);
            }
            if (subDirs.SingleOrDefault(p => p.Name.ToLower() == Constants.AVLOPSOURCEFOLDERNAME.ToLower()) == null)
                throw new Exception(Constants.AVLOPSOURCEFOLDERNAME + " not found");
            else
            {
                DirectoryInfo avlopDir = subDirs.Single((p => p.Name.ToLower() == Constants.AVLOPSOURCEFOLDERNAME.ToLower()));
                IterateCategories(avlopDir, Constants.AVLOP);
            }

        }

        //Iterates all category folders (for exapmle: "1- HB", "2- VP" ....
        private void IterateCategories(DirectoryInfo baseFolder, string baseCategoryName)
        {
            var availableCategories = SourceDestinationMapping.Instance.GetSourceFolderMappingsFromBaseCategory(baseCategoryName);
            foreach (DirectoryInfo catDir in baseFolder.GetDirectories())
            {
                if (availableCategories.ContainsKey(catDir.Name))
                {
                    IterateStations(catDir, availableCategories[catDir.Name], baseCategoryName);
                }
                else
                    Logger.GetInstance.AddRow("Unknown folder " + catDir.Name, Logger.LogType.Warning);
            }
        }

        private void IterateStations(DirectoryInfo baseCategoryFolder, string DestinationCategoryName, string BaseCategoryName)
        {
            foreach (DirectoryInfo stationDir in baseCategoryFolder.GetDirectories())
            {
                string stationName = stationDir.Name.Trim();
                this.Stations.Add(new StationInfo { DestinationCategoryName = DestinationCategoryName, 
                    CategoryTaxonomyID = string.Empty, 
                    BaseCategoryName = BaseCategoryName,
                    SourceFolder = stationDir.FullName, 
                    StationName = stationName });
            }
        }

    }
}
