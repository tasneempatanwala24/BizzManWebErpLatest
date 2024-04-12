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
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;

namespace BizzManWebErp
{
    public partial class wfMmMaterialPurchaseOrderDirectGrnEntry : System.Web.UI.Page
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
        public static string DepartmentMasterList()
        {
            // clsMain objMain = new clsMain();
            DataTable dtDepartmentList = new DataTable();

            try
            {

                dtDepartmentList = objMain.dtFetchData("select [Id],[DeptName] FROM [tblHrDeptMaster]");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtDepartmentList);
        }

        //=================================
        //================================
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
        public static string GenerateOrderID(string OrderDate)
        {
            DataTable dtNewQuotationID = new DataTable();

            try
            {
                string formattedOrderDate = DateTime.ParseExact(OrderDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("yyyy/MM/dd");

                dtNewQuotationID = objMain.dtFetchData("select 'GRN' + CONVERT(NVARCHAR(10), '" + formattedOrderDate + "', 120) + '/' +\r\n                             RIGHT('0000' + CAST(ISNULL(MAX(SUBSTRING(Id, LEN(Id) - 3, 4)), 0) + 1 AS NVARCHAR(4)), 4)\r\n as Id    FROM tblMmMaterialPurchaseGrnMaster  \r\n    WHERE GrnEntryDate ='" + formattedOrderDate + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtNewQuotationID);
        }

        [WebMethod]
        public static string FetchPurchaseOrderDetails(string OrderId)
        {
            //  clsMain objMain = new clsMain();
            DataTable dtPurchaseOrderDetails = new DataTable();

            try
            {

                dtPurchaseOrderDetails = objMain.dtFetchData(@"select OE.Id,M.MaterialName,OE.QtyOrder,OE.UnitPrice,OE.QtyReceive,
                                                                          M.UnitMesure,(OE.QtyOrder-(OE.QtyReceive)) as BalanceQty
                                                                          from tblMmMaterialPurchaseOrderEntryDetail OE
                                                                          join tblMmMaterialMaster M on M.Id=OE.MaterialMasterId
                                                                          where OE.Active='Y' and OE.PurchaseOrderMasterId='" + OrderId + "'");

                DataTable dtPurchaseOrder = objMain.dtFetchData(@"select *
from tblMmMaterialPurchaseOrderEntryMaster a
where Id='" + OrderId + "'");



                if (dtPurchaseOrder != null && dtPurchaseOrder.Rows.Count > 0)
                {
                    DataRow dr = dtPurchaseOrder.Rows[0];
                    // Create an anonymous object containing SalesQuotationMasterinfo and sales items
                    var invoiceData = new
                    {
                        PurchaseOrderMasterInfo = new
                        {
                            OrderDeadlineDate = dr["OrderDeadlineDate"].ToString() == "" ? "" : Convert.ToDateTime(dr["OrderDeadlineDate"].ToString()).ToShortDateString(),
                            ReceiptDate = dr["ReceiptDate"].ToString() == "" ? "" : Convert.ToDateTime(dr["ReceiptDate"].ToString()).ToShortDateString(),
                            PaymentTerm = dr["PaymentTerm"].ToString(),
                            PurchaseAgreement = dr["PurchaseAgreement"].ToString(),
                            BranchCode = dr["BranchCode"].ToString() == "" ? "0" : dr["BranchCode"].ToString(),
                            DepartmentId = dr["DepartmentId"].ToString() == "" ? "0" : dr["DepartmentId"].ToString(),
                            QuotationNo = dr["QuotationNo"].ToString()


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
        public static string PurchaseOrderList(string VendorId = "")
        {
            //  clsMain objMain = new clsMain();
            DataTable dtPurchaseOrderList = new DataTable();

            try
            {

                dtPurchaseOrderList = objMain.dtFetchData("select Id FROM tblMmMaterialPurchaseOrderEntryMaster where Active='Y' and VendoreId='" + VendorId + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtPurchaseOrderList);
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
                                                                          left join tblMmMaterialPurchaseGateInwardMaster GI on GI.Id=PG.GateInwardMasterId
                                                                       left   join tblMmVendorMaster v on v.Id=PG.VendorId
                                                                        left  join tblHrBranchMaster b on b.BranchCode=PG.BranchCode
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

                dtMaterialPurchaseGrnDetails = objMain.dtFetchData(@"select PG.Id,M.MaterialName,M.UnitMesure,W.Name as WareHouse,PG.QtyOrder,                        PG.GateInwordQtyReceive,PG.QtyStockEntry,PG.QtyReturn,PG.UnitPrice,PG.TotalAmt
                                                                  from tblMmMaterialPurchaseGrnDetail PG
                                                                  join tblMmMaterialMaster M on M.Id=PG.MaterialMasterId
                                                                  join tblFaWarehouseMaster W on W.Id=PG.WarehouseId
                                                                  where PG.Active='Y' and PG.GrnMasterId='" + id + "'");

          
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
        public static string AddMaterialPurchaseOrderDirectGrnEntry(List<SalesQuotationDetail> data, string PurchaseOrderId = "", string EntryDate = "", string Vendor = "", string GRNID = "",
                                                string Active = "", string BranchCode = "",string LoginUser = "")
        {
            StringBuilder strBuild = new StringBuilder();
            strBuild.Append("<XMLData>");
            strBuild.Append("<PurchaseOrderId>" + PurchaseOrderId + "</PurchaseOrderId>");
            strBuild.Append("<Vendor>" + Vendor + "</Vendor>");
            strBuild.Append("<GRNID>" + GRNID + "</GRNID>");
            strBuild.Append("<EntryDate>" + DateTime.ParseExact(EntryDate, "yyyy-MM-dd", CultureInfo.InvariantCulture) + "</EntryDate>");
              strBuild.Append("<Active>" + Active + "</Active>");
            strBuild.Append("<BranchCode>" + BranchCode + "</BranchCode>");
             strBuild.Append("<CreateUser>" + LoginUser + "</CreateUser>");


            strBuild.Append("<SalesQuotationDetails>");
            if (data.Count > 0)
            {
                foreach (var item in data)
                {
                    strBuild.Append("<SalesQuotationDetail>");
                    strBuild.Append("<ItemId>" + Convert.ToInt32(item.ItemID) + "</ItemId>");
                    strBuild.Append("<Quantity>" + item.Quantity + "</Quantity>");
                    strBuild.Append("<QtyRecieve>" + item.QtyRecieve + "</QtyRecieve>");
                    strBuild.Append("<QtyReturn>" + item.QtyReturn + "</QtyReturn>");
                    strBuild.Append("<WareHouseId>" + item.WareHouseId + "</WareHouseId>");
                    strBuild.Append("<Description>" + item.Description + "</Description>");
                   
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

            var result = objMain.ExecuteProcedure("procMmMaterialPurchaseOrderDirectGrnEntry", objParam);


            return "";
        }
    }
}