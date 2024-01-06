﻿using System;
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
        public static string AddtSalesQuotationMasterAndDetails(List<SalesQuotationDetail> data,string QuotationId,int CustomerId,string  QuotationDate,string CreateBy,double NetTotal, double NetGST, double ShippingCharges, double NetAmount, string Notes,string  TermsAndConditions)
        {
            StringBuilder strBuild = new StringBuilder();
            strBuild.Append("<XMLData>");
            strBuild.Append("<QuotationId>"+ QuotationId + "</QuotationId>");
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
                    strBuild.Append("<Qty>" + item.Quantity+ "</Qty>");
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

                if (dtQuotationDetails!=null && dtQuotationDetails.Rows.Count>0)
                {
                    DataRow dr = dtQuotationDetails.Rows[0];
                    // Create an anonymous object containing SalesQuotationMasterinfo and sales items
                    var invoiceData = new
                    {
                        SalesQuotationMastertInfo = new
                        {
                            QuotationId = dr["QuotationId"].ToString(),
                            QuotationDate = dr["QuotationDate"].ToString(),
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

        public static string GeneratePDF(string QuotationId)
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
                    //add logic here

                    return "";
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
    }
}