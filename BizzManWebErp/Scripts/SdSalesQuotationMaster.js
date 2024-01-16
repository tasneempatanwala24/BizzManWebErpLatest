var optionsOfMaterialDropdownGrid = '';
$(document).ready(function () {
    $("#addRowBtn,#saveDataBtn,.preventDefault").click(function (event) {
        event.preventDefault();
    }); 

    $('#ddlClientName').select2();

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

    BindCustomerDropdown();
    fetchDataList();
    // Add Row button click event
    $("#addRowBtn").on("click", function () {
        addRow();
    });

    // Delete button click event
    $("#dataTable").on("click", ".delete-row", function () {
        $(this).closest("tr").remove();
        toggleTfootVisibility();
        calculateTotalRowAmount(this);
    });

});


function BindCustomerDropdown() {
    $.ajax({
        type: "POST",
        url: 'wSdSalesQuotationMaster.aspx/GetCustomerList',
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
                abranch = abranch + "<option value='" + JSON.parse(response.d)[i].CustomerID + "'>" + JSON.parse(response.d)[i].CustomerName + "</option>";
            }
            $('#ddlClientName').append(abranch);
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}


function GetCustomerDetails() {
    if ($('#ddlClientName').val() != '') {
        $.ajax({
            type: "POST",
            url: 'wSdSalesQuotationMaster.aspx/GetCustomerDetailsById',
            data: JSON.stringify({
                "CustomerId": $('#ddlClientName').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                $('#txtClientAddress').val(data[0].Address);
                $('#txtContactNumber').val(data[0].Mobile);
                $('#txtEmail').val(data[0].Email);
               
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

function addRow() {
    var newRow = $("<tr>");
    var cols = "";

    // Add ItemName column
    cols += '<td><select  class="ddlMaterialName form-control" onchange="FetchUnitMeasure(this);"> < option value = "" > -Select Material Name -</option > </select ></td>';

    // Add Qty with input
    cols += '<td><input class="txtQuantity" onchange="calculateTotalRowAmount(this)" type="text" value="0" class="form-control"oninput="handleNumericInput(event)"></td>';

    // Add Rate with input
    cols += '<td><input class="txtRate" onchange="calculateTotalRowAmount(this)" type="text" value="0" class="form-control" oninput="handleNumericInput(event)"></td>';

    // Add Discount with input
    cols += '<td><input class="txtDiscount" onchange="calculateTotalRowAmount(this)" type="text" value="0" class="form-control" oninput="handleNumericInput(event)"></td>';

    // Add GST
    cols += '<td><input class="txtGST" type="text" class="form-control" disabled></td>';

    // Add Amount
    cols += '<td><input class="txtAmount" type="text" class="form-control" disabled></td>';


   

    // Add Action column with delete button
    cols += '<td>' +
        '<button class="btn btn-danger delete-row"><i class="fas fa-trash"></i></button>' +
        '</td>';

    newRow.append(cols);
    $("#dataTable tbody").append(newRow);

    if (optionsOfMaterialDropdownGrid == '') {
        FetchBOMDetailsMaterials();
    }
    else {
        var dropdown = $('#dataTable tbody tr:last-child .ddlMaterialName');

        dropdown.append(optionsOfMaterialDropdownGrid);
    }

    toggleTfootVisibility();
}

function toggleTfootVisibility() {
    var hasRows = $('#dataTable tbody tr').length > 0;
    $('#dataTable tfoot').toggleClass('no-rows-footer', !hasRows);
}

function FetchBOMDetailsMaterials() {
  
   
        $.ajax({
            type: "POST",
            url: 'wSdSalesQuotationMaster.aspx/MaterialMasterList',
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {
                var dropdown = $('#dataTable tbody tr:last-child .ddlMaterialName');
                dropdown.html('');
                var data = JSON.parse(response.d);
                var req = "<option value=''>-Select Material-</option>";
                for (var i = 0; i < JSON.parse(response.d).length; i++) {
                    req = req + "<option value='" + JSON.parse(response.d)[i].Id + "'>" + JSON.parse(response.d)[i].MaterialName + "</option>";
                }
                optionsOfMaterialDropdownGrid = req;
                dropdown.append(req);
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    
}

function FetchUnitMeasure(dropdown) {
    var row = $(dropdown).closest('tr');
   
    if ($(dropdown).val() != '') {
        $.ajax({
            type: "POST",
            url: 'wSdSalesQuotationMaster.aspx/FetchMaterialDetails',
            data: JSON.stringify({
                "MaterialId": $(dropdown).val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

            },
            success: function (response) {

                var data = JSON.parse(response.d);
                //  $('#txtMaterialUnitMeasure').val(data[0].IntegratedTaxPercent);
                //$('#txtMaterialRate').val(data[0].MRP);
                row.find('.txtRate').val(data[0].MRP);
                row.find('.txtGST').val(data[0].IntegratedTaxPercent);
                calculateTotalRowAmount(dropdown);
            },
            complete: function () {

            },
            failure: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
    else {
        row.find('.txtRate').val('0');
        row.find('.txtGST').val('');
    }
}

function calculateTotalRowAmount(obj) {
    var row = $(obj).closest('tr');
   
    var materialID = $(row).find('.ddlMaterialName').val();
    if (materialID != '') {
        var qty = $(row).find('.txtQuantity').val();
        var rate = $(row).find('.txtRate').val();
        var discount = $(row).find('.txtDiscount').val();
        var gst = $(row).find('.txtGST').val();
        var amount = (qty * rate) * (1 - discount / 100) * (1 + gst / 100);

      
        $(row).find('.txtAmount').val(amount.toFixed(2));
        calculateGrandTotal();
    }
    
}

// Function to calculate grand total, grand total GST, and net amount
function calculateGrandTotal() {
    var grandTotal = 0;
    var grandTotalGST = 0;
    var shippingCharges = parseFloat($('#ShippingCharges').val());
    // Iterate through each row in the table body
    $('#dataTable tbody tr').each(function () {
        var qty = parseFloat($(this).find('.txtQuantity').val());
        var rate = parseFloat($(this).find('.txtRate').val());

        var totalAmount = parseFloat($(this).find('.txtAmount').val());
        grandTotal += totalAmount;

        const gst = parseFloat($(this).find('.txtGST').val());
        grandTotalGST += (qty * rate) * (gst / 100);
    });

    // Display the calculated values in the table footer
    $('#grandTotal').val(grandTotal.toFixed(2));
    $('#grandTotalGST').val(grandTotalGST.toFixed(2));
    grandTotal += shippingCharges
    $('#netAmount').val(grandTotal.toFixed(2));
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

// Event listener for datepicker change
function QuotationDateChange() {
    // Generate Quotation ID based on the selected date
    const selectedDate = $('#quotationDate').val();
    if (selectedDate) {
        // Parse the date using moment.js with the correct format
        const momentDate = moment(selectedDate, 'DD/MM/YYYY');
        // Check if the parsed date is valid
        if (momentDate.isValid()) {
            // Format the date as 'YYYY/MM/DD'
            const formattedDate = momentDate.format('YYYY/MM/DD');
            const quotationId = 'QUOT' + formattedDate + '/' + generateRandomNumber();

            // Set the generated Quotation ID to the textbox
            $('#txtQuotation').val(quotationId);
        } else {
            // Handle invalid date input
            console.error('Invalid date format:', selectedDate);
        }
    }
}

// Function to generate a random number (nnnn)
function generateRandomNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
}



function saveData() {
    if ($('#quotationDate').val() == '') {
        alertify.error("Please enter Quotation Date");
        return;
    }
    else if ($('#ddlClientName').val() == '')
    {
        alertify.error("Please Select Customer Name");
        return;
    }
    else if ($('#notes').val() == '') {
        alertify.error("Please Enter Notes");
        return;
    }
    else if ($('#terms').val() == '') {
        alertify.error("Please Enter Terms and Conditions");
        return;
    }
    var hasRows = $('#dataTable tbody tr').length > 0;
    if (!hasRows) {
        alertify.error("Please Enter some items.");
        return;
    }
    var data = [];
    $("#dataTable tbody tr").each(function () {
       

        var materialID = $(this).find('.ddlMaterialName').val();
        var qty = $(this).find('.txtQuantity').val();
        var rate = $(this).find('.txtRate').val();
        var discount = $(this).find('.txtDiscount').val();
        var gst = $(this).find('.txtGST').val();
        var amount = $(this).find('.txtAmount').val();
        data.push({ ItemID: materialID, Quantity: qty, Rate: rate, Discount: discount, GST: gst, Amount: amount });
    });
    var quotationId = $('#txtQuotation').val();
    var customerId = $('#ddlClientName').val();
    var quotationDate = $('#quotationDate').val();
    var loginuser = $('#ContentPlaceHolder1_loginuser').val();
    var NetTotal = $('#grandTotal').val(); 
    var NetGST = $('#grandTotalGST').val(); 
    var ShippingCharges = $('#ShippingCharges').val(); 
    var NetAmount = $('#netAmount').val(); 
    var Notes = $('#notes').val(); 
    var TermsAndConditions = $('#terms').val(); 
    // Send data to server using AJAX
    $.ajax({
        type: "POST",
        url: "wSdSalesQuotationMaster.aspx/AddtSalesQuotationMasterAndDetails", // Adjust the URL based on your setup
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ data: data, QuotationId: quotationId, CustomerId: customerId, QuotationDate: quotationDate, CreateBy: loginuser, NetTotal: NetTotal, NetGST: NetGST, ShippingCharges: ShippingCharges, NetAmount: NetAmount, Notes: Notes, TermsAndConditions: TermsAndConditions }),
        dataType: "json",
        success: function (response) {
            alertify.success('Sales Quotation details added successfully');
            ClearAll();
        },
        error: function (error) {
            console.log(error);
            alertify.error("Error saving data. Please try again.");
        }
    });
}

function ClearAll() {
    $('#dataTable tbody tr').remove();
    $('#txtQuotation').val('');
    $('#quotationDate').val('');
    $('#txtClientAddress').val('');
    $('#txtContactNumber').val('');
    $('#txtEmail').val('');
    $('#notes').val('');
    $('#terms').val('');
    $('#ShippingCharges').val('0')
    toggleTfootVisibility();
    $('#ddlClientName').val('');
}

function CreateData() {
    //  $('#divEmpJobList').hide();
    $('#divDataList').hide();
    $('#divDataItemsView').hide();
    $('#ContentPlaceHolder1_PrintDataBtn').hide();
    //  $('#divEmpJobEntry').show();
    $('#divDataEntry').show();
    $('#saveDataBtn').show();
    ClearAll();
}

function ViewDataList() {
    //  $('#divEmpJobList').hide();
    $('#divDataList').show();
    $('#divDataItemsView').hide();
    $('#ContentPlaceHolder1_PrintDataBtn').hide();
    //  $('#divEmpJobEntry').show();
    $('#divDataEntry').hide();
    $('#saveDataBtn').hide();
    fetchDataList();
   
}

function fetchDataList() {
    console.log("Fetching data...");
    $.ajax({
        type: "POST",
        url: 'wSdSalesQuotationMaster.aspx/FetchMasterList',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = JSON.parse(response.d);
            console.log("Data fetched successfully:", data);
            displayDataList(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error");
            console.error("AJAX Error:", textStatus, errorThrown);
        }
    });
    console.log("End...");
}


function displayDataList(data) {
    var tableBody = $('#tbody_EmpJob_List');
    tableBody.empty(); // Clear existing rows
    console.log("display details me");
    for (var i = 0; i < data.length; i++) {
        var sqlDate = new Date(data[i].QuotationDate);
        var formattedDate = formatDate(sqlDate);
        var row = '<tr onclick="GetSdSalesQuotationMasterById(\'' + data[i].QuotationId + '\')">';
        row += '<td>' + data[i].QuotationId + '</td>';
        row += '<td>' + formattedDate + '</td>';
        row += '<td>' + data[i].ContactName + '</td>';
        row += '<td>' + data[i].NetTotal + '</td>';
        row += '<td>' + data[i].NetAmount + '</td>';
        row += '<td>' + data[i].ShippingCharges + '</td>';
        row += '<td>' + data[i].Notes + '</td>';
        row += '<td>' + data[i].TermsAndConditions + '</td>';
        row += '</tr>';

        tableBody.append(row);
    }

    // Initialize or reinitialize DataTable
    $('#tblEmpJobList').DataTable();
}
function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Month is zero-based
    var year = date.getFullYear();

    // Add leading zero if day or month is a single digit
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return month + '/' + day + '/' + year;
}

function GetSdSalesQuotationMasterById(QuoatId) {
   
    $('#divDataList').hide();
    $('#divDataEntry').hide();
    $('#saveDataBtn').hide();
    $.ajax({
        type: "POST",
        url: 'wSdSalesQuotationMaster.aspx/GetSdSalesQuotationMasterById',
        data: JSON.stringify({
            "QuotationId": QuoatId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (response) {
            var data = JSON.parse(response.d);
            $('#disptxtCustomerName').val(data.SalesQuotationMastertInfo.CustomerName)
            $('#dispQuotationDate').val(data.SalesQuotationMastertInfo.QuotationDate)
            $('#disptxtClientAddress').val(data.SalesQuotationMastertInfo.Address)
            $('#disptxtQuotation').val(data.SalesQuotationMastertInfo.QuotationId)
            $('#disptxtContactNumber').val(data.SalesQuotationMastertInfo.Mobile)
            $('#disptxtEmail').val(data.SalesQuotationMastertInfo.Email)
            $('#dispgrandTotal').val(data.SalesQuotationMastertInfo.NetTotal)
            $('#dispgrandTotalGST').val(data.SalesQuotationMastertInfo.NetGST)
            $('#dispShippingCharges').val(data.SalesQuotationMastertInfo.ShippingCharges)
            $('#dispnetAmount').val(data.SalesQuotationMastertInfo.NetAmount)
            $('#dispnotes').val(data.SalesQuotationMastertInfo.Notes)
            $('#dispterms').val(data.SalesQuotationMastertInfo.TermsAndConditions)

            var html = '';
            for (var i = 0; i < data.SalesItems[0].Table.length; i++) {
                html = html + '<tr"><td>' + data.SalesItems[0].Table[i].materialName + '</td>'
                    + '<td>' + data.SalesItems[0].Table[i].Qty + '</td>'
                    + '<td>' + data.SalesItems[0].Table[i].Rate + '</td>'
                    + '<td>' + data.SalesItems[0].Table[i].Discount + '</td>'
                    + '<td>' + data.SalesItems[0].Table[i].GST + '</td>'
                    + '<td>' + data.SalesItems[0].Table[i].Amount + '</td></tr>';
            }
            $('#salesItemBody').html(html);
            $('#divDataItemsView').show();   
            $('#ContentPlaceHolder1_PrintDataBtn').show();
        },
        complete: function () {

        },
        failure: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

function generatePDF() {

    $('#divDataList').hide();
    $('#divDataEntry').hide();
    $('#saveDataBtn').hide();

    $('#ContentPlaceHolder1_printQuotationId').val($('#disptxtQuotation').val());
    

    //$.ajax({
    //    type: "POST",
    //    url: 'wSdSalesQuotationMaster.aspx/GeneratePDF',
    //    data: JSON.stringify({
    //        "QuotationId": $('#disptxtQuotation').val()
    //    }),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    beforeSend: function () {

    //    },
    //    success: function (response) {
    //        // Trigger download on success
    //        // Log the PDF data
    //        console.log(response.d);
    //      // downloadPDF(response.d);
    //       // window.location.href = response.d;
    //        window.open(response.d, '_blank');
    //    },
    //    complete: function () {

    //    },
    //    failure: function (jqXHR, textStatus, errorThrown) {

    //    }
    //});
}
function downloadPDF(pdfData) {
    // Create a blob from the PDF data
    var blob = new Blob([pdfData], { type: "application/pdf" });

    // Create a link element to trigger the download
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "example.pdf";

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
}