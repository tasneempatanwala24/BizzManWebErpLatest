using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BizzManWebErp
{
    public partial class wfHrEmpLeaveApplicationIndivisual : System.Web.UI.Page
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
        public static string BranchMasterList(string EmpId="")
        {
            DataTable dtBranchList = new DataTable();

            try
            {

                dtBranchList = objMain.dtFetchData("select b.BranchCode as BranchCode, BranchName FROM tblHrBranchMaster b inner join tblHrEmpMaster e on e.Branchcode = b.BranchCode inner join tblUserMaster u on e.EmpId = u.EmpId where u.UserName = '" + EmpId + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            // return JsonConvert.SerializeObject(dtBranchList);

            string json = JsonConvert.SerializeObject(dtBranchList, Formatting.None);
            dtBranchList.Clear();
            return json;

        }

        [WebMethod]
        public static string YearList()
        {
            // clsMain objMain = new clsMain();
            DataTable dtYearList = new DataTable();

            try
            {

                dtYearList = objMain.dtFetchData("select [Year] FROM tblHrYearMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            // return JsonConvert.SerializeObject(dtBranchList);

            string json = JsonConvert.SerializeObject(dtYearList, Formatting.None);
            dtYearList.Clear();
            return json;

        }

        [WebMethod]
        public static string MonthList()
        {
            DataTable dtMonthList = new DataTable();

            try
            {

                dtMonthList = objMain.dtFetchData("select MonthName FROM tblHrMonthMaster");
            }
            catch (Exception ex)
            {
                return "";
            }

            // return JsonConvert.SerializeObject(dtBranchList);

            string json = JsonConvert.SerializeObject(dtMonthList, Formatting.None);
            dtMonthList.Clear();
            return json;

        }

        [WebMethod]
        public static string EmployeeMasterList(string branchid = "")
        {
            // clsMain objMain = new clsMain();
            DataTable dtDepartmentList = new DataTable();

            try
            {

                dtDepartmentList = objMain.dtFetchData("select EmpId,EmpName+' ('+EmpId+')' as EmpName from tblHrEmpMaster where Branchcode='" + branchid + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtDepartmentList);
        }
        [WebMethod]
        public static string EmployeesMasterList(string id = "")
        {
            // clsMain objMain = new clsMain();
            DataTable dtDepartmentList = new DataTable();

            try
            {

                dtDepartmentList = objMain.dtFetchData("select e.EmpId,e.EmpName+' ('+e.EmpId+')' as EmpName from tblHrEmpMaster e inner join tblUserMaster u on e.empId=u.empid where u.Username='" + id + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtDepartmentList);
        }

        [WebMethod]
        public static string FetchEmployeeDetails(string EmpId = "")
        {
            DataTable dtEmployeeList = new DataTable();

            try
            {

                dtEmployeeList = objMain.dtFetchData("select EmpName from tblHrEmpMaster where EmpId='" + EmpId + "'");
            }
            catch (Exception ex)
            {
                return "";
            }

            return JsonConvert.SerializeObject(dtEmployeeList);
        }

        [WebMethod]
        public static string FetchEmpLeaveDetails(string LeaveApplicationId = "")
        {
            DataTable dtEmpList = new DataTable();

            try
            {
                dtEmpList = objMain.dtFetchData(@"select ELM.LeaveApplicationId,ELM.EmpId AS EmpId,EM.EmpName+' ('+EM.EmpId+')' as EmpName, ELM.BranchCode,[Year],[Month],TotalDay
                ,convert(varchar, LeaveApplicationDate, 23) AS LeaveApplicationDate,LeaveStatus,[Description],CAST(PhotoImage as varchar(max))[PhotoImage]
                from tblHrEmpLeaveApplicationMaster  ELM INNER JOIN tblHrEmpMaster EM ON ELM.EmpId = EM.EmpId where ELM.LeaveApplicationId='" + LeaveApplicationId + "'");
            }
            catch (Exception ex)
            {
                // return "";
            }

            string json = JsonConvert.SerializeObject(dtEmpList, Formatting.None);
            return json;
        }

        //    [WebMethod]
        //    public static string FetchEmpLeaveDataDetails(string BranchCode, string EmpId, string Year, string Month)
        //    {
        //        DataTable dtList = new DataTable();

        //        try
        //        {
        //            dtList = objMain.dtFetchData(@"Select Id,EM.LeaveApplicationId,[Year],[Month],LeaveApplicationDate AS LeaveDay from tblHrEmpLeaveApplicationMaster EM INNER JOIN tblHrEmpLeaveApplicationDetail ED
        //ON EM.LeaveApplicationId = ED.LeaveApplicationId where BranchCode ='" + BranchCode + "' and EmpId='" + EmpId + "' and Year='" + Year + "' and Month= '" + Month + "' ORDER BY LeaveDay");
        //        }
        //        catch (Exception ex)
        //        {
        //            // return "";
        //        }

        //        string json = JsonConvert.SerializeObject(dtList, Formatting.None);
        //        return json;
        //    }

        [WebMethod]
        public static string FetchEmpLeaveDataDetails(string LeaveApplicationId)
        {
            DataTable dtList = new DataTable();

            try
            {
                dtList = objMain.dtFetchData(@"Select LeaveApplicationId,convert(varchar, LeaveDay, 23) AS LeaveDay,[Description] as DetailDescription from tblHrEmpLeaveApplicationDetail
                where LeaveApplicationId ='" + LeaveApplicationId + "' ORDER BY LeaveDay");
            }
            catch (Exception ex)
            {
                // return "";
            }

            string json = JsonConvert.SerializeObject(dtList, Formatting.None);
            return json;
        }

        [WebMethod]
        public static string FetchEmpLeaveList(string empId="")
        {
            DataTable dtList = new DataTable();

            try
            {
                dtList = objMain.dtFetchData(@"select ELM.LeaveApplicationId AS LeaveApplicationId,ELM.EmpId AS EmpId,EM.EmpName+' ('+EM.EmpId+')' as EmpName, ELM.BranchCode,BM.[BranchName],[Year],[Month],TotalDay
                from tblHrEmpLeaveApplicationMaster  ELM INNER JOIN tblHrEmpMaster EM ON ELM.EmpId = EM.EmpId
				INNER JOIN tblHrBranchMaster BM ON ELM.BranchCode = BM.BranchCode INNER JOIN tblUserMaster u on EM.EmpId = u.EmpId WHERE u.UserName = '" + empId + "'");
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
        public static string CheckDataAvailability(string EmpId, string LeaveStatus, string isUpdate)
        {
            //  clsMain objMain = new clsMain();
            bool checkId = new bool();

            try
            {

                //if (isUpdate == "0")
                //{
                //    checkId = objMain.blSearchDataHO(string.Format("select 1 from tblHrEmpLeaveApplicationMaster where EmpId='{0}'", EmpId));
                //}
                //else 
                if (isUpdate == "1")
                {
                    if (LeaveStatus == "Approved")
                    {
                        checkId = objMain.blSearchDataHO(string.Format("select 1 from tblHrEmpLeaveApplicationMaster where EmpId='{0}' and LeaveStatus='Approved'", EmpId));
                    }
                }
                else
                {
                    checkId = false;
                }
            }
            catch (Exception ex)
            {
                return "False";
            }

            return JsonConvert.SerializeObject(checkId.ToString());
        }
        [WebMethod]
        public static string GetEmpImageById(string Id = "")
        {

            // clsMain objMain = new clsMain();
            DataTable dtImages = new DataTable();

            try
            {
                string sqlQuery = $"SELECT CAST(PhotoImage as varchar(max)) AS PhotoImage FROM tblHrEmpLeaveApplicationMaster WHERE LeaveApplicationId = " + "'" + Id + "'";

                dtImages = objMain.dtFetchData(sqlQuery);
            }
            catch (Exception ex)
            {
            }

            return JsonConvert.SerializeObject(dtImages, Formatting.None);

        }

        [WebMethod]
        public static string DeleteLeaveDetailData(string Id, string LeaveApplicationId)
        {
            SqlParameter[] objParam = new SqlParameter[2];

            objParam[0] = new SqlParameter("@Id", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = Convert.ToInt32(Id);

            objParam[1] = new SqlParameter("@LeaveApplicationId", SqlDbType.NVarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = LeaveApplicationId;

            var resultstatus = objMain.ExecuteProcedure("procHrEmpLeavedelete", objParam);
            string json = JsonConvert.SerializeObject(resultstatus, Formatting.None);
            return json;
        }

        [WebMethod]
        public static string AddData(string BranchCode, string LeaveApplicationDate, string EmpId, string Year,
            string Month, string LeaveStatus, string emp_leave_details, string PhotoImage, string Description = "", string LoginUser = "")
        {
            SqlParameter[] objParam = new SqlParameter[10];

            objParam[0] = new SqlParameter("@BranchCode", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = BranchCode;

            objParam[1] = new SqlParameter("@LeaveApplicationDate", SqlDbType.NVarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = LeaveApplicationDate;

            objParam[2] = new SqlParameter("@EmpId", SqlDbType.NVarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = EmpId;

            objParam[3] = new SqlParameter("@Year", SqlDbType.NVarChar);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = Year;

            objParam[4] = new SqlParameter("@Month", SqlDbType.NVarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = Month;

            objParam[5] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[5].Direction = ParameterDirection.Input;
            objParam[5].Value = LoginUser;

            objParam[6] = new SqlParameter("@Description", SqlDbType.NVarChar);
            objParam[6].Direction = ParameterDirection.Input;
            objParam[6].Value = Description;

            objParam[7] = new SqlParameter("@LeaveStatus", SqlDbType.NVarChar);
            objParam[7].Direction = ParameterDirection.Input;
            objParam[7].Value = LeaveStatus;

            objParam[8] = new SqlParameter("@emp_leave_details", SqlDbType.NVarChar);
            objParam[8].Direction = ParameterDirection.Input;
            objParam[8].Value = emp_leave_details;

            objParam[9] = new SqlParameter("@PhotoImage", SqlDbType.VarBinary);
            objParam[9].Direction = ParameterDirection.Input;
            objParam[9].Value = Encoding.UTF8.GetBytes(PhotoImage);

            //objParam[4] = new SqlParameter("@Id", SqlDbType.Int);
            //objParam[4].Direction = ParameterDirection.Input;
            //objParam[4].Value = Convert.ToInt32(Id);

            var resultstatus = objMain.ExecuteProcedure("procHrEmpLeaveApplicationIndivisual", objParam);
            string json = JsonConvert.SerializeObject(resultstatus, Formatting.None);
            return json;
        }
    }
}