using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BizzManWebErp
{
    public partial class wfInventTransportMaster : System.Web.UI.Page
    {

        static clsMain objMain;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["Id"] != null)
                {
                    loginuser.Value = Convert.ToString(Session["Id"]);

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
        public static string StateList()
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
        [WebMethod]
        public static string AddTransport(string TransportName, string Address1, string StateId, string Phone, string Email, string Description,
            string PhotoImage, string User, string Id, string Gst)
        {
            
            SqlParameter[] objParam = new SqlParameter[10];

            objParam[0] = new SqlParameter("@TransportName", SqlDbType.VarChar);
            objParam[0].Direction = ParameterDirection.Input;
            objParam[0].Value = TransportName;

            objParam[1] = new SqlParameter("@Address1", SqlDbType.VarChar);
            objParam[1].Direction = ParameterDirection.Input;
            objParam[1].Value = Address1;

            objParam[2] = new SqlParameter("@StateId", SqlDbType.VarChar);
            objParam[2].Direction = ParameterDirection.Input;
            objParam[2].Value = StateId;

            objParam[3] = new SqlParameter("@Phone", SqlDbType.VarChar);
            objParam[3].Direction = ParameterDirection.Input;
            objParam[3].Value = Phone;

            objParam[4] = new SqlParameter("@Email", SqlDbType.VarChar);
            objParam[4].Direction = ParameterDirection.Input;
            objParam[4].Value = Email;

            objParam[5] = new SqlParameter("@Description", SqlDbType.VarChar);
            objParam[5].Direction = ParameterDirection.Input;
            objParam[5].Value = Description;

            objParam[6] = new SqlParameter("@PhotoImage", SqlDbType.VarBinary);
            objParam[6].Direction = ParameterDirection.Input;
            objParam[6].Value = Encoding.UTF8.GetBytes(PhotoImage);

            objParam[7] = new SqlParameter("@User", SqlDbType.VarChar);
            objParam[7].Direction = ParameterDirection.Input;
            objParam[7].Value = User;

            objParam[8] = new SqlParameter("@Id", SqlDbType.Int);
            objParam[8].Direction = ParameterDirection.Input;
            objParam[8].Value = Convert.ToInt32(Id);

            objParam[9] = new SqlParameter("@Gst", SqlDbType.VarChar);
            objParam[9].Direction = ParameterDirection.Input;
            objParam[9].Value = Gst;

            var result = objMain.ExecuteProcedure("procInventTransportMaster", objParam);
            
            return "";
        }

        [WebMethod]
        public static string GetTransportList()
        {
            DataTable dtlist = new DataTable();

            try
            {

                dtlist = objMain.dtFetchData(@"SELECT Id,TransportName,PhoneNo,EmailAddress,GST_No FROM tblInventTransportMaster");
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
            return JsonConvert.SerializeObject(dtlist, settings);

        }

        [WebMethod]
        public static string GetTransportById(string Id)
        {

            DataTable dtList = new DataTable();

            try
            {
                string sqlQuery = $"SELECT TransportName,TransportAddress,GST_No,EmailAddress,PhoneNo,EmailAddress,Description,CAST(TransportImage as varchar(max)) TransportImage,StateId from tblInventTransportMaster WHERE Id ={Id} ";

                dtList = objMain.dtFetchData(sqlQuery);
            }
            catch (Exception ex)
            {
            }

            return JsonConvert.SerializeObject(dtList, Formatting.None);

        }

        [WebMethod]
        public static string GetTransportImageById(string Id)
        {

            // clsMain objMain = new clsMain();
            DataTable dtImages = new DataTable();

            try
            {
                string sqlQuery = $"SELECT CAST(TransportImage as varchar(max)) TransportImage FROM tblInventTransportMaster WHERE TransportName =" + Id;

                dtImages = objMain.dtFetchData(sqlQuery);
            }
            catch (Exception ex)
            {
            }

            return JsonConvert.SerializeObject(dtImages, Formatting.None);

        }

        [WebMethod]
        public static string CheckAvailability(string GstNo, string isUpdate)
        {
            //  clsMain objMain = new clsMain();
            bool checkId = new bool();

            try
            {

                if (isUpdate == "0")
                {
                    if (!string.IsNullOrEmpty(GstNo))
                    {
                        checkId = objMain.blSearchDataHO(string.Format("select 1 from tblInventTransportMaster where GST_No='{0}'", GstNo));
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
    }

}