import StoreProvider from "./store.provider";
import ThemeProvider from "./theme.provider";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      {/* <QueryProvider> */}
        <ThemeProvider>{children}</ThemeProvider>
      {/* </QueryProvider> */}
    </StoreProvider>
  );
}
