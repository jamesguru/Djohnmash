import { role } from "@/lib/data";
import { logout } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Menu = () => {
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/admin",
          visible: ["admin", "teacher", "student", "parent"],
        },
        
        {
          icon: "/student.png",
          label: "Members",
          href: "/list/members",
          visible: ["admin", "teacher"],
        },
      
        {
          icon: "/subject.png",
          label: "Bookings",
          href: "/list/bookings",
          visible: ["admin"],
        },

        {
          icon: "/message.png",
          label: "Reviews & Feedback",
          href: "/list/ratings",
          visible: ["admin", "teacher", "student", "parent"],
        },

        {
          icon: "/class.png",
          label: "Services",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/lesson.png",
          label: "Packages & Offers",
          href: "/list/packages",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/exam.png",
          label: "Bookings Management",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/assignment.png",
          label: "Payments",
          href: "/list/payments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/result.png",
          label: "Marketing",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/attendance.png",
          label: " User Management",
          href: "/list/attendance",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Reports",
          href: "/list/reports",
          visible: ["admin", "teacher", "student", "parent"],
        },
        
        
      ],
    },
    
  ];

  const router = useRouter();
  const handleLogout = (e:any) =>{
    e.preventDefault();
    logout();
    router.push("/sign-in");
  }

  return (
    <div className="mt-4 text-sm px-2">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className=" hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}

          <Link
            href="/logout"
            key="Logout"
            onClick={(e) => handleLogout(e)}
            className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
          >
            <Image src="/logout.png" alt="" width={20} height={20} />
            <span className=" hidden lg:block">Logout</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
