using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using ClosedXML.Excel;
using Newtonsoft.Json;
 
namespace BizzManWebErp
{
    public partial class wfSdSalesOrder : System.Web.UI.Page
    {
        //added on 12 Dec 2023
        static clsMain objMain;
        
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
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
                else
                {
                    Response.Redirect("wfAdminLogin.aspx");
                }
            }
        }


        [WebMethod]
        public static string MaterialPackagingList(string materialid)
        {
          //  clsMain objMain = new clsMain();
            DataTable dtMaterialPackagingList = new DataTable();

            try
            {

                dtMaterialPackagingList = objMain.dtFetchData("select id,Packaging from tblMmMaterialPackagingDetails where MaterialMasterId=" + materialid);
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtMaterialPackagingList);
        }

        [WebMethod]
        public static string FetchSalesOrderListDownload(string SalesOrderId = "")
        {
         //   clsMain objMain = new clsMain();
            DataTable dtSalesOrderList = new DataTable();

            try
            {

                dtSalesOrderList = objMain.dtFetchData(@"select so.SalesOrderId,so.SalesOrderSource,c.CustomerName,so.GST_Treatment,CONVERT(nvarchar,so.ExpirationDate,104) as ExpirationDate,
                                                             CONVERT(nvarchar,so.ExpirationDate,104) as ExpirationDate,cm.Currency,
		                                                     so.PaymentTerms,sm.OrderStatus as OrderStatus,
		                                                      so.TotalAmount as TotalAmount,b.BranchName,d.DeptName
                                                      from tblSdSalesOrder so 
                                                      left join tblCrmCustomers c on c.CustomerId=so.CustomerId
                                                      left join tblMmCurrencyMaster cm on cm.Id=so.CurrencyId
                                                      left join tblSdSalesOrderStatusMaster sm on sm.id=so.OrderStatusId
                                                      left join tblHrBranchMaster b on b.BranchCode=so.BranchCode
                                                      left join tblHrDeptMaster d on d.Id=so.DepartmentID
                                                      where 1=1" + (SalesOrderId != "" ? " and so.SalesOrderId in(SELECT Item FROM [dbo].[SplitString] ('" + SalesOrderId + "',','))" : "") + " order by so.id desc");
            }
            catch (Exception ex)
            {
                // return "";
            }
            dtSalesOrderList.TableName = "SalesOrderList";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dtSalesOrderList);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    byte[] bytes = stream.ToArray();

                    //Convert File to Base64 string and send to Client.
                    return Convert.ToBase64String(bytes, 0, bytes.Length);
                }
            }

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

            try
            {

                dtSalesOrderasterDetails = objMain.dtFetchData("select * from tblSdSalesOrder where SalesOrderId='" + SalesOrderId + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtSalesOrderasterDetails);
        }




        [WebMethod]
        public static string FetchSalesOrderDetailsList(string salesorderid = "")
        {
          //  clsMain objMain = new clsMain();
            DataTable dtSalesOrderDetailsList = new DataTable();

            try
            {

                dtSalesOrderDetailsList = objMain.dtFetchData(@"select o.MaterialId,m.MaterialName,o.Qty,m.UnitMesure,p.Packaging,
                                                          o.PackageId,o.UnitPrice,o.Tax,o.SubTotal
                                                          from tblSdSalesOrderProductDetails o
                                                          left join tblMmMaterialMaster m on m.Id=o.MaterialId
                                                          left join tblMmMaterialPackagingDetails p on p.id=o.PackageId
                                                          where o.SalesOrderId='" + salesorderid + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtSalesOrderDetailsList);
        }


        [WebMethod]
        public static string AddSalesOrder(string SalesOrderId = "", string CustomerId = "", string ExpirationDate = "", string GSTTreatment = "",
                                           string SalesOrder_details = "", string QuotationDate = "", string Currency = "", 
                                           string PaymentTerms="",string TermsConditions="",string TotalAmount="",string OrderSource="", string LoginUser = "",
                                           string BranchCode = "", string DepartmentID = "")
        {

           // clsMain objMain = new clsMain();
 //   have some error for class declaration
  //==========================================          
 //========================================
 ////============data not save===========================
            
            SqlParameter[] objParam = new SqlParameter[14];


            objParam[0] = new SqlParameter("@SalesOrderId", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = SalesOrderId;


            objParam[1] = new SqlParameter("@CustomerId", SqlDbType.Int);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = Convert.ToInt32(CustomerId);


            objParam[2] = new SqlParameter("@ExpirationDate", SqlDbType.DateTime);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = Convert.ToDateTime(ExpirationDate);


            objParam[3] = new SqlParameter("@GSTTreatment", SqlDbType.NVarChar);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = GSTTreatment;

            objParam[4] = new SqlParameter("@SalesOrder_details", SqlDbType.NVarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = SalesOrder_details;

            objParam[5] = new SqlParameter("@QuotationDate", SqlDbType.DateTime);
            objParam[5].Direction = ParameterDirection.Input;
            objParam[5].Value = Convert.ToDateTime(QuotationDate);

            objParam[6] = new SqlParameter("@Currency", SqlDbType.Int);
            objParam[6].Direction = ParameterDirection.Input;
            objParam[6].Value = Convert.ToInt32(Currency);

            objParam[7] = new SqlParameter("@PaymentTerms", SqlDbType.NVarChar);
            objParam[7].Direction = ParameterDirection.Input;
            objParam[7].Value = PaymentTerms;

            objParam[8] = new SqlParameter("@TermsConditions", SqlDbType.NVarChar);
            objParam[8].Direction = ParameterDirection.Input;
            objParam[8].Value = TermsConditions;

            objParam[9] = new SqlParameter("@TotalAmount", SqlDbType.Decimal);
            objParam[9].Direction = ParameterDirection.Input;
            objParam[9].Value = Convert.ToDecimal(TotalAmount);

            objParam[10] = new SqlParameter("@OrderSource", SqlDbType.NVarChar);
            objParam[10].Direction = ParameterDirection.Input;
            objParam[10].Value = OrderSource;

            objParam[11] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[11].Direction = ParameterDirection.Input;
            objParam[11].Value = LoginUser;

            objParam[12] = new SqlParameter("@BranchCode", SqlDbType.NVarChar);
            objParam[12].Direction = ParameterDirection.Input;
            objParam[12].Value = BranchCode;

            objParam[13] = new SqlParameter("@DepartmentID", SqlDbType.Int);
            objParam[13].Direction = ParameterDirection.Input;
            objParam[13].Value = Convert.ToInt32(DepartmentID);

            var result = objMain.ExecuteStoreProcedure("procSdSalesOrderInsert", objParam);

            string json = "";
            if (result != null)
            {
                if (result.Rows.Count > 0)
                {
                    json = result.Rows[0][0].ToString();
                }
            }


            return json;
        }

        [WebMethod]
        public static string UpdateSalesOrderStatus(string SalesOrderId = "", string OrderStatus = "",string LoginUser="")
        {

         //   clsMain objMain = new clsMain();
            SqlParameter[] objParam = new SqlParameter[3];


            objParam[0] = new SqlParameter("@SalesOrderId", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = SalesOrderId;


            objParam[1] = new SqlParameter("@OrderStatus", SqlDbType.NVarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = OrderStatus;

            objParam[2] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = LoginUser;


            var result = objMain.ExecuteProcedure("procSdSalesOrderStatusUpdate", objParam);


            return "";
        }

        //================================
        //=================================
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
        //============================
        //===========================






        //================================
        //===============================
        //==========================
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
        //===========================
        //==============================
        //==============================



        //=========================
        //=========================
        //======================
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
        //===========================
        //============================


        //===================================
        //===============================
        [WebMethod]
        public static string CustomerMasterList()
        {
          //  clsMain objMain = new clsMain();
            DataTable dtCustomerList = new DataTable();

            try
            {

                dtCustomerList = objMain.dtFetchData("select CustomerId,CustomerName FROM tblCrmCustomers");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtCustomerList);
        }
//==============================
//================================

        //===============================
        //==================================
        [WebMethod]
        public static string CustomerTypeMasterList()
        {
          //  clsMain objMain = new clsMain();
            DataTable dtCustomerList = new DataTable();

            try
            {

                dtCustomerList = objMain.dtFetchData("select id,CustomerType FROM tblCrmCustomerType");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtCustomerList);
        }

        //===============================
        //=================================

        //=============================
        //===============================
        //===============================
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
        //=============================
        //===============================
        //==============================






        [WebMethod]
        public static string AddCustomer(string CustomerName = "", string CustomerType = "", string CompanyName = "", string City = "",
                                           string State = "", string Email = "", string Mobile = "", string LoginUser = "")
        {

          //  clsMain objMain = new clsMain();
            SqlParameter[] objParam = new SqlParameter[8];


            objParam[0] = new SqlParameter("@CustomerName", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = CustomerName;


            objParam[1] = new SqlParameter("@CustomerType", SqlDbType.Int);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = Convert.ToInt32(CustomerType);


            objParam[2] = new SqlParameter("@CompanyName", SqlDbType.NVarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = CompanyName;


            objParam[3] = new SqlParameter("@City", SqlDbType.NVarChar);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = City;

            objParam[4] = new SqlParameter("@State", SqlDbType.NVarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = State;

            objParam[5] = new SqlParameter("@Email", SqlDbType.NVarChar);
            objParam[5].Direction = ParameterDirection.Input;
            objParam[5].Value = Email;

            objParam[6] = new SqlParameter("@Mobile", SqlDbType.NVarChar);
            objParam[6].Direction = ParameterDirection.Input;
            objParam[6].Value = Mobile;

            objParam[7] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[7].Direction = ParameterDirection.Input;
            objParam[7].Value = LoginUser;


            var result = objMain.ExecuteStoreProcedure("procCrmCustomerInsert", objParam);

            string json = "";
            if (result != null)
            {
                if (result.Rows.Count > 0)
                {
                    json = result.Rows[0][0].ToString();
                }
            }


            return json;
        }
//==============================
//===========================
        [WebMethod]
        public static string FetchStateList()
        {
          //  clsMain objMain = new clsMain();
            DataTable dtStateList = new DataTable();

            try
            {

                dtStateList = objMain.dtFetchData("select StateId,StateName from tblHrStateMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtStateList);
        }
//=============================
//==============================
        [WebMethod]
        public static string FetchCityList(string stateid)
        {
          //  clsMain objMain = new clsMain();
            DataTable dtCityList = new DataTable();

            try
            {

                dtCityList = objMain.dtFetchData("select Id,CityName from tblHrCityMaster where StateId=" + stateid);
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtCityList);
        }



        [WebMethod]
        public static string AddCustomerType(string CustomerType = "")
        {

          //  clsMain objMain = new clsMain();
            SqlParameter[] objParam = new SqlParameter[1];


            objParam[0] = new SqlParameter("@CustomerType", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = CustomerType;



            var result = objMain.ExecuteStoreProcedure("procCrmCustomerTypeInsert", objParam);

            string json = "";
            if (result != null)
            {
                if (result.Rows.Count > 0)
                {
                    json = result.Rows[0][0].ToString();
                }
            }


            return json;
        }


        [WebMethod]
        public static string MaterialMasterList()
        {
           // clsMain objMain = new clsMain();
            DataTable dtMaterialMasterList = new DataTable();

            try
            {

                dtMaterialMasterList = objMain.dtFetchData("select Id,MaterialName from tblMmMaterialMaster where isnull(CanSale,0)=1");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtMaterialMasterList);
        }

    }
}