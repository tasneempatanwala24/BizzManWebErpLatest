$(document).ready(function () {
    $("button").click(function (event) {
        event.preventDefault();
    });
    $('#ddlVendor').select2();
    BindVendorDropdown();
    BindBranchDropdown();
    BindDepartmentDropdown();
    BindMaterialPurchaseOrderList();
    BindMaterialMasterDropdown();

    $(".dat").on("change", function () {
        this.setAttribute(
            "data-date",
            moment(this.value, "YYYY-MM-DD")
                .format(this.getAttribute("data-date-format"))
        );
    }).trigger("change");
});
//=======================================
//=======================================
function BindDepartmentDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/DepartmentMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            var department = "<option value=''>-Select Department-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                department = department + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].DeptName + "</option>";
            }
            $('#ddlDepartment').append(department);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}
//===========================
//============================


//===========================
//=============================
function BindBranchDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/BranchMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            var branch = "<option value=''>-Select Branch-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                branch = branch + "<option value='" + JSON.parse(response.d)[i].BranchCode + "'>" + JSON.parse(response.d)[i].BranchName + "</option>";
            }
            $('#ddlBranch').append(branch);
            // $('#ddlBankBranch').append(branch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}




//================================
//==================================


function BindVendorDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/VendorList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlVendor').select2('destroy');
            $('#ddlVendor').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select Vendor-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].VendorName + "</option>";
            }
            $('#ddlVendor').append(req);
            $('#ddlVendor').select2();
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });


}




function CreateMaterialPurchaseOrder() {
    $('#divMaterialPurchaseOrderList').hide();
    $('#divMaterialPurchaseOrderEntry').show();
    $('#divSalesOrderDetails').show();
    $('#btnSave').show();
    $('#btnExport').hide();
    $('#previewBtn').hide();
    
    $('#txtCreatedBy').val($('#ContentPlaceHolder1_loginuser').val());
    ClearAll();

}

function ViewMaterialPurchaseOrderList() {
    $('#divMaterialPurchaseOrderList').show();
    $('#divMaterialPurchaseOrderEntry').hide();
    $('#divSalesOrderDetails').hide();
    $('#previewBtn').hide();
    $('#divMaterialPurchaseOrderMasterList').hide();
    $('#divMaterialPurchaseOrderMasterDetails').hide();
    $('#btnSave').hide();
    $('#btnExport').show();
    BindMaterialPurchaseOrderList();
}



function ClearAll() {
    $('#tbody_MaterialPurchaseOrderMasterList').html('');
    $('#tbody_MaterialPurchaseOrderMasterDetails').html('');
    $('#tbody_SalesOrderDetails').children('tr:not(:first)').remove();
    $('#ddlVendor').select2('destroy');
    $('#ddlVendor').val('');
    $('#ddlVendor').select2();
    $('#txtEntryDate').val('');
    $('#txtID').val('');
    $('#txtDeadlineDate').val('');
    $('#txtReceiptDate').val('');
    $('#txtPaymentTerm').val('');
    $('#txtPurchaseAgreement').val('');
    $('#txtQuotationNo').val('');
    $('#ddlBranch').val('');
    $('#ddlDepartment').val('');


    $('#ddlMaterialName').val('');
    $('#txtMaterialQty').val('');
    $('#txtMaterialUnitMeasure').val('');
    $('#txtMaterialRate').val('');
    $('#txtMaterialTotalAmount').val('');
    //  $('#ddlPackage').html("<option value=''>-Select Package-</option>");
    $('#txtDesciption').val('');
    // $('#txtMaterialDiscount').val('0');
    $('#txtMaterialStock').val('');
    $('#previewBtn').hide();

    $('#chkAskConfirm').prop('checked', false);
}


