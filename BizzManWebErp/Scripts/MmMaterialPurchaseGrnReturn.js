﻿$(document).ready(function () {

    $("button").click(function (event) {
        event.preventDefault();
    });
    $('#ddlVendor').select2();
    $('#ddlGRN').select2();
    BindVendorDropdown();
    BindBranchDropdown();
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

//============================


//===========================
//=============================
function BindBranchDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseGrnReturn.aspx/BranchMasterList',
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
        url: 'wfMmMaterialPurchaseGrnReturn.aspx/VendorList',
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
    if ($('#txtReturnDate').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseGrnReturn.aspx/GenerateOrderID',
            data: JSON.stringify({
                "ReturnDate": $('#txtReturnDate').val()
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
        url: 'wfMmMaterialPurchaseGrnReturn.aspx/PurchaseOrderGRNList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "VendorId": $('#ddlVendor').val()
        }),
        success: function (response) {
            $('#tbody_MaterialPurchaseOrderMasterDetails').html('');
            $('#ddlBranch').val('');
          
            $('#ddlGRN').select2('destroy');
            $('#ddlGRN').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select GRN-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].Id + "</option>";
            }
            $('#ddlGRN').append(req);
            $('#ddlGRN').select2();
            hideLoader();

        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });


}






function FetchPurchaseOrderDetails() {
    showLoader();
    if ($('#ddlGRN').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfMmMaterialPurchaseGrnReturn.aspx/FetchPurchaseOrderGRNDetails',
            data: JSON.stringify({
                "GRNId": $('#ddlGRN').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                 $('#ddlBranch').val('');
                var data = JSON.parse(response.d);
                 $('#ddlBranch').val(data.PurchaseOrderMasterInfo.BranchCode)
                $('#tbody_MaterialPurchaseOrderMasterDetails').html('');

                var warehouseHtml = $('#td_warehouse').html();
                var html = '';

                var promises = [];

                for (var index = 0; index < data.PurchaseItems[0].Table.length; index++) {
                 
                html += '<tr><td style="display:none;">' + data.PurchaseItems[0].Table[index].Id + '</td><td>' + data.PurchaseItems[0].Table[index].MaterialName + '</td>'
                    + '<td>' + (data.PurchaseItems[0].Table[index].QtyOrder != undefined ? data.PurchaseItems[0].Table[index].QtyOrder : '') + '</td>'
                    + '<td>' + (data.PurchaseItems[0].Table[index].UnitMesure != undefined ? data.PurchaseItems[0].Table[index].UnitMesure : '') + '</td>'
                    + '<td>' + (data.PurchaseItems[0].Table[index].QtyStockEntry != undefined ? data.PurchaseItems[0].Table[index].QtyStockEntry : '') + '</td>'
                    + '<td>' + (data.PurchaseItems[0].Table[index].QtyReturn != undefined ? data.PurchaseItems[0].Table[index].QtyReturn : '') + '</td>'
                    + '<td>' + (data.PurchaseItems[0].Table[index].QtyBalance != undefined ? data.PurchaseItems[0].Table[index].QtyBalance : '') + '</td>'

                    + '<td>' + (data.PurchaseItems[0].Table[index].UnitPrice != undefined ? data.PurchaseItems[0].Table[index].UnitPrice : '') + '</td>'
                     + '<td><input type="text" class="form-control RtrnQty"  value="0" onchange="CheckReturn(this)" oninput="handleNumericInput(event)" onblur="checkInputGiven(event)" /></td>'
                    + '<td>' + warehouseHtml + '</td><td><input type="text" class="form-control descptn" /></td></tr>';
                          
                }

               
                    $('#tbody_MaterialPurchaseOrderMasterDetails').html(html);
                    hideLoader();
              
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




function CheckReturn(ele) {
    var BalanceStock = parseFloat($(ele.parentElement.parentElement.children[6])[0].innerText);
    var RtrnQty = parseFloat($(ele).val());
    if (RtrnQty <= BalanceStock && RtrnQty > 0) {

    }
    else {

       $(ele).val('0');
        alertify.error("Return Qty should be greater than 0 and less than Balance Stock of GRN.");
    }
}


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
    $('#ddlGRN').select2('destroy');
    $('#ddlGRN').val('');
    $('#ddlGRN').select2();
    $('#ddlGRN').empty();
    $('#txtReturnDate').val('');
    $('#txtID').val('');
       $('#ddlBranch').val('');
  
}

function BindMaterialPurchaseGrnList() {
    showLoader();
    $.ajax({
        type: "POST",
        url: 'wfMmMaterialPurchaseGrnReturn.aspx/FetchMaterialPurchaseGrnReturnList',
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
                html = html + '<tr><td><input type="checkbox" class="editor-active chk_purchase_order_list"></td><td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + data[i].Id + '</td><td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + data[i].GrnReturnDate + '</td>'
                    + '<td onclick="FetchMaterialPurchaseGrnDetails(\'' + data[i].Id + '\');">' + (data[i].GrnMasterId != undefined ? data[i].GrnMasterId : '') + '</td>'
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
        url: 'wfMmMaterialPurchaseGrnReturn.aspx/FetchMaterialPurchaseGrnReturnDetails',
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
                    + '<td>' + (data[i].QtyReturn != undefined ? data[i].QtyReturn : '') + '</td>'
                    + '<td>' + (data[i].UnitMesure != undefined ? data[i].UnitMesure : '') + '</td>'
                    + '<td>' + (data[i].UnitPrice != undefined ? data[i].UnitPrice : '') + '</td>'
                    + '<td>' + (data[i].TotalAmt != undefined ? data[i].TotalAmt : '') + '</td>'
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
        url: 'wfMmMaterialPurchaseGrnReturn.aspx/WarehouseList',
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




function AddMaterialPurchaseOrderDirectGrnEntry() {
    if ($('#txtReturnDate').val() == '') {
        alertify.error('Please enter return date');
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
    

    var hasRows = $('#tbody_MaterialPurchaseOrderMasterDetails tr').length > 0;
    if (!hasRows) {
        alertify.error('Please Select Purchase Order GRN');
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

       

        var RtrnQty = $(this).find('.RtrnQty');

        // Check if the warehouse input value is empty
        if (RtrnQty.val() === '' ) {
            // Set the flag to true if any warehouse is not selected
            found = true;
            // Break out of the loop since we've found at least one warehouse not selected
            return false;
        }


    });



    // Check the flag value
    if (found) {
        // If the flag is true, it means at least one warehouse is not selected
        alertify.error('Please enter return quantity and warehouse on purchase details list');
        return;
    }

    var data = [];
    $("#tbody_MaterialPurchaseOrderMasterDetails tr").each(function (i) {

        var materialID = $(this)[0].cells[0].innerText;
        var QtyReturn = $(this).find('.RtrnQty').val();//$(this)[0].cells[8].innerText;
        var WareHouseId = $(this).find('#ddlWarehouse').val();
        var Description = $(this).find('.descptn').val();
        if (parseFloat(QtyReturn) > 0) {
            data.push({ ItemID: materialID, QtyReturn: QtyReturn, WareHouseId: WareHouseId, Description: Description });
        }
        


    });

    showLoader();
    // Send data to server using AJAX
    $.ajax({
        type: "POST",
        url: "wfMmMaterialPurchaseGrnReturn.aspx/AddMaterialPurchaseOrderGrnReturn", // Adjust the URL based on your setup
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            data: data,
            "GRNReturnID": $('#txtID').val(),
            "GRNID": $('#ddlGRN').val(),
            "ReturnDate": $('#txtReturnDate').val(),
            "Vendor": $('#ddlVendor').val(),
            "BranchCode": $('#ddlBranch').val(),
            "LoginUser": $('#ContentPlaceHolder1_loginuser').val()
        }),
        dataType: "json",
        success: function (response) {


            setTimeout(function () {


                hideLoader();
                alertify.success('Purchase Order GRN Return added successfully');
                ClearAll();
            }, 1000); // Hide loader after 3 seconds
        },
        error: function (error) {
            console.log(error);
            alertify.error("Error saving data. Please try again.");
        }
    });
}