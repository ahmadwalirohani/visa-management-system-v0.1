<!DOCTYPE html>
<html dir="rtl" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Visa Management System') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<style>
    body {
        user-select: none
    }


    /* width */
    ::-webkit-scrollbar {
        width: 6px;
    }

    /* button */
    ::-webkit-scrollbar-button {
        background: var(--main-temp-bg);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(196, 196, 196, 0.925);
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #333333;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* The track NOT covered by the handle.
::-webkit-scrollbar-track-piece {
background: #000;
}

/* Corner */
    ::-webkit-scrollbar-corner {
        background: gray;
    }

    /* Resizer */
    ::-webkit-resizer {
        background: gray;
    }
</style>

<body class="font-sans antialiased">
    @inertia
</body>

</html>