function BindMaterialPurchaseOrderList() {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/FetchMaterialPurchaseOrderList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            setTimeout(function () {
                hideLoader();
                $('#tblMaterialPurchaseOrderList').DataTable().clear();
                $('#tblMaterialPurchaseOrderList').DataTable().destroy();
                $('#tbody_MaterialPurchaseOrder_List').html('');

                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html = html + '<tr><td><input type="checkbox" class="editor-active chk_purchase_order_list"></td><td  onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + data[i].Id + '</td><td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + data[i].VendorName + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].OrderEntryDate != undefined ? data[i].OrderEntryDate : '') + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].OrderDeadlineDate != undefined ? data[i].OrderDeadlineDate : '') + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + data[i].ReceiptDate + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].BranchName != undefined ? data[i].BranchName : '') + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].DeptName != undefined ? data[i].DeptName : '') + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].PaymentTerm != undefined ? data[i].PaymentTerm : '') + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].PurchaseAgreement != undefined ? data[i].PurchaseAgreement : '') + '</td>'
                        + '<td onclick="FetchMaterialPurchaseOrderDetails(\'' + data[i].Id + '\');">' + (data[i].QuotationNo != undefined ? data[i].QuotationNo : '') + '</td>'
                        + '<td><a onclick="DeleteMaterialPurchaseOrder(\'' + data[i].Id + '\');" style="cursor:pointer;"><i class="fa fa-trash" aria-hidden="true"></i></a></td></tr>';
                }
                $('#tbody_MaterialPurchaseOrder_List').html(html);
                // $('#tblMaterialPurchaseOrderList').DataTable();

                var d = new Date();
                var table = $('#tblMaterialPurchaseOrderList').DataTable({
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

                $('#example-select-all').on('click', function () {
                    // Check/uncheck all checkboxes in the table
                    var rows = table.rows({ 'search': 'applied' }).nodes();
                    $('input[type="checkbox"]', rows).prop('checked', this.checked);


                });

                $('#tblMaterialPurchaseOrderList tbody').on('change', 'input[type="checkbox"]', function () {
                    // If checkbox is not checked

                    if (!this.checked) {
                        var el = $('#example-select-all').get(0);
                        // If "Select all" control is checked and has 'indeterminate' property
                        if (el && el.checked && ('indeterminate' in el)) {
                            // Set visual state of "Select all" control 
                            // as 'indeterminate'
                            el.indeterminate = true;
                        }
                    }



                });
            }, 1000); // Hide loader after 3 seconds


           



        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}

//function AddMaterialPurchaseOrder() {
//    var purchaseOrderDetails = '';
//    var chk = 0;
//    var AskConfirm = 'N';
//    $('#tbody_MaterialPurchaseOrderMasterDetails tr').each(function (index1, tr) {
//        chk = 0;
//        $(tr).find('td').each(function (index, td) {
//            if (index == 0) {
//                if ($($(td).find('input:checkbox')[0]).is(":checked")) {
//                    chk = 1;
//                }
//            }

//            if (index == 1) {
//                if (chk == 1) {
//                    if (purchaseOrderDetails == '') {
//                        purchaseOrderDetails = td.outerText;
//                    }
//                    else {
//                        purchaseOrderDetails = purchaseOrderDetails + ',' + td.outerText;
//                    }
//                }
//            }

//        });
//    });

//    if ($('#chkAskConfirm').is(":checked")) {
//        AskConfirm = 'Y';
//    }

//    if ($('#txtEntryDate').val() != '') {
//        if ($('#ddlVendor').val() != '') {
//            if ($('#txtDeadlineDate').val() != '') {
//                if ($('#txtReceiptDate').val() != '') {
//                    if ($('#ddlBranch').val() != '') {
//                        if ($('#ddlDepartment').val() != '') {
//                            if (purchaseOrderDetails != '') {
//                                $.ajax({
//                                    type: "POST",
//                                    url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/AddMaterialPurchaseOrder',
//                                    data: JSON.stringify({
//                                        "OrderID": $('#txtID').val(),
//                                        "EntryDate": $('#txtEntryDate').val(),
//                                        "Vendor": $('#ddlVendor').val(),
//                                        "DeadlineDate": $('#txtDeadlineDate').val(),
//                                        "ReceiptDate": $('#txtReceiptDate').val(),
//                                        "PurchaseOrderDetails": purchaseOrderDetails,
//                                        "AskConfirm": AskConfirm,
//                                        "PaymentTerm": $('#txtPaymentTerm').val(),
//                                        "PurchaseAgreement": $('#txtPurchaseAgreement').val(),
//                                        "QuotationNo": $('#txtQuotationNo').val(),
//                                        "BranchCode": $('#ddlBranch').val(),
//                                        "DepartmentId": $('#ddlDepartment').val(),
//                                        "LoginUser": $('#ContentPlaceHolder1_loginuser').val()
//                                    }),
//                                    contentType: "application/json; charset=utf-8",
//                                    dataType: "json",
//                                    beforeSend: function () {

