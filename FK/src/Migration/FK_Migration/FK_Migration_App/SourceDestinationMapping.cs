using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FK_Migration
{
    public sealed class SourceDestinationMapping
    {
        private static readonly SourceDestinationMapping instance = new SourceDestinationMapping();

        private Dictionary<string, string> SourceFolderDestinationTermVann;
        private Dictionary<string, Dictionary<string, string>> SourceFolderBaseCategoryMappings;
        private Dictionary<string, string> _SourceDocumentTypeMappings;
        private Dictionary<string, string> SourceFileEndingToFileTypeMappings;

        private SourceDestinationMapping() 
        {
            SourceFileEndingToFileTypeMappings = new Dictionary<string, string>();
            SourceFileEndingToFileTypeMappings.Add(".doc", "Word");
            SourceFileEndingToFileTypeMappings.Add(".dot", "Word");
            SourceFileEndingToFileTypeMappings.Add(".docx", "Word");
            SourceFileEndingToFileTypeMappings.Add(".docm", "Word");
            SourceFileEndingToFileTypeMappings.Add(".dotm", "Word");
            SourceFileEndingToFileTypeMappings.Add(".docb", "Word");
            SourceFileEndingToFileTypeMappings.Add(".xls", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".xlsb", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".xlw", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".xlsx", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".xlsm", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".xltx", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".xltm", "Excel");
            SourceFileEndingToFileTypeMappings.Add(".avi", "Video");
            SourceFileEndingToFileTypeMappings.Add(".mov", "Video");
            SourceFileEndingToFileTypeMappings.Add(".mp4", "Video");
            SourceFileEndingToFileTypeMappings.Add(".wmv", "Video");
            SourceFileEndingToFileTypeMappings.Add(".vob", "Video");
            SourceFileEndingToFileTypeMappings.Add(".flv", "Video");
            SourceFileEndingToFileTypeMappings.Add(".mkv", "Video");
            SourceFileEndingToFileTypeMappings.Add(".webm", "Video");
            SourceFileEndingToFileTypeMappings.Add(".png", "Bilde");
            SourceFileEndingToFileTypeMappings.Add(".bmp", "Bilde");
            SourceFileEndingToFileTypeMappings.Add(".jpeg", "Bilde");
            SourceFileEndingToFileTypeMappings.Add(".jpg", "Bilde");
            SourceFileEndingToFileTypeMappings.Add(".tiff", "Bilde");
            SourceFileEndingToFileTypeMappings.Add(".gif", "Bilde");
            SourceFileEndingToFileTypeMappings.Add(".dwg", "DWG");
            SourceFileEndingToFileTypeMappings.Add(".pdf", "PDF");
            SourceFileEndingToFileTypeMappings.Add(Constants.FILEFORMAT_DIVERSE, Constants.FILEFORMAT_DIVERSE);
            
            _SourceDocumentTypeMappings = new Dictionary<string, string>();
            _SourceDocumentTypeMappings.Add("1- FUNKSJONSBESKRIVELSE", "Funksjonsbeskrivelse");
            _SourceDocumentTypeMappings.Add("2- ELEKTRO", "Elektro");
            _SourceDocumentTypeMappings.Add("3- DATABLADER", "Datablad");
            _SourceDocumentTypeMappings.Add("4- TESTPROTOKOLLER", "Testprotokoll");
            _SourceDocumentTypeMappings.Add("5- BILDER", "Bilde");
            _SourceDocumentTypeMappings.Add("6- FDV", "FDV");
            _SourceDocumentTypeMappings.Add("7- PLS", "PLS");
            _SourceDocumentTypeMappings.Add("8- ANLEGGSTEGNINGER", "Anleggstegning");
            _SourceDocumentTypeMappings.Add("10- DIVERSE", "Diverse");

            SourceFolderDestinationTermVann = new Dictionary<string, string>();
            SourceFolderDestinationTermVann.Add("1- HB", "HB - Høydebasseng");
            SourceFolderDestinationTermVann.Add("2- VP", "VP - Vann pumpestasjon");
            SourceFolderDestinationTermVann.Add("3- RK", "RK - Reduksjon");
            SourceFolderDestinationTermVann.Add("4- MK", "MK - Målekum");
            SourceFolderDestinationTermVann.Add("7- VM", "VM - Vassdragsmålestasjon");
            SourceFolderDestinationTermVann.Add("5- DA", "DA - Dammer i Marka");
            SourceFolderDestinationTermVann.Add("9- VF", "VF - Vannfylleri");

            SourceFolderBaseCategoryMappings = new Dictionary<string, Dictionary<string, string>>();
            SourceFolderBaseCategoryMappings.Add(Constants.VANN, SourceFolderDestinationTermVann);

        }

        public static SourceDestinationMapping Instance
        {
            get
            {
                return instance;
            }
        }

        public string GetDestinationTermNameFromSourceFolder(string sourceFolder)
        {
            throw new NotImplementedException();
        }

        public Dictionary<string, string> GetSourceFolderMappingsFromBaseCategory(string baseCategory)
        {
            if (SourceFolderBaseCategoryMappings.ContainsKey(baseCategory))
                return SourceFolderBaseCategoryMappings[baseCategory];
            else
                return new Dictionary<string, string>();
        }


        public bool ContainsSourceDocumentType(string documentTypeName)
        {
            return this._SourceDocumentTypeMappings.ContainsKey(documentTypeName.ToUpper());
        }

        public string GetDestinationDocumentType(string sourceDocumentType)
        {
            return this._SourceDocumentTypeMappings[sourceDocumentType.ToUpper()];
        }

        public string GetDestinationFileFormatFromExtension(string fileExtension)
        {
            if (this.SourceFileEndingToFileTypeMappings.ContainsKey(fileExtension))
                return this.SourceFileEndingToFileTypeMappings[fileExtension];
            else
                return this.SourceFileEndingToFileTypeMappings[Constants.FILEFORMAT_DIVERSE];
        }
    }

}
