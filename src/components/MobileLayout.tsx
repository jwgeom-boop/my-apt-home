import { ReactNode } from "react";
import BottomTabBar from "./BottomTabBar";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}

const MobileLayout = ({ children, title }: MobileLayoutProps) => {
  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background relative">
      {title && (
        <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center justify-center h-12">
          <h1 className="text-base font-semibold">{title}</h1>
        </header>
      )}
      <main className="pb-20 px-4 pt-4">{children}</main>
      <BottomTabBar />
    </div>
  );
};

export default MobileLayout;
