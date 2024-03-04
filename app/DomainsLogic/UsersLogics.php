<?php

namespace App\DomainsLogic;

use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Hash;

class UsersLogics
{
    public function __construct()
    {
    }

    public static function create_user(CreateUserRequest $request): JsonResponse
    {
        $imageName = null;
        if ($request->hasFile("image")) {
            $uploadedImage = $request->file('image');
            $imageName = uniqid('image_') . '.' . $uploadedImage->getClientOriginalExtension();
            //$uploadedImage->storeAs('user_images', $imageName, 'public');
            $request->file("image")->move("user_images", $imageName);
        }


        if ($request->is_update == 'false')
            User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "image" => ($request->hasFile("image")) ? '/user_images/' . $imageName : '/user-avator.png',
            ]);
        else User::whereId($request->id)->update([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "image" => ($request->hasFile("image")) ? "/user_images/" . $imageName : '/user-avator.png',
        ]);

        return response()->json([true], JsonResponse::HTTP_OK);
    }
}
