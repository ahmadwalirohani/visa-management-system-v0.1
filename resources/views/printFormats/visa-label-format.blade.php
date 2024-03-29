<!DOCTYPE html>
<html lang="en" dir="rtl">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>A6 Printout</title>
    <style>
        body {
            font-family: 'Calibri', sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 2.95in;
            /* A6 width */
            height: fit-content;
            /* A6 height */
            margin: auto;
            border: 2px solid black;
            border-radius: 10px;
            padding: 2px;
            box-sizing: border-box;
        }

        header,
        footer {
            text-align: center;
            padding: 5px 0;
        }

        header {
            display: flex;
        }

        .logo {
            margin-right: auto;
            width: 50%;
        }

        .company-info {
            margin-left: auto;
            width: 50%;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table,
        th,
        td {
            border-bottom: 1px solid black;
            padding: 8px;
            text-align: center;
        }

        footer .barcode {
            display: block;
            margin: 0 auto;
            margin-top: 10px;
        }

        @media print {
            @page {
                size: A6;
                margin: 0mm;
            }
        }
    </style>
</head>

<body>


    <div class="container">
        <header>
            <div class="company-info">
                @if($is_urgent == 1)
                <img src="/urgent.png" style="width: 100%; height: 50px; transform:rotate(350deg)" alt="">
                @endif
                <h3>p-1234567890</h3>
            </div>
            <div class="logo">

                <img src="https://system.azizivisaservices.com/assets/images/Logo-images/azizi-logo.png" alt="Logo" width="130" />

            </div>
        </header>
        <section>
            <table>
                <tbody>
                    <tr>
                        <th>نام و تخلص</th>
                        <td id="name">نذیر احمد یارزاده</td>
                    </tr>
                    <tr>
                        <th>نوع ویزا</th>
                        <td id="type">ورود شش ماه چند بار</td>
                    </tr>
                    <tr>
                        <th id="dynamic_type">پالک</th>
                        <td id="dynamic_value">نماینده شرکت</td>
                    </tr>
                    <tr>
                        <th>مربوط</th>
                        <td id="customer">شرکت نوروزی</td>
                    </tr>
                    <tr>
                        <th>تاریخ</th>
                        <td>{{ Morilog\Jalali\Jalalian::now()}}</td>
                    </tr>
                    <!-- Add more rows as needed -->
                </tbody>
            </table>
        </section>
        <footer>
            <div class="barcode">
                <div style="margin: auto;background:none;width:100%">
                    {!!
                    DNS1D::getBarcodeSVG((string)$visa_no, 'C128')
                    !!}
                </div>
            </div>
        </footer>
    </div>
</body>

</html>