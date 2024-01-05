﻿<%@ Page Title="" Language="C#" MasterPageFile="~/POS.Master" AutoEventWireup="true" CodeBehind="wfPosCustomer.aspx.cs" Inherits="BizzManWebErp.wfPosCustomer" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript"
        src="https://code.jquery.com/jquery-3.5.1.js">
    </script>
    <!-- DataTables CSS -->
    <link rel="stylesheet"
        href="https://cdn.datatables.net/1.10.23/css/jquery.dataTables.min.css">
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.10.23/js/jquery.dataTables.min.js">
    </script>
    <link href="css/style.css" rel="stylesheet" />
    <link href="css/POS.css" rel="stylesheet" />
    <script src="Scripts/bootstrap.min.js"></script>
    <link href="css/jquery-ui.css" rel="stylesheet" />
    <script src="Scripts/jquery-ui.min.js"></script>
    <script src="Scripts/moment.min.js"></script>
    <script src="Scripts/PosCustomerMaster.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="POS-Content">
        <div class="window">
            <div class="screen">
                <div class="screen-content">
                    <div class="top-content">
                        <input type="hidden" id="loginuser" runat="server" />
                        <button onclick="CreateCustomer();" class="buttonCreatCustomer" id="btncreate">Create</button>
                        <button class="buttonCreatCustomer" id="btnView" onclick="ViewCustomerList();">View</button>
                        <button onclick="Discard();" class="buttonCreatCustomer">Discard</button>
                        <button onclick="AddCustomer();" id="btnsave" style="display: none;" class="buttonCreatCustomer">Save</button>
                        <input class="form-control py-2 rounded-pill mr-1 pr-5 SearchCustomer" type="search" value="Search Customer" id="example-search-input" hidden="hidden">
                    </div>
                    <div class="subwindow-container-fix scrollable-y" id="DivCustomerList">
                        <table class="client-list" id="tblCustomerList">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody class="client-list-contents" id="tbodycustomerList"></tbody>
                        </table>
                    </div>
                    <div class="client-details edit" id="createDiv">
                        <%--<div class="client-picture">
                            <img id="imgphoto" />
                             <i role="img" aria-label="Picture" title="Picture" class="fa fa-camera"></i>
                            <input type="file" class="image-uploader" id="imgupload" onclick="OpenFileUploader();">
                        </div>--%>
                        <div class="client-detail">
                            <span class="label">Customer Name</span>
                            <input name="Id" placeholder="Id" class="detail client-name" hidden="hidden" id="txtCustomerId">
                            <input name="name" placeholder="Name" class="detail client-name" id="txtCustomerName">
                        </div>
                        <div class="client-details-box clearfix">
                            <div class="client-details-left">
                                <div class="client-detail">
                                    <span class="label">Street</span>
                                    <input name="street" value="" placeholder="Street" class="leftside" id="txtStreet">
                                </div>
                                <div class="client-detail">
                                    <span class="label">City</span>
                                    <input name="city" value="" placeholder="City" class="leftside" id="txtcity">
                                </div>
                                <div class="client-detail">
                                    <span class="label">Postcode</span>
                                    <input name="zip" value="" placeholder="ZIP" class="leftside" id="txtpostcode" onkeypress="return ValidateNumber(event);">
                                </div>

                                <div class="client-detail">
                                    <span class="label">State</span>
                                    <select name="state_id" class="leftside" id="ddlstate">
                                        <option value="">None</option>
                                        <option value="577">Andaman and Nicobar</option>
                                        <option value="578">Andhra Pradesh</option>
                                        <option value="579">Arunachal Pradesh</option>
                                        <option value="580">Assam</option>
                                        <option value="581">Bihar</option>
                                        <option value="583">Chattisgarh</option>
                                        <option value="582">Chandigarh</option>
                                        <option value="585">Daman and Diu</option>
                                        <option value="586">Delhi</option>
                                        <option value="584">Dadra and Nagar Haveli</option>
                                        <option value="587">Goa</option>
                                        <option value="588">Gujarat</option>
                                        <option value="590">Himachal Pradesh</option>
                                        <option value="589">Haryana</option>
                                        <option value="1384">Other Territory</option>
                                        <option value="592">Jharkhand</option>
                                        <option value="591">Jammu and Kashmir</option>
                                        <option value="593">Karnataka</option>
                                        <option value="594">Kerala</option>
                                        <option value="595">Lakshadweep</option>
                                        <option value="597">Maharashtra</option>
                                        <option value="599">Meghalaya</option>
                                        <option value="598">Manipur</option>
                                        <option value="596">Madhya Pradesh</option>
                                        <option value="600">Mizoram</option>
                                        <option value="601">Nagaland</option>
                                        <option value="602">Orissa</option>
                                        <option value="604">Punjab</option>
                                        <option value="603">Puducherry</option>
                                        <option value="605">Rajasthan</option>
                                        <option value="606">Sikkim</option>
                                        <option value="607">Tamil Nadu</option>
                                        <option value="609">Tripura</option>
                                        <option value="608">Telangana</option>
                                        <option value="611">Uttarakhand</option>
                                        <option value="610">Uttar Pradesh</option>
                                        <option value="612">West Bengal</option>
                                    </select>
                                </div>
                                <div class="client-detail">
                                    <span class="label">Country</span>
                                    <select name="country_id" class="leftside" id="ddlcountry">
                                        <option value="">None</option>
                                        <option value="3">Afghanistan</option>
                                        <option value="6">Albania</option>
                                        <option value="15">Åland Islands</option>
                                        <option value="62">Algeria</option>
                                        <option value="11">American Samoa</option>
                                        <option value="1">Andorra</option>
                                        <option value="8">Angola</option>
                                        <option value="5">Anguilla</option>
                                        <option value="9">Antarctica</option>
                                        <option value="4">Antigua and Barbuda</option>
                                        <option value="10">Argentina</option>
                                        <option value="7">Armenia</option>
                                        <option value="14">Aruba</option>
                                        <option value="13">Australia</option>
                                        <option value="12">Austria</option>
                                        <option value="16">Azerbaijan</option>
                                        <option value="32">Bahamas</option>
                                        <option value="23">Bahrain</option>
                                        <option value="19">Bangladesh</option>
                                        <option value="18">Barbados</option>
                                        <option value="36">Belarus</option>
                                        <option value="20">Belgium</option>
                                        <option value="37">Belize</option>
                                        <option value="25">Benin</option>
                                        <option value="27">Bermuda</option>
                                        <option value="33">Bhutan</option>
                                        <option value="29">Bolivia</option>
                                        <option value="30">Bonaire, Sint Eustatius and Saba</option>
                                        <option value="17">Bosnia and Herzegovina</option>
                                        <option value="35">Botswana</option>
                                        <option value="34">Bouvet Island</option>
                                        <option value="31">Brazil</option>
                                        <option value="105">British Indian Ocean Territory</option>
                                        <option value="28">Brunei Darussalam</option>
                                        <option value="22">Bulgaria</option>
                                        <option value="21">Burkina Faso</option>
                                        <option value="24">Burundi</option>
                                        <option value="116">Cambodia</option>
                                        <option value="47">Cameroon</option>
                                        <option value="38">Canada</option>
                                        <option value="52">Cape Verde</option>
                                        <option value="123">Cayman Islands</option>
                                        <option value="40">Central African Republic</option>
                                        <option value="214">Chad</option>
                                        <option value="46">Chile</option>
                                        <option value="48">China</option>
                                        <option value="54">Christmas Island</option>
                                        <option value="39">Cocos (Keeling) Islands</option>
                                        <option value="49">Colombia</option>
                                        <option value="118">Comoros</option>
                                        <option value="42">Congo</option>
                                        <option value="45">Cook Islands</option>
                                        <option value="50">Costa Rica</option>
                                        <option value="97">Croatia</option>
                                        <option value="51">Cuba</option>
                                        <option value="53">Curaçao</option>
                                        <option value="55">Cyprus</option>
                                        <option value="56">Czech Republic</option>
                                        <option value="44">Côte d'Ivoire</option>
                                        <option value="41">Democratic Republic of the Congo</option>
                                        <option value="59">Denmark</option>
                                        <option value="58">Djibouti</option>
                                        <option value="60">Dominica</option>
                                        <option value="61">Dominican Republic</option>
                                        <option value="63">Ecuador</option>
                                        <option value="65">Egypt</option>
                                        <option value="209">El Salvador</option>
                                        <option value="87">Equatorial Guinea</option>
                                        <option value="67">Eritrea</option>
                                        <option value="64">Estonia</option>
                                        <option value="69">Ethiopia</option>
                                        <option value="72">Falkland Islands</option>
                                        <option value="74">Faroe Islands</option>
                                        <option value="71">Fiji</option>
                                        <option value="70">Finland</option>
                                        <option value="75">France</option>
                                        <option value="79">French Guiana</option>
                                        <option value="174">French Polynesia</option>
                                        <option value="215">French Southern Territories</option>
                                        <option value="76">Gabon</option>
                                        <option value="84">Gambia</option>
                                        <option value="78">Georgia</option>
                                        <option value="57">Germany</option>
                                        <option value="80">Ghana</option>
                                        <option value="81">Gibraltar</option>
                                        <option value="88">Greece</option>
                                        <option value="83">Greenland</option>
                                        <option value="77">Grenada</option>
                                        <option value="86">Guadeloupe</option>
                                        <option value="91">Guam</option>
                                        <option value="90">Guatemala</option>
                                        <option value="82">Guernsey</option>
                                        <option value="85">Guinea</option>
                                        <option value="92">Guinea-Bissau</option>
                                        <option value="93">Guyana</option>
                                        <option value="98">Haiti</option>
                                        <option value="95">Heard Island and McDonald Islands</option>
                                        <option value="236">Holy See (Vatican City State)</option>
                                        <option value="96">Honduras</option>
                                        <option value="94">Hong Kong</option>
                                        <option value="99">Hungary</option>
                                        <option value="108">Iceland</option>
                                        <option value="104" selected="">India</option>
                                        <option value="100">Indonesia</option>
                                        <option value="107">Iran</option>
                                        <option value="106">Iraq</option>
                                        <option value="101">Ireland</option>
                                        <option value="103">Isle of Man</option>
                                        <option value="102">Israel</option>
                                        <option value="109">Italy</option>
                                        <option value="111">Jamaica</option>
                                        <option value="113">Japan</option>
                                        <option value="110">Jersey</option>
                                        <option value="112">Jordan</option>
                                        <option value="124">Kazakhstan</option>
                                        <option value="114">Kenya</option>
                                        <option value="117">Kiribati</option>
                                        <option value="250">Kosovo</option>
                                        <option value="122">Kuwait</option>
                                        <option value="115">Kyrgyzstan</option>
                                        <option value="125">Laos</option>
                                        <option value="134">Latvia</option>
                                        <option value="126">Lebanon</option>
                                        <option value="131">Lesotho</option>
                                        <option value="130">Liberia</option>
                                        <option value="135">Libya</option>
                                        <option value="128">Liechtenstein</option>
                                        <option value="132">Lithuania</option>
                                        <option value="133">Luxembourg</option>
                                        <option value="147">Macau</option>
                                        <option value="141">Madagascar</option>
                                        <option value="155">Malawi</option>
                                        <option value="157">Malaysia</option>
                                        <option value="154">Maldives</option>
                                        <option value="144">Mali</option>
                                        <option value="152">Malta</option>
                                        <option value="142">Marshall Islands</option>
                                        <option value="149">Martinique</option>
                                        <option value="150">Mauritania</option>
                                        <option value="153">Mauritius</option>
                                        <option value="246">Mayotte</option>
                                        <option value="156">Mexico</option>
                                        <option value="73">Micronesia</option>
                                        <option value="138">Moldova</option>
                                        <option value="137">Monaco</option>
                                        <option value="146">Mongolia</option>
                                        <option value="139">Montenegro</option>
                                        <option value="151">Montserrat</option>
                                        <option value="136">Morocco</option>
                                        <option value="158">Mozambique</option>
                                        <option value="145">Myanmar</option>
                                        <option value="159">Namibia</option>
                                        <option value="168">Nauru</option>
                                        <option value="167">Nepal</option>
                                        <option value="165">Netherlands</option>
                                        <option value="160">New Caledonia</option>
                                        <option value="170">New Zealand</option>
                                        <option value="164">Nicaragua</option>
                                        <option value="161">Niger</option>
                                        <option value="163">Nigeria</option>
                                        <option value="169">Niue</option>
                                        <option value="162">Norfolk Island</option>
                                        <option value="120">North Korea</option>
                                        <option value="143">North Macedonia</option>
                                        <option value="148">Northern Mariana Islands</option>
                                        <option value="166">Norway</option>
                                        <option value="171">Oman</option>
                                        <option value="177">Pakistan</option>
                                        <option value="184">Palau</option>
                                        <option value="172">Panama</option>
                                        <option value="175">Papua New Guinea</option>
                                        <option value="185">Paraguay</option>
                                        <option value="173">Peru</option>
                                        <option value="176">Philippines</option>
                                        <option value="180">Pitcairn Islands</option>
                                        <option value="178">Poland</option>
                                        <option value="183">Portugal</option>
                                        <option value="181">Puerto Rico</option>
                                        <option value="186">Qatar</option>
                                        <option value="188">Romania</option>
                                        <option value="190">Russian Federation</option>
                                        <option value="191">Rwanda</option>
                                        <option value="187">Réunion</option>
                                        <option value="26">Saint Barthélémy</option>
                                        <option value="198">Saint Helena, Ascension and Tristan da Cunha</option>
                                        <option value="119">Saint Kitts and Nevis</option>
                                        <option value="127">Saint Lucia</option>
                                        <option value="140">Saint Martin (French part)</option>
                                        <option value="179">Saint Pierre and Miquelon</option>
                                        <option value="237">Saint Vincent and the Grenadines</option>
                                        <option value="244">Samoa</option>
                                        <option value="203">San Marino</option>
                                        <option value="192">Saudi Arabia</option>
                                        <option value="204">Senegal</option>
                                        <option value="189">Serbia</option>
                                        <option value="194">Seychelles</option>
                                        <option value="202">Sierra Leone</option>
                                        <option value="197">Singapore</option>
                                        <option value="210">Sint Maarten (Dutch part)</option>
                                        <option value="201">Slovakia</option>
                                        <option value="199">Slovenia</option>
                                        <option value="193">Solomon Islands</option>
                                        <option value="205">Somalia</option>
                                        <option value="247">South Africa</option>
                                        <option value="89">South Georgia and the South Sandwich Islands</option>
                                        <option value="121">South Korea</option>
                                        <option value="207">South Sudan</option>
                                        <option value="68">Spain</option>
                                        <option value="129">Sri Lanka</option>
                                        <option value="182">State of Palestine</option>
                                        <option value="195">Sudan</option>
                                        <option value="206">Suriname</option>
                                        <option value="200">Svalbard and Jan Mayen</option>
                                        <option value="212">Swaziland</option>
                                        <option value="196">Sweden</option>
                                        <option value="43">Switzerland</option>
                                        <option value="211">Syria</option>
                                        <option value="208">São Tomé and Príncipe</option>
                                        <option value="227">Taiwan</option>
                                        <option value="218">Tajikistan</option>
                                        <option value="228">Tanzania</option>
                                        <option value="217">Thailand</option>
                                        <option value="223">Timor-Leste</option>
                                        <option value="216">Togo</option>
                                        <option value="219">Tokelau</option>
                                        <option value="222">Tonga</option>
                                        <option value="225">Trinidad and Tobago</option>
                                        <option value="221">Tunisia</option>
                                        <option value="224">Turkey</option>
                                        <option value="220">Turkmenistan</option>
                                        <option value="213">Turks and Caicos Islands</option>
                                        <option value="226">Tuvalu</option>
                                        <option value="232">USA Minor Outlying Islands</option>
                                        <option value="230">Uganda</option>
                                        <option value="229">Ukraine</option>
                                        <option value="2">United Arab Emirates</option>
                                        <option value="231">United Kingdom</option>
                                        <option value="233">United States</option>
                                        <option value="234">Uruguay</option>
                                        <option value="235">Uzbekistan</option>
                                        <option value="242">Vanuatu</option>
                                        <option value="238">Venezuela</option>
                                        <option value="241">Vietnam</option>
                                        <option value="239">Virgin Islands (British)</option>
                                        <option value="240">Virgin Islands (USA)</option>
                                        <option value="243">Wallis and Futuna</option>
                                        <option value="66">Western Sahara</option>
                                        <option value="245">Yemen</option>
                                        <option value="248">Zambia</option>
                                        <option value="249">Zimbabwe</option>
                                    </select>
                                </div>
                            </div>
                            <div class="client-details-right">
                                <div class="client-detail">
                                    <span class="label">Language</span>
                                    <select name="lang" class="rightside" id="ddllanguage">
                                        <option value="">None</option>
                                        <option value="en_US" selected="">English (US)</option>
                                    </select>
                                </div>
                                <div class="client-detail">
                                    <span class="label">Email</span>
                                    <input name="email" type="email" value="" class="rightside" id="txtemail">
                                </div>
                                <div class="client-detail">
                                    <span class="label">Phone</span>
                                    <input name="phone" type="tel" value="" class="rightside" id="txtphone" onkeypress="return ValidateNumber(event);" maxlength="10">
                                </div>
                                <div class="client-detail">
                                    <span class="label">Barcode</span>
                                    <input name="barcode" value="" class="rightside" id="txtbarcode">
                                </div>
                                <div class="client-detail">
                                    <span class="label">Tax ID</span>
                                    <input name="vat" value="" class="rightside" id="txttaxId">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
