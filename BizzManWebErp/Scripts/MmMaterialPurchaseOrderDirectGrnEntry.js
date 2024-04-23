$(document).ready(function () {
   
    $("button").click(function (event) {
        event.preventDefault();
    });
    $('#ddlVendor').select2();
    $('#ddlOrder').select2();
    $('#ddlActive').val('Y') 
    BindVendorDropdown();
    BindBranchDropdown();
    BindDepartmentDropdown();
    BindWarehouseDropdown();
    BindMaterialPurchaseGrnList();

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
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/DepartmentMasterList',
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
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/BranchMasterList',
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
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/VendorList',
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

function GenerateOrderID() {
    if ($('#txtEntryDate').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/GenerateOrderID',
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

function BindPurchaseOrderDropdown() {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/PurchaseOrderList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "VendorId": $('#ddlVendor').val()
        }),
        success: function (response) {
            $('#ddlOrder').select2('destroy');
            $('#ddlOrder').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select Order-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].Id + "</option>";
            }
            $('#ddlOrder').append(req);
            $('#ddlOrder').select2();
            hideLoader();
           
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });


}



//function FetchPurchaseOrderDetails() {
//    showLoader();
//    if ($('#ddlOrder').val() != '') {
//        FetchPurchaseOrderMasterDetails();
//        $.ajax({
//            type: "POST",
//            url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/FetchPurchaseOrderDetails',
//            data: JSON.stringify({
//                "OrderId": $('#ddlOrder').val()
//            }),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            beforeSend: function () {

//            },
//            success: function (response) {

//                var data = JSON.parse(response.d);
//                $('#txtDeadlineDate').val(data.PurchaseOrderMasterInfo.OrderDeadlineDate)
//                $('#txtReceiptDate').val(data.PurchaseOrderMasterInfo.ReceiptDate)
//                $('#txtPaymentTerm').val(data.PurchaseOrderMasterInfo.PaymentTerm)
//                $('#txtPurchaseAgreement').val(data.PurchaseOrderMasterInfo.PurchaseAgreement)
//                $('#ddlBranch').val(data.PurchaseOrderMasterInfo.BranchCode)
//                $('#ddlDepartment').val(data.PurchaseOrderMasterInfo.DepartmentId)
//                $('#txtQuotationNo').val(data.PurchaseOrderMasterInfo.QuotationNo)

//                $('#tbody_MaterialPurchaseOrderMasterDetails').html('');
//                var warehouseHtml = $('#td_warehouse').html();
//                var html = '';

//                //for (var i = 0; i < data.PurchaseItems[0].Table.length; i++) {
//                //    (function (index) {
//                //        BindMaterialPackagingDropdown(data.PurchaseItems[0].Table[index].MaterialMasterId, function () {
//                //            var packageeHtml = $('#td_package').html();
//                //            html = html + '<tr><td style="display:none;">' + data.PurchaseItems[0].Table[index].Id + '</td><td>' + data.PurchaseItems[0].Table[index].MaterialName + '</td>'
//                //                + '<td>' + (data.PurchaseItems[0].Table[index].QtyOrder != undefined ? data.PurchaseItems[0].Table[index].QtyOrder : '') + '</td>'
//                //                + '<td>' + (data.PurchaseItems[0].Table[index].UnitMesure != undefined ? data.PurchaseItems[0].Table[index].UnitMesure : '') + '</td>'
//                //                + '<td>' + (data.PurchaseItems[0].Table[index].QtyReceive != undefined ? data.PurchaseItems[0].Table[index].QtyReceive : '') + '</td>'
//                //                + '<td>' + (data.PurchaseItems[0].Table[index].BalanceQty != undefined ? data.PurchaseItems[0].Table[index].BalanceQty : '') + '</td>'
//                //                + '<td>' + (data.PurchaseItems[0].Table[index].UnitPrice != undefined ? data.PurchaseItems[0].Table[index].UnitPrice : '') + '</td>'

