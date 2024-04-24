<!DOCTYPE html>
<html>

<head>
    <title></title>
</head>
<style type="text/css">
    body {
        font-family: 'Calibri', sans-serif;
        margin: 0px;
        padding: 0px;
    }

    .container {
        width: 100%;
        height: auto;
    }

    .container .header {
        width: 100%;
        height: auto;
    }

    .logo {
        position: absolute;
        top: 10px;
        left: 30px;
    }

    .header .info {
        margin-right: 30px;
        float: right;
    }

    .header .info table td {
        border-bottom: 1px dotted;
        padding: 15px;
    }

    .header .info table {
        position: relative;
        top: -10px;
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;
    }

    .header .info table td:nth-child(2),
    td:nth-child(3) {
        padding-right: 90px;
    }

    .header .info table td:nth-child(3) {
        padding-right: 90px;
    }

    .data {
        width: 100%;
        clear: both;

    }

    .data table {
        padding: 10px;
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;

    }

    .data td,
    th {
        border: 1px solid gray;
        padding: 5px;
    }

    .data tr {
        background-color: rgb(108, 226, 108);
    }

    .data th {
        background-color: rgb(192, 185, 185);
    }



    .total {
        width: 20%;
        height: auto;
        float: left;
        padding: 10px;
    }

    .total table {
        padding: 5px;
        width: 200px;
        table-layout: auto;
        border-collapse: collapse;
    }

    .total td {
        padding: 5px;
    }

    .total tr {
        border-bottom: 1px solid gray;
    }

    .total td:nth-child(odd) {
        background-color: rgb(231, 227, 227);
    }

    .note {
        width: 20%;
        height: auto;
        float: right;
        margin-right: 20px;
    }

    .note h3 {
        margin-bottom: 0px;
    }

    .note p {
        margin-top: 0px;
        background-color: rgb(230, 220, 89);
        width: 300px;
        padding: 15px;
        border-top: 2px solid black;
        height: 80px;
        text-align: justify;
    }

    .total_visa {
        width: 300px;
        position: relative;
        right: 50%;
        top: -130px;
        height: auto;
    }

    .total_visa table {
        padding: 5px;
        width: 200px;
        table-layout: auto;
        border-collapse: collapse;
    }

    .total_visa td {
        padding: 5px;
    }

    .total_visa tr {
        border-bottom: 1px solid gray;
    }

    .total_visa td:nth-child(odd) {
        background-color: rgb(72, 157, 163);
    }
</style>

<body dir="rtl">
    <div class="logo">
        <img src="{{ asset($system_info->company_logo) }}" width="170" height="170" alt="">
    </div>
    <div class="container">
        <h2 align="center" class="nazanin-bold">صورت حساب<span id="cus_name">:احمدولي</span></h2>
        <div class="header nazanin-regular">
            <div class="info">
                <table class="nazanin-bold">
                    <tr>
                        <td>جمله حساب </td>
                        <td id="totalAmount"></td>
                        <td id="currency">افغاني</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>از تاریخ</td>
                        <td id="fromDate">1400/7/4</td>
                        <td>تا تاریخ</td>
                        <td colspan="2" id="toDate">1400/7/4</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="data">
            <table class="nazanin-regular">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>تاریخ</th>
                        <th>نام و تخلص</th>
                        <th>ولایت</th>
                        <th>شغل</th>
                        <th>پاسپورټ</th>
                        <th>بلاک</th>
                        <th>نوع ويزا</th>
                        <th> نوع دخول</th>
                        <th>اقامه</th>
                        <th>شماره سند</th>
                        <th>رسیدګي</th>
                        <th>بردګي</th>
                        <th>بلانس</th>
                    </tr>
                </thead>
                <tbody id="body">
                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>
                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>
                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>
                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>

                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>
                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>
                    <tr>
                        <td> 1 </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td colspan="8" style="background-color: wheat;">sdfds</td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                        <td> تنمسیتب </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="total">
            <table class="nazanin-bold">
                <tr>
                    <td>جمله رسیدګي شرکت</td>
                    <td id="totalCredit">123</td>
                </tr>
                <tr>
                    <td>جمله بردګي شرکت</td>
                    <td id="totalDebit">123</td>
                </tr>
                <tr>
                    <td style="background:rgb(108, 226, 108) ">باقیمانده</td>
                    <td id="reminder" style="background:rgb(108, 226, 108) ">234234</td>
                </tr>
            </table>
        </div>
        <div class="note nazanin-regular">
            <h3>نوټ:</h3>
            <p>در صورت مشاهده هر ګونه مشکل اطلاع رسانی کنید. <br /> لطفاً به ګرفتن حواله ما را بیشتر کمک کنید تا به شما خدمت کنیم.</p>
        </div>
        <div class="total_visa">
            <table class="nazanin-bold">
                <tr>
                    <td>تعداد ویزه</td>
                    <td id="visaCount">232</td>
                </tr>
                <tr>
                    <td>جمله حساب</td>
                    <td id="visaAmount">2344</td>
                </tr>
            </table>
        </div>
    </div>
</body>

</html>