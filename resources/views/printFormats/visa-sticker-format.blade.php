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
            margin-top: 5px;
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

                <h2 id="date">{{ $date }}</h2>
            </div>
            <div class="logo">
                @if($is_urgent)
                <img src="/urgent.png" style="width: 100%; height: 50px; transform:rotate(350deg)" alt="">
                @endif
            </div>
        </header>
    </div>
</body>

</html>