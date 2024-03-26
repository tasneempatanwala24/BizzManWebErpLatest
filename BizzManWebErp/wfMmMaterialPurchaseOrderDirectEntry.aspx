<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/MmMainMenu.Master" CodeBehind="wfMmMaterialPurchaseOrderDirectEntry.aspx.cs" Inherits="BizzManWebErp.wfMmMaterialPurchaseOrderDirectEntry" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/style.css" rel="stylesheet" />
    <script src="Scripts/bootstrap.min.js"></script>
    <link href="css/jquery-ui.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="Scripts/jquery-ui.min.js"></script>
    <%--<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js"></script>--%>
    <script src="Scripts/moment.min.js"></script>
    <link href="css/bootstrap-timepicker.css" rel="stylesheet">
    <script type="text/javascript" src="Scripts/bootstrap-timepicker.js"></script>
    <script src="Scripts/MmMaterialPurchaseOrderDirectEntry.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <input type="hidden" id="loginuser" runat="server" />

 <button onclick="CreateMaterialPurchaseOrder();">Create</button>
    <button onclick="ViewMaterialPurchaseOrderList();">View</button>
    <button onclick="DownloadFile();" id="btnExport">Export To Excel</button>
    <button onclick="AddMaterialPurchaseOrder();" style="display: none;" id="btnSave">Save</button>
      <button type="button" class="preventDefault" id="previewBtn" style="display:none" onclick="PrintPreview()">
    Preview PDF
