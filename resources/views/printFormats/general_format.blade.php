<!DOCTYPE html>
<html lang="en" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Beautiful Responsive Table</title>
</head>
<style>
    body {
        font-family: 'Calibri', sans-serif;
        /* Classic Excel font */
        margin: 40px;
        background-color: #fff;
        color: #333;
    }

    .print-container {
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
    }

    h1 {
        text-align: center;
        border-bottom: 2px solid #4f81bd;
        /* Excel's classic blue */
        padding-bottom: 10px;
        margin-bottom: 20px;
        color: #4f81bd;
        /* Excel's classic blue */
        font-size: 24px;
    }

    .financial-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: auto;
        /* Helps in keeping the layout more consistent */
    }

    .financial-table th,
    .financial-table td {
        padding: 8px 12px;
        border: 1px solid #d0d7e5;
        /* Excel-like border color */
        text-align: right;
        /* RTL alignment */
        overflow: hidden;
        /* In case the content is too long, it'll be clipped */
        white-space: nowrap;
        /* Text won't wrap to the next line */
        text-overflow: ellipsis;
        /* ... will be shown if the text is too long */
    }

    .financial-table thead th {
        background-color: #dbe5f1;
        /* Excel-like header color */
        color: #333;
    }

    .financial-table tbody tr:nth-child(even) {
        background-color: #f6f6f6;
        /* Slightly different background for even rows for better readability */
    }

    .financial-table tbody .subHeader {
        background-color: rgba(196, 196, 196, 0.925) !important;
    }

    .financial-table tbody .subTr {
        background-color: aliceblue !important;
    }

    @media print {
        body {
            margin: 0;
        }

        .print-container {
            margin: 20mm;
            max-width: none;
        }
    }

    @media print {
        @page {
            size: A5 landescape;
            margin: 0mm;
        }
    }

    @media print {
        body {
            margin: 0;
        }

        .print-container {
            box-shadow: none;
            margin: auto;
            max-width: none;
        }
    }

    .info {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 10px;
    }

    .i-title {
        color: #4f81bd;
        font-size: large;
        font-weight: bold;
    }

    .i-value {
        text-decoration: underline dashed aliceblue;

    }
</style>

<body>
    <div class="print-container">
        <h1 id="title">خریداري راپور</h1>
        <div class="info" id="info">
            <div>
                <li>
                    <span class="i-title">تاریخ</span> :-
                    <span class="i-value"> </span>
                </li>
                <li>
                    <span class="i-title">تاریخ</span> :-
                    <span class="i-value"> </span>
                </li>
            </div>
            <div>
                <li>
                    <span class="i-title">تاریخ</span> :-
                    <span class="i-value"> </span>
                </li>
                <li>
                    <span class="i-title">تاریخ</span> :-
                    <span class="i-value"> </span>
                </li>
            </div>
            <div>
                <li>
                    <span class="i-title">تاریخ</span> :-
                    <span class="i-value"> </span>
                </li>
                <li>
                    <span class="i-title">تاریخ</span> :-
                    <span class="i-value"> </span>
                </li>
            </div>
        </div>
        <table class="financial-table">
            <thead id="Header">
                <tr>
                    <th>#</th>
                    <th>خریدار</th>
                    <th>بیل نمبر</th>
                    <th>تاریخ</th>
                    <th>جمله مبلغ</th>
                    <th>تفصیل</th>
                </tr>
            </thead>
            <tbody id="Data">
                <tr>
                    <td>1</td>
                    <td>محمدولي S-23</td>
                    <td>
                        602
                    </td>
                    <td>Tue Oct 24 2023</td>
                    <td><code>6782500 k</code></td>
                    <td></td>
                </tr>
                <tr class="subHeader">
                    <th>#</th>
                    <th>جنس</th>
                    <th>تعداد / وزن</th>
                    <th>نرخ</th>
                    <th>جمله</th>
                    <th> </th>
                </tr>
                <tr class="subTr">
                    <td>1</td>
                    <td> Prudct 1</td>
                    <td> 123 </td>
                    <td> 123 </td>
                    <td> 1234.2 </td>
                    <td> no description </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>امان الله S0123</td>
                    <td>
                        116
                    </td>
                    <td>Tue Oct 24 2023</td>
                    <td><code>2882040 k</code></td>
                    <td></td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>محمد نعیم S-123</td>
                    <td>
                        117
                    </td>
                    <td>Tue Oct 24 2023</td>
                    <td><code>7733250 k</code></td>
                    <td></td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>فیض الله S-21</td>
                    <td>
                        118
                    </td>
                    <td>Tue Oct 24 2023</td>
                    <td><code>2585870 k</code></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>