//                                    },
//                                    success: function (response) {
//                                        if ($('#txtID').val() == '') {
//                                            alertify.success('Material purchase order details added successfully');
//                                            ClearAll();
//                                        }
//                                        else {
//                                            alertify.success('Material purchase order details updated successfully');
//                                        }
//                                    },
//                                    complete: function () {

//                                    },
//                                    failure: function (jqXHR, textStatus, errorThrown) {

//                                    }
//                                });
//                            }
//                            else {
//                                alertify.error('Please select purchase quotation master data and detail data');
//                            }
//                        }
//                        else {
//                            alertify.error('Please select any department');
//                        }
//                    }
//                    else {
//                        alertify.error('Please select any branch');
//                    }
//                }
//                else {
//                    alertify.error('Please enter receipt date');
//                }
//            }
//            else {
//                alertify.error('Please enter deadline date');
//            }
//        }
//        else {
//            alertify.error('Please select any vendor');
//        }
//    }
//    else {
//        alertify.error('Please enter entry date');
//    }
//}



function AddMaterialPurchaseOrder() {
    if ($('#txtEntryDate').val() == '') {
        alertify.error('Please enter entry date');
        return;
    }
    else if ($('#ddlVendor').val() == '') {
        alertify.error('Please select any vendor');
        return;
    }
    else if ($('#txtDeadlineDate').val() == '') {
        alertify.error('Please enter deadline date');
        return;
    }
    else if ($('#txtReceiptDate').val() == '') {
        alertify.error('Please enter receipt date');
        return;
    }
    else if ($('#ddlBranch').val() == '') {
        alertify.error('Please select any branch');
        return;
    }
    else if ($('#ddlDepartment').val() == '') {
        alertify.error('Please select any department');
        return;
    }
    var AskConfirm = 'N';
    if ($('#chkAskConfirm').is(":checked")) {
        AskConfirm = 'Y';
    }
    var hasRows = $('#tbody_SalesOrderDetails tr').length > 1;
    if (!hasRows) {
        alertify.error('Please add Purchase Order Lines');
        return;
    }
    showLoader();
    var data = [];
    $("#tbody_SalesOrderDetails tr").each(function (i) {
        if (i > 0) {
            var materialID = $(this)[0].cells[0].innerText;
            var Qty = $(this)[0].cells[3].innerText;
            var UnitMeasure = $(this)[0].cells[4].innerText;
            var Rate = $(this)[0].cells[5].innerText;
         //   var GST = $(this)[0].cells[9].innerText;
         //   var discount = $(this)[0].cells[8].innerText;
            var amount = $(this)[0].cells[6].innerText;
          //  var packageId = $(this)[0].cells[6].innerText;
            var description = $(this)[0].cells[7].innerText;
            data.push({ ItemID: materialID, Quantity: Qty, Rate: Rate, UnitMeasure: UnitMeasure, Amount: amount, Description: description});

        }




    });

    // Send data to server using AJAX
    $.ajax({
        type: "POST",
        url: "wfMmMaterialPurchaseOrderDirectEntry.aspx/AddMaterialPurchaseOrder", // Adjust the URL based on your setup
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            data: data,
            "OrderID": $('#txtID').val(),
            "EntryDate": $('#txtEntryDate').val(),
            "Vendor": $('#ddlVendor').val(),
            "DeadlineDate": $('#txtDeadlineDate').val(),
            "ReceiptDate": $('#txtReceiptDate').val(),
            "AskConfirm": AskConfirm,
            "PaymentTerm": $('#txtPaymentTerm').val(),
            "PurchaseAgreement": $('#txtPurchaseAgreement').val(),
            "QuotationNo": $('#txtQuotationNo').val(),
            "BranchCode": $('#ddlBranch').val(),
            "DepartmentId": $('#ddlDepartment').val(),
            "LoginUser": $('#ContentPlaceHolder1_loginuser').val()
        }),
        dataType: "json",
        success: function (response) {


            setTimeout(function () {


                hideLoader();
                alertify.success('Sales Order details added successfully');
                ClearAll();
            }, 1000); // Hide loader after 3 seconds
        },
        error: function (error) {
            console.log(error);
            alertify.error("Error saving data. Please try again.");
        }
    });
}



