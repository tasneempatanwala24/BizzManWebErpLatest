﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="wfHrDeptMasterNew.aspx.cs" Inherits="BizzManWebErp.wfHrDeptMasterNew" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/style.css" rel="stylesheet" />
    <script src="Scripts/bootstrap.min.js"></script>
    <link href="css/jquery-ui.css" rel="stylesheet" />
    <script src="Scripts/jquery-ui.min.js"></script>
       
    <script src="Scripts/HrDepartmentMasterNew.js"></script>

</asp:Content>

  

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <input type="hidden" id="loginuser" runat="server" />
    <button onclick="CreateData();">Create</button>
    <button onclick="ViewDataList();">View</button>
    <button onclick="AddData();" style="display: none;" id="btnSave">Save</button>

    <div class="container" id="divDataList" style="margin-top: 10px; overflow: auto;">
            <div id="dataTable_wrapper"></div>  
        <table id="tblDeptList" class="display table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Department Name</th>
                </tr>
            </thead>
            <tbody id="tbody_Dept_List">
            </tbody>
        </table>
    </div>


     <div class="container" id="divDataEntry" style="display: none; margin-top: 10px;">
        <div class="card">
            <div class="card-header">
                <b>Department Master </b>
            </div>
            <div class="card-body">
                <div class="panel panel-default">   
                    <div class="panel-body">
                        <table class="tbl">
                            <tr>
                              <td style="width: 10%;">ID</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtId" name="txtId" />
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 15%;">Department Name *</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtDepartmentName" name="txtDepartmentName" />
                                </td>                               
                            </tr>                           
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>


</asp:Content>
