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
where QuotationStatus='Approve' and Quot.SalesOrderComplete != 'y'
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
            DataTable dtQuotationDetails = new DataTable();
            DataTable dtSalesQuotationDetail = new DataTable();

            try
            {

                dtQuotationDetails = objMain.dtFetchData(@"select Quot.* ,isnull(CustomerName,'')as CustomerName,isnull(Mobile,'')as Mobile,convert(varchar(10), cast(QuotationDate as date), 101) as formattedQuotationDate
from tblSdSalesQuotationMaster as Quot
INNER JOIN   tblCrmCustomers on tblCrmCustomers.CustomerId=Quot.CustomerId
inner join tblCrmCustomerContacts on tblCrmCustomers.ContactId=tblCrmCustomerContacts.ContactId
where QuotationId='" + QuotationId + "'");

                dtSalesQuotationDetail = objMain.dtFetchData(@" select QuotationId,SD.Id as SalesQuotationDetailId,ItemId,materialName,material.Id as MaterialId,material.UnitMesure as UnitMeasure,Qty,Rate,Discount,GST,Amount,SD.CentralTaxPercent,SD.StateTaxPercent,SD.CessPercent,
material.MRP as ActualRate from tblSdSalesQuotationMaster SM 
inner join tblSdSalesQuotationDetail SD on SM.QuotationId=SD.QuotationMasterId inner join 
tblMmMaterialMaster material on material.Id=SD.ItemId where SM.QuotationId='" + QuotationId + "' and SD.SalesOrderGenerate='n'");

                if (dtQuotationDetails != null && dtQuotationDetails.Rows.Count > 0)
                {
                    DataRow dr = dtQuotationDetails.Rows[0];
                    // Create an anonymous object containing SalesQuotationMasterinfo and sales items
                    var invoiceData = new
                    {
                        SalesQuotationMastertInfo = new
                        {
                            QuotationId = dr["QuotationId"].ToString(),
                            formattedQuotationDate = dr["formattedQuotationDate"].ToString(),
                            //QuotationStatus = dr["QuotationStatus"].ToString(),
                            NetTotal = dr["NetTotal"].ToString(),
                            //NetGST = dr["NetGST"].ToString(),
                            NetAmount = dr["NetAmount"].ToString(),
                            //ShippingCharges = dr["ShippingCharges"].ToString(),
                            //Notes = dr["Notes"].ToString(),
                            //TermsAndConditions = dr["TermsAndConditions"].ToString(),
                            CustomerId = dr["CustomerId"].ToString(),
                            CustomerName = dr["CustomerName"].ToString(),
                            Mobile = dr["Mobile"].ToString()
                            //Email = dr["Email"].ToString(),
                            //Address = dr["Address"].ToString()

                        },
                        SalesItems = dtSalesQuotationDetail.AsEnumerable().ToList()

                    };
                    return JsonConvert.SerializeObject(invoiceData);
                }
            }
            catch (Exception ex)
            {
                return "";
            }
            return "";

        }

        [WebMethod]
        public static string GenerateOrderID(string OrderDate)
        {
            DataTable dtNewQuotationID = new DataTable();

            try
            {
                string formattedOrderDate = DateTime.ParseExact(OrderDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("yyyy/MM/dd");
                dtNewQuotationID = objMain.dtFetchData(@"select 'SORD' + CONVERT(NVARCHAR(10), '" + formattedOrderDate + "', 120)   +'/'+                       RIGHT('0000' + CAST(ISNULL(MAX(SUBSTRING(SalesOrderId, LEN(SalesOrderId) - 3, 4)), 0) + 1 AS NVARCHAR(4)), 4) as SalesOrderId    FROM tblSdSalesOrder    WHERE OrderDate ='" + formattedOrderDate + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtNewQuotationID);
        }


        [WebMethod]
        public static string GetBranchDetails()
        {
            // clsMain objMain = new clsMain();
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select BranchName, BranchCode from tblHrBranchMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtList);
        }

        [WebMethod]
        public static string GetDeptDetails()
        {
            //  clsMain objMain = new clsMain();
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select DeptName, Id from tblHrDeptMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtList);
        }

        [WebMethod]
        public static string BindCurrencyList()
        {
            //  clsMain objMain = new clsMain();
            DataTable dtCurrencyList = new DataTable();

            try
            {

                dtCurrencyList = objMain.dtFetchData("select Id,Currency FROM tblMmCurrencyMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtCurrencyList);
        }


        [WebMethod]
        public static string AddSalesOrder(List<SalesQuotationDetail> data, string SalesOrderId = "", string CustomerId = "", string ExpirationDate = "", string GSTTreatment = "", string QuotationDate = "", string Currency = "",
                                           string PaymentTerms = "", string TermsConditions = "", string TotalAmount = "", string OrderSource = "", string LoginUser = "",
                                           string BranchCode = "", string DepartmentID = "", string OrderDate = "", string QuotationId = "")
        {
            StringBuilder strBuild = new StringBuilder();
            strBuild.Append("<XMLData>");
            strBuild.Append("<SalesOrderId>" + SalesOrderId + "</SalesOrderId>");
            strBuild.Append("<QuotationId>" + QuotationId + "</QuotationId>");
            strBuild.Append("<CustomerId>" + CustomerId + "</CustomerId>");
            strBuild.Append("<ExpirationDate>" + DateTime.ParseExact(ExpirationDate, "yyyy-MM-dd", CultureInfo.InvariantCulture) + "</ExpirationDate>");
            strBuild.Append("<OrderDate>" + DateTime.ParseExact(OrderDate, "yyyy-MM-dd", CultureInfo.InvariantCulture) + "</OrderDate>");
            strBuild.Append("<GSTTreatment>" + GSTTreatment + "</GSTTreatment>");
            strBuild.Append("<QuotationDate>" + QuotationDate + "</QuotationDate>");
            strBuild.Append("<Currency>" + Currency + "</Currency>");
            strBuild.Append("<TermsConditions>" + TermsConditions + "</TermsConditions>");
            strBuild.Append("<PaymentTerms>" + PaymentTerms + "</PaymentTerms>");
            strBuild.Append("<TotalAmount>" + TotalAmount + "</TotalAmount>");
            strBuild.Append("<OrderSource>" + OrderSource + "</OrderSource>");
            strBuild.Append("<CreateUser>" + LoginUser + "</CreateUser>");
            strBuild.Append("<BranchCode>" + BranchCode + "</BranchCode>");
            strBuild.Append("<DepartmentID>" + DepartmentID + "</DepartmentID>");


            strBuild.Append("<SalesQuotationDetails>");
            if (data.Count > 0)
            {
                foreach (var item in data)
                {
                    strBuild.Append("<SalesQuotationDetail>");
                    strBuild.Append("<ItemId>" + Convert.ToInt32(item.ItemID) + "</ItemId>");
                    strBuild.Append("<Qty>" + item.Quantity + "</Qty>");
                    strBuild.Append("<Rate>" + item.Rate + "</Rate>");
                    strBuild.Append("<SalesQuotationDetailId>" + item.SalesQuotationDetailId + "</SalesQuotationDetailId>");
                    strBuild.Append("<GST>" + item.GST + "</GST>");
                    strBuild.Append("<Discount>" + item.Discount + "</Discount>");
                    //strBuild.Append("<CentralTaxPercent>" + item.CentralTaxPercent + "</CentralTaxPercent>");
                    //strBuild.Append("<StateTaxPercent>" + item.StateTaxPercent + "</StateTaxPercent>");
                    //strBuild.Append("<CessPercent>" + item.CessPercent + "</CessPercent>");

                    strBuild.Append("<Amount>" + item.Amount + "</Amount>");
                    strBuild.Append("</SalesQuotationDetail>");
                }
            }
            strBuild.Append("</SalesQuotationDetails>");

            strBuild.Append("</XMLData>");



            //  clsMain objMain = new clsMain();
            SqlParameter[] objParam = new SqlParameter[1];


            objParam[0] = new SqlParameter("@XMLData", SqlDbType.Xml);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = strBuild.ToString();

            var result = objMain.ExecuteProcedure("procSdSalesQuotationOrder", objParam);


            return "";
        }


        [WebMethod]
        public static string FetchSalesOrderMasterList()
        {
            //   clsMain objMain = new clsMain();
            DataTable dtMaterialBOMMasterList = new DataTable();

            try
            {

                dtMaterialBOMMasterList = objMain.dtFetchData(@"select so.SalesOrderId,so.SalesOrderSource,c.CustomerName,so.GST_Treatment,CONVERT(nvarchar,so.ExpirationDate,104) as ExpirationDate,
                                                             CONVERT(nvarchar,so.QuotationDate,104) as QuotationDate,cm.Currency,
		                                                     so.PaymentTerms,sm.OrderStatus as OrderStatus,so.OrderStatusId,
		                                                      so.TotalAmount as TotalAmount,b.BranchName,d.DeptName
                                                      from tblSdSalesOrder so 
                                                      left join tblCrmCustomers c on c.CustomerId=so.CustomerId
                                                      left join tblMmCurrencyMaster cm on cm.Id=so.CurrencyId
                                                      left join tblSdSalesOrderStatusMaster sm on sm.id=so.OrderStatusId
                                                      left join tblHrBranchMaster b on b.BranchCode=so.BranchCode
                                                      left join tblHrDeptMaster d on d.Id=so.DepartmentID
                                                              order by so.id desc");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtMaterialBOMMasterList);
        }


        [WebMethod]
        public static string FetchSalesOrderMasterDetails(string SalesOrderId)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtSalesOrderasterDetails = new DataTable();
            DataTable dtSalesOrderDetailsList = new DataTable();
            try
            {

                dtSalesOrderasterDetails = objMain.dtFetchData(@"select SO.*,CustomerName,Mobile,BranchName,DeptName,Currency,
convert(varchar(10), cast(SO.QuotationDate as date), 101) as formattedQuotationDate,
convert(varchar(10), cast(ExpirationDate as date), 101) as formattedExpirationDate,
convert(varchar(10), cast(OrderDate as date), 101) as formattedOrderDate
from tblSdSalesOrder SO
                    inner join tblCrmCustomers Cust on Cust.CustomerId=SO.CustomerId
                    inner join tblCrmCustomerContacts on Cust.ContactId=tblCrmCustomerContacts.ContactId
                    inner join tblHrBranchMaster on tblHrBranchMaster.BranchCode=SO.BranchCode
                    inner join tblHrDeptMaster on tblHrDeptMaster.Id=SO.DepartmentID
                    inner join tblMmCurrencyMaster on tblMmCurrencyMaster.Id=SO.CurrencyId
                    left join tblSdSalesQuotationMaster as Quot on Quot.QuotationId=SO.SalesQuotationMasterId
                    where SalesOrderId='" + SalesOrderId + "'");

                dtSalesOrderDetailsList = objMain.dtFetchData(@"select o.MaterialId,m.MaterialName,o.Qty,m.UnitMesure,p.Packaging,
                                                                  o.PackageId,o.UnitPrice,o.Tax,o.SubTotal
                                                                  from tblSdSalesOrderProductDetails o
                                                                  left join tblMmMaterialMaster m on m.Id=o.MaterialId
                                                                  left join tblMmMaterialPackagingDetails p on p.id=o.PackageId
                                                                  where o.SalesOrderId='" + SalesOrderId + "'");

                if (dtSalesOrderasterDetails != null && dtSalesOrderasterDetails.Rows.Count > 0)
                {
                    DataRow dr = dtSalesOrderasterDetails.Rows[0];
                    // Create an anonymous object containing SalesQuotationMasterinfo and sales items
                    var invoiceData = new
                    {
                        SalesQuotationOrderMastertInfo = new
                        {
                            QuotationId = dr["SalesQuotationMasterId"].ToString(),
                            SalesOrderId = dr["SalesOrderId"].ToString(),
                            GSTTreatment = dr["GST_Treatment"].ToString(),
                            PaymentTerms = dr["PaymentTerms"].ToString(),
                            TermCondition = dr["TermCondition"].ToString(),
                             formattedQuotationDate = dr["formattedQuotationDate"].ToString(),
                            formattedExpirationDate = dr["formattedExpirationDate"].ToString(),
                            formattedOrderDate = dr["formattedOrderDate"].ToString(),
                            BranchName = dr["BranchName"].ToString(),
                            DeptName = dr["DeptName"].ToString(),
                            Currency = dr["Currency"].ToString(),
                            TotalAmount = dr["TotalAmount"].ToString(),
                            CustomerId = dr["CustomerId"].ToString(),
                            CustomerName = dr["CustomerName"].ToString(),
                            Mobile = dr["Mobile"].ToString()
                           

                        },
                        SalesItems = dtSalesOrderDetailsList.AsEnumerable().ToList()

                    };
                    return JsonConvert.SerializeObject(invoiceData);
                }
            }
            catch (Exception ex)
            {
                return "";
            }

            return "";
        }

    }

}