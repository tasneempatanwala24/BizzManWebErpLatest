$(document).ready(function () {
    $("button").click(function (event) {
        event.preventDefault();
    });

    BindMaterialMasterDropdown();
    BindCustomerDropdown();
    BindCurrencyDropdown();
    BindCustomerTypeDropdown();
    BindStateDropdown();
    BindBranchDropdown();
    BindDepartmentDropdown()
    BindSalesOrderMasterList();
});

 

function BindBranchDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfMmRequisitionNote.aspx/GetBranchDetails',
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
        url: 'wfMmRequisitionNote.aspx/GetDeptDetails',
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


function BindMaterialPackagingDropdown(materialid) {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/MaterialPackagingList',
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
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].id + "'>" + JSON.parse(response.d)[i].Packaging + "</option>";
            }
            $('#ddlPackage').append(req);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });


}



function BindMaterialMasterDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/MaterialMasterList',
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




function BindStateDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/FetchStateList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlState').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select State-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].StateId + "'>" + JSON.parse(response.d)[i].StateName + "</option>";
            }
            $('#ddlState').append(req);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });


}

function BindCityDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/FetchCityList',
        data: JSON.stringify({
            "stateid": $('#ddlState').val()
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlCity').html('');
            var data = JSON.parse(response.d);
            var req = "<option value=''>-Select City-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].CityName + "</option>";
            }
            $('#ddlCity').append(req);
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
        url: 'wfMmMaterialMaster.aspx/BindCurrencyList',
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



function BindCustomerDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/CustomerMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlCustomer').html('');
            var data = JSON.parse(response.d);
            var branch = "<option value=''>-Select Customer-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                branch = branch + "<option value='" + JSON.parse(response.d)[i].CustomerId + "'>" + JSON.parse(response.d)[i].CustomerName + "</option>";
            }
            $('#ddlCustomer').append(branch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}


function BindCustomerTypeDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/CustomerTypeMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            $('#ddlCustomerType').html('');
            var data = JSON.parse(response.d);
            var branch = "<option value=''>-Select Customer Type-</option>";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                branch = branch + "<option value='" + JSON.parse(response.d)[i].id + "'>" + JSON.parse(response.d)[i].CustomerType + "</option>";
            }
            $('#ddlCustomerType').append(branch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });

}




function CreateSalesOrder() {
    $('#divSalesOrderList').hide();
    $('#divSalesOrderEntry').show();
    $('#divSalesOrderDetails').show();
    $('#btnSave').show();
    $('#btnExport').hide();

    $('#tr_SalesOrderEntry').show();

    ClearAll();
}

function ViewSalesOrderList() {
    $('#divSalesOrderList').show();
    $('#divSalesOrderEntry').hide();
    $('#divSalesOrderDetails').hide();
    $('#btnSave').hide();
    $('#btnExport').show();
    $('#btnConfirm').hide();
    $('#btnCancel').hide();
    BindSalesOrderMasterList();
}



function ClearAll() {
    $('#tbody_SalesOrderDetails').children('tr:not(:first)').remove();
    $('#ddlMaterialName').val('');
    $('#txtMaterialQty').val('');
    $('#txtMaterialUnitMeasure').val('');
    $('#ddlPackage').html("<option value=''>-Select Package-</option>");
    $('#txtMaterialRate').val('');
    $('#txtMaterialTax').val('');
    $('#txtMaterialTotalAmount').val('');
    $('#ddlCustomer').val('');
    $('#txtExpirationDate').val('');
    $('#ddlGSTTreatment').val('');
    $('#txtQuotationDate').val('');
    $('#ddlCurrency').val('');
    $('#ddlPaymentTerms').val('');
    $('#txtTermsConditions').val('');
    $('#txtTotalAmount').val('');
    $('#hdnSalesOrderId').val('');

    $('#txtCustomerName').val('');
    $('#ddlCustomerType').val('');
    $('#txtCompanyName').val('');
    $('#ddlCity').val('');
    $('#ddlState').val('');
    $('#txtEmail').val('');
    $('#txtMobile').val('');
    $('#txtSaleOrderId').val('');
    $('#ddlBranch').val('');
    $('#ddlDept').val('');

    $('#btnConfirm').hide();
    $('#btnCancel').hide();

}



