using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using BizzManWebErp.Model;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.ExtendedProperties;
using Newtonsoft.Json;
using iTextSharp;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Vml;
using System.Security;
using DocumentFormat.OpenXml.Office.CoverPageProps;
namespace BizzManWebErp
{
    public partial class wfSdSalesQuotationOrder : System.Web.UI.Page
    {
        static clsMain objMain;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["Id"] != null)
            {
                loginuser.Value = Session["Id"].ToString();
                //added on 12 Dec 2023
                //############START###############
                if (Session["objMain_Session"] != null)
                {
                    objMain = (clsMain)Session["objMain_Session"];
                }
                else
                {
                    Response.Redirect("wfAdminLogin.aspx");
                }
                //############END###############
            }
        }

        [WebMethod]
        public static string GetQuotationList()
        {
            //  clsMain objMain = new clsMain();
            DataTable dtQuotationlist = new DataTable();

            try
            {

                dtQuotationlist = objMain.dtFetchData(@"select Quot.* ,isnull(CustomerName,'')as CustomerName,isnull(Mobile,'')as Mobile
from tblSdSalesQuotationMaster as Quot
INNER JOIN   tblCrmCustomers on tblCrmCustomers.CustomerId=Quot.CustomerId
inner join tblCrmCustomerContacts on tblCrmCustomers.ContactId=tblCrmCustomerContacts.ContactId
where QuotationStatus='Approve'
");
            }
            catch (Exception ex)
            {

            }

            var settings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.Arrays
            };
            return JsonConvert.SerializeObject(dtQuotationlist, settings);

        }

        [WebMethod]
        public static string GetQuotationIdDetailsById(string QuotationId)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtCustomerDetails = new DataTable();

            try
            {

                dtCustomerDetails = objMain.dtFetchData(@"select Quot.* ,isnull(CustomerName,'')as CustomerName,isnull(Mobile,'')as Mobile
from tblSdSalesQuotationMaster as Quot
INNER JOIN   tblCrmCustomers on tblCrmCustomers.CustomerId=Quot.CustomerId
inner join tblCrmCustomerContacts on tblCrmCustomers.ContactId=tblCrmCustomerContacts.ContactId
where QuotationId='" + QuotationId + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtCustomerDetails);
        }

        [WebMethod]
        public static string GenerateOrderID(string OrderDate)
        {
            DataTable dtNewQuotationID = new DataTable();

            try
            {
                string formattedOrderDate = DateTime.ParseExact(OrderDate, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("yyyy/MM/dd");
                dtNewQuotationID = objMain.dtFetchData("select 'SORD' + CONVERT(NVARCHAR(10), '" + formattedOrderDate + "', 120) + '/' +\r\n                             RIGHT('0000' + CAST(ISNULL(MAX(SUBSTRING(SalesOrderId, LEN(QuotationID) - 3, 4)), 0) + 1 AS NVARCHAR(4)), 4)\r\n as SalesOrderId    FROM tblSdSalesOrder\r\n    WHERE OrderDate ='" + formattedOrderDate + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtNewQuotationID);
        }
    }


}