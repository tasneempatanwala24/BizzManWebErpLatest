
$(document).ready(function () {
    $("#saveDataBtn,.preventDefault").click(function (event) {
        event.preventDefault();
    });

    $('#ddlQuotationId').select2();

   


    // Initialize Bootstrap Datepicker
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
        startDate: '0d' // Restrict to the current date and future dates
    });

    BindQuotationDropdown();
   // fetchDataList();
     BindCurrencyDropdown();
     BindBranchDropdown();
    BindDepartmentDropdown()
    BindSalesOrderMasterList();

});

function BindSalesOrderMasterList() {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfSdSalesQuotationOrder.aspx/FetchSalesOrderMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);

            setTimeout(function () {

                $('#tblSalesOrderList').DataTable().clear();
                $('#tblSalesOrderList').DataTable().destroy();
                $('#tbody_SalesOrder_List').html('');

                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html = html + '<tr><td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + data[i].SalesOrderId + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].ManualOrderId != undefined ? data[i].ManualOrderId : '') + '</td>'

                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].SalesOrderSource != undefined ? data[i].SalesOrderSource : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].CustomerName != undefined ? data[i].CustomerName : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].BranchName != undefined ? data[i].BranchName : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].DeptName != undefined ? data[i].DeptName : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].GST_Treatment != undefined ? data[i].GST_Treatment : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].ExpirationDate != undefined ? data[i].ExpirationDate : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].QuotationDate != undefined ? data[i].QuotationDate : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].Currency != undefined ? data[i].Currency : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].PaymentTerms != undefined ? data[i].PaymentTerms : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].OrderStatus != undefined ? data[i].OrderStatus : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].DeliveyCharges != undefined ? data[i].DeliveyCharges : '0') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].OutstandingAmount != undefined ? data[i].OutstandingAmount : '0') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].Advance != undefined ? data[i].Advance : '0') + '</td>'

                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].TotalAmount != undefined ? data[i].TotalAmount : '0') + '</td></tr>';
                }
                $('#tbody_SalesOrder_List').html(html);
                var d = new Date();
                var table = $('#tblSalesOrderList').DataTable({
                    'columnDefs': [
                        {
                            'targets': 0,
                            'checkboxes': {
                                'selectRow': true
                            }
                        }
                    ],
                    'select': {
                        'style': 'multi'
                    },
                    fixedHeader: {
                        header: true
                    }
                });
                hideLoader();


            }, 1000); // Hide loader after 3 seconds





            

        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}
function BindBranchDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesQuotationOrder.aspx/GetBranchDetails',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlBranch').html('');
            var ddlBranch = "<option value=''>-Select Branch-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                ddlBranch = ddlBranch + "<option value='" + JSON.parse(response.d)[i].BranchCode + "'>" + JSON.parse(response.d)[i].BranchName + "</option>";
            }

            $("#ddlBranch").append(ddlBranch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function BindDepartmentDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesQuotationOrder.aspx/GetDeptDetails',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlDept').html('');
            var ddlDept = "<option value=''>-Select Department-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                ddlDept = ddlDept + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].DeptName + "</option>";
            }

            $("#ddlDept").append(ddlDept);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}
function BindCurrencyDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesQuotationOrder.aspx/BindCurrencyList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlCurrency').html('');
            var data = JSON.parse(response.d);
            var branch = "<option value=''>-Select Currency-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                branch = branch + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].Currency + "</option>";
            }
            $('#ddlCurrency').append(branch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}

