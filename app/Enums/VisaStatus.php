<?php

namespace App\Enums;

enum VisaStatus: string
{
    case REGISTRATION = "registration";
    case BOOKED = "booked";
    case ORDERED = "ordered";
    case COMPLETED = "completed";

    case CANCELED = "1";
}
