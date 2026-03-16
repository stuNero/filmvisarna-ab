PasswordRecoveryPage.route = {
  path: '/återställ-lösenord'
};

export default function PasswordRecoveryPage() {
  return (
    <>
      <div className="min-h-screen pt-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col gap-6">
            <h1 className="text-center font-bold text-4xl">
              Återställ ditt lösenord
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
