<?php

namespace App\Enums;

enum TransactionTypes: string
{
    case CUSTOMER_CREDIT = "customer";
    case CUSTOMER_DEBIT = "customer";
}
