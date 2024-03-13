<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Model;

interface ICustomerService
{
    public static function checkAccount(int $currency_id, int $customer_id): bool;
    public static function createAccount(Model $account, int $customer_id, int $currency_id, float $balance): void;
    //public static function createCreditLegder(Model $creditLegder, int $model_id, float $credit, float $debit, string $transactionType): void;
}
