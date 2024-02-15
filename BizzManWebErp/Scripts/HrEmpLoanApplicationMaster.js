$(document).ready(function () {
    $("button").click(function (event) {
        event.preventDefault();
    });
    ViewDataList();
    BindYearDropdown();
        BindMonthDropdown();
        BindBranchDropdown();
        BindLoanStatusDropdown();
        BindEmiIntegratedSalary();
        BindLoanDisburse();
    $("#ddlBranch").on("change", function () {
        BindEmployeeDropdown();
    }).trigger("change");
    $("#ddlEmployee").on("change", function () {
        ShowEmployeeName();
    }).trigger("change");
    $("#ddlDisburse").on("change", function () {
        if ($("#ddlDisburse").val() == "Y") {
            var ApproveAmount = $('#txtApproveAmount').val().replace(/[\s\n\r]/g, "");
            //var LoanApplicationAmount = $('#txtLoanApplicationAmount').val().replace(/[\s\n\r]/g, "");
            if (ApproveAmount != 0 && ApproveAmount != '') {
                $("#txtLoanBalanceAmount").val(ApproveAmount);
                                
            }
            else {
                alertify.error("Please enter proper approve amount");
            }
        }
        else {
            $("#ddlDisburse").val(0);
        }
    }).trigger("change");
    $('#txtLoanApplicationDate').datepicker({
        format: "dd-M-yyyy",
        viewMode: "days",
        minViewMode: "days",
        autoclose: true,
        todayHighlight: true,
        enableOnReadonly: false,
    });
    $('#txtApproveDate').datepicker({
        format: "dd-M-yyyy",
        viewMode: "days",
        minViewMode: "days",
        autoclose: true,
        todayHighlight: true,
        enableOnReadonly: false,
    });
    $('#txtEMIAmount').keypress(function (event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    $('#txtLoanApplicationAmount').keypress(function (event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    $('#txtLoanBalAmount').keypress(function (event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    $('#txtApproveAmount').keypress(function (event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
   
});
function BindBranchDropdown() {

    $.ajax({
        type: "POST",
        url: 'wfHrEmpLoanApplicationMaster.aspx/BranchMasterList',
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

        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}
function BindEmployeeDropdown() {
   
    if ($('#ddlBranch').val() == '') {
        //$('#ddlEmployee').select2('destroy');
        $('#ddlEmployee').html("<option value=''>-Select Employee-</option>");
        $('#ddlEmployee').select2();
        $('#txtEmpName').val('');
        
    }
    else {
        
        $.ajax({
            type: "POST",
            url: 'wfHrEmpLoanApplicationMaster.aspx/EmployeeMasterList',
            data: JSON.stringify({
                "branchid": $('#ddlBranch').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                $('#ddlEmployee').html('');
                var data = JSON.parse(response.d);
                var emp = "<option value=''>-Select Employee-</option>";
                for (var i = 0; i < JSON.parse(response.d).length; i++) {
                    emp = emp + "<option value='" + JSON.parse(response.d)[i].EmpId + "'>" + JSON.parse(response.d)[i].EmpName + "</option>";

                }
                $('#ddlEmployee').append(emp);

            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}

function ShowEmployeeName() {
    
    if ($('#ddlEmployee').val() == null || $('#ddlEmployee').val() == '') {
        $('#txtEmpName').val('');
    }
    else {
        FetchEmployeeDetails($('#ddlEmployee').val());
        
    }
}
function FetchEmployeeDetails(empid) {
    $.ajax({
        type: "POST",
        url: 'wfHrEmpLoanApplicationMaster.aspx/FetchEmployeeDetails',
        data: JSON.stringify({
            "EmpId": empid
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {

            var data = JSON.parse(response.d);
            $('#txtEmpName').val(data[0].EmpName);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function BindYearDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfHrEmpLoanApplicationMaster.aspx/YearList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            var abranch = "";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                abranch = abranch + "<option value='" + JSON.parse(response.d)[i].Year + "'>" + JSON.parse(response.d)[i].Year + "</option>";
            }
            $('#ddlYear').append(abranch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function BindMonthDropdown() {
    $.ajax({
        type: "POST",
        url: 'wfHrEmpLoanApplicationMaster.aspx/MonthList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            var abranch = "";
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                abranch = abranch + "<option value='" + JSON.parse(response.d)[i].MonthName + "'>" + JSON.parse(response.d)[i].MonthName + "</option>";
            }
            $('#ddlMonth').append(abranch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function BindLoanStatusDropdown() {
    $('#ddlLoanStatus').html('');
    var html = "<option value=''>-Select Loan Status-</option>";
    html = html + "<option value='Process'>Process</option><option value='Approved'>Approved</option><option value='Cancel'>Cancel</option>";
    $('#ddlLoanStatus').html(html);
    $('#ddlLoanStatus').val("Process");
}

function BindEmiIntegratedSalary() {
    $('#ddlEmiIntegratedsalary').html('');
    var html = "<option value=''>-Select EMI Integrated With Salary-</option>";
    html = html + "<option value='Y'>Y</option><option value='N'>N</option>";
    $('#ddlEmiIntegratedsalary').html(html);
}

function BindLoanDisburse() {
    $('#ddlDisburse').html('');
    var html = "<option value=''>-Select Loan Disburse-</option>";
    html = html + "<option value='Y'>Y</option><option value='N'>N</option>";
    $('#ddlDisburse').html(html);
}

function ClearAll() {
    $('#ddlBranch').val('');
    $('#ddlEmployee').val('');
    $('#txtEmpName').val('');
    $('#ddlYear').val('');
    $('#ddlMonth').val('');
    $('#txtId').val('');
    $('#txtLoanApplicationAmount').val(0.00);
    $('#txtLoanApplicationDate').val('');
    $('#txtDescription').val('');
    $('#ddlLoanStatus').val("Process");
    $('#txtApproveDate').val('');
    $('#txtApproveAmount').val(0.00);
    $('#ddlEmiIntegratedsalary').val('');
    $('#txtEMIAmount').val(0.00);
    $('#txtLoanBalanceAmount').val(0.00);
    $('#txtLoanApproveBy').val('');
    $('#ddlDisburse').val('');
}

function CreateData() {
    $('#divDataList').hide();
    $('#divDataEntry').show();
    $('#txtEmpName').attr("readonly", "readonly");
    $('#txtId').attr("readonly", "readonly");
    $('#txtLoanBalanceAmount').attr("readonly", "readonly");
    $("#btnSave").html('Save');
    $('#btnSave').show();
    $('#ddlBranch').attr("disabled", false);
    $('#ddlEmpId').attr("disabled", false);
    $('#ddlYear').attr("disabled", false);
    $('#ddlMonth').attr("disabled", false);
    $('#ddlLoanStatus').val("Process");
    $('#ddlLoanStatus').attr("disabled", true);
    $('#txtLoanApplicationAmount').val('0.00');
    $('#txtEMIAmount').attr("readonly", "readonly");
    $('#txtEMIAmount').val('0.00');
    $('#txtLoanBalanceAmount').attr("readonly", "readonly");
    $('#txtLoanBalanceAmount').val('0.00');
    $('#txtApproveDate').attr("readonly", "readonly");
    $('#txtApproveDate').prop('readonly', true);
    $('#txtApproveAmount').attr("readonly", "readonly");
    $('#txtApproveAmount').val('0.00');
    $('#txtLoanApproveBy').attr("readonly", "readonly");
    $('#ddlDisburse').attr("disabled", true);
    $('#ddlEmiIntegratedsalary').attr("disabled", true);
    if ($("#btnSave").html('Save')) {
        ClearAll();
    }

}
function ViewDataList() {
    $('#divDataList').show();
    $('#btnSave').hide();
    $('#divDataEntry').hide();
    BindEmpLoanList();
}

function BindEmpLoanList() {
    $.ajax({
        type: "POST",
        url: 'wfHrEmpLoanApplicationMaster.aspx/FetchEmpLoanList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            $('#tblEmpLoanList').DataTable().clear();
            $('#tblEmpLoanList').DataTable().destroy();
            $('#tbody_EmpLoan_List').html('');
            var html = '';
            for (var i = 0; i < JSON.parse(response.d).length; i++) {
                html = html + '<tr onclick="FetchEmpLoanDetails(\'' + data[i].Id + '\')"><td>' + data[i].Id + '</td>'
                    + '<td>' + data[i].BranchName + '</td>'
                    + '<td>' + data[i].EmpName + '</td>'
                    + '<td>' + data[i].Year + '</td>'
                    + '<td>' + data[i].Month + '</td>'
                    + '<td>' + data[i].LoanApplicationAmount + '</td>'
                    + '<td>' + data[i].LoanApproveAmount + '</td>'
                    + '<td>' + data[i].EmiAmount + '</td>'
                    + '<td>' + data[i].LoanApproved + '</td>'
                    + '<td>' + data[i].LoanStatus + '</td></tr > ';
            }
            $('#tbody_EmpLoan_List').html(html);
            $('#tblEmpLoanList').DataTable();

        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function AddData() {
    var isUpdate = 0;
    var isValid = true;
    if ($('#btnSave').html() == 'Update') {
        isUpdate = 1;
    }
    
    if ($('#ddlBranch').val() != '') {
        if ($('#ddlEmployee').val() != '') {
            if ($('#ddlYear').val() != '') {
                if ($('#ddlMonth').val() != '') {
                    var LoanApplicationAmount = $('#txtLoanApplicationAmount').val().replace(/[\s\n\r]/g, "");
                    var ApproveAmount = $('#txtApproveAmount').val().replace(/[\s\n\r]/g, "");
                    if (LoanApplicationAmount != 0 && LoanApplicationAmount != '') {
                        if ($('#txtLoanApplicationDate').val() != '') {
                            if (isUpdate == 1) {
                                if (ApproveAmount != 0 && ApproveAmount != '') {
                                    if (parseFloat($('#txtEMIAmount').val()) < parseFloat($('#txtApproveAmount').val())) { }
                                    else {
                                        alertify.error('EMI Amount cannot be greater than Loan Approve Amount');
                                        return false;
                                    }
                                    if (parseFloat($('#txtApproveAmount').val()) < parseFloat($('#txtLoanApplicationAmount').val())) { }
                                    else {
                                        alertify.error('Loan Approve Amount cannot be greater than Loan Application Amount');
                                        return false;
                                    }
                                }
                                
                                
                            }
                            $.ajax({
                                    type: "POST",
                                    url: 'wfHrEmpLoanApplicationMaster.aspx/AddData',
                                    data: JSON.stringify({
                                        "EmpId": $('#ddlEmployee').val(),
                                        "BranchCode": $('#ddlBranch').val(),
                                        "LoanApplicationAmount": parseInt($("#txtLoanApplicationAmount").val(), 10),
                                        "LoanApplicationDate": $('#txtLoanApplicationDate').val(),
                                        "Year": $('#ddlYear').val(),
                                        "Month": $('#ddlMonth').val(),
                                        "Description": $('#txtDescription').val(),
                                        "LoginUser": $('#ContentPlaceHolder1_loginuser').val(),
                                        "isUpdate": isUpdate,
                                        "Id": $('#txtId').val(),
                                        "LoanStatus": $('#ddlLoanStatus').val(),
                                        "ApproveAmount": parseInt($("#txtApproveAmount").val(), 10) || 0,
                                        "LoanApproveDate": $('#txtApproveDate').val(),
                                        "EmiIntegratedWithSalary": $('#ddlEmiIntegratedsalary').val(),
                                        "EMIAmount": parseInt($("#txtEMIAmount").val(), 10) || 0,
                                        "LoanBalanceAmount": parseInt($("#txtLoanBalanceAmount").val(), 10) || 0,
                                        "LoanApproveBy": $('#ContentPlaceHolder1_loginuser').val(),
                                        "Disburse": $('#ddlDisburse').val()
                                    }),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    beforeSend: function () {

                                    },
                                    success: function (response) {
                                        if (response.d == "success") {
                                            alertify.success('Employee Loan added successfully');
                                            ClearAll();
                                        }
                                        else
                                            alertify.error('Something went wrong, please try again later');

                                    },
                                    failure: function (response) {
                                        alertify.error('failure. Something went wrong, please try again later');
                                    },
                                    error: function (response) {
                                        alertify.error('Error occurred. Something went wrong, please try again later');
                                    }
                                });
                           
                        }
                        else {
                            alertify.error('Please enter Loan Application Date');
                        }   // end year
                    }
                    else {
                        alertify.error('Please enter loan application amount');
                    }
                }
                else {
                    alertify.error('Please select month');
                }
            }
            else {
                alertify.error('Please select year');
            }
        }
        else {
            alertify.error('Please select any employee');
        }
    }
    else {   //  branch
        alertify.error('Please select any branch');
    }
}

function FetchEmpLoanDetails(id) {
    $.ajax({
        type: "POST",
        url: 'wfHrEmpLoanApplicationMaster.aspx/FetchEmpLoanDetails',
        data: JSON.stringify({
            "id": id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },

        success: function (response) {
            $('#divDataList').hide();
            $('#divDataEntry').show();
            var data = JSON.parse(response.d);
            if (data[0].LoanDisburse == 'Y' || data[0].LoanStatus == 'Cancel') {
                $("#btnSave").hide();
                $('#ddlBranch').attr("disabled", true);
                $('#ddlEmployee').attr("disabled", true);
                $('#ddlYear').attr("disabled", true);
                $('#ddlMonth').attr("disabled", true);
                $('#txtEmpName').attr("readonly", "readonly");
                $('#txtId').attr("readonly", "readonly");
                $('#txtLoanApplicationDate').attr("readonly", "readonly");
                $('#txtLoanApplicationDate').prop('readonly', "readonly");
                $('#txtLoanApplicationAmount').attr("readonly", "readonly");
                $('#ddlEmiIntegratedsalary').attr("disabled", true);
                $('#txtEMIAmount').attr("readonly", "readonly");
                $('#txtApproveAmount').attr("readonly", "readonly");
                $('#txtApproveDate').attr("readonly", "readonly");
                $('#txtLoanBalanceAmount').attr("readonly", "readonly");
                $('#txtLoanApproveBy').attr("readonly", "readonly");
                $('#ddlDisburse').attr("disabled", true);
                $('#txtDescription').attr("readonly", "readonly");
            }
            else {
                $("#btnSave").html('Update');
                $('#ddlBranch').attr("disabled", true);
                $('#ddlEmployee').attr("disabled", true);
                $('#ddlYear').attr("disabled", true);
                $('#ddlMonth').attr("disabled", true);
                $('#txtEmpName').attr("readonly", "readonly");
                $('#txtId').attr("readonly", "readonly");
                $('#txtLoanApplicationDate').attr("readonly", "readonly");
                $('#txtLoanApplicationDate').prop('readonly', true);
                $('#txtLoanApplicationAmount').attr("readonly", "readonly");
                $('#ddlEmiIntegratedsalary').attr("disabled", false);
                $('#txtEMIAmount').attr("readonly", false);
                $('#txtApproveAmount').attr("readonly", false);
                $('#txtApproveDate').attr("readonly", false);
                $('#txtLoanBalanceAmount').attr("readonly", "readonly");
                $('#txtLoanApproveBy').attr("readonly", "readonly");
                $('#ddlDisburse').attr("disabled", false);
                $("#btnSave").show();
            }
                
            $('#ddlBranch').val(data[0].BranchCode);
            $('#ddlEmployee').html("<option value = ''> -Select Employee -</option><option value='" + data[0].EmpId + "' selected>" + data[0].EmpName + "</option>");
            $('#ddlEmployee').val(data[0].EmpId).attr("selected", true);
            $('#txtEmpName').val(data[0].EmpName);
            $('#ddlYear').val(data[0].Year);
            $('#ddlMonth').val(data[0].Month);  
            $('#txtId').val(data[0].Id);
            $('#txtLoanApplicationAmount').val(data[0].LoanApplicationAmount);
            $('#txtLoanApplicationDate').val(data[0].LoanApplicationDate);
            $('#txtDescription').val(data[0].Description);
            if (data[0].LoanStatus == 'Approved' || data[0].LoanStatus == 'Cancel') {
                $('#ddlLoanStatus').attr("disabled", true);
                $('#txtApproveAmount').attr("readonly", true);
                $('#txtApproveDate').attr("readonly", true);
                
            }
            else {
                $('#ddlLoanStatus').attr("disabled", false);
            }
            $('#ddlLoanStatus').val(data[0].LoanStatus);
            $('#txtApproveDate').val(data[0].LoanApproveDate);
            $('#txtApproveAmount').val(data[0].LoanApproveAmount);
            $('#ddlEmiIntegratedsalary').val(data[0].EmiIntegratedWithSalary);
            $('#txtEMIAmount').val(data[0].EmiAmount);
            $('#txtLoanBalanceAmount').val(data[0].LoanBalanceAmount);
            $('#txtLoanApproveBy').val(data[0].LoanApproveByEmoId);
            $('#ddlDisburse').val(data[0].LoanDisburse);
            
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {
            alertify('hi');
        }
    });
}