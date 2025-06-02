import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import {
  FiGrid, FiUsers, FiPlusSquare, FiFolder,
  FiMessageSquare, FiPackage, FiDollarSign,
  FiFileText, FiSettings
} from 'react-icons/fi';
import { motion } from "framer-motion";

export default function ConstructionSidebar() {
  const { t } = useTranslation();

  const navItems = [
    { name: t("Dashboard"), icon: <FiGrid />, path: "/dashboard/Construction/overview" },
    { name: t("My Team"), icon: <FiUsers />, path: "/dashboard/Construction/team" },
    { name: t("Start Project"), icon: <FiPlusSquare />, path: "/dashboard/Construction/start-project" },
    { name: t("Projects"), icon: <FiFolder />, path: "/dashboard/Construction/projects" },
    { name: t("Messages"), icon: <FiMessageSquare />, path: "/dashboard/Construction/messages" },
    { name: t("Inventory"), icon: <FiPackage />, path: "/dashboard/Construction/inventory" },
    { name: t("Budget"), icon: <FiDollarSign />, path: "/dashboard/Construction/budget" },
    { name: t("Documents"), icon: <FiFileText />, path: "/dashboard/Construction/documents" },
    { name: t("Settings"), icon: <FiSettings />, path: "/dashboard/Construction/settings" },
    { name: t("Social"), icon: <FiFileText />, path: "/dashboard/Construction/social/overview" }
   ];

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <aside className="bg-black text-white transition-colors duration-300 h-full">
      <div className="px-6 py-10">
        <h1 className="text-2xl font-extrabold tracking-wide mb-10">
          ArchonWiser
        </h1>

        <motion.nav
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {navItems.map(({ name, icon, path }) => (
            <motion.div key={path} variants={itemVariants}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-[15px] font-semibold tracking-tight transition-all
                  ${
                    isActive
                      ? 'bg-white text-black shadow'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                {icon}
                <span className="capitalize">{name}</span>
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>
      </div>
    </aside>
  );
}
