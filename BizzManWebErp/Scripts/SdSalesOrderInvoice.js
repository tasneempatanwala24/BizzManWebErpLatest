
$(document).ready(function () {
    $("#saveDataBtn,.preventDefault").click(function (event) {
        event.preventDefault();
    });

    $('#ddlSalesOrderd').select2();




    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true,
        todayHighlight: true

    });
    BindSalesOrderDropdown();
   
    BindSalesOrderInvoiceMasterList();
    $(document).on("keydown", function (event) {
        // Check if Ctrl key is pressed along with 'S' key
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault(); // Prevent the default save dialog
            AddSalesOrder(); // Call the save function
        }
    });
    attachKeydownListeners();

});

function attachKeydownListeners() {
    $("#ddlSalesOrderd").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            setTimeout(function () {
                //$("#txtSalesInvoiceDate").focus(); // Trigger click to open the calendar popup
                $("#txtDeliveryCharges").focus();
            }, 300);
        }
    });

    $("#ddlSalesOrderd").on("change", function (event) {
      
            setTimeout(function () {
               // $("#txtSalesInvoiceDate").focus(); // Trigger click to open the calendar popup
                $("#txtDeliveryCharges").focus();
            }, 300);
        


    });

    $("#txtSalesInvoiceDate").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $("#txtDeliveryCharges").focus();
        }
    });
   
   
}
function getCurrentDate() {
    var today = new Date();
    var day = ("0" + today.getDate()).slice(-2); // Add leading zero if needed
    var month = ("0" + (today.getMonth() + 1)).slice(-2); // Months are zero-based, so add 1 and add leading zero if needed
    var year = today.getFullYear();
    return month + "/" + day + "/" + year;
}
function BindSalesOrderInvoiceMasterList() {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrderInvoice.aspx/FetchSalesOrderInvoiceMasterList',
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
                    html = html + '<tr><td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + data[i].SalesInvoiceId + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].SalesOrderId != undefined ? data[i].SalesOrderId : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].ManualOrderId != undefined ? data[i].ManualOrderId : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].CustomerName != undefined ? data[i].CustomerName : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].formattedsalesInvoiceDate != undefined ? data[i].formattedsalesInvoiceDate : '') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].Deliveycharges != undefined ? data[i].Deliveycharges : '0') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].TotalAmount != undefined ? data[i].TotalAmount : '0') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].OutstandingAmount != undefined ? data[i].OutstandingAmount : '0') + '</td>'
                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].Advance != undefined ? data[i].Advance : '0') + '</td>'

                        + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesInvoiceId + '\');">' + (data[i].PaymentComplete != undefined ? data[i].PaymentComplete : 'n') + '</td></tr>'

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


