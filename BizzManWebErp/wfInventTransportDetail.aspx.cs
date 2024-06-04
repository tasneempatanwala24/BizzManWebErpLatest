using DocumentFormat.OpenXml.Bibliography;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Web.Services;

namespace BizzManWebErp
{
    public partial class wfInventTransportDetail : System.Web.UI.Page
    {
        static clsMain objMain;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["Id"] != null)
                {
                    loginuser.Value = Convert.ToString(Session["Id"]);

                    //added  on 24 Feb 2024
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
        public static string BranchMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select BranchCode, BranchName FROM tblHrBranchMaster");
            }
            catch (Exception ex)
            {
                return "";
            }
            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }

        [WebMethod]
        public static string DepartmentMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select Id,DeptName FROM tblHrDeptMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }

        [WebMethod]
        public static string TransportMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select Id,TransportName FROM tblInventTransportMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }

        [WebMethod]
        public static string LocationMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select Id,LocationName FROM tblInventLocationMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }

        [WebMethod]
        public static string MaterialPOEntryMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select Id,Id as TransportCategoryTransectionId FROM tblMmMaterialPurchaseOrderEntryMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }
        [WebMethod]
        public static string SDSalesOrderList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select SalesOrderId as Id,SalesOrderId as TransportCategoryTransectionId FROM tblSdSalesOrder");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }
        [WebMethod]
        public static string MaterialPurchaseGrnMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select Id,Id as TransectionId  FROM tblMmMaterialPurchaseGrnMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }

        [WebMethod]
        public static string SdSODeliveryMasterList()
        {
            DataTable dtList = new DataTable();

            try
            {

                dtList = objMain.dtFetchData("select SalesOrderDeliveryId as Id,SalesOrderDeliveryId as TransectionId FROM tblSdSalesOrderDeliveryMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;

        }

        [WebMethod]
        public static string FetchTransportDetails(string ID = "")
        {
            DataTable dtList = new DataTable();

            try
            {
                dtList = objMain.dtFetchData(@"select ID,convert(varchar, EntryDate, 23) AS EntryDate,TransportMasterId
                ,TransportCategory, TransportCategoryTransectionId,TransectionId,FromLocation,ToLocation
                ,TransportAmt,CentralTaxPercent,StateTaxPercent,CessPercent,CAST(TransportImage as varchar(max))[TransportImage]
                ,NetAmt,Description,SubmitGST,BranchCode,DepartmentID,VehicleNo,VehicleType
                from tblInventTransportDetail where Id='" + ID + "'");
            }
            catch (Exception ex)
            {
                // return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            return json;
        }
          
        [WebMethod]
        public static string FetchTransportDetailList()
        {
            DataTable dtList = new DataTable();

            try
            {
                dtList = objMain.dtFetchData(@"select TD.ID,convert(varchar, EntryDate, 23) as EntryDate,TransportName,TransportAmt,FromLocation,ToLocation,CentralTaxPercent,StateTaxPercent,CessPercent,NetAmt from tblInventTransportDetail TD INNER JOIN tblInventTransportMaster T ON TD.TransportMasterId = T.Id");
            }
            catch (Exception ex)
            {
                // return "";
            }

            var settings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.Arrays
            };

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            dtList.Clear();
            return json;
        }

        [WebMethod]
        public static string GetTransportImageById(string Id = "")
        {

            // clsMain objMain = new clsMain();
            DataTable dtImages = new DataTable();

            try
            {
                string sqlQuery = $"SELECT CAST(TransportImage as varchar(max)) AS TransportImage FROM tblInventTransportDetail WHERE Id = " + "'" + Id + "'";

                dtImages = objMain.dtFetchData(sqlQuery);
            }
            catch (Exception ex)
            {
            }

            return JsonConvert.SerializeObject(dtImages, Formatting.None);

        }

        [WebMethod]
        public static string AddData(string BranchCode, string EntryDate, string TransportMasterId, string TransportCategory,
            string TransportCategoryTransectionId, string TransectionId, string FromLocation, 
            string ToLocation,string TransportAmt,string CentralTaxPercent, string StateTaxPercent,string CessPercent,
            string NetAmt, string DepartmentID,string VehicleNo,string VehicleType,
            string TransportImage, string SubmitGST="", string Description = "", string LoginUser = "",string ID = "")
        {
            SqlParameter[] objParam = new SqlParameter[21];

            objParam[0] = new SqlParameter("@BranchCode", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = BranchCode;

            objParam[1] = new SqlParameter("@EntryDate", SqlDbType.NVarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = EntryDate;

            objParam[2] = new SqlParameter("@TransportMasterId", SqlDbType.NVarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = TransportMasterId;

            objParam[3] = new SqlParameter("@TransportCategory", SqlDbType.NVarChar);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = TransportCategory;

            objParam[4] = new SqlParameter("@TransportCategoryTransectionId", SqlDbType.NVarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = TransportCategoryTransectionId;

            objParam[5] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[5].Direction = ParameterDirection.Input;
            objParam[5].Value = LoginUser;

            objParam[6] = new SqlParameter("@Description", SqlDbType.NVarChar);
            objParam[6].Direction = ParameterDirection.Input;
            objParam[6].Value = Description;

            objParam[7] = new SqlParameter("@TransectionId", SqlDbType.NVarChar);
            objParam[7].Direction = ParameterDirection.Input;
            objParam[7].Value = TransectionId;

            objParam[8] = new SqlParameter("@FromLocation", SqlDbType.NVarChar);
            objParam[8].Direction = ParameterDirection.Input;
            objParam[8].Value = FromLocation;

            objParam[9] = new SqlParameter("@TransportImage", SqlDbType.VarBinary);
            objParam[9].Direction = ParameterDirection.Input;
            objParam[9].Value = Encoding.UTF8.GetBytes(TransportImage);

            objParam[10] = new SqlParameter("@ToLocation", SqlDbType.NVarChar);
            objParam[10].Direction = ParameterDirection.Input;
            objParam[10].Value = ToLocation;

            objParam[11] = new SqlParameter("@TransportAmt", SqlDbType.NVarChar);
            objParam[11].Direction = ParameterDirection.Input;
            objParam[11].Value = TransportAmt!= "" ? Convert.ToDecimal(TransportAmt) : 0;

            objParam[12] = new SqlParameter("@CentralTaxPercent", SqlDbType.NVarChar);
            objParam[12].Direction = ParameterDirection.Input;
            objParam[12].Value = CentralTaxPercent != "" ? Convert.ToDecimal(CentralTaxPercent) : 0;

            objParam[13] = new SqlParameter("@StateTaxPercent", SqlDbType.NVarChar);
            objParam[13].Direction = ParameterDirection.Input;
            objParam[13].Value = StateTaxPercent != "" ? Convert.ToDecimal(StateTaxPercent) : 0;

            objParam[14] = new SqlParameter("@CessPercent", SqlDbType.NVarChar);
            objParam[14].Direction = ParameterDirection.Input;
            objParam[14].Value = CessPercent != "" ? Convert.ToDecimal(CessPercent) : 0;

            objParam[15] = new SqlParameter("@NetAmt", SqlDbType.NVarChar);
            objParam[15].Direction = ParameterDirection.Input;
            objParam[15].Value = NetAmt != "" ? Convert.ToDecimal(NetAmt) : 0;

            objParam[16] = new SqlParameter("@SubmitGST", SqlDbType.NVarChar);
            objParam[16].Direction = ParameterDirection.Input;
            objParam[16].Value = SubmitGST != "" ? SubmitGST : "n";

            objParam[17] = new SqlParameter("@DepartmentID", SqlDbType.NVarChar);
            objParam[17].Direction = ParameterDirection.Input;
            objParam[17].Value = DepartmentID;

            objParam[18] = new SqlParameter("@VehicleNo", SqlDbType.NVarChar);
            objParam[18].Direction = ParameterDirection.Input;
            objParam[18].Value = VehicleNo;

            objParam[19] = new SqlParameter("@VehicleType", SqlDbType.NVarChar);
            objParam[19].Direction = ParameterDirection.Input;
            objParam[19].Value = VehicleType;

            objParam[20] = new SqlParameter("@ID", SqlDbType.NVarChar);
            objParam[20].Direction = ParameterDirection.Input;
            objParam[20].Value = ID;

            var resultstatus = objMain.ExecuteProcedure("procInventTransportDetail", objParam);
            string json = JsonConvert.SerializeObject(resultstatus, Formatting.None);
            return json;
        }
    }
}