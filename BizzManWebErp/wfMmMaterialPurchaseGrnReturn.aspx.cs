using BizzManWebErp.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BizzManWebErp
{
    public partial class wfMmMaterialPurchaseGrnReturn : System.Web.UI.Page
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
            else
            {
                Response.Redirect("wfAdminLogin.aspx");
            }
        }

        //===============================
        //=========================
        //===============================

      

        [WebMethod]
        public static string BranchMasterList()
        {
            // clsMain objMain = new clsMain();
            DataTable dtBranchList = new DataTable();

            try
            {

                dtBranchList = objMain.dtFetchData("select [BranchCode],[BranchName] FROM [tblHrBranchMaster]");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtBranchList);
        }

        //==============================
        //=============================

        [WebMethod]
        public static string VendorList()
        {
            //   clsMain objMain = new clsMain();
            DataTable dtVendorList = new DataTable();

            try
            {

                dtVendorList = objMain.dtFetchData("select Id,VendorName FROM tblMmVendorMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtVendorList);
        }

        [WebMethod]
        public static string GenerateOrderID(string ReturnDate)
        {
            DataTable dtNewQuotationID = new DataTable();

            try
            {
                string formattedOrderDate = DateTime.ParseExact(ReturnDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("yyyy/MM/dd");

                dtNewQuotationID = objMain.dtFetchData("select 'GRETUN' + CONVERT(NVARCHAR(10), '" + formattedOrderDate + "', 120) + '/' +\r\n                             RIGHT('0000' + CAST(ISNULL(MAX(SUBSTRING(Id, LEN(Id) - 3, 4)), 0) + 1 AS NVARCHAR(4)), 4)\r\n as Id    FROM tblMmMaterialPurchaseGrnReturnMaster   \r\n    WHERE GrnReturnDate ='" + formattedOrderDate + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtNewQuotationID);
        }

        [WebMethod]
        public static string FetchPurchaseOrderGRNDetails(string GRNId)
        {
           
            DataTable dtPurchaseOrderDetails = new DataTable();

            try
            {

                dtPurchaseOrderDetails = objMain.dtFetchData(@"select OE.Id,M.MaterialName,OE.QtyOrder,OE.UnitPrice,OE.QtyStockEntry,OE.QtyReturn,
M.UnitMesure,stock.QtyBalance,OE.MaterialMasterId,OE.GrnMasterId
from tblMmMaterialPurchaseGrnDetail OE
inner join tblMmMaterialMaster M on M.Id=OE.MaterialMasterId
inner join tblMmMaterialStockMaster stock on stock.TransectionId=OE.GrnMasterId and stock.MaterialMasterId=OE.MaterialMasterId
where  OE.Active='Y'  and OE.GrnMasterId='" + GRNId + "' ");

                DataTable dtPurchaseOrder = objMain.dtFetchData(@"select *
from tblMmMaterialPurchaseGrnMaster a
where Id='" + GRNId + "'");



                if (dtPurchaseOrder != null && dtPurchaseOrder.Rows.Count > 0)
                {
                    DataRow dr = dtPurchaseOrder.Rows[0];
                    // Create an anonymous object containing SalesQuotationMasterinfo and sales items
                    var invoiceData = new
                    {
                        PurchaseOrderMasterInfo = new
                        {
                           BranchCode = dr["BranchCode"].ToString() == "" ? "0" : dr["BranchCode"].ToString()
                            

                        },
                        PurchaseItems = dtPurchaseOrderDetails.AsEnumerable().ToList()

                    };
                    return JsonConvert.SerializeObject(invoiceData);
                }
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
            return JsonConvert.SerializeObject(dtPurchaseOrderDetails, settings);
        }

        [WebMethod]
        public static string PurchaseOrderGRNList(string VendorId = "")
        {
            //  clsMain objMain = new clsMain();
            DataTable dtPurchaseOrderList = new DataTable();

            try
            {

                dtPurchaseOrderList = objMain.dtFetchData("select Id FROM tblMmMaterialPurchaseGrnMaster where Active='Y' and VendorId='" + VendorId + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtPurchaseOrderList);
        }

        [WebMethod]
        public static string FetchMaterialPurchaseGrnReturnList()
        {
            //  clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGrnList = new DataTable();

            try
            {

                dtMaterialPurchaseGrnList = objMain.dtFetchData(@"select PG.Id,CONVERT(nvarchar,PG.GrnReturnDate,106) as GrnReturnDate,
GrnMasterId,v.VendorName,b.BranchName from tblMmMaterialPurchaseGrnReturnMaster PG
left   join tblMmVendorMaster v on v.Id=PG.VendorId
left  join tblHrBranchMaster b on b.BranchCode=PG.BranchCode");
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
        public static string FetchMaterialPurchaseGrnReturnDetails(string id)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtMaterialPurchaseGrnDetails = new DataTable();

            try
            {

                dtMaterialPurchaseGrnDetails = objMain.dtFetchData(@"select PG.Id,M.MaterialName,M.UnitMesure,W.Name as WareHouse,PG.QtyReturn,PG.UnitPrice,PG.TotalAmt
                                            from tblMmMaterialPurchaseGrnReturnDetail PG
                                            join tblMmMaterialMaster M on M.Id=PG.MaterialMasterId
                                            join tblFaWarehouseMaster W on W.Id=PG.WarehouseId
                                             where PG.GrnReturnMasterId='" + id + "'");


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
        public static string WarehouseList()
        {
            //  clsMain objMain = new clsMain();
            DataTable dtWarehouseList = new DataTable();

            try
            {

                dtWarehouseList = objMain.dtFetchData("select Id,Name FROM tblFaWarehouseMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtWarehouseList);
        }

        [WebMethod]
        public static string AddMaterialPurchaseOrderGrnReturn(List<SalesQuotationDetail> data, string GRNID = "", string ReturnDate = "", string Vendor = "", string GRNReturnID = "", string BranchCode = "", string LoginUser = "")
        {
            StringBuilder strBuild = new StringBuilder();
            strBuild.Append("<XMLData>");
            strBuild.Append("<GRNReturnID>" + GRNReturnID + "</GRNReturnID>");
            strBuild.Append("<Vendor>" + Vendor + "</Vendor>");
            strBuild.Append("<GRNID>" + GRNID + "</GRNID>");
            strBuild.Append("<ReturnDate>" + DateTime.ParseExact(ReturnDate, "yyyy-MM-dd", CultureInfo.InvariantCulture) + "</ReturnDate>");
            strBuild.Append("<BranchCode>" + BranchCode + "</BranchCode>");
            strBuild.Append("<CreateUser>" + LoginUser + "</CreateUser>");


            strBuild.Append("<SalesQuotationDetails>");
            if (data.Count > 0)
            {
                foreach (var item in data)
                {
                    strBuild.Append("<SalesQuotationDetail>");
                    strBuild.Append("<ItemId>" + Convert.ToInt32(item.ItemID) + "</ItemId>");
                    strBuild.Append("<QtyReturn>" + item.QtyReturn + "</QtyReturn>");
                    strBuild.Append("<WareHouseId>" + item.WareHouseId + "</WareHouseId>");
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

            var result = objMain.ExecuteProcedure("procMmMaterialPurchaseGrnReturn", objParam);


            return "";
        }
    }
}