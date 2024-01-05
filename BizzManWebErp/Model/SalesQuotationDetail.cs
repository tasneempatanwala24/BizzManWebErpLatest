using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BizzManWebErp.Model
{
    public class SalesQuotationDetail
    {
        public int ItemID { get; set; }
        public decimal Rate { get; set; }
        public decimal Qty { get; set; }
        public decimal Discount { get; set; }
        public decimal GST { get; set; }
        public decimal Amount { get; set; }
    }
}