//                //                + '<td><input type="number" class="form-control RcvQty" onchange="CheckRecive(this)" oninput="handleNumericInput(event)"  value="' + (data.PurchaseItems[0].Table[index].BalanceQty != undefined ? data.PurchaseItems[0].Table[index].BalanceQty : '') + '" /></td>'
//                //                + '<td><input type="number" class="form-control RtrnQty"  value="0" onchange="CheckReturn(this)" oninput="handleNumericInput(event)" /></td>'
//                //                + '<td>' + packageeHtml + '</td > '
//                //                + '<td><input type="number" class="form-control PckgQty"  value="0"  oninput="handleNumericInput(event)" /></td>'

//                //                + '<td>' + warehouseHtml + '</td><td><input type="text" class="form-control descptn" /></td><td><input type="checkbox" class="editor-active"></td></tr>';

//                //            // Other HTML generation code
//                //        });
//                //    })(i);
//                //}

//                //html = '';

//                for (var i = 0; i < data.PurchaseItems[0].Table.length; i++) {
//                    BindMaterialPackagingDropdown(data.PurchaseItems[0].Table[i].MaterialMasterId, function (index) {
//                        var packageeHtml = $('#td_package').html();
//                        html = html + '<tr><td style="display:none;">' + data.PurchaseItems[0].Table[index].Id + '</td><td>' + data.PurchaseItems[0].Table[index].MaterialName + '</td>'
//                            + '<td>' + (data.PurchaseItems[0].Table[index].QtyOrder != undefined ? data.PurchaseItems[0].Table[index].QtyOrder : '') + '</td>'
//                            + '<td>' + (data.PurchaseItems[0].Table[index].UnitMesure != undefined ? data.PurchaseItems[0].Table[index].UnitMesure : '') + '</td>'
//                            + '<td>' + (data.PurchaseItems[0].Table[index].QtyReceive != undefined ? data.PurchaseItems[0].Table[index].QtyReceive : '') + '</td>'
//                            + '<td>' + (data.PurchaseItems[0].Table[index].BalanceQty != undefined ? data.PurchaseItems[0].Table[index].BalanceQty : '') + '</td>'
//                            // + '<td>' + (data.PurchaseItems[0].Table[index].UnitPrice != undefined ? data.PurchaseItems[0].Table[index].UnitPrice : '') + '</td>'
//                            + '<td><input type="text" class="form-control UnitPrice" style="width:80px" value="' + (data.PurchaseItems[0].Table[index].UnitPrice != undefined ? data.PurchaseItems[0].Table[index].UnitPrice : '') + '"   oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'

//                            + '<td><input type="text" class="form-control RcvQty" onchange="CheckRecive(this)" oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" value="' + (data.PurchaseItems[0].Table[index].BalanceQty != undefined ? data.PurchaseItems[0].Table[index].BalanceQty : '') + '" /></td>'
//                            + '<td><input type="text" class="form-control RtrnQty"  value="0" onchange="CheckReturn(this)" oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'
//                            + '<td>' + packageeHtml + '</td > '
//                            + '<td><input type="text" class="form-control PckgQty"  value="0"   oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'

//                            + '<td>' + warehouseHtml + '</td><td><input type="text" class="form-control descptn" /></td><td><input type="checkbox" class="editor-active"></td></tr>';


//                    },i);




//                }
//                $('#tbody_MaterialPurchaseOrderMasterDetails').html(html);
//                hideLoader();

//            },
//            complete: function () {

//            },
//            failure: function (jqXHR, textStatus, errorThrown) {

//            }
//        });
//    }
//    else {
//        alertify.error("Please select any order");
//    }
//}


