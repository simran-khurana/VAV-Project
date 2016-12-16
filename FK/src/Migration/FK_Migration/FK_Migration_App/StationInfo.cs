using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FK_Migration
{
    public class StationInfo
    {
        public string DestinationFacilityNameId;
        public string StationName;
        public string SourceFolder;
        public string DestinationCategoryName;
        public string CategoryTaxonomyID;
        public string BaseCategoryName;
        public override string ToString()
        {
            return BaseCategoryName + " - " + StationName;
        }
    }
}
