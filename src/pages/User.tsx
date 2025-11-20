import React, { useEffect, useRef, useState } from "react";
import { useCurrentUser, useUserUpdate } from "../queries/useAuth";
import { useForm } from "react-hook-form";
import { useFavorites } from "../contexts/FavoriteContext";
import Card from "../components/Card/Card";
import type { UserForm } from "../types/common";

const User = () => {
  const [isEditing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, reset, handleSubmit } = useForm<UserForm>();
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: updateUserInfo } = useUserUpdate();
  const { favoriteItems } = useFavorites();

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      role: user.role,
    });
  }, [user]);

  const handleEdit = () => {
    setEditing((prev) => !prev);
  };

  const handleCancel = () => {
    if (!user) return;
    setEditing(false);
    reset({
      name: user.name,
      role: user.role,
    });
  };

  const onSubmit = (data: UserForm) => {
    if (!user) return;
    const payload = { id: user.id, ...data };
    updateUserInfo(payload);
    setEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
  };

  if (isLoading || !user) return null;

  return (
    <div className='main py-6 md:py-8'>
      <div className='flex flex-col gap-6 md:flex-row md:items-start md:gap-10'>
        <section className='w-full max-w-md mx-auto md:mx-0 bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
          <h2 className='font-outfit text-lg font-semibold mb-4'>My Profile</h2>

          <div className='flex flex-col items-center'>
            <div className='relative w-24 h-24 rounded-full overflow-hidden border border-gray-200'>
              <button
                type='button'
                className='w-full h-full group'
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className='hidden'
                />
                <img
                  src={user.avatar}
                  alt={user.name}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition'>
                  Change
                </div>
              </button>
            </div>
            <button
              type='button'
              className='mt-2 px-2 text-xs text-gray-500 underline underline-offset-2'
            >
              delete
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mt-6 space-y-4 font-outfit text-sm'
          >
            <div className='border-y border-gray-200 py-4 space-y-3'>
              <div>
                <p className='mb-1 text-[13px] text-gray-500 tracking-wide'>
                  USER ROLE
                </p>
                <div className='inline-flex gap-4'>
                  <label className='form-radio inline-flex items-center gap-1 text-sm'>
                    <input
                      type='radio'
                      id='roleCustomer'
                      value='customer'
                      disabled={!isEditing}
                      {...register("role")}
                    />
                    <span>customer</span>
                  </label>
                  <label className='form-radio inline-flex items-center gap-1 text-sm'>
                    <input
                      type='radio'
                      id='roleAdmin'
                      value='admin'
                      disabled={!isEditing}
                      {...register("role")}
                    />
                    <span>admin</span>
                  </label>
                </div>
              </div>

              <div className='space-y-1'>
                <label
                  htmlFor='name'
                  className='block text-[13px] text-gray-500 tracking-wide'
                >
                  NAME
                </label>
                <input
                  type='text'
                  id='name'
                  placeholder=' '
                  readOnly={!isEditing}
                  className={`w-full border px-2 py-1.5 rounded-md text-sm outline-none
                    ${
                      isEditing
                        ? "border-gray-300 focus:border-black"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  {...register("name")}
                />
              </div>

              <div className='space-y-1'>
                <p className='text-[13px] text-gray-500 tracking-wide'>
                  EMAIL
                </p>
                <p className='text-sm text-gray-800 break-all'>{user.email}</p>
              </div>

              <div className='space-y-1'>
                <p className='text-[13px] text-gray-500 tracking-wide'>
                  JOIN DATE
                </p>
                <p className='text-sm text-gray-800'>
                  {new Date(user.creationAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                type='button'
                className='button block py-1 mt-2 mx-auto px-10'
                onClick={handleEdit}
              >
                edit
              </button>
            )}
            {isEditing && (
              <div className='flex mt-1 justify-center gap-3'>
                <button
                  type='button'
                  className='button py-1 px-6.5'
                  onClick={handleCancel}
                >
                  cancel
                </button>
                <button type='submit' className='button button-black py-1 px-8'>
                  save
                </button>
              </div>
            )}
          </form>
        </section>

        <section className='flex-1 w-full bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm'>
          <div className='flex items-center justify-between gap-2 mb-4'>
            <h2 className='text-base md:text-lg font-semibold'>
              Favorites
              <span className='ml-2 text-xs md:text-sm font-outfit text-gray-500 align-middle'>
                ({favoriteItems.length})
              </span>
            </h2>
            {favoriteItems.length > 4 && (
              <button
                type='button'
                className='text-xs md:text-sm text-gray-600 underline underline-offset-4'
              >
                더보기
              </button>
            )}
          </div>

          {favoriteItems.length === 0 ? (
            <p className='text-sm text-gray-500'>
              아직 즐겨찾기한 상품이 없어요.
            </p>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
              {favoriteItems.map((item) => {
                return <Card key={item.id} product={item} variant='summary' />;
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default User;