function BindSalesOrderDropdown() {
    $('#ddlSalesOrderd').empty();
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrderInvoice.aspx/GetSalesOrderList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            // var abranch = "<option value=''>-Select Customer-</option>";
            var abranch = ' <option value="">-Select SalesOrder Id-</option>';
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                abranch = abranch + "<option value='" + JSON.parse(response.d)[i].SalesOrderId + "'>" + JSON.parse(response.d)[i].SalesOrderId + "</option>";
            }
            $('#ddlSalesOrderd').append(abranch);
            $('#ddlSalesOrderd').focus();
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function GetSalesOrderIdDetails() {
    if ($('#ddlSalesOrderd').val() != '' && $('#ddlSalesOrderd').val() != null) {
        showLoader();
        $.ajax({
            type: "POST",
            url: 'wfSdSalesOrderInvoice.aspx/GetSalesOrderIdDetailsById',
            data: JSON.stringify({
                "SalesOrderId": $('#ddlSalesOrderd').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
               

                    $('#txtCustomer').val(data.SalesOrderInvoiceMasterInfo.CustomerName + " " + data.SalesOrderInvoiceMasterInfo.Mobile)
                    $('#hdnCustomerId').val(data.SalesOrderInvoiceMasterInfo.CustomerId);
                    $('#txtOutstandingAmount').val(data.SalesOrderInvoiceMasterInfo.OutStandingamount);
                    $('#txtAdvance').val(data.SalesOrderInvoiceMasterInfo.Advance);
                    $('#txtDeliveryCharges').val(data.SalesOrderInvoiceMasterInfo.Deliveycharges);

                    var html = '';
                    for (var i = 0; i < data.SalesOrderInvoiceItems[0].Table.length; i++) {
                        html = html + '<tr><td><input type="checkbox" class="rowCheckbox"><input type="hidden" value="' + data.SalesOrderInvoiceItems[0].Table[i].CentralTaxPercent + '" class="hdnCentralTaxPercent"><input type="hidden" value="' + data.SalesOrderInvoiceItems[0].Table[i].StateTaxPercent + '" class="hdnStateTaxPercent"><input type="hidden" value="' + data.SalesOrderInvoiceItems[0].Table[i].CessPercent +'" class="hdnCessPercent"></td>'
                            + '<td class="materialID" style="display:none">' + data.SalesOrderInvoiceItems[0].Table[i].MaterialId + '</td>'
                            + '<td class="SalesOrderProductDetailId" style="display:none">' + data.SalesOrderInvoiceItems[0].Table[i].SalesOrderProductDetailId + '</td>'
                            + '<td class="materialName">' + data.SalesOrderInvoiceItems[0].Table[i].materialName + '</td>'
                            + '<td class="Qty">' + data.SalesOrderInvoiceItems[0].Table[i].Qty + '</td>'
                            + '<td class="UnitMeasure">' + data.SalesOrderInvoiceItems[0].Table[i].UnitMeasure + '</td>'
                            + '<td class="Package">' + data.SalesOrderInvoiceItems[0].Table[i].Package + '</td>'
                            + '<td class="PackageId" style="display:none">' + data.SalesOrderInvoiceItems[0].Table[i].PackageId + '</td>'
                            + '<td class="Rate">' + data.SalesOrderInvoiceItems[0].Table[i].Rate + '</td>'
                            + '<td class="Discount">' + data.SalesOrderInvoiceItems[0].Table[i].Discount + '</td>'
                            + '<td class="GST">' + data.SalesOrderInvoiceItems[0].Table[i].GST + '</td>'
                            + '<td class="amount">' + data.SalesOrderInvoiceItems[0].Table[i].Amount + '</td></tr>';


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

                  

               
              
            },
            complete: function () {
                setTimeout(function () {
                $("#selectAll").prop("checked", true);
                $('.rowCheckbox').prop('checked', true);
                GetTotalAmount();
                hideLoader();

            }, 1000); // Hide loader after 3 seconds
            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
     
    }
}


function AddSalesOrder() {
    if ($('#txtSalesInvoiceDate').val() == '') {
        alertify.error('Please enter Invoice Date');
        return;
    }
    else if ($('#txtSalesInvoiceId').val() == '') {
        alertify.error('Please enter Invoice Date');
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
            var SalesOrderProductDetailId = $(this).find('.SalesOrderProductDetailId').text();
            var Qty = $(this).find('.Qty').text();
            var UnitMeasure = $(this).find('.UnitMeasure').text();
            var Rate = $(this).find('.Rate').text();
            var GST = $(this).find('.GST').text();
            var Discount = $(this).find('.Discount').text();
            var amount = $(this).find('.amount').text();
            var packageId = $(this).find('.PackageId').text();

            data.push({ ItemID: materialID, Quantity: Qty, Rate: Rate, GST: GST, UnitMeasure: UnitMeasure, Amount: amount, SalesOrderProductDetailId: SalesOrderProductDetailId, Discount: Discount, PackageId: packageId });
        }


    });

    // Send data to server using AJAX
    $.ajax({
        type: "POST",
        url: "wfSdSalesOrderInvoice.aspx/AddSalesOrderInvoice", // Adjust the URL based on your setup
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            data: data,
            "SalesOrderId": $('#ddlSalesOrderd').val(),
            "SalesInvoiceId": $('#txtSalesInvoiceId').val(),
            "CustomerId": $('#hdnCustomerId').val(),
            "OutstandingAmount": $('#txtOutstandingAmount').val(),
            "Advance": $('#txtAdvance').val(),
            "DeliveryCharges": $('#txtDeliveryCharges').val(),
             "TotalAmount": $('#txtTotalAmount').val(),
             "LoginUser": $('#ContentPlaceHolder1_loginuser').val(),
              "SalesinvoiceDate": $('#txtSalesInvoiceDate').val()
        }),
        dataType: "json",
        success: function (response) {
          
            setTimeout(function () {


                hideLoader();
                alertify.success('Sales Order Invoice added successfully');
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
    var grandTotalGST = 0;
    var centralTaxValue = 0;
    var stateTaxValue = 0;
    var cessTaxValue = 0;

    var centralTaxPercent = 0;
    var stateTaxPercent = 0;
    var cessTaxPercent = 0;
    $('#tbody_SalesOrderDetails tr').each(function () {
        if ($(this).find('.rowCheckbox').is(':checked')) {
            centralTaxPercent = parseFloat($(this).find('.hdnCentralTaxPercent ').val());
            stateTaxPercent = parseFloat($(this).find('.hdnStateTaxPercent ').val());
            cessTaxPercent = parseFloat($(this).find('.hdnCessPercent ').val());

            if (isNaN(centralTaxPercent)) centralTaxPercent = 0;
            if (isNaN(stateTaxPercent)) stateTaxPercent = 0;
            if (isNaN(cessTaxPercent)) cessTaxPercent = 0;
            var amount = parseFloat($(this).find('.amount').text());
            centralTaxValue += (amount * (centralTaxPercent / 100));
            stateTaxValue += (amount * (stateTaxPercent / 100));
            cessTaxValue += (amount * (cessTaxPercent / 100));
            grandTotal += parseFloat($(this).find('.amount').text());
        }
    });
    grandTotalGST = centralTaxValue + stateTaxValue + cessTaxValue;
    grandTotal = grandTotal + parseFloat($('#txtDeliveryCharges').val())
    $('#txtNetGST').val(grandTotalGST.toFixed(2));
    $('#txtCentralTax').val(centralTaxValue.toFixed(2));
    $('#txtStateTax').val(stateTaxValue.toFixed(2));
    $('#txtTotalAmount').val(grandTotal);
   // $('#txtOutstandingAmount').val(amount);
}

function GenerateOrderID() {
    if ($('#txtSalesInvoiceDate').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfSdSalesOrderInvoice.aspx/GenerateOrderID',
            data: JSON.stringify({
                "SalesInvoiceDate": $('#txtSalesInvoiceDate').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                $('#txtSalesInvoiceId').val(data[0].SalesInvoiceId);


            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        $('#txtSalesInvoiceId').val('');
    }
}

function ViewSalesOrderList() {
    $('#divDataList').show();
    $('#divDataEntry').hide();
    $('#divDataEntryDetails').hide();
    $('#previewBtn').hide();
    // $('#divSalesOrderDetails').hide();
    $('#saveDataBtn').hide();
    BindSalesOrderInvoiceMasterList();
}
function ClearAll() {
    $('#tbody_SalesOrderDetails tr').remove();
    $('#txtSalesInvoiceId').val('');
    $('#hdnCustomerId').val('');
      $('#txtTotalAmount').val('0');
    $('#txtOutstandingAmount').val('0');
    $('#txtDeliveryCharges').val('0');
    
      $('#txtCustomer').val('');
    $('#txtSalesInvoiceDate').val('');
    $('#txtCustomer').val('');
    $('#txtNetGST').prop('disabled', false).val('0').prop('disabled', true);
    $('#txtCentralTax').prop('disabled', false).val('0').prop('disabled', true);
    $('#txtStateTax').prop('disabled', false).val('0').prop('disabled', true);
    $('#txtSalesInvoiceDate').val(getCurrentDate());
    $('#ddlSalesOrderd').select2('destroy');
    $('#ddlSalesOrderd').html('<option value="">-Select Customer-</option>');
    $('#ddlSalesOrderd').select2();
    BindSalesOrderDropdown();
    GenerateOrderID();
    
}

function CreateData() {
    showLoader();
    //  $('#divEmpJobList').hide();
    $('#divDataList').hide();
    $('#divDataEntryDetails').hide();
    $('#previewBtn').hide();
    //  $('#divDataItemsView').hide();
    $('#divDataEntry').show();
    $('#saveDataBtn').show();

    ClearAll();
    hideLoader()
}
function FetchSalesOrderMasterDetails(id) {



    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrderInvoice.aspx/FetchSalesOrderInvoiceMasterDetails',
        data: JSON.stringify({
            "SalesInvoiceId": id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {

            var data = JSON.parse(response.d);
            $('#dispSalesOrderId').val(data.SalesQuotationOrderMastertInfo.SalesOrderId);
            $('#dispCustomer').val(data.SalesQuotationOrderMastertInfo.CustomerName + " " + data.SalesQuotationOrderMastertInfo.Mobile)
            $('#dispSalesInvoiceDate').val(data.SalesQuotationOrderMastertInfo.formattedsalesInvoiceDate);
            $('#dispSalesInvoiceId').val(data.SalesQuotationOrderMastertInfo.SalesInvoiceId);
            $('#dispTotalAmount').val(data.SalesQuotationOrderMastertInfo.TotalAmount);
            $('#dispOutstandingAmount').val(data.SalesQuotationOrderMastertInfo.OutstandingAmount);
            $('#dispAdvance').val(data.SalesQuotationOrderMastertInfo.Advance);
            $('#dispPaymentComplete').val(data.SalesQuotationOrderMastertInfo.PaymentComplete);
            $('#dispDeliveryCharges').val(data.SalesQuotationOrderMastertInfo.DeliveryCharges);
           
            var centralTaxValue = 0;
            var stateTaxValue = 0;
            var cessTaxValue = 0;

            var centralTaxPercent = 0;
            var stateTaxPercent = 0;
            var cessTaxPercent = 0;
            var NetGST = 0;

         


            var html = '';
            for (var i = 0; i < data.SalesOrderInvoiceItems[0].Table.length; i++) {
                html = html + '<tr>'
                    + '<td class="materialID" style="display:none">' + data.SalesOrderInvoiceItems[0].Table[i].MaterialId + '</td>'

                    + '<td class="materialName">' + data.SalesOrderInvoiceItems[0].Table[i].MaterialName + '</td>'
                    + '<td class="Qty">' + data.SalesOrderInvoiceItems[0].Table[i].Qty + '</td>'
                    + '<td class="UnitMeasure">' + data.SalesOrderInvoiceItems[0].Table[i].UnitMesure + '</td>'
                    + '<td class="Package">' + data.SalesOrderInvoiceItems[0].Table[i].Packaging + '</td>'
                    + '<td class="PackageId" style="display:none">' + data.SalesOrderInvoiceItems[0].Table[i].PackageId + '</td>'
                    + '<td class="Rate">' + data.SalesOrderInvoiceItems[0].Table[i].UnitPrice + '</td>'
                    + '<td class="GST">' + data.SalesOrderInvoiceItems[0].Table[i].Tax + '</td>'
                    + '<td class="amount">' + data.SalesOrderInvoiceItems[0].Table[i].SubTotal + '</td></tr>';
                centralTaxPercent = parseFloat(data.SalesOrderInvoiceItems[0].Table[i].CentralTaxPercent);
                stateTaxPercent = parseFloat(data.SalesOrderInvoiceItems[0].Table[i].StateTaxPercent);
                cessTaxPercent = parseFloat(data.SalesOrderInvoiceItems[0].Table[i].CessPercent);
                var amount = parseFloat(data.SalesOrderInvoiceItems[0].Table[i].SubTotal);

                centralTaxValue += (amount * (centralTaxPercent / 100));
                stateTaxValue += (amount * (stateTaxPercent / 100));
                cessTaxValue += (amount * (cessTaxPercent / 100));

            }
            NetGST = centralTaxValue + stateTaxValue + cessTaxValue;
            $('#dispNetGST').val(NetGST);
            $('#dispCentralTax').val(centralTaxValue);
            $('#dispStateTax').val(stateTaxValue);




            $('#disptbody_SalesOrderDetails').html(html);
            $('#divDataList').hide();
            $('#previewBtn').show();
            
            $('#divDataEntry').hide();
            $('#saveDataBtn').hide();
            $('#divDataEntryDetails').show();


        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}

// Function to handle numeric input
function checkInputGiven(event) {
    var value = event.target.value;
    if (/^\d\.$/.test(value)) { // Checks if input is a single digit followed by a dot
        event.target.value = value.charAt(0); // Sets the value to the single digit
    }
    // Allow focus to change
    $(event.target).trigger('focusout');
}
function handleNumericInput(event) {
    // Get the input element
    var inputElement = event.target;

    // Remove non-numeric characters (except decimal point)
    var numericValue = inputElement.value.replace(/[^\d.]/g, '');

    // Handle multiple decimal points
    numericValue = numericValue.replace(/(\..*)\./g, '$1');

    // Limit to two decimal places
    numericValue = numericValue.replace(/(\.\d{2})\d+$/g, '$1');

    // If the input starts with a decimal point, add a leading zero
    if (numericValue.charAt(0) === '.') {
        numericValue = '0' + numericValue;
    }

    // Set the default value to 0 if the input is empty
    if (numericValue === '') {
        numericValue = '0';
    }

    // Handle leading zeros
    if (numericValue.length > 1 && numericValue.charAt(0) === '0' && numericValue.charAt(1) !== '.') {
        numericValue = numericValue.slice(1); // Remove leading zero
    }

    // Update the input value
    inputElement.value = numericValue;
}


function PrintPreview() {
    //showLoader();

    //// Call the server-side method to get the PDF content
    //$.ajax({
    //    type: 'POST',
    //    url: 'wfSdSalesOrderInvoice.aspx/GetPdfContent',
    //    contentType: 'application/json; charset=utf-8',
    //    data: JSON.stringify({
    //        "SalesInvoiceId": $('#dispSalesInvoiceId').val()
    //    }),
    //    dataType: 'json',
    //    success: function (response) {
    //        setTimeout(function () {
    //            hideLoader();


    //            // Display the PDF content in the modal
    //            $('#pdfPreview').attr('src', 'data:application/pdf;base64,' + response.d);
    //            $('#pdfModal').modal('show');
    //            $('.modal-backdrop').remove();
    //        }, 1000); // Hide loader after 3 seconds

    //    },
    //    error: function (xhr, status, error) {
    //        console.log('Error fetching PDF:', error);
    //    }
    //});

    window.open('wfSdSalesOrderInvoice_display.aspx?id=' + $('#dispSalesInvoiceId').val(), "_blank");

}

function ClosePDFModal() {
    $('#pdfModal').modal('hide');
}