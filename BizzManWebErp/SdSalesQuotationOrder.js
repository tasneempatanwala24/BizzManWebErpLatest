$(document).ready(function () {
    $("#addRowBtn,#saveDataBtn,.preventDefault").click(function (event) {
        event.preventDefault();
    });

    $('#ddlQuotationId').select2();

   

    $(".delete-row").click(function (event) {
        event.preventDefault();
    });
    // Initialize Bootstrap Datepicker
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
        startDate: '0d' // Restrict to the current date and future dates
    });

    BindQuotationDropdown();
   // fetchDataList();
 

});


function BindQuotationDropdown() {
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
            var abranch = '';
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                abranch = abranch + "<option value='" + JSON.parse(response.d)[i].Quotationid + "'>" + JSON.parse(response.d)[i].Quotationid  + "</option>";
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
    if ($('#ddlQuotationId').val() != '') {
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
                $('#txtCustomer').val(data[0].CustomerName + " " + data[0].Mobile);
                $('#txtQuotationDate').val(data[0].QuotationDate);
              

            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        ClearAll();
    }
}
function GenerateOrderID() {
    if ($('#orderDate').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wSdSalesQuotationMaster.aspx/GenerateOrderID',
            data: JSON.stringify({
                "OrderDate": $('#orderDate').val()
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


function ClearAll() {
    //$('#dataTable tbody tr').remove();
    //$('#txtQuotation').val('');
    //$('#quotationDate').val('');
    //$('#txtClientAddress').val('');
    //$('#txtContactNumber').val('');
    //$('#txtEmail').val('');
    //$('#notes').val('');
    //$('#terms').val('');
    //$('#ShippingCharges').val('0')
    //toggleTfootVisibility();
    //$('#ddlClientName').val('').trigger('change');;
}