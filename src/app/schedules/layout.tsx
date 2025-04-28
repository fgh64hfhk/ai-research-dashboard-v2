// /app/schedules/layout.tsx
// import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";
// import BreadcrumbBar from "@/components/layout/BreadcrumbBar";

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {/* <BreadcrumbBar /> */}
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}