function DeleteMaterialPurchaseOrder(id) {
    alertify.confirm('Confirm Material Purchase Order Delete', 'Are you sure, you want to delete material purchase order entry ?', function () {
        $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/DeleteMaterialPurchaseOrder',
            data: JSON.stringify({
                "id": id
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                alertify.success('Material purchase order details deleted successfully');
                BindMaterialPurchaseOrderList();

            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
        , function () { });
}




function FetchMaterialPurchaseOrderDetails(id) {
    ClearAll();
    $('#btnExport').hide();
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/FetchMaterialPurchaseOrderDetails',
        data: JSON.stringify({
            "id": id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            $('#txtID').val(JSON.parse(response.d)[0].Id);
            $('#ddlVendor').select2('destroy');
            $('#ddlVendor').val(JSON.parse(response.d)[0].VendoreId);
            $('#ddlVendor').select2();
            $('#txtPaymentTerm').val(JSON.parse(response.d)[0].PaymentTerm);
            $('#txtPurchaseAgreement').val(JSON.parse(response.d)[0].PurchaseAgreement);
            $('#txtQuotationNo').val(JSON.parse(response.d)[0].QuotationNo);
            $('#ddlBranch').val(JSON.parse(response.d)[0].BranchCode);
            $('#ddlDepartment').val(JSON.parse(response.d)[0].DepartmentId);

            if (JSON.parse(response.d)[0].AskConfirmation == 'Y') {
                $('#chkAskConfirm').prop('checked', true);
            }
            var dt = new Date(JSON.parse(response.d)[0].OrderEntryDate);
            document.getElementById("txtEntryDate").valueAsDate = dt;

            var dt1 = new Date(JSON.parse(response.d)[0].OrderDeadlineDate);
            document.getElementById("txtDeadlineDate").valueAsDate = dt1;

            var dt2 = new Date(JSON.parse(response.d)[0].ReceiptDate);
            document.getElementById("txtReceiptDate").valueAsDate = dt2;

            FetchMaterialPurchaseOrderDetailsList(id);
            $('#divMaterialPurchaseOrderList').hide();
            $('#divSalesOrderDetails').show();
            $('#divMaterialPurchaseOrderEntry').show();
            $('#btnSave').show();
            $('#previewBtn').show();
            hideLoader();
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}





function FetchMaterialPurchaseOrderDetailsList(id) {
    $('#tbody_SalesOrderDetails').children('tr:not(:first)').remove();

    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/FetchMaterialPurchaseOrderDetailsList',
        data: JSON.stringify({
            "id": id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);

            var html = '';
            for (var i = 0; i < data.length; i++) {
                $('#tbody_SalesOrderDetails').append('<tr><td style="display: none;">' + data[i].MaterialMasterId + '</td>'
                    + '<td>' + (data[i].MaterialName != undefined ? data[i].MaterialName : "") + '</td>'
                    + '<td>' + (data[i].Stock != undefined ? data[i].Stock : "") + '</td>'
                    + '<td>' + (data[i].QtyOrder != undefined ? data[i].QtyOrder : "") + '</td>'
                    + '<td>' + (data[i].UnitMesure != undefined ? data[i].UnitMesure : "") + '</td>'
                   // + '<td>' + (data[i].Packaging != undefined ? data[i].Packaging : "") + '</td>'
                  //  + '<td style="display: none;">' + (data[i].PackageId != undefined ? data[i].PackageId : "") + '</td>'
                    + '<td>' + (data[i].UnitPrice != undefined ? data[i].UnitPrice : "") + '</td>'
                   // + '<td>' + (data[i].DiscountPercent != undefined ? data[i].DiscountPercent : "") + '</td>'
                  // + '<td>' + (data[i].Tax != undefined ? data[i].Tax : "") + '</td>'
                    + '<td>' + (data[i].TotalAmt != undefined ? data[i].TotalAmt : "") + '</td>'
                    + '<td>' + (data[i].Description != undefined ? data[i].Description : "") + '</td>'
                    + '<td><a onclick="DeleteSalesOrderDetailEntry(this);" style="cursor:pointer;"><i class="fa fa-trash" aria-hidden="true"></i></a></td>'
                    + '</tr>');
            }




        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function DownloadFile() {
    
    var chk = 0;
    var orderid = '';
    $('#tbody_MaterialPurchaseOrder_List tr').each(function (index1, tr) {
        chk = 0;
        $(tr).find('td').each(function (index, td) {
            if (index == 0) {
                if ($(td.children[0]).is(':checked')) {
                    chk = 1;
                }
                else {
                    chk = 0;
                }
            }

            if (index == 1) {
                if (chk == 1) {
                    if (orderid == '') {
                        orderid = td.outerText;
                    }
                    else {
                        orderid = orderid + ',' + td.outerText;
                    }
                }
            }
        });
    });

    if (orderid != '') {
        showLoader();
        $.ajax({
            type: "POST",
            url: "wfMmMaterialPurchaseOrderDirectEntry.aspx/FetchMaterialPurchaseOrderListDownload",
            data: JSON.stringify({
                "orderid": orderid
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                var d = new Date();
                var fileName = 'MaterilaPurchaseOrder_' + d.toDateString() + '.xlsx';
                //Convert Base64 string to Byte Array.
                var bytes = Base64ToBytes(r.d);

                //Convert Byte Array to BLOB.
                var blob = new Blob([bytes], { type: "application/octetstream" });

                //Check the Browser type and download the File.
                var isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    var url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob);
                    var a = $("<a />");
                    a.attr("download", fileName);
                    a.attr("href", link);
                    $("body").append(a);
                    a[0].click();
                    $("body").remove(a);
                    hideLoader();
                }
            }
        });
    }
    else {
        alertify.error('Please select any record');
    }
}

function Base64ToBytes(base64) {
    var s = window.atob(base64);
    var bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) {
        bytes[i] = s.charCodeAt(i);
    }
    return bytes;
}


function FetchMaterialDetails() {
    if ($('#ddlBranch').val() == '') {
        alertify.error('Please Select Branch');
        $('#ddlMaterialName').val('');
        return;
    }

    if ($('#ddlMaterialName').val() != '' && $('#ddlBranch').val() != '') {
        var found = false;
        $('#tbody_SalesOrderDetails tr').each(function (i) {
            if (i > 0) {
                var materialid = parseFloat($(this)[0].cells[0].innerText)
                if (materialid == $('#ddlMaterialName').val()) {
                    found = true;

                }
            }

        });
        if (found) {
            alertify.error('Material already added');
            $('#ddlMaterialName').val('');
            return;
        }
        showLoader();
        $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/FetchMaterialDetails',
            data: JSON.stringify({
                "MaterialId": $('#ddlMaterialName').val(),
                "BranchCode": $('#ddlBranch').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);



                setTimeout(function () {

                    $('#txtMaterialUnitMeasure').val(data[0].UnitMesure);
                    $('#txtMaterialRate').val(data[0].MRP);
                    $('#txtMaterialStock').val(data[0].Stock);
                   
                    hideLoader();
                }, 1000); // Hide loader after 3 seconds
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}

function SaveSalesOrderDetails() {

    if ($('#ddlMaterialName').val() != '') {



        if ($('#txtMaterialQty').val() != '') {
            //if ($('#ddlPackage').val() != '') {
            $('#tbody_SalesOrderDetails').append('<tr><td style="display: none;">' + $('#ddlMaterialName').val() + '</td>'
                + '<td>' + $("#ddlMaterialName option:selected").text() + '</td>'
                + '<td>' + $("#txtMaterialStock").val() + '</td>'
                + '<td>' + $("#txtMaterialQty").val() + '</td>'
                + '<td>' + $("#txtMaterialUnitMeasure").val() + '</td>'
                //+ '<td>' + ($("#ddlPackage").val() != "" ? $("#ddlPackage option:selected").text() : "") + '</td>'
                //+ '<td style="display: none;">' + ($("#ddlPackage").val() != "" ? $("#ddlPackage").val() : "0") + '</td>'
                + '<td>' + $("#txtMaterialRate").val() + '</td>'
                //+ '<td>' + $("#txtMaterialDiscount").val() + '</td>'
                //+ '<td>' + $("#txtMaterialTax").val() + '</td>'
                + '<td>' + $("#txtMaterialTotalAmount").val() + '</td>'
            + '<td>' + $("#txtDesciption").val() + '</td>'
                + '<td><a onclick="DeleteSalesOrderDetailEntry(this);" style="cursor:pointer;"><i class="fa fa-trash" aria-hidden="true"></i></a></td>'
                + '</tr>');

          
            $('#ddlMaterialName').val('');
            $('#txtMaterialQty').val('');
            $('#txtMaterialUnitMeasure').val('');
            $('#txtMaterialRate').val('');
            $('#txtMaterialTotalAmount').val('');
          //  $('#ddlPackage').html("<option value=''>-Select Package-</option>");
            $('#txtDesciption').val('');
           // $('#txtMaterialDiscount').val('0');
            $('#txtMaterialStock').val('');
            //}
            //else {
            //    alertify.error('Please select any package');
            //}
        }
        else {
            alertify.error('Please enter material quantity');
        }
    }
    else {
        alertify.error('Please select any material name');
    }


}


function DeleteSalesOrderDetailEntry(ele) {
   

    $(ele.parentElement.parentElement).remove();
    //calculateGrandTotal();
}


function GenerateOrderID() {
    if ($('#txtEntryDate').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/GenerateOrderID',
            data: JSON.stringify({
                "OrderDate": $('#txtEntryDate').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                $('#txtID').val(data[0].Id);


            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        $('#txtID').val('');
    }
}

function BindMaterialMasterDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/MaterialMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlMaterialName').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select Material-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].MaterialName + "</option>";
            }
            $('#ddlMaterialName').append(req);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}


// Function to handle numeric input
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

function UpdateTotalAmount() {
    if ($('#txtMaterialQty').val() != '') {
        if ($('#ddlMaterialName').val() != '') {
            // var totalAmnt = parseFloat($('#txtMaterialRate').val()) * parseInt($('#txtMaterialQty').val());
            // totalAmnt = totalAmnt + ((totalAmnt * parseInt($('#txtMaterialTax').val())) / 100);
            /*  var amount = (qty * rate) * (1 - discount / 100) * (1 + gst / 100);*/

            var totalAmnt = (parseInt($('#txtMaterialQty').val()) * parseFloat($('#txtMaterialRate').val())) ;

            $('#txtMaterialTotalAmount').val(totalAmnt.toFixed(2));
        }
        else {
            $('#txtMaterialQty').val('');
            alertify.error('Please select any material first');
        }
    }
    else {
        $('#txtMaterialTotalAmount').val('');
    }
}   

function PrintPreview() {
    showLoader();

    // Call the server-side method to get the PDF content
    $.ajax({
        type: 'POST',
        url: 'wfMmMaterialPurchaseOrderDirectEntry.aspx/GetPdfContent',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            "SalesOrderId": $('#txtID').val()
        }),
        dataType: 'json',
        success: function (response) {
            setTimeout(function () {
                hideLoader();


                // Display the PDF content in the modal
                $('#pdfPreview').attr('src', 'data:application/pdf;base64,' + response.d);
                $('#pdfModal').modal('show');
                $('.modal-backdrop').remove();
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