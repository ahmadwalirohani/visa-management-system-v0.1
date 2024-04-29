<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Slip</title>
    <style>
        body {
            font-family: 'Calibri', sans-serif;
            margin: none;
            background-color: #f4f4f4;
        }

        @media print {
            @page {
                size: A6;
                margin: 0mm;
            }
        }

        @media print {



            body {
                background-color: #fff;
                padding: 0;
            }

            .payment-slip {
                box-shadow: none;
                border: none;
                margin: 0px;
                width: 100%;
                padding: 0px;
                /* A5 width */
                overflow: hidden;
            }
        }

        .payment-slip {
            background-color: #ffffff;
            border-radius: 5px;
            max-width: 600px;
            margin: 0px auto;
        }

        .header,
        .footer {
            background-color: transparent;
            border: 1px solid #333;
            color: #fff;
            padding: 0px;
            text-align: center;
            border-radius: 5px;
        }

        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .label {
            font-weight: bold;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0px 10px;
        }

        .header-logo {
            width: 80px;
            height: auto;
        }

        .company-info {
            flex-grow: 2;
            text-align: left;
            padding-left: 20px;
        }
    </style>
</head>

<body>
    <div class="payment-slip">
        <div class="header nazanin-bold">
            <img src="{{ $system_info->company_logo }}" alt="Company Logo" class="header-logo">
            <div class="company-info">

            </div>
            <br>



        </div>
        <center>
            <h3 style="margin: 0px;padding: 0px"> <strong>پیسو رسید</strong></h3>
        </center>
        <div class="content" dir="rtl">
            <div class="row nazanin-bold">
                <span class="label"> مسلسل نمبر:</span>
                <span id=""><strong style="color: red;text-decoration: underline"> {{ $system_info->payment_no }} </strong></span>
            </div>
            <div class="row nazanin-bold">
                <span class="label">شرکت نوم:</span>
                <span id="payer_name">سلام جان</span>
            </div>
            <div class="row nazanin-bold">
                <span class="label">مبلغ:</span>
                <span id="amount">$500.00</span>
            </div>
            <div class="row nazanin-bold">
                <span class="label">مبلغ په حروفو:</span>
                <span id="words_of_number">$500.00</span>
            </div>
            <div class="row nazanin-bold">
                <span class="label">تاریخ:</span>
                <span id="date">2023-09-23</span>
            </div>
            <div class="row nazanin-bold">
                <span class="label">توزیعات:</span>
                <span id="remarks"> سشی شسیشسیشسیشسیشسیش شسی شسی شسی شسیسی شسی </span>
            </div>

        </div>

        <div class="footer nazanin-bold">
            ...
        </div>
    </div>
</body>

</html>