function BindQuotationDropdown() {
    $('#ddlQuotationId').empty();
    $.ajax({
        type: "POST",
        url: 'wfSdSalesQuotationOrder.aspx/GetQuotationList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            // var abranch = "<option value=''>-Select Customer-</option>";
            var abranch = ' <option value="">-Select Quotation Id-</option>';
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                abranch = abranch + "<option value='" + JSON.parse(response.d)[i].QuotationId + "'>" + JSON.parse(response.d)[i].QuotationId  + "</option>";
            }
            $('#ddlQuotationId').append(abranch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function GetQuotationIdDetails() {
    if ($('#ddlQuotationId').val() != '' && $('#ddlQuotationId').val() != null) {
        showLoader();
        $.ajax({
            type: "POST",
            url: 'wfSdSalesQuotationOrder.aspx/GetQuotationIdDetailsById',
            data: JSON.stringify({
                "QuotationId": $('#ddlQuotationId').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);

                setTimeout(function () {

                    $('#txtQuotationDate').val(data.SalesQuotationMastertInfo.formattedQuotationDate);
                    $('#txtCustomer').val(data.SalesQuotationMastertInfo.CustomerName + " " + data.SalesQuotationMastertInfo.Mobile)
                    $('#hdnCustomerId').val(data.SalesQuotationMastertInfo.CustomerId);
                    $('#txtDeliveryCharges').val(data.SalesQuotationMastertInfo.DeliveryCharges);

                    var html = '';
                    for (var i = 0; i < data.SalesItems[0].Table.length; i++) {
                        html = html + '<tr><td><input type="checkbox" class="rowCheckbox"></td>'
                            + '<td class="materialID" style="display:none">' + data.SalesItems[0].Table[i].MaterialId + '</td>'
                            + '<td class="SalesQuotationDetailId" style="display:none">' + data.SalesItems[0].Table[i].SalesQuotationDetailId + '</td>'
                            + '<td class="materialName">' + data.SalesItems[0].Table[i].materialName + '</td>'
                            + '<td class="Qty">' + data.SalesItems[0].Table[i].Qty + '</td>'
                            + '<td class="UnitMeasure">' + data.SalesItems[0].Table[i].UnitMeasure + '</td>'
                            + '<td class="Rate">' + data.SalesItems[0].Table[i].Rate + '</td>'
                            + '<td class="Discount">' + data.SalesItems[0].Table[i].Discount + '</td>'
                            + '<td class="GST">' + data.SalesItems[0].Table[i].GST + '</td>'
                            + '<td class="amount">' + data.SalesItems[0].Table[i].Amount + '</td></tr>';


                    }





                    $('#tbody_SalesOrderDetails').html(html);




                    $('#selectAll').change(function () {
                        // Set the checked property of all row checkboxes to match the header checkbox
                        $('.rowCheckbox').prop('checked', $(this).prop('checked'));
                        GetTotalAmount();
                    });

                    $('.rowCheckbox').change(function () {
                        GetTotalAmount();

                    });
                    hideLoader();
                },1000);
              //  $('#txtCustomer').val(data[0].CustomerName + " " + data[0].Mobile);
              
               
                
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        
    }
}


function AddSalesOrder() {
    if ($('#ddlCustomer').val() == '') {
        alertify.error('Please select any Customer');
        return;
    }
    else if ($('#txtExpirationDate').val() == '') {
        alertify.error('Please select any Expiration Date');
        return;
    }
    else if ($('#ddlGSTTreatment').val() == '') {
        alertify.error('Please select any GST Treatment');
        return;
    }
    else if ($('#txtQuotationDate').val() == '') {
        alertify.error('Please select any Quotation Date');
        return;
    }
    else if ($('#ddlCurrency').val() == '') {
        alertify.error('Please select any Currency');
        return;
    }
   
  

    var found = false;
    $("#tbody_SalesOrderDetails tr").each(function () {
        if ($(this).find('.rowCheckbox').is(':checked')) {
            found = true;
        }
    });
    if (found == false) {
        alertify.error('Please Select any Sales Order Lines');
        return;
    }

    showLoader();
    var data = [];
    $("#tbody_SalesOrderDetails tr").each(function () {
        if ($(this).find('.rowCheckbox').is(':checked')) {

            var materialID = $(this).find('.materialID').text();
            var SalesQuotationDetailId = $(this).find('.SalesQuotationDetailId').text();
            var Qty = $(this).find('.Qty').text();
            var UnitMeasure = $(this).find('.UnitMeasure').text();
            var Rate = $(this).find('.Rate').text();
            var GST = $(this).find('.GST').text();
            var Discount = $(this).find('.Discount').text();
            var amount = $(this).find('.amount').text();


            data.push({ ItemID: materialID, Quantity: Qty, Rate: Rate, GST: GST, UnitMeasure: UnitMeasure, Amount: amount, SalesQuotationDetailId: SalesQuotationDetailId, Discount: Discount });
        }

        
    });

    // Send data to server using AJAX
    $.ajax({
        type: "POST",
        url: "wfSdSalesQuotationOrder.aspx/AddSalesOrder", // Adjust the URL based on your setup
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            data: data,
            "QuotationId": $('#ddlQuotationId').val(),
            "SalesOrderId": $('#txtSalesOrderId').val(),
            "CustomerId": $('#hdnCustomerId').val(),
            "ExpirationDate": $('#txtExpirationDate').val(),
            "GSTTreatment": $('#ddlGSTTreatment').val(),
             "QuotationDate": $('#txtQuotationDate').val(),
            "Currency": $('#ddlCurrency').val(),
            "PaymentTerms": $('#ddlPaymentTerms').val(),
            "TermsConditions": $('#txtTermsConditions').val(),
            "TotalAmount": $('#txtTotalAmount').val(),
            "OrderSource": "Quotation",
            "LoginUser": $('#ContentPlaceHolder1_loginuser').val(),
            "BranchCode": $('#ddlBranch').val(),
            "DepartmentID": $('#ddlDept').val(),
            "OrderDate": $('#txtorderDate').val(),
            "DeliveryCharges": $('#txtDeliveryCharges').val(),
            "OutstandingAmount": $('#txtOutstandingAmount').val(),
            "Advance": $('#txtAdvance').val()
        }),
        dataType: "json",
        success: function (response) {
           

            setTimeout(function () {
                hideLoader();
                alertify.success('Sales Quotation details added successfully');
                ClearAll();

            }, 1000); // Hide loader after 3 seconds
        },
        error: function (error) {
            console.log(error);
            alertify.error("Error saving data. Please try again.");
        }
    });
}


function GetTotalAmount() {
    var grandTotal = 0;
    var shippingCharges = parseFloat($('#txtDeliveryCharges').val());
    $('#tbody_SalesOrderDetails tr').each(function () {
        if ($(this).find('.rowCheckbox').is(':checked')) {
            grandTotal += parseFloat($(this).find('.amount').text());
        }
    });
    grandTotal += shippingCharges
    $('#txtTotalAmount').val(grandTotal.toFixed(2));
    var outstanding = 0;
    var advance = 0;
    advance = parseFloat($('#txtAdvance').val());
    outstanding = grandTotal - advance;
    $('#txtOutstandingAmount').val(outstanding.toFixed(2));
}

function GenerateOrderID() {
    if ($('#txtorderDate').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfSdSalesQuotationOrder.aspx/GenerateOrderID',
            data: JSON.stringify({
                "OrderDate": $('#txtorderDate').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                $('#txtSalesOrderId').val(data[0].SalesOrderId);


            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        $('#txtSalesOrderId').val('');
    }
}

function ViewSalesOrderList() {
    $('#divDataList').show();
    $('#divDataEntry').hide();
    $('#divDataEntryDetails').hide();
   // $('#divSalesOrderDetails').hide();
    $('#previewBtn').hide();
    $('#saveDataBtn').hide();
      BindSalesOrderMasterList();
}
function ClearAll() {
    $('#tbody_SalesOrderDetails tr').remove();
    $('#txtSalesOrderId').val('');
    $('#hdnCustomerId').val('');
    $('#txtExpirationDate').val('');
    $('#txtQuotationDate').val('');
    $('#txtTermsConditions').val('');
    $('#txtTotalAmount').val('0');
    $('#txtorderDate').val('');
    $('#txtCustomer').val('');
    $('#txtOutstandingAmount').val('0');
    $('#txtDeliveryCharges').val('0');
    $('#txtAdvance').val('0');
    $('#ddlGSTTreatment').val('');
    $('#ddlCurrency').val('').trigger('change');;
    $('#ddlPaymentTerms').val('').trigger('change');;
    $('#ddlBranch').val('').trigger('change');;
    $('#ddlDept').val('').trigger('change');;
    BindQuotationDropdown();
    $('#ddlQuotationId').val('').trigger('change');;
}

function CreateData() {
    //  $('#divEmpJobList').hide();
    $('#divDataList').hide();
    $('#divDataEntryDetails').hide();
   $('#previewBtn').hide();
     $('#divDataEntry').show();
    $('#saveDataBtn').show();
    
    ClearAll();
}
function FetchSalesOrderMasterDetails(id, OrderStatus) {
   
    showLoader();

        $.ajax({
            type: "POST",
            url: 'wfSdSalesQuotationOrder.aspx/FetchSalesOrderMasterDetails',
            data: JSON.stringify({
                "SalesOrderId": id
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                $('#dispQuotationDate').val(data.SalesQuotationOrderMastertInfo.formattedQuotationDate);
                $('#dispCustomer').val(data.SalesQuotationOrderMastertInfo.CustomerName + " " + data.SalesQuotationOrderMastertInfo.Mobile)
                $('#dispQuotationId').val(data.SalesQuotationOrderMastertInfo.QuotationId);
                $('#disporderDate').val(data.SalesQuotationOrderMastertInfo.formattedOrderDate);
                $('#dispSalesOrderId').val(data.SalesQuotationOrderMastertInfo.SalesOrderId);
                $('#dispGSTTreatment').val(data.SalesQuotationOrderMastertInfo.GSTTreatment);
                $('#dispPaymentTerms').val(data.SalesQuotationOrderMastertInfo.PaymentTerms);
                $('#dispCurrency').val(data.SalesQuotationOrderMastertInfo.Currency);
                $('#dispBranch').val(data.SalesQuotationOrderMastertInfo.BranchName);
                $('#dispDept').val(data.SalesQuotationOrderMastertInfo.DeptName);
                $('#dispTotalAmount').val(data.SalesQuotationOrderMastertInfo.TotalAmount);
                $('#dispTermsConditions').val(data.SalesQuotationOrderMastertInfo.TermCondition);
                $('#dispDeliveryCharges').val(data.SalesQuotationOrderMastertInfo.DeliveryCharges);
                $('#dispOutstandingAmount').val(data.SalesQuotationOrderMastertInfo.OutstandingAmount);
                $('#dispAdvance').val(data.SalesQuotationOrderMastertInfo.Advance);

                $('#dispExpirationDate').val(data.SalesQuotationOrderMastertInfo.formattedExpirationDate);
               
             
                var html = '';
                for (var i = 0; i < data.SalesItems[0].Table.length; i++) {
                    html = html + '<tr>'
                        + '<td class="materialID" style="display:none">' + data.SalesItems[0].Table[i].MaterialId + '</td>'
                      
                        + '<td class="materialName">' + data.SalesItems[0].Table[i].MaterialName + '</td>'
                        + '<td class="Qty">' + data.SalesItems[0].Table[i].Qty + '</td>'
                        + '<td class="UnitMeasure">' + data.SalesItems[0].Table[i].UnitMesure + '</td>'
                        + '<td class="Rate">' + data.SalesItems[0].Table[i].UnitPrice + '</td>'
                        + '<td class="GST">' + data.SalesItems[0].Table[i].Tax + '</td>'
                        + '<td class="amount">' + data.SalesItems[0].Table[i].SubTotal + '</td></tr>';


                }





                $('#disptbody_SalesOrderDetails').html(html);
                $('#divDataList').hide();
                $('#divDataEntry').hide();
                $('#saveDataBtn').hide();
                $('#divDataEntryDetails').show();
                $('#previewBtn').show();
                hideLoader();
              
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    
}


function PrintPreview() {
     showLoader();

    // Call the server-side method to get the PDF content
    $.ajax({
        type: 'POST',
        url: 'wfSdSalesQuotationOrder.aspx/GetPdfContent',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            "SalesOrderId": $('#dispSalesOrderId').val()
        }),
        dataType: 'json',
        success: function (response) {
            setTimeout(function () {
                hideLoader();


                // Display the PDF content in the modal
                $('#pdfPreview').attr('src', 'data:application/pdf;base64,' + response.d);
                $('#pdfModal').modal('show');
            }, 1000); // Hide loader after 3 seconds

        },
        error: function (xhr, status, error) {
            console.log('Error fetching PDF:', error);
        }
    });

}

function ClosePDFModal() {
    $('#pdfModal').modal('hide');
}

function handleNumericInput(event) {
    // Get the input element
    var inputElement = event.target;

    // Remove non-numeric characters (except 0)
    var numericValue = inputElement.value.replace(/[^0-9]/g, '');

    // Handle leading zeros
    if (numericValue.length > 1 && numericValue.charAt(0) === '0') {
        numericValue = numericValue.slice(1); // Remove leading zero
    }

    // Set the default value to 0 if the input is empty
    if (numericValue === '') {
        numericValue = '0';
    }

    // Update the input value
    inputElement.value = numericValue;
}