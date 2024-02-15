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
    public partial class wfMmMaterialPurchaseGrnEntry : System.Web.UI.Page
    {
        //added on 12 Dec 2023
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
            else
            {
                Response.Redirect("wfAdminLogin.aspx");
            }
        }



        [WebMethod]
        public static string FetchMaterialPurchaseGrnList()
        {
          //  clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGrnList = new DataTable();

            try
            {

                dtMaterialPurchaseGrnList = objMain.dtFetchData(@"select PG.Id,CONVERT(nvarchar,PG.GrnEntryDate,106) as GrnEntryDate,PG.GateInwardMasterId,
                                                                          GI.OrderId,v.VendorName,b.BranchName from tblMmMaterialPurchaseGrnMaster PG
                                                                          join tblMmMaterialPurchaseGateInwardMaster GI on GI.Id=PG.GateInwardMasterId
                                                                          join tblMmVendorMaster v on v.Id=PG.VendorId
                                                                          join tblHrBranchMaster b on b.BranchCode=PG.BranchCode
                                                                          where PG.Active='Y'");
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
            return JsonConvert.SerializeObject(dtMaterialPurchaseGrnList, settings);
        }

        [WebMethod]
        public static string FetchMaterialPurchaseGrnDetails(string id)
        {
          //  clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGrnDetails = new DataTable();

            try
            {

                dtMaterialPurchaseGrnDetails = objMain.dtFetchData(@"select PG.Id,M.MaterialName,M.UnitMesure,W.Name as WareHouse,PG.QtyOrder,
                                                                  PG.GateInwordQtyReceive,PG.QtyStockEntry,PG.QtyReturn,PG.UnitPrice,PG.TotalAmt
                                                                  from tblMmMaterialPurchaseGrnDetail PG
                                                                  join tblMmMaterialMaster M on M.Id=PG.MaterialMasterId
                                                                  join tblFaWarehouseMaster W on W.Id=PG.WarehouseId
                                                                  where PG.Active='Y' and PG.GrnMasterId='"+ id + "'");
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
            return JsonConvert.SerializeObject(dtMaterialPurchaseGrnDetails, settings);
        }




        [WebMethod]
        public static string FetchMaterialPurchaseGrnListDownload(string Grnid = "")
        {
          //  clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGrnList = new DataTable();

            try
            {

                dtMaterialPurchaseGrnList = objMain.dtFetchData(@"select PG.Id,CONVERT(nvarchar,PG.GrnEntryDate,106) as GrnEntryDate,PG.GateInwardMasterId,
                                                                          GI.OrderId,v.VendorName,b.BranchName from tblMmMaterialPurchaseGrnMaster PG
                                                                          join tblMmMaterialPurchaseGateInwardMaster GI on GI.Id=PG.GateInwardMasterId
                                                                          join tblMmVendorMaster v on v.Id=PG.VendorId
                                                                          join tblHrBranchMaster b on b.BranchCode=PG.BranchCode
                                                                          where PG.Active='Y'" + (Grnid != "" ? " and PG.Id in(SELECT Item FROM [dbo].[SplitString] ('" + Grnid + "',','))" : ""));
            }
            catch (Exception ex)
            {
                // return "";
            }
            dtMaterialPurchaseGrnList.TableName = "MaterialPurchaseGrnList";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dtMaterialPurchaseGrnList);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    byte[] bytes = stream.ToArray();

                    //Convert File to Base64 string and send to Client.
                    return Convert.ToBase64String(bytes, 0, bytes.Length);
                }
            }

            ////var settings = new JsonSerializerSettings
            ////{
            ////    Formatting = Formatting.Indented,
            ////    NullValueHandling = NullValueHandling.Ignore,
            ////    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            ////    PreserveReferencesHandling = PreserveReferencesHandling.Arrays

            ////};
            ////return JsonConvert.SerializeObject(dtMaterialPurchaseOrderList, settings);
        }




        [WebMethod]
        public static string FetchMaterialPurchaseGateInwordList(string vendorid)
        {
          //  clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGateInwordList = new DataTable();

            try
            {

                dtMaterialPurchaseGateInwordList = objMain.dtFetchData(@"select GI.Id,v.VendorName,CONVERT(nvarchar,GI.InwardEntryDate,106) as InwardEntryDate,GI.OrderId,
                                              GI.[PONo],GI.[Transporter],GI.[VehicleNo],GI.[DeliveryTerms],CONVERT(nvarchar,GI.Deadline,106) as DeadlineDate,GI.[ChallanNo]
                                             ,CONVERT(varchar(15),GI.[GateInTime],100) as GateInTime,CONVERT(varchar(15),GI.[GaeOutTime],100) as GaeOutTime,GI.[PaymentTerms],
                                              b.BranchName
                                              from tblMmMaterialPurchaseGateInwardMaster GI
                                              join tblMmVendorMaster v on GI.VendorId=v.Id
                                              join tblHrBranchMaster b on b.BranchCode=GI.BranchCode 
                                              where GI.Active='Y' and GI.GrnEntry='N' and GI.VendorId='" + vendorid+"'");
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
            return JsonConvert.SerializeObject(dtMaterialPurchaseGateInwordList, settings);
        }


        [WebMethod]
        public static string FetchPurchaseGateInwordMasterDetailList(string GateInwordMasterId)
        {
           // clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGateInwordMasterDetailList = new DataTable();

            try
            {

                dtMaterialPurchaseGateInwordMasterDetailList = objMain.dtFetchData(@"select GI.Id,M.MaterialName,M.UnitMesure,GI.QtyOrder,GI.QtyReceive,GI.UnitPrice
                                                                            from tblMmMaterialPurchaseGateInwardDetail GI
                                                                            join tblMmMaterialMaster M on M.Id=GI.MaterialMasterId
                                                                            where GI.Active='Y' and GI.PurchaseGateInwardMasterId='" + GateInwordMasterId + "'");
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
            return JsonConvert.SerializeObject(dtMaterialPurchaseGateInwordMasterDetailList, settings);
        }



        [WebMethod]
        public static string AddMaterialPurchaseGrn(string VendorId = "0", string EntryDate = "", string order_details = "", string LoginUser = "", string GateInwordId="")
        {

         //   clsMain objMain = new clsMain();
            SqlParameter[] objParam = new SqlParameter[5];


            objParam[0] = new SqlParameter("@VendorId", SqlDbType.Int);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = Convert.ToInt32(VendorId);


            objParam[1] = new SqlParameter("@EntryDate", SqlDbType.DateTime);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = Convert.ToDateTime(EntryDate);

            objParam[2] = new SqlParameter("@order_details", SqlDbType.NVarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = order_details;

            objParam[3] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = LoginUser;

            objParam[4] = new SqlParameter("@GateInwordId", SqlDbType.NVarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = GateInwordId;

            var result = objMain.ExecuteStoreProcedure("procMaterialPurchaseGrnEntryInsert", objParam);

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




    }
}