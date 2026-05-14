export interface MenuItem {
  label: string;
  icon: any;
  route?: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}