using iTextSharp.text.pdf;
using iTextSharp.text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Data;
using Newtonsoft.Json;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace BizzManWebErp
{
    public partial class wfHrEmpSalaryPaySlip : System.Web.UI.Page
    {
        static clsMain objMain;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["Id"] != null)
                {
                    loginuser.Value = Session["Id"].ToString();
                    string id = Request.QueryString["id"];

                    //added on 12 Dec 2023
                    //############START###############
                    if (Session["objMain_Session"] != null)
                    {
                        objMain = (clsMain)Session["objMain_Session"];
                        //AddPaySlipContent(id);
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
        public static string AddPaySlipContent(string Id)
        {
            DataSet objDs = new DataSet();
            DataTable dtcompany = objMain.dtFetchData("select CompanyName,Address1,PhoneNo,EmailAddress,WebSiteAddress,Logo from tblAdminCompanyMaster");

            DataTable dtempDetail = objMain.dtFetchData(@"Select e.EmpName, sg.EmpId, e.PanNo,e.PfNo AS UANNo, e.Grade, 
            d.DesignationName, dept.DeptName,EsiNo, Convert(varchar(20),ISNULL(e.DOJ,''),105) AS DOJ, e.AcNumber, sg.EarnDay + sg.CL + sg.EL + sg.Sunday + sg.Holiday + sg.Total_2ndSaturday + sg.Total_4thSaturday
			as dayPresent, e.IfscCode,sg.Year,sg.Month
            from tblHrEmpMaster e inner join tblHrDesignationMaster d on e.PresentDesignation = d.ID
            inner join tblHrDeptMaster dept on e.PresentDepartId = dept.Id inner
            join tblHrPayrollMonthlySalaryGenerate sg on e.EmpId = sg.EmpId    where sg.Id = " + "'" + Id + "'");

            DataTable dtsalaryDetail = objMain.dtFetchData(@"Select sg.BasicPay,sg.PF_EmployeesValue,sg.HraAmt,sg.PT,sg.LTA_Amt,sg.LoanEmiAmount,
														sg.TDS_Deduct,sg.OtherAllownce,sg.GROSS_TOTAL, PF_EmployeesValue + PT + LoanEmiAmount + TDS_Deduct as TotalDeductions,ISNULL(sg.SalaryPaymentMode,'') as SalaryPaymentMode,sg.NetPay
														,sg.CL_Earn,sg.CL_ClosingBalance,sg.EL_Earn,sg.EL_ClosingBalance,sg.ESI_EmployeesValue,DaAmt
														from  tblHrPayrollMonthlySalaryGenerate sg 
														where sg.Id= " + "'" + Id + "'");

            objDs.Tables.AddRange(new DataTable[] { dtcompany, dtempDetail, dtsalaryDetail });
            string json = JsonConvert.SerializeObject(objDs, Formatting.None);
            return json;
        }
    }
}