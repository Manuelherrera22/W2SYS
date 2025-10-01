'use client';

import * as React from 'react';
import { MENU_ITEMS, MenuItem } from '@/lib/menu-items';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen, currentPath, onNavigate }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['Products']);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    );
  };

  return (
    <aside className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? '' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
          <div className="text-lg md:text-3xl">
            <span className="text-black-3 dark:hidden">W2</span>
            <span className="text-black-3 dark:hidden"><b>SYS</b></span>
            <span className="text-black-3 hidden dark:block">W2</span>
            <span className="text-black-3 hidden dark:block"><b>SYS</b></span>
          </div>
        </a>
        <button
          aria-controls="sidebar"
          aria-expanded="false"
          className="block lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="fill-current" width="20" height="18" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"></path>
          </svg>
        </button>
      </div>
      
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MENU</h3>
            
            {MENU_ITEMS.map((menu) => (
              <ul key={menu.name} className="mb-6 flex flex-col gap-1.5">
                <li>
                  <a
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      currentPath.startsWith(menu.path) || expandedMenus.includes(menu.name) ? 'bg-graydark dark:bg-meta-4' : ''
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (menu.items) {
                        toggleMenu(menu.name);
                      } else {
                        onNavigate(menu.path);
                      }
                    }}
                  >
                    <span className="flex-shrink-0">{menu.icon}</span>
                    {menu.name}
                    {menu.items && (
                      <svg
                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform ${
                          expandedMenus.includes(menu.name) ? 'rotate-180' : ''
                        }`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          fill=""
                        />
                      </svg>
                    )}
                  </a>
                  
                  {menu.items && expandedMenus.includes(menu.name) && (
                    <ul className="mt-2 ml-4 flex flex-col gap-1.5 pl-6 border-l border-stroke dark:border-strokedark">
                      {menu.items.map((item) => (
                        <li key={item.path}>
                          <a
                            className={`block rounded-sm px-4 py-2 text-sm font-medium text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 ${
                              currentPath === item.path ? 'bg-graydark dark:bg-meta-4 text-white' : ''
                            }`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate(item.path);
                            }}
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}



