import { _logout } from "@lib/server_actions/logout";
import { LogOut } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

type LogoutBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    text?: string;
    icon?: ReactNode;
  };
const LogoutBtn = ({children,text,icon,...props}:LogoutBtnProps) => {
    const logoutText = text ? text : "Logout" 
    const logoutIcon = icon ? icon : <LogOut size={20} strokeWidth={1.75} />
    return (
       <button {...props} onClick={async ()=> {
            _logout()
       }}>
        {logoutIcon}
        <span className="">{logoutText}</span>
        {children}
       </button>
    );
}

export default LogoutBtn;