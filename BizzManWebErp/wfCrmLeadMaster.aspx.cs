
using BizzManWebErp.Model;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web.Services;
using System.Web.UI;

namespace BizzManWebErp
{
    public partial class wfCrmLeadMaster : System.Web.UI.Page
    {

        //added by  12 Dec 2023
        static clsMain objMain;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                hdUserId.Value = Session["Id"] != null ? Session["Id"].ToString() : null;
                hdPageViewType.Value = "ListView";

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

            if (!String.IsNullOrEmpty(hdPageViewType.Value))
            {
                Session["PageViewType"] = hdPageViewType.Value;
            }
            else
            {
                hdPageViewType.Value = Session["PageViewType"].ToString();
            }
           

        }

        [WebMethod]
        public static string GetLeadList()
        {
            DataTable dtResult = new DataTable();
            clsMain clsMain = new clsMain();
            try
            {
                SqlParameter[] sqlParam = new SqlParameter[0];
                dtResult = clsMain.ExecuteStoreProcedure("procCrmGetLeads", sqlParam);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            return JsonConvert.SerializeObject(dtResult, Formatting.None);
        }

        [WebMethod]
        public static string GetLeadDetails(string LeadId)
        {
            DataTable dtResult = new DataTable();
            clsMain clsMain = new clsMain();

            try
            {
                SqlParameter[] sqlParam = new SqlParameter[1];
                sqlParam[0] = new SqlParameter("@LeadId", LeadId);
                dtResult = clsMain.ExecuteStoreProcedure("procCrmGetLeads", sqlParam);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            return JsonConvert.SerializeObject(dtResult, Formatting.None);
            
        }

        [WebMethod]
        public static string SaveLeadDetails(CrmLeadModel leadObj)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.Arrays
            };
            string responseJson = null;
            clsMain clsMain = new clsMain();
            try
            {
                SqlParameter[] sqlParam = new SqlParameter[24];
                sqlParam[0] = new SqlParameter("@LeadId", !string.IsNullOrEmpty(leadObj.LeadId) ? Convert.ToInt32(leadObj.LeadId) : 0);
                sqlParam[1] = new SqlParameter("@LeadName", !string.IsNullOrEmpty(leadObj.LeadName) ? leadObj.LeadName : (object)DBNull.Value);
                sqlParam[2] = new SqlParameter("@Probability", !string.IsNullOrEmpty(leadObj.Probability) ? Convert.ToDecimal(leadObj.Probability) : (object)DBNull.Value);
                sqlParam[3] = new SqlParameter("@CompanyName", !string.IsNullOrEmpty(leadObj.CompanyName) ? leadObj.CompanyName : (object)DBNull.Value);
                sqlParam[4] = new SqlParameter("@ContactName", !string.IsNullOrEmpty(leadObj.ContactName) ? leadObj.ContactName : (object)DBNull.Value);
                sqlParam[5] = new SqlParameter("@Street1", !string.IsNullOrEmpty(leadObj.Street1) ? leadObj.Street1 : (object)DBNull.Value);
                sqlParam[6] = new SqlParameter("@Street2", !string.IsNullOrEmpty(leadObj.Street2) ? leadObj.Street2 : (object)DBNull.Value);
                sqlParam[7] = new SqlParameter("@City", !string.IsNullOrEmpty(leadObj.City) ? leadObj.City : (object)DBNull.Value);
                sqlParam[8] = new SqlParameter("@State", !string.IsNullOrEmpty(leadObj.State) ? leadObj.State : (object)DBNull.Value);
                sqlParam[9] = new SqlParameter("@Country", !string.IsNullOrEmpty(leadObj.Country) ? leadObj.Country : (object)DBNull.Value);
                sqlParam[10] = new SqlParameter("@Website", !string.IsNullOrEmpty(leadObj.Website) ? leadObj.Website : (object)DBNull.Value);
                sqlParam[11] = new SqlParameter("@JobPosition", !string.IsNullOrEmpty(leadObj.JobPosition) ? leadObj.JobPosition : (object)DBNull.Value);
                sqlParam[12] = new SqlParameter("@Phone", !string.IsNullOrEmpty(leadObj.Phone) ? leadObj.Phone : (object)DBNull.Value);
                sqlParam[13] = new SqlParameter("@Mobile", !string.IsNullOrEmpty(leadObj.Mobile) ? leadObj.Mobile : (object)DBNull.Value);
                sqlParam[14] = new SqlParameter("@Email", !string.IsNullOrEmpty(leadObj.Email) ? leadObj.Email : (object)DBNull.Value);
                sqlParam[15] = new SqlParameter("@Priority", !string.IsNullOrEmpty(leadObj.Priority) ? leadObj.Priority : (object)DBNull.Value);
                sqlParam[16] = new SqlParameter("@TagId", !string.IsNullOrEmpty(leadObj.Tag) ? Convert.ToInt32(leadObj.Tag) : (object)DBNull.Value);
                sqlParam[17] = new SqlParameter("@SalesPersonId", !string.IsNullOrEmpty(leadObj.Salesperson) ? leadObj.Salesperson : (object)DBNull.Value);
                sqlParam[18] = new SqlParameter("@SalesTeamId", !string.IsNullOrEmpty(leadObj.SalesTeam) ? Convert.ToInt32(leadObj.SalesTeam) : 0);
                sqlParam[19] = new SqlParameter("@Status", !string.IsNullOrEmpty(leadObj.Status) ? leadObj.Status : (object)DBNull.Value);
                sqlParam[20] = new SqlParameter("@Source", !string.IsNullOrEmpty(leadObj.Source) ? leadObj.Source : (object)DBNull.Value);
                sqlParam[21] = new SqlParameter("@Note", !string.IsNullOrEmpty(leadObj.Notes) ? leadObj.Notes : (object)DBNull.Value);
                sqlParam[22] = new SqlParameter("@UserId", !string.IsNullOrEmpty(leadObj.UserId) ? leadObj.UserId : (object)DBNull.Value);
                sqlParam[23] = new SqlParameter("@Zip", !string.IsNullOrEmpty(leadObj.Zip) ? leadObj.Zip : (object)DBNull.Value);

                var result = clsMain.ExecuteStoreProcedure("dbo.ProcCrmSaveLeadDetails", sqlParam);
                if (result != null)
                {
                    if (result.Rows.Count > 0)
                    {
                        responseJson = result.Rows[0][0].ToString();
                    }
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }

            return JsonConvert.SerializeObject(responseJson, settings);
        }

        [WebMethod]
        public static string ConvertToOpportunity(string LeadId)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.Arrays
            };
            string responseJson = null;
            clsMain clsMain = new clsMain();
            try
            {
                SqlParameter[] sqlParam = new SqlParameter[1];
                sqlParam[0] = new SqlParameter("@LeadId", Convert.ToInt64(LeadId));
                var result = clsMain.ExecuteStoreProcedure("dbo.ProcConvertLeadToOpportunity", sqlParam);
                if (result != null)
                {
                    if (result.Rows.Count > 0)
                    {
                        responseJson = result.Rows[0][0].ToString();
                    }
                }
            }
            catch (Exception ex) { throw ex; }
            return JsonConvert.SerializeObject(responseJson, settings);
        }

        [WebMethod]
        public static string GetStatesList(string countryId)
        {
            clsMain objMain = new clsMain();
            DataTable dtStateList = new DataTable();

            try
            {

                dtStateList = objMain.dtFetchData("SELECT StateId,StateName FROM tblHrStateMaster where CountryId='"+countryId+"'");
            }
            catch (Exception ex)
            {
                return "";
            }
            
            string json = JsonConvert.SerializeObject(dtStateList, Formatting.None);
            return json;
        }
        [WebMethod]
        public static string GetCountryList()
        {
            clsMain objMain = new clsMain();
            DataTable dtCountry = new DataTable();

            try
            {

                dtCountry = objMain.dtFetchData("SELECT Id,CountryName FROM tblHrCountryMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            string json = JsonConvert.SerializeObject(dtCountry, Formatting.None);
            return json;
        }

        [WebMethod]
        public static string GetCityList(string StateId)
        {
            clsMain objMain = new clsMain();
            DataTable dtCityList = new DataTable();
            try
            {
                

                dtCityList = objMain.dtFetchData("SELECT Id,CityName FROM tblHrCityMaster where StateId='"+StateId+"'");
               // dtCityList = (new DBHelper().GetTableRow)("dbo.procCrmGetCityByState", sqlParam, CommandType.StoredProcedure);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            string json = JsonConvert.SerializeObject(dtCityList, Formatting.None);
            return json;
        }

        [WebMethod]
        public static string GetLeadTagList()
        {
            clsMain objMain = new clsMain();
            DataTable dtTagList = new DataTable();
            try
            {
                var _strSQL = $"Select Id,TagsName from tblCrmLeadTagMaster";
                dtTagList = objMain.dtFetchData(_strSQL);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            string json = JsonConvert.SerializeObject(dtTagList, Formatting.None);
            return json;
        }
        [WebMethod]
        public static string GetSalePersonList()
        {
            clsMain objMain = new clsMain();
            DataTable dtSalePersonList = new DataTable();
            try
            {
                var _strSQL = $"Select EmpId, EmpName from tblHrEmpMaster";
                dtSalePersonList = objMain.dtFetchData(_strSQL);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            string json = JsonConvert.SerializeObject(dtSalePersonList, Formatting.None);
            return json;
        }
        [WebMethod]
        public static string GetSaleTeamList()
        {
            clsMain objMain = new clsMain();
            DataTable dtList = new DataTable();
            try
            {
                var _strSQL = $"Select Id,SalesTeamName from tblCrmSalesTeamMaster";
                dtList = objMain.dtFetchData(_strSQL);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            return json;
        }

        protected void UploadBtn_Click(object sender, EventArgs e)
        {
            UploadExcelOpenXML();
        }

        protected void btnImportCancel_Click(object sender, EventArgs e)
        {
            hdPageViewType.Value = "ListView";
            Session["PageViewType"] = hdPageViewType.Value;
            lblImportError.Text = string.Empty;
        }



        public void UploadExcelOpenXML()
        {
            string filepath = Path.Combine(Server.MapPath($"~/Common/ExcelFiles/{hdUserId.Value}"));
            try
            {
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                FileUpLoad1.SaveAs(filepath + "/" + FileUpLoad1.FileName);
                //Open the Excel file in Read Mode using OpenXml.
                using (SpreadsheetDocument doc = SpreadsheetDocument.Open(filepath + "/" + FileUpLoad1.FileName, false))
                {
                    //Read the first Sheet from Excel file.
                    Sheet sheet = doc.WorkbookPart.Workbook.Sheets.GetFirstChild<Sheet>();

                    //Get the Worksheet instance.
                    Worksheet worksheet = (doc.WorkbookPart.GetPartById(sheet.Id.Value) as WorksheetPart).Worksheet;

                    //Fetch all the rows present in the Worksheet.
                    IEnumerable<Row> rows = worksheet.GetFirstChild<SheetData>().Descendants<Row>();

                    //Create a new DataTable.
                    DataTable dt = new DataTable();

                    //Loop through the Worksheet rows.
                    foreach (Row row in rows)
                    {
                        //Use the first row to add columns to DataTable.
                        if (row.RowIndex.Value == 1)
                        {
                            foreach (DocumentFormat.OpenXml.Spreadsheet.Cell cell in row.Descendants<DocumentFormat.OpenXml.Spreadsheet.Cell>())
                            {
                                dt.Columns.Add(GetValue(doc, cell));
                            }
                        }
                        else
                        {
                            //Add rows to DataTable.
                            dt.Rows.Add();
                            int i = 0;
                            foreach (DocumentFormat.OpenXml.Spreadsheet.Cell cell in row.Descendants<DocumentFormat.OpenXml.Spreadsheet.Cell>())
                            {
                                dt.Rows[dt.Rows.Count - 1][i] = GetValue(doc, cell);
                                i++;
                            }
                        }
                    }

                    /*Saving to database*/
                    string JSONString = string.Empty;
                    JSONString = JsonConvert.SerializeObject(dt);
                    var listLeadsModel = JsonConvert.DeserializeObject<List<CrmLeadModel>>(JSONString);
                    foreach (var model in listLeadsModel.Where(x=>!string.IsNullOrEmpty(x.LeadName)).ToList())
                    {
                        model.UserId = hdUserId.Value;
                        SaveLeadDetails(model);
                    }

                }
            }
            catch (Exception ex)
            {
                lblImportError.Text = $"Faild:{ex.Message}";
                hdPageViewType.Value = "ImportFile";
                Session["PageViewType"] = hdPageViewType.Value;
            }
            finally
            {
                DirectoryInfo di = new DirectoryInfo(filepath);
                FileInfo[] files = di.GetFiles();
                foreach (FileInfo file in files)
                {
                    file.Delete();
                }
                Directory.Delete(filepath);
            }
        }


        private string GetValue(SpreadsheetDocument doc, DocumentFormat.OpenXml.Spreadsheet.Cell cell)
        {
            string value = cell.CellValue.InnerText;
            if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString)
            {
                return doc.WorkbookPart.SharedStringTablePart.SharedStringTable.ChildElements.GetItem(int.Parse(value)).InnerText;
            }
            return value;
        }

        
    }
    
}