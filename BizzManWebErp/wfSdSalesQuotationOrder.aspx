<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="wfSdSalesQuotationOrder.aspx.cs" MasterPageFile="~/SdMainMenu.Master" Inherits="BizzManWebErp.wfSdSalesQuotationOrder" %>

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

    <script src="Scripts/SdSalesQuotationOrder.js"></script>
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
     
    <input type="hidden" id="loginuser" runat="server" />
   




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

      <div class="container" id="divDataEntry" style="margin-top: 10px;display:none; overflow: auto;">
       
          <div class="card">
              <div class="card-header">
    Add Sales order
  </div>
  <div class="card-body">
                <div class="panel panel-default">   
                    <div class="panel-body">
                        <table class="tbl">
                            <tr>
                                <td>
                                    <label class="control-label">Quotation ID</label>
                                </td>
                                <td>
                                   

                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlQuotationId" name="ddlQuotationId" onchange="GetQuotationIdDetails()" class="rounded border-dark">
                                        <option value="">-Select Quotation Id-</option>
                                    </select>

</div>
                                    
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-secondary preventDefault" onclick="location.href='wfCrmCustomerMaster.aspx'" style="margin-bottom:17%"><i class="fas fa-plus"></i></button>
                                </td>
                                 <td style="width: 10%;">Order Date</td>
                                <td>
                                <input type="text" class="form-control rounded border-dark datepicker" id="orderDate" name="orderDate" onchange="GenerateOrderID()">
                                </td>
                            </tr>
                             <tr>
                                <td style="width: 15%;">Customer</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtCustomer" name="txtCustomer" disabled />
                                </td> 
                               
                                  <td style="width: 10%; text-align:center" colspan="2">Sales Order Id</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtSalesOrderId" name="txtSalesOrderId" disabled/>
                                </td>
                            </tr>  
                            <tr>
                                <td style="width: 15%;">Quotation Date</td>
                                <td>
                                   <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtQuotationDate" name="txtQuotationDate" disabled/>
                                </td>                               
                           
                                <td style="width: 15%;">Expiration Date</td>
                                <td>
                                     <input type="text" class="form-control rounded border-dark datepicker" id="txtExpirationDate" name="txtExpirationDate">
                            
                                </td>                               
                            </tr> 

                                <tr>
                                <td style="width: 15%;">GST Treatment*</td>
                                <td>
                                  
                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlGSTTreatment" name="ddlGSTTreatment"  class="rounded border-dark">
                                        <option value="">-Select GST Treatment-</option>
                                    </select>

</div>    </td>                               
                           
                                <td style="width: 15%;">Payment Terms</td>
                                <td>
                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlPaymentTerms" name="ddlPaymentTerms"  class="rounded border-dark">
                                        <option value="">-Select Payment Terms-</option>
                                    </select>

</div>
                                </td>                               
                            </tr> 
                                  <tr>
                                <td style="width: 15%;">Currency*</td>
                                <td>
                                  
                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlCurrency" name="ddlCurrency"  class="rounded border-dark">
                                        <option value="">-Select Currency-</option>
                                    </select>

</div>    </td>                               
                           
                                <td style="width: 15%;">Branch*</td>
                                <td>
                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlBranch" name="ddlBranch"  class="rounded border-dark">
                                        <option value="">-Select Branch-</option>
                                    </select>

</div>
                                </td>                               
                            </tr> 
                                   <tr>
                                <td style="width: 15%;">Department*</td>
                                <td>
                                  
                                    <div class="input-group mb-3">

 <select style="width: 100%;" id="ddlDepartment" name="ddlDepartment"  class="rounded border-dark">
                                        <option value="">-Select Department-</option>
                                    </select>

</div>    </td>                               
                           
                                <td style="width: 15%;">Total Amount</td>
                                <td>
                                      <input type="text" style="width: 100%;" class="form-control rounded border-dark" id="txtTotalAmount" name="txtTotalAmount" disabled/>
                              
                                </td>                               
                            </tr>
                            <tr>
                                 <td style="width: 15%;">Terms & Conditions</td>
                                <td>
                                      <textarea class="form-control" id="terms" placeholder="Terms and conditions- late fees,payment methods,delivery schedule ..."></textarea>
   
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
          </div>
          
         
             <div class="card">
               <div class="card-header">
    Sales Order Lines
  </div>
            <div class="card-body">
                <div class="panel panel-default">
                    <div class="panel-body">
  <table id="dataTable" class="table table-bordered table-responsive" style="width: 100%;">
    <thead>
      <tr>
        <th>Item Name</th>
        <th  style="width:10%">Qty</th>
        <th style="width:10%">Rate</th>
           <th style="width:10%">Discount %</th>
            <th style="width:10%">GST %</th>
            <th style="width:20%">Amount</th>
            <th  style="width:5%"><button class="btn btn-success mb-3 pull-right" id="addRowBtn"><i class="fas fa-plus"></i></button></th>
      </tr>
    </thead>
    <tbody>
      <!-- Rows will be added dynamically -->
        <tr>
           
        </tr>
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
    
                         </div>
                </div>
            </div>
                 </div>
 </div>


       


  





</asp:Content>