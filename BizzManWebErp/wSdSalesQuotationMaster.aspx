<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/SdMainMenu.Master" CodeBehind="wSdSalesQuotationMaster.aspx.cs" Inherits="BizzManWebErp.wSdSalesQuotationMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/style.css" rel="stylesheet" />
     <link href="css/jquery-ui.css" rel="stylesheet" />
     <link href="css/bootstrap.min.css" rel="stylesheet" />
       <link href="css/bootstrap-datepicker.min.css" rel="stylesheet" />
   <!-- Include Font Awesome CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap4.min.css">
 
         
    
    <script src="Scripts/jquery-ui.min.js"></script>

  <%--  <script src="Scripts/jquery-3.5.1.slim.min.js"></script>--%>
    <script src="Scripts/bootstrap.min.js"></script>
      <script src="Scripts/bootstrap-datepicker.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <script src="Scripts/SdSalesQuotationMaster.js"></script>
    <style>
    .no-rows-footer {
      display: none;
    }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
     <button onclick="CreateData();" class="preventDefault">Create</button>
    <button onclick="ViewDataList();"  class="preventDefault">View</button>
  <button id="saveDataBtn" onclick="saveData()"  class="preventDefault" style="display:none">Save</button>
 <%--<button id="PrintDataBtn" runat="server" OnClientClick="generatePDF()" OnClick="btnPrint_Click"  style="display:none">Print</button>--%>
    <asp:Button runat="server" ID="PrintDataBtn" style="display:none;background-color:#7952b3;color:#fff;padding:7px;border:none" OnClientClick="generatePDF()" OnClick="btnPrint_Click" Text="Print"/>
   <button onclick="onEditButtonClick();" ID="EditDataBtn"  class="preventDefault" style="display:none">Edit</button>
    
    <input type="hidden" id="loginuser" runat="server" />
    <input type="hidden" id="printQuotationId" runat="server" />




       <div class="container" id="divDataList" style="margin-top: 10px; overflow: auto;">
    <table id="tblEmpJobList" class="display table table-bordered table-striped">
        <thead>
            <tr>
                <th>Quotation ID</th>
                <th>Quotation Date</th>
                <th>Customer Name</th>
                <th>Quotation Status</th>
                <th>Net Total</th>
                 <th>Net GST</th>
                  <th>Shipping Charges</th>
                <th>Net Amount</th>
              
            </tr>
        </thead>
        <tbody id="tbody_EmpJob_List">
            <!-- Table rows will be added dynamically -->
        </tbody>
    </table>
</div>

      <div class="container" id="divDataEntry" style="margin-top: 10px;display:none">
        <%--<div class="card">
            <div class="card-header">
                <b>KPI Sub Group </b>
            </div>--%>
            <div class="card-body">
                <div class="panel panel-default">   
                    <div class="panel-body">
                        <table class="tbl">
                            <tr>
                                <td>
                                    <label class="control-label">Client's Name</label>
                                </td>
                                <td>
                                   

                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlClientName" name="ddlClientName" onchange="GetCustomerDetails()" class="rounded border-dark">
                                        <option value="">-Select Client Name-</option>
                                    </select>

</div>
                                    
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-secondary preventDefault" onclick="location.href='wfCrmCustomerMaster.aspx'" style="margin-bottom:17%"><i class="fas fa-plus"></i></button>
                                </td>
                                 <td style="width: 10%;">Date</td>
                                <td>
                                <input type="text" class="form-control rounded border-dark datepicker" id="quotationDate" name="quotationDate" onchange="QuotationDateChange()">
                                </td>
                            </tr>
                             <tr>
                                <td style="width: 15%;">Client's Address</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtClientAddress" name="txtClientAddress" disabled />
                                </td> 
                               
                                  <td style="width: 10%; text-align:center" colspan="2">Quotation #</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtQuotation" name="txtQuotation" disabled/>
                                </td>
                            </tr>  
                            <tr>
                                <td style="width: 15%;">Client's Contact Number</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtContactNumber" name="txtContactNumber" disabled/>
                                </td>                               
                            </tr>  
                            <tr>
                                <td style="width: 15%;">Client's Email</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtEmail" name="txtEmail" disabled/>
                                </td>                               
                            </tr> 
                        </table>
                    </div>
                </div>
            </div>
              <div class="container">
  
  <table class="table table-bordered" id="dataTable">
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Qty</th>
        <th>Rate</th>
           <th>Discount %</th>
            <th>GST %</th>
            <th>Amount</th>
            <th><button class="btn btn-success mb-3 pull-right" id="addRowBtn"><i class="fas fa-plus"></i></button></th>
      </tr>
    </thead>
    <tbody>
      <!-- Rows will be added dynamically -->
    </tbody>
      <tfoot class="no-rows-footer">
          <tr>
              <th colspan="5" style="text-align:right"><b>Total</b></th>
              <th>
                  <input type="text" id="grandTotal" value="0" class="form-control" disabled>
              </th>
          </tr>
           <tr>
              <th colspan="5" style="text-align:right"><b>GST</b></th>
              <th>
                  <input type="text" id="grandTotalGST"  value="0" class="form-control" disabled>
              </th>
          </tr>
           <tr>
              <th colspan="5" style="text-align:right">Shipping Charges</th>
              <th>
                  <input type="text" value="0" class="form-control" id="ShippingCharges" onchange="calculateGrandTotal()" oninput="handleNumericInput(event)">
              </th>
          </tr>
           <tr>
              <th colspan="5" style="text-align:right"><b>Net Amount</b></th>
              <th>
                  <input type="text" value="0" id="netAmount"  class="form-control" disabled>
              </th>
          </tr>
      </tfoot>
  </table>
       
        <br />
        <div class="form-group">
      <label for="notes">Notes:</label>
      <textarea class="form-control" id="notes" placeholder="Notes - any relevant information not already covered"></textarea>
    </div>
         <br />
        <div class="form-group">
      <label for="notes">Terms & Conditions</label>
      <textarea class="form-control" id="terms" placeholder="Terms and conditions- late fees,payment methods,delivery schedule ..."></textarea>
    </div>
        <br />

 <%-- <button class="btn btn-success" id="saveDataBtn" onclick="saveData()">Save Data</button>--%>
