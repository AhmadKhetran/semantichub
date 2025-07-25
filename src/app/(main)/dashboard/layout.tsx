import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { authOptions } from "@/app/utils/auth";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";
import {
  SidebarVariant,
  allowedSidebarVariants,
  SidebarCollapsible,
  allowedSidebarCollapsibles,
  ContentLayout,
  allowedContentLayouts,
  ThemePreset,
  allowedThemePresets,
  ThemeMode,
  allowedThemeModes,
} from "@/types/preferences";

import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession(authOptions);

  console.log("session here in dashboard layout", session);

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const [sidebarVariant, sidebarCollapsible, contentLayout, themeMode, themePreset] = await Promise.all([
    getPreference<SidebarVariant>("sidebar_variant", allowedSidebarVariants, "inset"),
    getPreference<SidebarCollapsible>("sidebar_collapsible", allowedSidebarCollapsibles, "icon"),
    getPreference<ContentLayout>("content_layout", allowedContentLayouts, "centered"),
    getPreference<ThemeMode>("theme_mode", allowedThemeModes, "light"),
    getPreference<ThemePreset>("theme_preset", allowedThemePresets, "default"),
  ]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} role={session?.user.role} />
      <SidebarInset
        data-content-layout={contentLayout}
        className={cn(
          "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
          // Adds right margin for inset sidebar in centered layout up to 113rem.
          // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
          "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
        )}
      >
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher themeMode={themeMode} />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
