<?php

namespace App\DomainsLogic;

use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use App\Models\UserPrivilegeBranches;
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

    public static function add_user_to_branch(HttpRequest $request): JsonResponse
    {

        $validated = $request->validate([
            'branch' => 'required|numeric|min:1',
            'role' => 'required|string|max:255',
            'userId' => 'required|numeric|min:1',
        ]);

        if (!$request->is_update && UserPrivilegeBranches::query()->where('user_id', $request->userId)->where('branch_id', $request->branch)->exists() == true) {
            return response()->json(['message' => 'یوزر ته باید یو ځل څانګي اضافه سي'], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        ($request->is_update ? UserPrivilegeBranches::find($request->id) : new UserPrivilegeBranches)->setData((object) $validated)->save();

        return response()->json(
            UserPrivilegeBranches::whereUserId($request->userId)->withBranch()->get(),
            JsonResponse::HTTP_OK
        );
    }

    public static function update_user_privileges(HttpRequest $request): JsonResponse
    {
        UserPrivilegeBranches::whereId($request->id)
            ->update([
                'privileges' =>  json_encode($request->privileges)
            ]);

        return response()->json([true], JsonResponse::HTTP_OK);
    }
}
