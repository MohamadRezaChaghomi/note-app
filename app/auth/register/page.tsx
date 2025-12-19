export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">ثبت نام</h2>
        <input className="w-full border p-2" placeholder="نام" />
        <input className="w-full border p-2" placeholder="ایمیل" />
        <input className="w-full border p-2" type="password" placeholder="رمز عبور" />
        <button className="w-full bg-black text-white p-2">
          ثبت نام
        </button>
      </form>
    </div>
  );
}
