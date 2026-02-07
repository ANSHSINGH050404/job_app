'use client'

import { AppContextType, AppProviderProps, User } from "@/type";
import { create } from "domain";
import { createContext, useContext } from "react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";



export const utils_services = "http://localhost:5001";
export const auth_services= "http://localhost:5000";
export const user_services="http://localhost:5002"
export const job_services="http://localhost:5003"

const AppContext =createContext<AppContextType | undefined>(undefined)


export const AppProvider:React.FC<AppProviderProps> = ({children})=>{

    const [user,setUser] = useState<User | null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const [btnLoading,setBtnLoading] = useState<boolean>(true)
    const [isAuth,setIsAuth]=useState<boolean>(false)

    return (

        <AppContext.Provider value={{user,loading,btnLoading,setUser,setLoading,setIsAuth,isAuth,}}>
            {children}
            <Toaster />
        </AppContext.Provider>
    )
}


export const useAppData =(): AppContextType =>{
    const context=useContext(AppContext)
    if(!context){
   throw new Error ("UseAppdata must be used within AppProvider")
    }

    return context;
}