</div>
        </div>
    <%--</div>--%>

    <div class="container" id="divDataItemsView" style="margin-top: 10px;display:none">
           <div class="card-body">
                <div class="panel panel-default">   
                    <div class="panel-body">
                        <table class="tbl">
                            <tr>
                                <td>
                                    <label class="control-label">Client's Name</label>
                                </td>
                                <td>
                                    
									
									 <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="disptxtCustomerName" name="disptxtCustomerName" disabled/>
                                </td>
                                 <td style="width: 10%;">Date</td>
                                <td>
                                <input type="text" class="form-control rounded border-dark" id="dispQuotationDate" name="dispQuotationDate" disabled>
                                </td>
                            </tr>
                             <tr>
                                <td style="width: 15%;">Client's Address</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="disptxtClientAddress" name="disptxtClientAddress" disabled />
                                </td> 
                               
                                  <td style="width: 10%;">Quotation #</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="disptxtQuotation" name="disptxtQuotation" disabled/>
                                </td>
                            </tr>  
                            <tr>
                                <td style="width: 10%;">Client's Contact Number</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="disptxtContactNumber" name="disptxtContactNumber" disabled/>
                                </td>   
                                 <td style="width: 10%;">Quotation Status</td>
                                <td>
                                 
                                
                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="dispddlQuotStatus" name="dispddlQuotStatus"  class="form-control rounded border-dark" disabled>
                                        <option value="Process">Process</option>
     <option value="Approve">Approve</option>
     <option value="Cancel">Cancel</option>
     <option value="Completed">Completed</option>
                                    </select>

</div>
                                </td>
                            </tr>  
                            <tr>
                                <td style="width: 15%;">Client's Email</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="disptxtEmail" name="disptxtEmail" disabled/>
                                </td>                               
                            </tr> 
                        </table>
                    </div>
                </div>
            </div>
              <div class="container">
  
  <table class="table table-bordered" id="dispdataTable">
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Qty</th>
        <th>Rate</th>
           <th>Discount %</th>
            <th>GST %</th>
            <th>Amount</th>
            
      </tr>
    </thead>
    <tbody id="salesItemBody">
      <!-- Rows will be added dynamically -->
    </tbody>
      <tfoot>
          <tr>
              <th colspan="5" style="text-align:right"><b>Total</b></th>
              <th>
                  <input type="text" id="dispgrandTotal" value="0" class="form-control" disabled>
              </th>
          </tr>
           <tr>
              <th colspan="5" style="text-align:right"><b>GST</b></th>
              <th>
                  <input type="text" id="dispgrandTotalGST"  value="0" class="form-control" disabled>
              </th>
          </tr>
           <tr>
              <th colspan="5" style="text-align:right">Shipping Charges</th>
              <th>
                  <input type="text" value="0" class="form-control" id="dispShippingCharges" disabled>
              </th>
          </tr>
           <tr>
              <th colspan="5" style="text-align:right"><b>Net Amount</b></th>
              <th>
                  <input type="text" value="0" id="dispnetAmount"  class="form-control" disabled>
              </th>
          </tr>
      </tfoot>
  </table>
      
        <br />
        <div class="form-group">
      <label for="notes">Notes:</label>
      <textarea class="form-control" id="dispnotes" disabled ></textarea>
    </div>
         <br />
        <div class="form-group">
      <label for="notes">Terms & Conditions</label>
      <textarea class="form-control" id="dispterms" disabled></textarea>
    </div>
        <br />

 
</div>
        </div>





</asp:Content>