function FetchPurchaseOrderDetails() {
    showLoader();
    if ($('#ddlOrder').val() != '') {
       $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/FetchPurchaseOrderDetails',
            data: JSON.stringify({
                "OrderId": $('#ddlOrder').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                var data = JSON.parse(response.d);
                $('#txtDeadlineDate').val(data.PurchaseOrderMasterInfo.OrderDeadlineDate)
                $('#txtReceiptDate').val(data.PurchaseOrderMasterInfo.ReceiptDate)
                $('#txtPaymentTerm').val(data.PurchaseOrderMasterInfo.PaymentTerm)
                $('#txtPurchaseAgreement').val(data.PurchaseOrderMasterInfo.PurchaseAgreement)
                $('#ddlBranch').val(data.PurchaseOrderMasterInfo.BranchCode)
                $('#ddlDepartment').val(data.PurchaseOrderMasterInfo.DepartmentId)
                $('#txtQuotationNo').val(data.PurchaseOrderMasterInfo.QuotationNo)
                $('#tbody_MaterialPurchaseOrderMasterDetails').html('');

                var warehouseHtml = $('#td_warehouse').html();
                var html = '';

                var promises = [];

                for (var i = 0; i < data.PurchaseItems[0].Table.length; i++) {
                    var promise = new Promise(function (resolve, reject) {
                        BindMaterialPackagingDropdown(data.PurchaseItems[0].Table[i].MaterialMasterId, function (index) {
                            var packageeHtml = $('#td_package').html();
                            html += '<tr><td style="display:none;">' + data.PurchaseItems[0].Table[index].Id + '</td><td>' + data.PurchaseItems[0].Table[index].MaterialName + '</td>'
                                + '<td>' + (data.PurchaseItems[0].Table[index].QtyOrder != undefined ? data.PurchaseItems[0].Table[index].QtyOrder : '') + '</td>'
                                + '<td>' + (data.PurchaseItems[0].Table[index].UnitMesure != undefined ? data.PurchaseItems[0].Table[index].UnitMesure : '') + '</td>'
                                + '<td>' + (data.PurchaseItems[0].Table[index].QtyReceive != undefined ? data.PurchaseItems[0].Table[index].QtyReceive : '') + '</td>'
                                + '<td>' + (data.PurchaseItems[0].Table[index].BalanceQty != undefined ? data.PurchaseItems[0].Table[index].BalanceQty : '') + '</td>'
                                + '<td><input type="text" class="form-control UnitPrice" style="width:80px" value="' + (data.PurchaseItems[0].Table[index].UnitPrice != undefined ? data.PurchaseItems[0].Table[index].UnitPrice : '') + '"   oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'
                                + '<td><input type="text" class="form-control RcvQty" onchange="CheckRecive(this)" oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" value="' + (data.PurchaseItems[0].Table[index].BalanceQty != undefined ? data.PurchaseItems[0].Table[index].BalanceQty : '') + '" /></td>'
                                + '<td><input type="text" class="form-control RtrnQty"  value="0" onchange="CheckReturn(this)" oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'
                                + '<td>' + packageeHtml + '</td > '
                                + '<td><input type="text" class="form-control PckgQty"  value="0"   oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'
                                + '<td>' + warehouseHtml + '</td><td><input type="text" class="form-control descptn" /></td><td><input type="checkbox" class="editor-active"></td></tr>';
                            resolve();
                        }, i);
                    });
                    promises.push(promise);
                }

                Promise.all(promises).then(function () {
                    $('#tbody_MaterialPurchaseOrderMasterDetails').html(html);
                    hideLoader();
                });
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    } else {
        alertify.error("Please select any order");
    }
}


function CheckRecive(ele)
{
    var GrnBalanceQty = parseFloat($(ele.parentElement.parentElement.children[5])[0].innerText);
    var RtrnQty = parseFloat($(ele.parentElement.parentElement.children[8].children[0]).val());
    var RcvQty = parseFloat($(ele).val());
    if ((RcvQty + RtrnQty) <= GrnBalanceQty && RcvQty >= 0 && RtrnQty>=0) {
              
            }
            else {
       
        $(ele.parentElement.parentElement.children[8].children[0]).val('0')
        $(ele).val('0');
        alertify.error("Invalid Recieve Qty");
            }
}

function CheckReturn(ele) {
    var GrnBalanceQty = parseFloat($(ele.parentElement.parentElement.children[5])[0].innerText);
    var RcvQty = parseFloat($(ele.parentElement.parentElement.children[7].children[0]).val());
    var RtrnQty = parseFloat($(ele).val());
    if ((RcvQty + RtrnQty) <= GrnBalanceQty && RcvQty >= 0 && RtrnQty >= 0) {

    }
    else {

        $(ele.parentElement.parentElement.children[7].children[0]).val('0')
        $(ele).val('0');
        alertify.error("Invalid Return Qty");
    }
}

// Function to handle numeric input
//function handleNumericInput(obj) {
//    // Get the input element
//    //var inputElement = event.target;

//   // var numericValue = inputElement.value;
//    var numericValue = obj.value;
//    //var numericValue = inputElement.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for decimal point
//    //numericValue = numericValue.replace(/^(\d*\.\d{0,2})\d*$/, '$1'); // Limit decimal places to two digits In this code:

//    if (isNaN(numericValue)) {
//        numericValue = '0';
//    }
//    if (numericValue.indexOf(".") > -1 && (numericValue.split('.')[1].length > 2)) {
//        numericValue=numericValue.substring(0, numericValue.length - 1);
//    }

//    // Handle leading zeros
//    if (numericValue.length > 1 && numericValue.charAt(0) === '0') {
//        numericValue = numericValue.slice(1); // Remove leading zero
//    }

//    // Set the default value to 0 if the input is empty
//    if (numericValue === '') {
//        numericValue = '0';
//    }

//    // Update the input value
//    // inputElement.value = numericValue;
//    obj.value=numericValue;
//}

function checkInputGiven(event) {
    var value = event.target.value;
    if (/^\d\.$/.test(value)) { // Checks if input is a single digit followed by a dot
        event.target.value = value.charAt(0); // Sets the value to the single digit
    }
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


function UpdateReceiveQty(ele) {
    var GrnBalanceQty = parseInt($(ele.parentElement.parentElement.children[5])[0].innerText);
    if ($(ele).val() != '') {
        if (parseInt($(ele).val()) < 0) {
            $(ele.parentElement.parentElement.children[7].children[0]).val(GrnBalanceQty);
            $(ele.parentElement.parentElement.children[8].children[0]).val('0');
        }
        else {
         
            var RtrnQty = parseInt($(ele).val());
            if (RtrnQty <= GrnBalanceQty) {
                $(ele.parentElement.parentElement.children[7].children[0]).val(GrnBalanceQty - RtrnQty);
            }
            else {
                $(ele.parentElement.parentElement.children[7].children[0]).val(GrnBalanceQty);
                $(ele.parentElement.parentElement.children[8].children[0]).val('0');
            }
        }
    }
    else {
        $(ele.parentElement.parentElement.children[7].children[0]).val(GrnBalanceQty);
        $(ele.parentElement.parentElement.children[8].children[0]).val('0');
    }
}



function CreateMaterialPurchaseGrn() {
    $('#divMaterialPurchaseGrnList').hide();
    $('#divMaterialPurchaseGrnDetailsList').hide();
    $('#divMaterialPurchaseGrnEntry').show();
    $('#divMaterialPurchaseOrderMasterDetails').show();
   $('#btnSave').show();
    $('#btnExport').hide();

    ClearAll();
}

function ViewMaterialPurchaseGrnList() {
    $('#divMaterialPurchaseGrnList').show();
    $('#divMaterialPurchaseGrnDetailsList').show();
    $('#divMaterialPurchaseGrnEntry').hide();
    $('#divMaterialPurchaseOrderMasterDetails').hide();
    $('#btnSave').hide();
    $('#btnExport').show();
    BindMaterialPurchaseGrnList();
}



function ClearAll() {
    $('#tbody_MaterialPurchaseOrderMasterDetails').html('');
    $('#ddlVendor').select2('destroy');
    $('#ddlVendor').val('');
    $('#ddlVendor').select2();
    $('#ddlOrder').select2('destroy');
    $('#ddlOrder').val('');
    $('#ddlOrder').select2();
    $('#ddlOrder').empty();
    $('#txtEntryDate').val('');
    $('#txtID').val('');
    $('#txtDeadlineDate').val('');
    $('#txtReceiptDate').val('');
    $('#txtPaymentTerm').val('');
    $('#txtPurchaseAgreement').val('');
    $('#txtQuotationNo').val('');
    $('#ddlBranch').val('');
    $('#ddlDepartment').val('');

    

}

function BindMaterialPurchaseGrnList() {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/FetchMaterialPurchaseGrnList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            hideLoader();
            var data = JSON.parse(response.d);
            $('#tblMaterialPurchaseGrnList').DataTable().clear();
            $('#tblMaterialPurchaseGrnList').DataTable().destroy();
            $('#tbody_MaterialPurchaseGrn_List').html('');

            var html = '';
            for (var i = 0; i < data.length; i++) {
                html = html + '<tr><td><input type="checkbox" class="editor-active chk_purchase_order_list"></td><td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + data[i].Id + '</td><td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + data[i].GrnEntryDate + '</td>'
                    + '<td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + (data[i].OrderId != undefined ? data[i].OrderId : '') + '</td>'
                    + '<td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + (data[i].GateInwardMasterId != undefined ? data[i].GateInwardMasterId : '') + '</td>'
                    + '<td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + (data[i].VendorName != undefined ? data[i].VendorName : '') + '</td>'
                    + '<td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + (data[i].BranchName != undefined ? data[i].BranchName : '') + '</td></tr>';
            }
            $('#tbody_MaterialPurchaseGrn_List').html(html);
            // $('#tblMaterialPurchaseOrderList').DataTable();

            var d = new Date();
            var table = $('#tblMaterialPurchaseGrnList').DataTable({
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

            $('#tbody_MaterialPurchaseGrn_List tbody').on('change', 'input[type="checkbox"]', function () {
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



        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}

function FetchMaterialPurchaseGrnDetails(id) {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/FetchMaterialPurchaseGrnDetails',
        data: JSON.stringify({
            "id": id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            $('#tblMaterialPurchaseGrnDetails').DataTable().clear();
            $('#tblMaterialPurchaseGrnDetails').DataTable().destroy();
            $('#tbody_MaterialPurchaseGrnDetails').html('');

            var html = '';
            for (var i = 0; i < data.length; i++) {
                html = html + '<tr><td>' + data[i].MaterialName + '</td>'
                    + '<td>' + (data[i].QtyOrder != undefined ? data[i].QtyOrder : '') + '</td>'
                    + '<td>' + (data[i].UnitMesure != undefined ? data[i].UnitMesure : '') + '</td>'
                    + '<td>' + (data[i].GateInwordQtyReceive != undefined ? data[i].GateInwordQtyReceive : '') + '</td>'
                    + '<td>' + (data[i].QtyStockEntry != undefined ? data[i].QtyStockEntry : '') + '</td>'
                    + '<td>' + (data[i].QtyReturn != undefined ? data[i].QtyReturn : '') + '</td>'
                    + '<td>' + (data[i].UnitPrice != undefined ? data[i].UnitPrice : '') + '</td>'
                    + '<td>' + (data[i].TotalAmt != undefined ? data[i].TotalAmt : '') + '</td>'
                    + '<td>' + (data[i].Packaging != undefined ? data[i].Packaging : '') + '</td>'
                    + '<td>' + (data[i].PackageQty != undefined ? data[i].PackageQty : '') + '</td>'
                    + '<td>' + (data[i].WareHouse != undefined ? data[i].WareHouse : '') + '</td></tr>';
            }
            $('#tbody_MaterialPurchaseGrnDetails').html(html);
            $('#tblMaterialPurchaseGrnDetails').DataTable();
            hideLoader();
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}


function BindWarehouseDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/WarehouseList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            // $('#ddlWarehouse').select2('destroy');
            $('#ddlWarehouse').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select Warehouse-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].Name + "</option>";
            }
            $('#ddlWarehouse').append(req);
            // $('#ddlWarehouse').select2();
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}


function BindMaterialPackagingDropdown(materialid,callback,index) {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/MaterialPackagingList',
        data: JSON.stringify({
            "materialid": materialid
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlPackage').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select Package-</option>";
            for (var j = 0; j < JSON.parse(response.d).length; j++) {
                req = req + "<option value='" + JSON.parse(response.d)[j].id + "'>" + JSON.parse(response.d)[j].Packaging + "</option>";
            }
            $('#ddlPackage').append(req);
            callback(index);
           
        },
        complete: function () {
          
        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });


}

function AddMaterialPurchaseOrderDirectGrnEntry() {
    if ($('#txtEntryDate').val() == '') {
        alertify.error('Please enter entry date');
        return;
    }
    else if ($('#ddlVendor').val() == '') {
        alertify.error('Please select any vendor');
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

    var hasRows = $('#tbody_MaterialPurchaseOrderMasterDetails tr').length > 0;
    if (!hasRows) {
        alertify.error('Please Select Purchase Order');
        return;
    }
    var found = false;
    // Iterate over each <tr> element
    $('#tbody_MaterialPurchaseOrderMasterDetails').find('tr').each(function () {
        // Find the select element with id 'ddlWarehouse' within this <tr>
        var warehouseSelect = $(this).find('#ddlWarehouse');

        // Check if the selected value of the warehouse dropdown is empty
        if (!warehouseSelect.val()) {
            // Set the flag to true if any warehouse is not selected
            found = true;
            // Break out of the loop since we've found at least one warehouse not selected
            return false;
        }

        var RcvQty = $(this).find('.RcvQty');

        // Check if the warehouse input value is empty
        if (RcvQty.val() === '') {
            // Set the flag to true if any warehouse is not selected
            found = true;
            // Break out of the loop since we've found at least one warehouse not selected
            return false;
        }

        var RtrnQty = $(this).find('.RtrnQty');

        // Check if the warehouse input value is empty
        if (RtrnQty.val() === '') {
            // Set the flag to true if any warehouse is not selected
            found = true;
            // Break out of the loop since we've found at least one warehouse not selected
            return false;
        }

        //var descptn = $(this).find('.descptn');

        //// Check if the warehouse input value is empty
        //if (descptn.val() === '') {
        //    // Set the flag to true if any warehouse is not selected
        //    found = true;
        //    // Break out of the loop since we've found at least one warehouse not selected
        //    return false;
        //}
    });



    // Check the flag value
    if (found) {
        // If the flag is true, it means at least one warehouse is not selected
        alertify.error('Please enter receive quantity,return quantity and warehouse on purchase details list');
        return;
    } 

    var data = [];
    $("#tbody_MaterialPurchaseOrderMasterDetails tr").each(function (i) {
      
            var materialID = $(this)[0].cells[0].innerText;
            var QtyOrder = $(this)[0].cells[2].innerText;
            var QtyRecieve = $(this).find('.RcvQty').val();//$(this)[0].cells[7].innerText;
            var QtyReturn = $(this).find('.RtrnQty').val();//$(this)[0].cells[8].innerText;
            var WareHouseId = $(this).find('#ddlWarehouse').val();
            var Description = $(this).find('.descptn').val();
        var PackageId = $(this).find('#ddlPackage').val();
        var PackageQuantity = $(this).find('.PckgQty').val()
        var Rate = $(this).find('.UnitPrice').val()
        data.push({ ItemID: materialID, Quantity: QtyOrder, QtyRecieve: QtyRecieve, QtyReturn: QtyReturn, WareHouseId: WareHouseId, Description: Description, PackageId: PackageId, PackageQuantity: PackageQuantity ,Rate:Rate});


    });
  
    showLoader();
    // Send data to server using AJAX
    $.ajax({
        type: "POST",
        url: "wfMmMaterialPurchaseOrderDirectGrnEntry.aspx/AddMaterialPurchaseOrderDirectGrnEntry", // Adjust the URL based on your setup
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            data: data,
            "GRNID": $('#txtID').val(),
            "PurchaseOrderId": $('#ddlOrder').val(),
            "EntryDate": $('#txtEntryDate').val(),
            "Vendor": $('#ddlVendor').val(),
              "BranchCode": $('#ddlBranch').val(),
            "Active": $('#ddlActive').val(),
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