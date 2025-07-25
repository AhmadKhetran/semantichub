import {
  LayoutDashboard,
  FolderCog,
  FileBarChart2,
  Tags,
  Code2,
  Network,
  BrainCircuit,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const getSidebarItems = (role: string): NavGroup[] => {
  const items: NavMainItem[] = [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Catalogue",
      url: "/dashboard/manage-catalogues",
      icon: FolderCog,
    },
    // {
    //   title: "Profiling Report",
    //   url: "/dashboard/profiling-report",
    //   icon: FileBarChart2,
    // },
    {
      title: "Tagging & Synonym",
      url: "/dashboard/tag-sys",
      icon: Tags,
    },
    {
      title: "View RDF",
      url: "/dashboard/view-rdf",
      icon: Code2,
    },
    {
      title: "Ontology Mapping",
      url: "/dashboard/ontology-mapping",
      icon: Network,
    },
    {
      title: "Knowledge Graph",
      url: "/dashboard/knowledge-graph",
      icon: BrainCircuit,
    },
  ];

  if (role === "SUPER_ADMIN") {
    items.push({
      title: "Manage Users",
      url: "/dashboard/user",
      icon: Users,
    });
  }

  return [
    {
      id: 1,
      label: "Dashboards",
      items,
    },
  ];
};
