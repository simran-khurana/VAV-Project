using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FK_Migration
{
    public class DocumentInfo
    {
        public string FileName { get; set; }

        public string FileFullPath { get; set; }

        public string DestinationDocumentTypeName { get; set; }
        public string DestinationDocumentTypeID { get; set; }
        public string DestinationFacilityTypeName { get; set; }
        public string DestinationFacilityTypeID { get; set; }
        public string DestinationFileFormatName { get; set; }
        public string DestinationFileFormatID { get; set; }

        public string DestinationFileExtension { get; set; }
    }
}
