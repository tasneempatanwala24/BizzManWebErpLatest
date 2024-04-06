using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Services;

namespace BizzManWebErp
{
    public partial class wfHrEmpLoanApplicationMaster : System.Web.UI.Page
    {

        //added  on 12 Dec 2023
        static clsMain objMain;
            
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["Id"] != null)
                {
                    loginuser.Value = Convert.ToString(Session["Id"]);

                    //added  on 12 Dec 2023
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
            DataTable dtBranchList = new DataTable();

            try
            {

                dtBranchList = objMain.dtFetchData("select BranchCode, BranchName FROM tblHrBranchMaster");
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
        public static string EmployeeMasterList(string branchid="")
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
        public static string FetchEmpLoanDetails(string id = "")
        {
            DataTable dtEmpList = new DataTable();

            try
            {

                dtEmpList = objMain.dtFetchData(@"select LoanApplicationId,ELM.EmpId AS EmpId,EM.EmpName+' ('+EM.EmpId+')' as EmpName, ELM.BranchCode,convert(varchar, LoanApplicationDate, 23) AS LoanApplicationDate,LoanApplicationAmount,LoanStatus,[Year],[Month],[Description] 
                ,convert(varchar, LoanApproveDate, 23) AS LoanApproveDate,LoanApproveAmount,UPPER(EmiIntegratedWithSalary) as EmiIntegratedWithSalary,EmiAmount,LoanBalanceAmount,LoanApproveByEmoId,UPPER(LoanDisburse) as LoanDisburse    
                from tblHrEmpLoanMaster  ELM INNER JOIN tblHrEmpMaster EM ON ELM.EmpId = EM.EmpId where LoanApplicationId='" + id + "'");
            }
            catch (Exception ex)
            {
                // return "";
            }

            string json = JsonConvert.SerializeObject(dtEmpList, Formatting.None);
            return json;
        }

        [WebMethod]
        public static string FetchEmpLoanList()
        {
            DataTable dtEmpLoanList = new DataTable();

            try
            {
                dtEmpLoanList = objMain.dtFetchData(@"Select ELM.LoanApplicationId,BM.BranchName, EM.EmpName, [Year],[Month],LoanApplicationAmount,
                    ISNULL(LoanApproveAmount,0.00) AS LoanApproveAmount,ISNULL(EmiAmount,0.00) AS EmiAmount,
                    LoanStatus from tblHrEmpLoanMaster ELM INNER JOIN tblHrBranchMaster BM ON ELM.BranchCode = BM.BranchCode
                    INNER JOIN tblHrEmpMaster EM ON ELM.EmpId = EM.EmpId");
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

            string json = JsonConvert.SerializeObject(dtEmpLoanList, Formatting.None);
            dtEmpLoanList.Clear();
            // return JsonConvert.SerializeObject(dtEmpList, settings);
            return json;
        }

        //  new style by mk
        [WebMethod]
        public static string CheckDataAvailability(string EmpId, string BranchCode,string LoanStatus,string LoanApplicationId)
        {
            bool checkId = new bool();
            
            
            try
            {
                SqlParameter[] objParam = new SqlParameter[4];

                objParam[0] = new SqlParameter("@EmpId", SqlDbType.NVarChar);
                objParam[0].Direction = ParameterDirection.Input;
                objParam[0].Value = EmpId;

                objParam[1] = new SqlParameter("@BranchCode", SqlDbType.NVarChar);
                objParam[1].Direction = ParameterDirection.Input;
                objParam[1].Value = BranchCode;

                objParam[2] = new SqlParameter("@LoanStatus", SqlDbType.NVarChar);
                objParam[2].Direction = ParameterDirection.Input;
                objParam[2].Value = LoanStatus;

                objParam[3] = new SqlParameter("@LoanApplicationId", SqlDbType.NVarChar);
                objParam[3].Direction = ParameterDirection.Input;
                objParam[3].Value = LoanApplicationId;

                DataTable dt = objMain.ExecuteStoreProcedure("procHrEmpLoanCheckData", objParam);
                if (Convert.ToInt32(dt.Rows[0]["CheckData"]) == 0)
                {
                    checkId = false;
                }
                else
                {
                    checkId = true;
                }
            }
            catch (Exception ex)
            {
                return "False";
            }

            return JsonConvert.SerializeObject(checkId.ToString());
        }


        [WebMethod]
        public static string AddData(string EmpId = "", string BranchCode = "", int LoanApplicationAmount = 0, string LoanApplicationDate = "",
                         string Year = "", string Month = "", string Description = "", string LoginUser = "",int isUpdate=0,string LoanApplicationId = ""
                        ,string LoanStatus="", int ApproveAmount=0, string LoanApproveDate="", string EmiIntegratedWithSalary = "", int EMIAmount = 0, 
                         int LoanBalanceAmount = 0 , string LoanApproveBy = "", string Disburse = "")
            {

            SqlParameter[] objParam = new SqlParameter[18];

            objParam[0] = new SqlParameter("@EmpId", SqlDbType.NVarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = EmpId;

            objParam[1] = new SqlParameter("@BranchCode", SqlDbType.NVarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = BranchCode;

            objParam[2] = new SqlParameter("@LoanApplicationDate", SqlDbType.NVarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = LoanApplicationDate;

            objParam[3] = new SqlParameter("@LoanApplicationAmount", SqlDbType.Int);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = LoanApplicationAmount;

            objParam[4] = new SqlParameter("@Year", SqlDbType.NVarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = Year;

            objParam[5] = new SqlParameter("@Month", SqlDbType.NVarChar);
            objParam[5].Direction = ParameterDirection.Input;
            objParam[5].Value = Month;

            objParam[6] = new SqlParameter("@Description", SqlDbType.NVarChar);
            objParam[6].Direction = ParameterDirection.Input;
            objParam[6].Value = Description;

            objParam[7] = new SqlParameter("@CreateUser", SqlDbType.NVarChar);
            objParam[7].Direction = ParameterDirection.Input;
            objParam[7].Value = LoginUser;

            objParam[8] = new SqlParameter("@Update", SqlDbType.Int);
            objParam[8].Direction = ParameterDirection.Input;
            objParam[8].Value = isUpdate;

            objParam[9] = new SqlParameter("@LoanApplicationId", SqlDbType.NVarChar);
            objParam[9].Direction = ParameterDirection.Input;
            objParam[9].Value = LoanApplicationId;

            objParam[10] = new SqlParameter("@LoanStatus", SqlDbType.NVarChar);
            objParam[10].Direction = ParameterDirection.Input;
            objParam[10].Value = LoanStatus;

            objParam[11] = new SqlParameter("@ApproveAmount", SqlDbType.Int);
            objParam[11].Direction = ParameterDirection.Input;
            objParam[11].Value = ApproveAmount;

            objParam[12] = new SqlParameter("@LoanApproveDate", SqlDbType.NVarChar);
            objParam[12].Direction = ParameterDirection.Input;
            objParam[12].Value = LoanApproveDate;

            objParam[13] = new SqlParameter("@EmiIntegratedWithSalary", SqlDbType.NVarChar);
            objParam[13].Direction = ParameterDirection.Input;
            objParam[13].Value = EmiIntegratedWithSalary;

            objParam[14] = new SqlParameter("@EMIAmount", SqlDbType.Int);
            objParam[14].Direction = ParameterDirection.Input;
            objParam[14].Value = EMIAmount;

            objParam[15] = new SqlParameter("@LoanBalanceAmount", SqlDbType.Int);
            objParam[15].Direction = ParameterDirection.Input;
            objParam[15].Value = LoanBalanceAmount;

            objParam[16] = new SqlParameter("@LoanApproveBy", SqlDbType.NVarChar);
            objParam[16].Direction = ParameterDirection.Input;
            objParam[16].Value = LoanApproveBy;

            objParam[17] = new SqlParameter("@Disburse", SqlDbType.NVarChar);
            objParam[17].Direction = ParameterDirection.Input;
            objParam[17].Value = Disburse;



            var resultstatus = objMain.ExecuteProcedure("procHrEmpLoanApplicationMaster", objParam);
            string json = JsonConvert.SerializeObject(resultstatus, Formatting.None);
            //string result = resultstatus.status;
            return json;
        }
    }
}