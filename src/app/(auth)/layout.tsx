export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            BotFolio
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your portfolio
          </p>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