function BindSalesOrderMasterList() {
    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/FetchSalesOrderMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            $('#tblSalesOrderList').DataTable().clear();
            $('#tblSalesOrderList').DataTable().destroy();
            $('#tbody_SalesOrder_List').html('');

            var html = '';
            for (var i = 0; i < data.length; i++) {
                html = html + '<tr><td><input type="checkbox" class="editor-active"></td><td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + data[i].SalesOrderId + '</td>'
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
                    + '<td style="white-space: nowrap;" onclick="FetchSalesOrderMasterDetails(\'' + data[i].SalesOrderId + '\',\'' + data[i].OrderStatusId + '\');">' + (data[i].TotalAmount != undefined ? data[i].TotalAmount : '') + '</td></tr>';
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

            $('#example-select-all').on('click', function () {
                // Check/uncheck all checkboxes in the table
                var rows = table.rows({ 'search': 'applied' }).nodes();
                $('input[type="checkbox"]', rows).prop('checked', this.checked);


            });

            $('#tbody_SalesOrder_List tbody').on('change', 'input[type="checkbox"]', function () {
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



function FetchSalesOrderMasterDetails(id, OrderStatus) {
    if (OrderStatus == '1' || OrderStatus == '2') {


        $.ajax({
            type: "POST",
            url: 'wfSdSalesOrder.aspx/FetchSalesOrderMasterDetails',
            data: JSON.stringify({
                "SalesOrderId": id
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                ClearAll();
                $('#divSalesOrderList').hide();
                $('#divSalesOrderEntry').show();
                $('#divSalesOrderDetails').show();
                $('#btnSave').show();
                $('#btnExport').hide();
                $('#btnView').show();
                $('#txtSaleOrderId').val(id);
                $('#ddlCustomer').val(data[0].CustomerId);
                $('#ddlGSTTreatment').val(data[0].GST_Treatment);
                $('#ddlCurrency').val(data[0].CurrencyId);
                $('#ddlPaymentTerms').val(data[0].PaymentTerms);
                $('#txtTermsConditions').val(data[0].TermCondition);
                $('#txtTotalAmount').val(data[0].TotalAmount);
                $('#ddlBranch').val(data[0].BranchCode);
                $('#ddlDept').val(data[0].DepartmentID);
                var dtExpirationDate = new Date(data[0].ExpirationDate);
                document.getElementById("txtExpirationDate").valueAsDate = dtExpirationDate;
                var dtQuotationDate = new Date(data[0].QuotationDate);
                document.getElementById("txtQuotationDate").valueAsDate = dtQuotationDate;
                $('#hdnSalesOrderId').val(data[0].SalesOrderId);

                FetchSalesOrderDetailsList(data[0].SalesOrderId);
                if (OrderStatus == '1') {
                    $('#btnConfirm').show();
                    $('#btnCancel').show();
                }
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}


function FetchSalesOrderDetailsList(salesorderid) {
    $('#tbody_SalesOrderDetails').children('tr:not(:first)').remove();

    $.ajax({
        type: "POST",
        url: 'wfSdSalesOrder.aspx/FetchSalesOrderDetailsList',
        data: JSON.stringify({
            "salesorderid": salesorderid
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);

            var html = '';
            for (var i = 0; i < data.length; i++) {
                $('#tbody_SalesOrderDetails').append('<tr><td style="display: none;">' + data[i].MaterialId + '</td>'
                    + '<td>' + (data[i].MaterialName != undefined ? data[i].MaterialName : "") + '</td>'
                    + '<td>' + (data[i].Qty != undefined ? data[i].Qty : "") + '</td>'
                    + '<td>' + (data[i].UnitMesure != undefined ? data[i].UnitMesure : "") + '</td>'
                    + '<td>' + (data[i].Packaging != undefined ? data[i].Packaging : "") + '</td>'
                    + '<td style="display: none;">' + (data[i].PackageId != undefined ? data[i].PackageId : "") + '</td>'
                    + '<td>' + (data[i].UnitPrice != undefined ? data[i].UnitPrice : "") + '</td>'
                    + '<td>' + (data[i].Tax != undefined ? data[i].Tax : "") + '</td>'
                    + '<td>' + (data[i].SubTotal != undefined ? data[i].SubTotal : "") + '</td>'
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
    var SalesOrderId = '';
    $('#tbody_SalesOrder_List tr').each(function (index1, tr) {
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
                    if (SalesOrderId == '') {
                        SalesOrderId = td.outerText;
                    }
                    else {
                        SalesOrderId = SalesOrderId + ',' + td.outerText;
                    }
                }
            }
        });
    });

    if (SalesOrderId != '') {
        $.ajax({
            type: "POST",
            url: "wfSdSalesOrder.aspx/FetchSalesOrderListDownload",
            data: JSON.stringify({
                "SalesOrderId": SalesOrderId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                var d = new Date();
                var fileName = 'SalesOrder_' + d.toDateString() + '.xlsx';
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
    $('#txtMaterialUnitMeasure').val()
    if ($('#ddlMaterialName').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfMmBomEntry.aspx/FetchMaterialDetails',
            data: JSON.stringify({
                "MaterialId": $('#ddlMaterialName').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                $('#txtMaterialUnitMeasure').val(data[0].UnitMesure);
                $('#txtMaterialRate').val(data[0].MRP);
                $('#txtMaterialTax').val(data[0].IntegratedTaxPercent);
                BindMaterialPackagingDropdown($('#ddlMaterialName').val());
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
                    + '<td>' + $("#txtMaterialQty").val() + '</td>'
                    + '<td>' + $("#txtMaterialUnitMeasure").val() + '</td>'
                    + '<td>' + ($("#ddlPackage").val()!=""? $("#ddlPackage option:selected").text():"") + '</td>'
                    + '<td style="display: none;">' + ($("#ddlPackage").val() != "" ? $("#ddlPackage").val():"0") + '</td>'
                    + '<td>' + $("#txtMaterialRate").val() + '</td>'
                    + '<td>' + $("#txtMaterialTax").val() + '</td>'
                    + '<td>' + $("#txtMaterialTotalAmount").val() + '</td>'
                    + '<td><a onclick="DeleteSalesOrderDetailEntry(this);" style="cursor:pointer;"><i class="fa fa-trash" aria-hidden="true"></i></a></td>'
                    + '</tr>');

                if ($('#txtTotalAmount').val() == '') {
                    $('#txtTotalAmount').val($("#txtMaterialTotalAmount").val());
                }
                else {
                    var totalAmnt = parseFloat($('#txtTotalAmount').val()) + parseFloat($('#txtMaterialTotalAmount').val());
                    $('#txtTotalAmount').val(totalAmnt.toFixed(2));
                }

                $('#ddlMaterialName').val('');
                $('#txtMaterialQty').val('');
                $('#txtMaterialUnitMeasure').val('');
                $('#txtMaterialRate').val('');
                $('#txtMaterialTotalAmount').val('');
                $('#ddlPackage').html("<option value=''>-Select Package-</option>");
                $('#txtMaterialTax').val('');

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
    var totalAmnt = parseFloat($('#txtTotalAmount').val()) - parseFloat($(ele.parentElement.parentElement.children[8]).text());
    $('#txtTotalAmount').val(totalAmnt.toFixed(2));
    $(ele.parentElement.parentElement).remove();
}


function UpdateTotalAmount() {
    if ($('#txtMaterialQty').val() != '') {
        if ($('#ddlMaterialName').val() != '') {
            var totalAmnt = parseFloat($('#txtMaterialRate').val()) * parseInt($('#txtMaterialQty').val());
            totalAmnt = totalAmnt + ((totalAmnt * parseInt($('#txtMaterialTax').val())) / 100);
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


function AddSalesOrder() {
    if ($('#ddlCustomer').val() != '') {
        if ($('#txtExpirationDate').val() != '') {
            if ($('#ddlGSTTreatment').val() != '') {
                if ($("#txtQuotationDate").val() != undefined) {

                    if ($('#ddlCurrency').val() != '') {
                        var indent_details = '';
                        $('#tbody_SalesOrderDetails tr').each(function (index1, tr) {
                            if (index1 > 0) {
                                $(tr).find('td').each(function (index, td) {
                                    if (index1 == 1) {
                                        if (indent_details == '') {
                                            if (index == 0) {
                                                indent_details = td.outerText;
                                            }

                                        }
                                        else {
                                            if (index == 2) {
                                                indent_details = indent_details + '|' + td.outerText;
                                            }
                                            else if (index == 5) {
                                                indent_details = indent_details + '$' + td.outerText;
                                            }

                                        }
                                    }
                                    else {
                                        if (index == 0) {
                                            indent_details = indent_details + '@' + td.outerText;
                                        }
                                        else if (index == 2) {
                                            indent_details = indent_details + '|' + td.outerText;
                                        }
                                        else if (index == 5) {
                                            indent_details = indent_details + '$' + td.outerText;
                                        }

                                    }
                                });
                            }
                        });

                        if (indent_details != '') {
                            if ($('#ddlDept').val() != '') {
                                if ($('#ddlBranch').val() != '') {
                            $.ajax({
                                type: "POST",
                                url: 'wfSdSalesOrder.aspx/AddSalesOrder',
                                data: JSON.stringify({
                                    "SalesOrderId": $('#hdnSalesOrderId').val(),
                                    "CustomerId": $('#ddlCustomer').val(),
                                    "ExpirationDate": $('#txtExpirationDate').val(),
                                    "GSTTreatment": $('#ddlGSTTreatment').val(),
                                    "SalesOrder_details": indent_details,
                                    "QuotationDate": $('#txtQuotationDate').val(),
                                    "Currency": $('#ddlCurrency').val(),
                                    "PaymentTerms": $('#ddlPaymentTerms').val(),
                                    "TermsConditions": $('#txtTermsConditions').val(),
                                    "TotalAmount": $('#txtTotalAmount').val(),
                                    "OrderSource": "Direct",
                                    "LoginUser": $('#ContentPlaceHolder1_loginuser').val(),
                                    "BranchCode": $('#ddlBranch').val(),
                                    "DepartmentID": $('#ddlDept').val()
                                }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                beforeSend: function () {

                                },
                                success: function (response) {
                                    alertify.success(response.d);
                                    ClearAll();

                                },
                                complete: function () {

                                },
                                failure: function (jqXHR, textStatus, errorThrown) {

                                }
                            });

                                }
                                else {
                                    alertify.error('Please select any Branch');
                                }
                            }
                            else {
                                alertify.error('Please select any Department');
                            }
                        }
                        else {
                            alertify.error('Please add Sales Order Lines');
                        }
                    }
                    else {
                        alertify.error('Please select any Currency');
                    }

                }
                else {
                    alertify.error('Please select any Quotation Date');
                }
            }
            else {
                alertify.error('Please select any GST Treatment');
            }
        }
        else {
            alertify.error('Please select any Expiration Date');
        }
    }
    else {
        alertify.error('Please select any Customer');
    }
}


function UpdateSalesOrderStatus(status) {
    alertify.confirm('Confirm Order Status Update', 'Are you sure, you want to update sales order status?', function () {
        $.ajax({
            type: "POST",
            url: 'wfSdSalesOrder.aspx/UpdateSalesOrderStatus',
            data: JSON.stringify({
                "SalesOrderId": $('#hdnSalesOrderId').val(),
                "OrderStatus": status,
                "LoginUser": $('#ContentPlaceHolder1_loginuser').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                alertify.success("Sales Order status updated successfully");
                ViewSalesOrderList();
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
        , function () {

        });


}


function CloseModal() {
    $('#CustomerAddModal').modal('hide');
}


function CloseCustomerTypeModal() {
    $('#CustomerTypeAddModal').modal('hide');
}


function AddCustomerDetails() {
    if ($('#txtCustomerName').val() != '') {
        if ($('#ddlCustomerType').val() != '') {
            if ($('#txtCompanyName').val() != '') {
                if ($("#ddlCity").val() != '') {

                    if ($('#ddlState').val() != '') {

                        if ($('#txtEmail').val() != '') {
                            if ($('#txtMobile').val() != '') {
                                $.ajax({
                                    type: "POST",
                                    url: 'wfSdSalesOrder.aspx/AddCustomer',
                                    data: JSON.stringify({
                                        "CustomerName": $('#txtCustomerName').val(),
                                        "CustomerType": $('#ddlCustomerType').val(),
                                        "CompanyName": $('#txtCompanyName').val(),
                                        "City": $('#ddlCity').val(),
                                        "State": $('#ddlState').val(),
                                        "Email": $('#txtEmail').val(),
                                        "Mobile": $('#txtMobile').val(),
                                        "LoginUser": $('#ContentPlaceHolder1_loginuser').val()
                                    }),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    beforeSend: function () {

                                    },
                                    success: function (response) {
                                        var str = "success";
                                        if (response.d.indexOf(str) != -1) {
                                            alertify.success(response.d);
                                            $('#txtCustomerName').val('');
                                            $('#ddlCustomerType').val('');
                                            $('#txtCompanyName').val('');
                                            $('#ddlCity').val('');
                                            $('#ddlState').val('');
                                            $('#txtEmail').val('');
                                            $('#txtMobile').val('');
                                            $('#CustomerAddModal').modal('hide');
                                            BindCustomerDropdown();
                                        }
                                        else {
                                            alertify.error(response.d);
                                        }

                                    },
                                    complete: function () {

                                    },
                                    failure: function (jqXHR, textStatus, errorThrown) {

                                    }
                                });
                            }
                            else {
                                alertify.error('Please enter contact number');
                            }
                        }
                        else {
                            alertify.error('Please enter email id');
                        }
                    }
                    else {
                        alertify.error('Please enter state');
                    }

                }
                else {
                    alertify.error('Please enter city');
                }
            }
            else {
                alertify.error('Please enter company name');
            }
        }
        else {
            alertify.error('Please select any customer type');
        }
    }
    else {
        alertify.error('Please enter customer name');
    }
}

function AddNewCustomer() {
    $('#txtCustomerName').val('');
    $('#ddlCustomerType').val('');
    $('#txtCompanyName').val('');
    $('#ddlCity').val('');
    $('#ddlState').val('');
    $('#txtEmail').val('');
    $('#txtMobile').val('');
    $('#CustomerAddModal').modal('show');
    $('.modal-backdrop').remove();
}

function AddCustomerType() {
    $('#txtCustomerType').val('');
    $('#CustomerTypeAddModal').modal('show');
    $('.modal-backdrop').remove();
}

function AddNewCustomerType() {

    if ($('#txtCustomerType').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wfSdSalesOrder.aspx/AddCustomerType',
            data: JSON.stringify({
                "CustomerType": $('#txtCustomerType').val().trim()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                var str = "success";
                if (response.d.indexOf(str) != -1) {
                    alertify.success(response.d);

                    $('#txtCustomerType').val('');
                    $('#CustomerTypeAddModal').modal('hide');
                    BindCustomerTypeDropdown();
                }
                else {
                    alertify.error(response.d);
                }

            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        alertify.error('Please enter customer type');
    }

}