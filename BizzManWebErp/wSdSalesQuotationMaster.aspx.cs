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

namespace BizzManWebErp
{
    public partial class wSdSalesQuotationMaster : System.Web.UI.Page
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
        public static string MaterialMasterList()
        {
            //  clsMain objMain = new clsMain();

            DataTable dtMaterialMasterList = new DataTable();

            try
            {

                //  dtMaterialMasterList = objMain.dtFetchData("select Id,MaterialName from tblMmMaterialMaster where Id not in(select MaterialMasterId from tblMmBomMaster) and BOM='Y'");
                dtMaterialMasterList = objMain.dtFetchData("select Id,MaterialName from tblMmMaterialMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtMaterialMasterList);
        }

        [WebMethod]
        public static string FetchMaterialDetails(string MaterialId)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtMaterialDetails = new DataTable();

            try
            {

                dtMaterialDetails = objMain.dtFetchData("select Id,MaterialName,UnitMesure,MRP,isnull(IntegratedTaxPercent,0) as IntegratedTaxPercent from tblMmMaterialMaster where Id=" + MaterialId + "");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtMaterialDetails);
        }

        [WebMethod]
        public static string GetCustomerList()
        {
            //  clsMain objMain = new clsMain();
            DataTable dtCustomerlist = new DataTable();

            try
            {

                dtCustomerlist = objMain.dtFetchData(@"select tblCrmCustomers.CustomerID,isnull(CustomerName,'')as CustomerName,isnull(Street1,'')+' '+isnull(City,'')+' '+isnull(State,'')+' '+isnull(Zip,'')+' '+isnull(Country,'') as Address
,isnull(Mobile,'')as Mobile,isnull(Email,'')as Email from tblCrmCustomerContacts
inner join tblCrmCustomers on tblCrmCustomers.CustomerID=tblCrmCustomerContacts.CustomerID");
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
            return JsonConvert.SerializeObject(dtCustomerlist, settings);

        }

        [WebMethod]
        public static string GetCustomerDetailsById(string CustomerId)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtCustomerDetails = new DataTable();

            try
            {

                dtCustomerDetails = objMain.dtFetchData("select tblCrmCustomers.CustomerID,isnull(CustomerName,'')as CustomerName,isnull(Street1,'')+' '+isnull(City,'')+' '+isnull(State,'')+' '+isnull(Zip,'')+' '+isnull(Country,'') as Address\r\n,isnull(Mobile,'')as Mobile,isnull(Email,'')as Email from tblCrmCustomerContacts\r\ninner join tblCrmCustomers on tblCrmCustomers.CustomerID=tblCrmCustomerContacts.CustomerID where tblCrmCustomers.CustomerID=" + CustomerId + "");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtCustomerDetails);
        }

        [WebMethod]
        public static string AddtSalesQuotationMasterAndDetails(List<SalesQuotationDetail> data, string QuotationId, int CustomerId, string QuotationDate, string CreateBy, double NetTotal, double NetGST, double ShippingCharges, double NetAmount, string Notes, string TermsAndConditions)
        {
            StringBuilder strBuild = new StringBuilder();
            strBuild.Append("<XMLData>");
            strBuild.Append("<QuotationId>" + QuotationId + "</QuotationId>");
            strBuild.Append("<CustomerId>" + CustomerId + "</CustomerId>");
            strBuild.Append("<QuotationDate>" + DateTime.ParseExact(QuotationDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) + "</QuotationDate>");
            strBuild.Append("<CreateBy>" + CreateBy + "</CreateBy>");
            strBuild.Append("<NetTotal>" + NetTotal + "</NetTotal>");
            strBuild.Append("<NetGST>" + NetGST + "</NetGST>");
            strBuild.Append("<ShippingCharges>" + ShippingCharges + "</ShippingCharges>");
            strBuild.Append("<NetAmount>" + NetAmount + "</NetAmount>");
            strBuild.Append("<Notes>" + Notes + "</Notes>");
            strBuild.Append("<TermsAndConditions>" + TermsAndConditions + "</TermsAndConditions>");

            strBuild.Append("<SalesQuotationDetails>");
            if (data.Count > 0)
            {
                foreach (var item in data)
                {
                    strBuild.Append("<SalesQuotationDetail>");
                    strBuild.Append("<ItemId>" + Convert.ToInt32(item.ItemID) + "</ItemId>");
                    strBuild.Append("<Qty>" + item.Quantity + "</Qty>");
                    strBuild.Append("<Rate>" + item.Rate + "</Rate>");
                    strBuild.Append("<Discount>" + item.Discount + "</Discount>");
                    strBuild.Append("<GST>" + item.GST + "</GST>");
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





            var result = objMain.ExecuteProcedure("procSdSalesQuotationMaster", objParam);


            return "";
        }

        [WebMethod]
        public static string GetSdSalesQuotationMasterById(string QuotationId)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtQuotationDetails = new DataTable();
            DataTable dtSalesQuotationDetail = new DataTable();
            try
            {

                dtQuotationDetails = objMain.dtFetchData("select QuotationId,QuotationDate,QuotationStatus,NetTotal,NetGST,NetAmount,ShippingCharges,Notes,TermsAndConditions\r\n,cust.CustomerId,isnull(CustomerName,'')as CustomerName,isnull(Mobile,'')as Mobile,isnull(Email,'')as Email\r\n,isnull(Street1,'')+' '+isnull(City,'')+' '+isnull(State,'')+' '+isnull(Zip,'')+' '+isnull(Country,'') as Address\r\nfrom tblSdSalesQuotationMaster SM\r\n inner join tblCrmCustomers cust on SM.CustomerId=cust.CustomerId\r\n inner join tblCrmCustomerContacts CustCon on CustCon.CustomerId=cust.CustomerId where SM.QuotationId='" + QuotationId + "'");

                dtSalesQuotationDetail = objMain.dtFetchData(" select QuotationId,ItemId,materialName,Qty,Rate,Discount,GST,Amount from \r\n tblSdSalesQuotationMaster SM\r\n inner join tblSdSalesQuotationDetail SD on SM.QuotationId=SD.QuotationMasterId\r\n inner join tblMmMaterialMaster material on material.Id=SD.ItemId where SM.QuotationId='" + QuotationId + "'");

                if (dtQuotationDetails != null && dtQuotationDetails.Rows.Count > 0)
                {
                    DataRow dr = dtQuotationDetails.Rows[0];
                    // Create an anonymous object containing SalesQuotationMasterinfo and sales items
                    var invoiceData = new
                    {
                        SalesQuotationMastertInfo = new
                        {
                            QuotationId = dr["QuotationId"].ToString(),
                            QuotationDate = Convert.ToDateTime(dr["QuotationDate"].ToString()).ToString("dd/MM/yyyy"),
                            QuotationStatus = dr["QuotationStatus"].ToString(),
                            NetTotal = dr["NetTotal"].ToString(),
                            NetGST = dr["NetGST"].ToString(),
                            NetAmount = dr["NetAmount"].ToString(),
                            ShippingCharges = dr["ShippingCharges"].ToString(),
                            Notes = dr["Notes"].ToString(),
                            TermsAndConditions = dr["TermsAndConditions"].ToString(),
                            CustomerId = dr["CustomerId"].ToString(),
                            CustomerName = dr["CustomerName"].ToString(),
                            Mobile = dr["Mobile"].ToString(),
                            Email = dr["Email"].ToString(),
                            Address = dr["Address"].ToString()

                        },
                        SalesItems = dtSalesQuotationDetail.AsEnumerable().ToList()

                    };
                    return JsonConvert.SerializeObject(invoiceData);
                }
                else
                {
                    return "";
                }


            }
            catch (Exception ex)
            {
                return "";
            }


        }

        [WebMethod]
        public static string FetchMasterList()
        {
            DataTable dtEmpList = new DataTable();

            try
            {
                Console.WriteLine("Fetching data...");
                dtEmpList = objMain.dtFetchData(@"select a.QuotationId,a.QuotationDate,a.NetTotal,a.NetGST,a.ShippingCharges,a.NetAmount,a.Notes,a.TermsAndConditions,a.QuotationStatus,b.ContactName from tblSdSalesQuotationMaster as a Inner Join tblCrmCustomerContacts as b on a.[CustomerId]=b.[CustomerId] order by a.CreateDate desc");

                if (dtEmpList == null)
                {
                    Console.WriteLine("No data found.");
                    return "[]"; // or any default value indicating an empty list
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching data: " + ex.ToString());
            }
            var settings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.Arrays
            };

            string json = JsonConvert.SerializeObject(dtEmpList, Formatting.None);
            dtEmpList.Clear();
            // return JsonConvert.SerializeObject(dtEmpList, settings);
            return json;

        }



        private  void AddInvoiceContent(Document document, string QuotationId)
        {// Open the document before adding content
         // Your company information
            //string filePath = Server.MapPath("Images\\logo.jpg");
            //filePath=Path.Combine(filePath, "Images\\logo.jpg");
            PdfPTable companyInfoTable = new PdfPTable(2);
            companyInfoTable.WidthPercentage = 100;
            companyInfoTable.SetWidths(new float[] { 3f, 1f }); // Adjust the widths as needed
            PdfPCell companyInfoCell = new PdfPCell();
            DataTable dtCompanyDetails = objMain.dtFetchData("select CompanyName,Address1,PhoneNo,EmailAddress,WebSiteAddress,Logo from tblAdminCompanyMaster");

 
            if (dtCompanyDetails != null && dtCompanyDetails.Rows.Count > 0)
            {
                string companyName = Convert.ToString(dtCompanyDetails.Rows[0]["CompanyName"]);
                companyInfoCell.AddElement(new Paragraph("Company Name : " + companyName, FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12)));

              



                string companyAddress = Convert.ToString(dtCompanyDetails.Rows[0]["Address1"]);
                companyInfoCell.AddElement(new Paragraph("Company Address : " + companyAddress, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                string companyEmail = Convert.ToString(dtCompanyDetails.Rows[0]["EmailAddress"]);
                companyInfoCell.AddElement(new Paragraph("Email: " + companyEmail, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                string companyPhone = Convert.ToString(dtCompanyDetails.Rows[0]["PhoneNo"]);
                companyInfoCell.AddElement(new Paragraph("Contact: " + companyPhone, FontFactory.GetFont(FontFactory.HELVETICA, 10)));

                companyInfoCell.BorderWidth = 0;

                companyInfoTable.AddCell(companyInfoCell);
                // Company logo on the right
                //adding company logo
                PdfPCell companyLogoCell = new PdfPCell();
                if (dtCompanyDetails.Rows[0]["Logo"]!= System.DBNull.Value)
                {
                    byte[] imageData = (byte[])dtCompanyDetails.Rows[0]["Logo"];

                   
                    // Replace "path/to/your/logo.png" with the actual path to your logo image
                    //iTextSharp.text.Image logo = iTextSharp.text.Image.GetInstance(filePath);

                    // Attempt to create an iTextSharp Image instance from the byte array
                    iTextSharp.text.Image logo = iTextSharp.text.Image.GetInstance(imageData);


                    logo.ScaleToFit(100, 100); // Adjust the width and height as needed
                    companyLogoCell.AddElement(logo);
                   

                    
                   
                }
                companyLogoCell.BorderWidth = 0;
                companyLogoCell.HorizontalAlignment = Element.ALIGN_RIGHT; // Align to the right
                companyInfoTable.AddCell(companyLogoCell);
                document.Add(companyInfoTable);

            }

           

            // Bill To section
            PdfPTable billToTable = new PdfPTable(2);
            billToTable.WidthPercentage = 100;
            billToTable.SetWidths(new float[] { 3f, 1f });

            // Client information on the left
            PdfPCell clientInfoCell = new PdfPCell();
            DataTable dtClientDetails = objMain.dtFetchData("SELECT ContactName, Street1, Phone, Email FROM tblCrmCustomerContacts WHERE CustomerId = (SELECT CustomerId FROM tblSdSalesQuotationMaster WHERE QuotationId = '" + QuotationId + "')");
            if (dtClientDetails.Rows.Count > 0)
            {
                string clientName = Convert.ToString(dtClientDetails.Rows[0]["ContactName"]);
                string clientAddress = Convert.ToString(dtClientDetails.Rows[0]["Street1"]);
                string clientEmail = Convert.ToString(dtClientDetails.Rows[0]["Email"]);
                string phone = Convert.ToString(dtClientDetails.Rows[0]["Phone"]);
                clientInfoCell.AddElement(new Paragraph("Name : " + clientName, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                clientInfoCell.AddElement(new Paragraph("Address : " + clientAddress, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                clientInfoCell.AddElement(new Paragraph("Phone : " + phone, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                clientInfoCell.AddElement(new Paragraph("Email: " + clientEmail, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                // Set border width and padding to zero
                clientInfoCell.BorderWidth = 0;
                clientInfoCell.Padding = 0;
                //clientInfoCell.HorizontalAlignment = Element.ALIGN_LEFT;
                billToTable.AddCell(clientInfoCell);
                DataTable dtQuotationDetails = objMain.dtFetchData("select QuotationId,FORMAT(QuotationDate, 'dd/MM/yyyy') as QuotationDate,QuotationStatus,NetTotal,NetGST,NetAmount,ShippingCharges,Notes,TermsAndConditions\r\n,cust.CustomerId,isnull(CustomerName,'')as CustomerName,isnull(Mobile,'')as Mobile,isnull(Email,'')as Email\r\n,isnull(Street1,'')+' '+isnull(City,'')+' '+isnull(State,'')+' '+isnull(Zip,'')+' '+isnull(Country,'') as Address\r\nfrom tblSdSalesQuotationMaster SM\r\n inner join tblCrmCustomers cust on SM.CustomerId=cust.CustomerId\r\n inner join tblCrmCustomerContacts CustCon on CustCon.CustomerId=cust.CustomerId where SM.QuotationId='" + QuotationId + "'");
                // Quotation details on the right
                PdfPCell quotationDetailsCell = new PdfPCell();
                quotationDetailsCell.AddElement(new Paragraph("Quotation ID: " + QuotationId, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                quotationDetailsCell.AddElement(new Paragraph("Quotation Date: " + Convert.ToString(dtQuotationDetails.Rows[0]["QuotationDate"]), FontFactory.GetFont(FontFactory.HELVETICA, 10)));
                quotationDetailsCell.BorderWidth = 0;
                quotationDetailsCell.Padding = 0;
                quotationDetailsCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                billToTable.AddCell(quotationDetailsCell);

                document.Add(new Paragraph("Bill To", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12)));
                document.Add(billToTable);

                // Add a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break


                // Add your invoice content here

                // Example: Adding a table
                PdfPTable itemTable = new PdfPTable(6);
                itemTable.WidthPercentage = 100;
                itemTable.SetWidths(new float[] { 2f, 1f, 1f, 1f, 1f, 1f });

                // Add table header
                itemTable.AddCell(new PdfPCell(new Phrase("Item", FontFactory.GetFont(FontFactory.HELVETICA_BOLD))));
                itemTable.AddCell(new PdfPCell(new Phrase("Qty", FontFactory.GetFont(FontFactory.HELVETICA_BOLD))));
                itemTable.AddCell(new PdfPCell(new Phrase("Rate", FontFactory.GetFont(FontFactory.HELVETICA_BOLD))));
                itemTable.AddCell(new PdfPCell(new Phrase("Discount", FontFactory.GetFont(FontFactory.HELVETICA_BOLD))));
                itemTable.AddCell(new PdfPCell(new Phrase("GST %", FontFactory.GetFont(FontFactory.HELVETICA_BOLD))));
                itemTable.AddCell(new PdfPCell(new Phrase("Amount", FontFactory.GetFont(FontFactory.HELVETICA_BOLD))));
                DataTable dtSalesQuotationDetail = objMain.dtFetchData(" select QuotationId,ItemId,materialName,Qty,Rate,Discount,GST,Amount from \r\n tblSdSalesQuotationMaster SM\r\n inner join tblSdSalesQuotationDetail SD on SM.QuotationId=SD.QuotationMasterId\r\n inner join tblMmMaterialMaster material on material.Id=SD.ItemId where SM.QuotationId='" + QuotationId + "'");
                // Add table rows with item details
                // Replace the following with your actual data
                if (dtSalesQuotationDetail != null && dtSalesQuotationDetail.Rows.Count > 0)
                {
                    foreach (DataRow row in dtSalesQuotationDetail.Rows)
                    {
                        itemTable.AddCell(row["materialName"].ToString());
                        itemTable.AddCell(row["Qty"].ToString());
                        itemTable.AddCell(row["Rate"].ToString());
                        itemTable.AddCell(row["Discount"].ToString());
                        itemTable.AddCell(row["GST"].ToString());
                        itemTable.AddCell(row["Amount"].ToString());
                    }


                }
                // Add more rows as needed

                // Add table footer
                PdfPCell totalAmountCell = new PdfPCell(new Phrase("Total Amount", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                totalAmountCell.Colspan = 5;
                totalAmountCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                itemTable.AddCell(totalAmountCell);
                string amt = Convert.ToString(dtQuotationDetails.Rows[0]["NetTotal"]);
                itemTable.AddCell(amt);
                string gst = Convert.ToString(dtQuotationDetails.Rows[0]["NetGST"]);
                PdfPCell netGSTCell = new PdfPCell(new Phrase("Net GST", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                netGSTCell.Colspan = 5;
                netGSTCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                itemTable.AddCell(netGSTCell);
                itemTable.AddCell(gst);
                string ship = Convert.ToString(dtQuotationDetails.Rows[0]["ShippingCharges"]);
                PdfPCell shippingChargesCell = new PdfPCell(new Phrase("Shipping Charges", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                shippingChargesCell.Colspan = 5;
                shippingChargesCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                itemTable.AddCell(shippingChargesCell);
                itemTable.AddCell(ship)
        ;
                string net = Convert.ToString(dtQuotationDetails.Rows[0]["NetAmount"]);
                PdfPCell netAmountCell = new PdfPCell(new Phrase("Net Amount", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                netAmountCell.Colspan = 5;
                netAmountCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                itemTable.AddCell(netAmountCell);
                itemTable.AddCell(net);

                document.Add(itemTable);
                // Add a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break
                document.Add(new Paragraph(new Phrase(" ")));  // Add an empty phrase to force a line break
                                                               // Example: Adding notes
                string notes = Convert.ToString(dtQuotationDetails.Rows[0]["Notes"]);
                document.Add(new Paragraph("Notes: " + notes, FontFactory.GetFont(FontFactory.HELVETICA, 10)));

                // Example: Adding terms and conditions
                string terms = Convert.ToString(dtQuotationDetails.Rows[0]["TermsAndConditions"]);
                document.Add(new Paragraph("Terms and Conditions: " + terms, FontFactory.GetFont(FontFactory.HELVETICA, 10)));
            }
        }

        protected void btnPrint_Click(object sender, EventArgs e)
        {
            string QuotationId = printQuotationId.Value;
            // Output directory for the PDF file
           // string filePath = Server.MapPath("~/"+ QuotationId.Replace("/","") + ".pdf");
            //if (File.Exists(filePath))
            //    File.Delete(filePath);
            DataTable dtQuotationDetails = new DataTable();
            DataTable dtSalesQuotationDetail = new DataTable();
            try
            {

                dtQuotationDetails = objMain.dtFetchData("select QuotationId,QuotationDate,QuotationStatus,NetTotal,NetGST,NetAmount,ShippingCharges,Notes,TermsAndConditions\r\n,cust.CustomerId,isnull(CustomerName,'')as CustomerName,isnull(Mobile,'')as Mobile,isnull(Email,'')as Email\r\n,isnull(Street1,'')+' '+isnull(City,'')+' '+isnull(State,'')+' '+isnull(Zip,'')+' '+isnull(Country,'') as Address\r\nfrom tblSdSalesQuotationMaster SM\r\n inner join tblCrmCustomers cust on SM.CustomerId=cust.CustomerId\r\n inner join tblCrmCustomerContacts CustCon on CustCon.CustomerId=cust.CustomerId where SM.QuotationId='" + QuotationId + "'");

                dtSalesQuotationDetail = objMain.dtFetchData(" select QuotationId,ItemId,materialName,Qty,Rate,Discount,GST,Amount from \r\n tblSdSalesQuotationMaster SM\r\n inner join tblSdSalesQuotationDetail SD on SM.QuotationId=SD.QuotationMasterId\r\n inner join tblMmMaterialMaster material on material.Id=SD.ItemId where SM.QuotationId='" + QuotationId + "'");

                if (dtQuotationDetails != null && dtQuotationDetails.Rows.Count > 0)
                {
                    //var fs = new FileStream(filePath, FileMode.Create);
                    //  MemoryStream fs = new MemoryStream();

                    Response.ContentType = "application/pdf";
                    Response.AppendHeader("Content-Disposition", "attachment; filename=" + QuotationId.Replace("/", "") + ".pdf");

                    using (MemoryStream fs = new MemoryStream())
                    {
                        Document document = new Document(PageSize.A4, 25, 25, 30, 30);
                        //PdfWriter writer = PdfWriter.GetInstance(document, fs);
                        PdfWriter writer = PdfWriter.GetInstance(document, Response.OutputStream);

                        document.Open();
                        AddInvoiceContent(document, QuotationId);
                        document.Close();
                        Response.End();
                    }
                    
                }
                else
                {

                }
                //if (File.Exists(filePath))
                //    File.Delete(filePath);

             
              //  Response.TransmitFile(filePath);
            


               

            }
            catch (Exception ex)
            {

            }
        }


        [WebMethod]
        public static string UpdateQuotationStatus(string QuotationId, string QuotationStatus)
        {
            //  clsMain objMain = new clsMain();
            SqlParameter[] objParam = new SqlParameter[2];


            objParam[0] = new SqlParameter("@QuotationId", SqlDbType.VarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = QuotationId;


            objParam[1] = new SqlParameter("@QuotationStatus", SqlDbType.VarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = QuotationStatus;



            var result = objMain.ExecuteProcedure("procSdSalesQuotationMasterUpdate", objParam);


            return "";
        }

        [WebMethod]
        public static string GenerateQuotationID(string QuotationDate)
        {
            DataTable dtNewQuotationID = new DataTable();

            try
            {
                string formattedQuotationDate = DateTime.ParseExact(QuotationDate, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("yyyy/MM/dd");
                dtNewQuotationID = objMain.dtFetchData("select 'QUOT' + CONVERT(NVARCHAR(10), '"+ formattedQuotationDate + "', 120) + '/' +\r\n                             RIGHT('0000' + CAST(ISNULL(MAX(SUBSTRING(QuotationID, LEN(QuotationID) - 3, 4)), 0) + 1 AS NVARCHAR(4)), 4)\r\n as QuotationID    FROM tblSdSalesQuotationMaster\r\n    WHERE QuotationDate ='" + formattedQuotationDate + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtNewQuotationID);
        }
    }
}