</button>

 <div class="container" id="divMaterialPurchaseOrderList" style="margin-top: 10px; overflow: auto;">
        <table id="tblMaterialPurchaseOrderList" class="display">
            <thead>
                <tr>
                    <th><input name="select_all" value="1" id="example-select-all" type="checkbox" /></th>
                    <th>Id</th>
                    <th>Vendor Name</th>
                    <th>Order Entry Date</th>
                    <th>Order Deadline Date</th>
                    <th>Receipt Date</th>
                    <th>Branch</th>
                    <th>Department</th>
                    <th>Payment Term</th>
                    <th>Purchase Agreement</th>
                    <th>Quotation No.</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody id="tbody_MaterialPurchaseOrder_List">
            </tbody>
        </table>
    </div>

    <div class="container" id="divMaterialPurchaseOrderEntry" style="display: none; margin-top: 10px;">
        <div class="card">
            <div class="card-header">
                Add Material Purchase Order
            </div>
            <div class="card-body">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <table class="tbl">
                            <tr>
                                <td>Order Entry Date *</td>
                                <td>
                                    <input type="date" class="form-control dat" id="txtEntryDate" name="txtEntryDate"  onchange="GenerateOrderID()" />
                                </td>
                                <td>
                                    <label class="control-label">ID</label>
                                </td>
                                <td>
                                    <input type="text" class="form-control" id="txtID" name="txtID" readonly="readonly" />
                                </td>
                                
                            </tr>
                            <tr>
                                <td>Vendor *</td>
                                <td>
                                    <select id="ddlVendor" name="ddlVendor" class="form-control"  style="width:300px;">
                                        <option value="">-Select Vendor-</option>
                                    </select>
                                </td>
                                <td>
                                    <label class="control-label">Order Deadline Date *</label>
                                </td>
                                <td>
                                    <input type="date" class="form-control dat" id="txtDeadlineDate" name="txtDeadlineDate" />
                                </td>
                                
                            </tr>
                            <tr>
                                <td>
                                    <label class="control-label">Receipt Date *</label>
                                </td>
                                <td>
                                    <input type="date" class="form-control dat" id="txtReceiptDate" name="txtReceiptDate" />
                                </td>
                                <td>
                                    <label class="control-label">Payment Term</label>
                                </td>
                                <td>
                                    <input type="text" class="form-control" id="txtPaymentTerm" name="txtPaymentTerm" maxlength="50" />
                                </td>
                                
                            </tr>
                            <tr>
                                <td>
                                    <label class="control-label">Purchase Agreement</label>
                                </td>
                                <td>
                                    <input type="text" class="form-control" id="txtPurchaseAgreement" name="txtPurchaseAgreement" maxlength="50" />
                                </td>
                                <td>
                                    <label class="control-label">Quotation No.</label>
                                </td>
                                <td>
                                    <input type="text" class="form-control" id="txtQuotationNo" name="txtQuotationNo" maxlength="50" />
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <label class="control-label">Branch *</label>
                                </td>
                                <td>
                                    <select id="ddlBranch" name="ddlBranch" class="form-control">
                                    </select>
                                </td>
                                <td>
                                    <label class="control-label">Department *</label>
                                </td>
                                <td>
                                    <select id="ddlDepartment" name="ddlDepartment" class="form-control">
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td colspan="3">
                                    <input type="checkbox" id="chkAskConfirm" name="chkAskConfirm" /> Ask Confirmation
                                </td>
                            </tr>
                            
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container" id="divSalesOrderDetails" style="margin-top: 10px; overflow: auto; display: none;">
        <div class="card">
            <div class="card-header">
                Purchase Order Lines
            </div>
            <div class="card-body">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <table id="tblSalesOrderBOMDetails" class="display no-footer dataTable" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th style="display: none;">Material Master Id</th>
                                    <th>Material Name</th>
                                       <th>Stock</th>
                                    <th>Qty</th>
                                    <th>Unit Measeure</th>
                                 <%-- <th>Package</th>
                                    <th style="display: none;">Package Id</th>
                                 --%>
                                    <th>Unit Price</th>
                                    <%-- <th>Discount (%)</th>
                                    <th>Tax (%)</th>--%>
                                    <th>Total Amount</th>
                                    <th>Description</th>
                                    <th></th>
                                </tr>
                            </thead>



                            <tbody id="tbody_SalesOrderDetails">
                                <tr id="tr_SalesOrderDetailEntry">
                                    <td style="display: none;"></td>
                                    <td>
                                        <select id="ddlMaterialName" name="ddlMaterialName" class="form-control" onchange="FetchMaterialDetails();">
                                            <option value="">-Select Material Name-</option>
                                        </select>
                                    </td>
                                      <td>
                                        <input type="text" class="form-control" id="txtMaterialStock" name="txtMaterialStock" readonly="readonly" />
                                    </td>
                                    <td>
                                        <input type="number" class="form-control" id="txtMaterialQty" name="txtMaterialQty" onchange="UpdateTotalAmount();" oninput="handleNumericInput(event)" value="0" />
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" id="txtMaterialUnitMeasure" name="txtMaterialUnitMeasure" readonly="readonly" />
                                    </td>
                                 <%-- <td>
                                        <select id="ddlPackage" name="ddlPackage" class="form-control">
                                            <option value="">-Select Package-</option>
                                        </select>
                                    </td>
                                    <td style="display: none;"></td>--%>
                                    <td>
                                        <input type="text" class="form-control" id="txtMaterialRate" name="txtMaterialRate" readonly="readonly" />
                                    </td>
                                      <%--  <td>
                                        <input type="number" class="form-control" id="txtMaterialDiscount" name="txtMaterialDiscount" onchange="UpdateTotalAmount();" value="0" oninput="handleNumericInput(event)" />
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" id="txtMaterialTax" name="txtMaterialTax" readonly="readonly" />
                                    </td>--%>
                                    <td>
                                        <input type="text" class="form-control" id="txtMaterialTotalAmount" name="txtMaterialTotalAmount" readonly="readonly" />
                                    </td>
                                     <td>
                                        <input type="text" class="form-control" id="txtDesciption" name="txtDesciption"  />
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary" onclick="SaveSalesOrderDetails();">Add</button>
                                    </td>
                                </tr>
                            </tbody>



                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

         <!-- Modal to display PDF -->
      <div class="modal fade" id="pdfModal" tabindex="-1" role="dialog" aria-labelledby="pdfModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="pdfModalLabel">PDF Preview</h5>
                <%--<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>--%>
            </div>
            <div class="modal-body">
                <iframe id="pdfPreview" style="width: 100%; height: 900px;" frameborder="0"></iframe>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"  onclick="ClosePDFModal();">Close</button>
            </div>
        </div>
    </div>
</div>




</asp:Content>
